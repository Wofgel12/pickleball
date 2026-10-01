// Server-only helpers for tournament registration (used by /api/tournoi/*).
// No SDKs: Stripe, Supabase and Resend are called over plain HTTPS so the
// Netlify functions stay tiny.
//
// Required env vars (Netlify → Site settings → Environment variables):
//   STRIPE_SECRET_KEY          sk_live_… (or sk_test_… while testing)
//   STRIPE_WEBHOOK_SECRET      whsec_… of the /api/tournoi/stripe-webhook endpoint
//   SUPABASE_URL               https://ywyrydgzxohshsmudqyq.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  service role key (Supabase → Project settings → API)
// Optional (custom confirmation e-mail; otherwise only Stripe's receipt is sent):
//   RESEND_API_KEY             re_…
//   TOURNAMENT_EMAIL_FROM      e.g. "GSC Pickleball <tournoi@gscpickleball.ch>" (domain verified in Resend)
// Discount code (optional, never written in the public repo):
//   TOURNAMENT_PROMO_CODE        the members code, set in Netlify only (case-insensitive);
//                                unlocks the member prices defined in src/i18n/tournament.ts
// Testing only:
//   TOURNAMENT_FAKE_PAYMENT=true  skips Stripe: orders are confirmed immediately
//                                 (no Stripe keys needed). Ignored once the page
//                                 is published, so it can never leak into launch.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { tournament, findCategory, formatCHF, tournamentCopy, type TournamentCategory } from '../i18n/tournament';
import { facts, type Lang } from '../i18n/ui';

function env(name: string): string | undefined {
  // Astro coerces values like "true" to booleans in import.meta.env: normalise to strings.
  // import.meta.env is absent in plain Netlify functions (the scheduled job): fall back to process.env.
  const metaEnv = ((import.meta as { env?: Record<string, unknown> }).env ?? {}) as Record<string, unknown>;
  const value = metaEnv[name] ?? process.env[name];
  return value === undefined || value === null ? undefined : String(value);
}

/** Normalised members code when `raw` matches TOURNAMENT_PROMO_CODE, otherwise null. */
export function validPromoCode(raw: unknown): string | null {
  const expected = env('TOURNAMENT_PROMO_CODE')?.trim().toUpperCase();
  const code = typeof raw === 'string' ? raw.trim().toUpperCase() : '';
  return expected && code && code === expected ? code : null;
}

/** Fake-payment test mode: on only when explicitly enabled AND the page isn't published yet. */
export function isFakePayment(): boolean {
  return env('TOURNAMENT_FAKE_PAYMENT') === 'true' && !tournament.published;
}

export function isConfigured(): boolean {
  return Boolean(
    (isFakePayment() || env('STRIPE_SECRET_KEY')) && env('SUPABASE_URL') && env('SUPABASE_SERVICE_ROLE_KEY'),
  );
}

/**
 * Marks every draw of a paid order as confirmed and sends the confirmation
 * e-mail once. Shared by the Stripe webhook and the fake-payment test mode.
 */
export async function confirmOrder(orderId: string, paymentRef: string | null): Promise<void> {
  const rows = await updateRegistrations(`order_id=eq.${orderId}`, {
    status: 'confirmed',
    stripe_payment_intent_id: paymentRef,
    hold_expires_at: null,
  });
  // Stripe retries webhooks: only send the e-mail once per order.
  if (rows.length > 0 && rows.every((r) => !r.confirmation_sent_at) && (await sendConfirmationEmail(rows))) {
    await updateRegistrations(`order_id=eq.${orderId}`, { confirmation_sent_at: new Date().toISOString() });
  }
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

// ---------- Supabase (PostgREST, service role) ----------

async function supabase(path: string, init: RequestInit = {}): Promise<Response> {
  const url = env('SUPABASE_URL')!.replace(/\/$/, '') + '/rest/v1/' + path;
  const key = env('SUPABASE_SERVICE_ROLE_KEY')!;
  return fetch(url, {
    ...init,
    headers: {
      apikey: key,
      // Legacy service_role keys are JWTs and go in Authorization too; the new
      // sb_secret_… keys are not JWTs and must only be sent as `apikey`.
      ...(key.startsWith('sb_') ? {} : { Authorization: `Bearer ${key}` }),
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
}

export async function getTakenCounts(): Promise<Record<string, number>> {
  const res = await supabase('rpc/tournament_counts', {
    method: 'POST',
    body: JSON.stringify({ p_tournament: tournament.id }),
  });
  if (!res.ok) throw new Error(`tournament_counts ${res.status}: ${await res.text()}`);
  const rows = (await res.json()) as { category: string; taken: number }[];
  return Object.fromEntries(rows.map((r) => [r.category, Number(r.taken)]));
}

export interface DrawChoice {
  category: TournamentCategory;
  partnerName: string | null;
  findPartner: boolean;
}

export interface OrderInput {
  draws: DrawChoice[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  lang: Lang;
  needsPaddle: boolean;
  /** Normalised discount code when one was applied. */
  discountCode: string | null;
}

/**
 * Atomically reserves every draw of the order (all or nothing).
 * Returns the order id, or null when one of the draws is full.
 */
export async function reserveOrder(
  input: OrderInput,
  perDrawCents: number[],
  discountPerDrawCents: number[] = [],
): Promise<string | null> {
  const res = await supabase('rpc/tournament_reserve_order', {
    method: 'POST',
    body: JSON.stringify({
      p_tournament: tournament.id,
      p_items: input.draws.map((d, i) => ({
        category: d.category.id,
        capacity: d.category.capacity,
        amount_cents: perDrawCents[i],
        discount_cents: discountPerDrawCents[i] ?? 0,
        partner_name: d.partnerName,
        find_partner: d.findPartner,
      })),
      // The place is only released once the scheduled job has closed the
      // Stripe page (see expireStaleOrders), so it can never be double-sold.
      p_hold_minutes: tournament.holdMinutes,
      p_first_name: input.firstName,
      p_last_name: input.lastName,
      p_email: input.email,
      p_phone: input.phone,
      p_lang: input.lang,
      p_needs_paddle: input.needsPaddle,
      p_discount_code: input.discountCode,
    }),
  });
  if (!res.ok) throw new Error(`tournament_reserve_order ${res.status}: ${await res.text()}`);
  return (await res.json()) as string | null;
}

export interface RegistrationRow {
  id: string;
  order_id: string;
  category: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  partner_name: string | null;
  find_partner: boolean;
  needs_paddle: boolean;
  discount_code: string | null;
  discount_cents: number;
  lang: Lang;
  status: string;
  amount_cents: number;
  confirmation_sent_at: string | null;
}

/** PATCH rows matching `filter` (PostgREST syntax) and return them. */
export async function updateRegistrations(filter: string, patch: Record<string, unknown>): Promise<RegistrationRow[]> {
  const res = await supabase(`tournament_registrations?${filter}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`update registrations ${res.status}: ${await res.text()}`);
  return (await res.json()) as RegistrationRow[];
}

// ---------- Stripe ----------

/** Encode nested params the way Stripe's form API expects (a[b][0][c]=…). */
function stripeForm(params: Record<string, unknown>, prefix = ''): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object') {
      out.push(...stripeForm(v as Record<string, unknown>, key));
    } else {
      out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
    }
  }
  return out;
}

async function stripe<T>(path: string, params: Record<string, unknown>): Promise<T> {
  const res = await fetch('https://api.stripe.com/v1/' + path, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env('STRIPE_SECRET_KEY')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: stripeForm(params).join('&'),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`stripe ${path} ${res.status}: ${JSON.stringify(body)}`);
  return body as T;
}

export async function createCheckoutSession(opts: {
  orderId: string;
  input: OrderInput;
  totalCents: number;
  origin: string;
}): Promise<{ id: string; url: string }> {
  const lang = opts.input.lang;
  const pagePath = lang === 'fr' ? '/tournoi/' : '/en/tournament/';
  const drawNames = opts.input.draws.map((d) => d.category.name[lang]).join(' + ');
  const isCombo = opts.input.draws.length > 1;
  const promo = opts.input.discountCode ? ` (code ${opts.input.discountCode})` : '';
  const productName = lang === 'fr'
    ? `Tournoi GSC Pickleball — ${isCombo ? 'Combo ' : ''}${drawNames}${promo}`
    : `GSC Pickleball Tournament — ${isCombo ? 'Combo ' : ''}${drawNames}${promo}`;
  const productDesc = lang === 'fr'
    ? 'Dimanche 15 novembre 2026, 9h–18h, Collège Calvin, Genève. Non remboursable.'
    : 'Sunday 15 November 2026, 9am–6pm, Collège Calvin, Geneva. Non-refundable.';
  const metadata = {
    order_id: opts.orderId,
    tournament: tournament.id,
    categories: opts.input.draws.map((d) => d.category.id).join(','),
  };

  return stripe<{ id: string; url: string }>('checkout/sessions', {
    mode: 'payment',
    locale: lang,
    customer_email: opts.input.email,
    client_reference_id: opts.orderId,
    // Stripe's minimum lifetime is 30 min; the scheduled job closes the page
    // earlier, as soon as the holdMinutes window is over.
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60 + 30,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: 'chf',
        unit_amount: opts.totalCents,
        product_data: { name: productName, description: productDesc },
      },
    }],
    metadata,
    payment_intent_data: { description: productName, metadata },
    success_url: `${opts.origin}${pagePath}?inscription=ok#inscription`,
    cancel_url: `${opts.origin}${pagePath}?inscription=annulee#inscription`,
  });
}

/**
 * Closes the Stripe page of every order whose hold is over, then frees its
 * places. Run every minute by netlify/functions/tournoi-expire-holds.
 * A page that was paid in the meantime can't be expired: Stripe refuses, we
 * skip it and the webhook confirms the order instead.
 */
export async function expireStaleOrders(): Promise<{ expired: number; skipped: number }> {
  const now = new Date().toISOString();
  const res = await supabase(
    `tournament_registrations?select=order_id,stripe_session_id&tournament=eq.${tournament.id}` +
      `&status=eq.pending&hold_expires_at=lt.${encodeURIComponent(now)}`,
  );
  if (!res.ok) throw new Error(`list stale holds ${res.status}: ${await res.text()}`);
  const rows = (await res.json()) as { order_id: string; stripe_session_id: string | null }[];

  const orders = new Map<string, string | null>();
  for (const r of rows) orders.set(r.order_id, r.stripe_session_id ?? orders.get(r.order_id) ?? null);

  let expired = 0;
  let skipped = 0;
  for (const [orderId, sessionId] of orders) {
    if (sessionId?.startsWith('cs_')) {
      const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}/expire`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env('STRIPE_SECRET_KEY')}` },
      });
      if (!stripeRes.ok) {
        // Already paid (or already expired by Stripe): leave it to the webhook.
        skipped++;
        continue;
      }
    }
    // No Stripe page (checkout creation failed) or page now closed: free the places.
    await updateRegistrations(`order_id=eq.${orderId}&status=eq.pending`, { status: 'expired', hold_expires_at: null });
    expired++;
  }
  return { expired, skipped };
}

/** Verifies the Stripe-Signature header (v1 HMAC-SHA256, 5-minute tolerance). */
export function verifyStripeSignature(payload: string, header: string | null): boolean {
  const secret = env('STRIPE_WEBHOOK_SECRET');
  if (!secret || !header) return false;
  const timestamp = header.split(',').find((p) => p.startsWith('t='))?.slice(2);
  const signatures = header.split(',').filter((p) => p.startsWith('v1=')).map((p) => p.slice(3));
  if (!timestamp || signatures.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const expected = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  return signatures.some((sig) => {
    const sigBuf = Buffer.from(sig, 'hex');
    return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
  });
}

// ---------- Confirmation e-mail (Resend) ----------

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/**
 * Sends one confirmation e-mail for the whole order (one row per draw).
 * Returns false (without throwing) when Resend isn't configured.
 */
export async function sendConfirmationEmail(order: RegistrationRow[]): Promise<boolean> {
  const apiKey = env('RESEND_API_KEY');
  const from = env('TOURNAMENT_EMAIL_FROM');
  if (!apiKey || !from || order.length === 0) return false;

  const reg = order[0];
  const lang: Lang = reg.lang === 'en' ? 'en' : 'fr';
  const fr = lang === 'fr';
  const t = tournamentCopy[lang];

  // Programme order: morning draw first, mixed (afternoon) second.
  const draws = order
    .map((r) => ({ row: r, cat: findCategory(r.category) }))
    .sort((x, y) => tournament.categories.indexOf(x.cat!) - tournament.categories.indexOf(y.cat!));
  const drawNames = draws.map((d) => (d.cat ? d.cat.name[lang] : d.row.category)).join(' + ');
  const totalCents = order.reduce((n, r) => n + r.amount_cents, 0);

  const rows: [string, string][] = [
    ...draws.flatMap(({ row, cat }): [string, string][] => [
      [
        cat ? `${cat.name[lang]} (${t.slots[cat.slot].toLowerCase()})` : row.category,
        cat && !cat.double
          ? (fr ? 'Tableau individuel' : 'Individual draw')
          : row.find_partner
          ? (fr ? 'Partenaire : on vous en trouve un·e, on vous recontacte avant le tournoi.' : 'Partner: we’ll find you one and be in touch before the tournament.')
          : `${fr ? 'Partenaire' : 'Partner'} : ${row.partner_name ?? ''}`,
      ],
    ]),
    [fr ? 'Raquette de prêt' : 'Loan paddle', reg.needs_paddle
      ? (fr ? 'Oui, une raquette vous sera prêtée sur place' : 'Yes, a paddle will be lent to you on site')
      : (fr ? 'Non, vous venez avec la vôtre' : 'No, you’re bringing your own')],
    ['Date', t.dateLong],
    [fr ? 'Horaires' : 'Hours', fr ? 'De 9h à 18h (horaires précis de votre tableau communiqués ultérieurement)' : '9am to 6pm (exact times for your draw will be announced later)'],
    [fr ? 'Lieu' : 'Venue', `${tournament.venueName}, ${fr ? 'Genève' : 'Geneva'}`],
    ...(reg.discount_code
      ? [[
          fr ? 'Réduction' : 'Discount',
          `−${formatCHF(order.reduce((n, r) => n + (r.discount_cents ?? 0), 0), lang)} (code ${reg.discount_code})`,
        ] as [string, string]]
      : []),
    [fr ? 'Montant payé' : 'Amount paid', formatCHF(totalCents, lang)],
  ];

  const whatsappNumber = reg.phone ? ` ${fr ? 'au' : 'on'} <strong>${escapeHtml(reg.phone)}</strong>` : '';

  const subject = fr
    ? `Inscription confirmée — Tournoi GSC Pickleball (${drawNames})`
    : `Registration confirmed — GSC Pickleball Tournament (${drawNames})`;

  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;background:#f4f7f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937">
<div style="max-width:560px;margin:0 auto;padding:24px">
  <div style="background:#002b2b;color:#fff;border-radius:16px 16px 0 0;padding:28px 24px">
    <p style="margin:0 0 6px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#5eead4">${escapeHtml(t.kicker)}</p>
    <h1 style="margin:0;font-size:24px;line-height:1.25">${fr ? 'C’est confirmé' : 'You’re in'}, ${escapeHtml(reg.first_name)} !</h1>
  </div>
  <div style="background:#fff;border:2px solid #002b2b;border-top:0;border-radius:0 0 16px 16px;padding:24px">
    <p style="margin:0 0 16px;line-height:1.55">${fr
      ? 'Merci pour votre inscription au tournoi de pickleball du Geneva Sports Club. Voici le récapitulatif :'
      : 'Thank you for registering for the Geneva Sports Club pickleball tournament. Here’s your summary:'}</p>
    <table role="presentation" style="width:100%;border-collapse:separate;margin:0 0 20px;background:#e8f8ee;border:2px solid #25D366;border-radius:12px">
      <tr>
        <td style="padding:16px 0 16px 16px;width:56px;vertical-align:top">
          <img src="https://gscpickleball.ch/email/whatsapp.png" width="48" height="48" alt="WhatsApp" style="display:block;border:0">
        </td>
        <td style="padding:16px;vertical-align:top">
          <p style="margin:0 0 4px;font-size:16px;font-weight:bold;color:#075e54">${fr ? 'Groupe WhatsApp du tournoi' : 'Tournament WhatsApp group'}</p>
          <p style="margin:0;line-height:1.5;color:#1f2937">${fr
            ? `Vous allez recevoir un message WhatsApp${whatsappNumber} pour être ajouté·e au groupe du tournoi. C’est là que nous partagerons les horaires précis de votre tableau et toutes les infos pratiques.`
            : `You’ll receive a WhatsApp message${whatsappNumber} to be added to the tournament group. That’s where we’ll share the exact times for your draw and all the practical info.`}</p>
        </td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      ${rows.map(([k, v]) => `<tr><td style="padding:8px 0;color:#0f766e;font-weight:bold;width:40%;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 0">${escapeHtml(v)}</td></tr>`).join('')}
    </table>
    <p style="margin:20px 0 8px;line-height:1.55">${fr
      ? 'Pensez à vos chaussures de salle à semelle non marquante. Des raquettes peuvent être prêtées en cas de besoin.'
      : 'Remember your non-marking indoor shoes. Paddles can be lent if needed.'}</p>
    <p style="margin:0 0 20px;line-height:1.55">${fr
      ? 'Rappel : l’inscription n’est pas remboursable.'
      : 'Reminder: registration is non-refundable.'}</p>
    <a href="${tournament.mapsUrl}" style="display:inline-block;background:#0d9488;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:bold">${escapeHtml(t.ctaMap)}</a>
    <p style="margin:24px 0 0;font-size:13px;color:#6b7280;line-height:1.55">${fr ? 'Une question ?' : 'Any questions?'} <a href="mailto:${facts.email}" style="color:#0f766e">${facts.email}</a></p>
  </div>
</div></body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [reg.email], reply_to: facts.email, subject, html }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
  return true;
}
