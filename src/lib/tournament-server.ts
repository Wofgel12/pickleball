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
//   TOURNAMENT_EMAIL_FROM      e.g. "GSC Pickleball <tournoi@genevasportsclub.ch>"
// Testing only:
//   TOURNAMENT_FAKE_PAYMENT=true  skips Stripe: orders are confirmed immediately
//                                 (no Stripe keys needed). Ignored once the page
//                                 is published, so it can never leak into launch.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { tournament, findCategory, formatCHF, tournamentCopy, type TournamentCategory } from '../i18n/tournament';
import { facts, type Lang } from '../i18n/ui';

function env(name: string): string | undefined {
  // Astro coerces values like "true" to booleans in import.meta.env: normalise to strings.
  const value = (import.meta.env as Record<string, unknown>)[name] ?? process.env[name];
  return value === undefined || value === null ? undefined : String(value);
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
}

/**
 * Atomically reserves every draw of the order (all or nothing).
 * Returns the order id, or null when one of the draws is full.
 */
export async function reserveOrder(input: OrderInput, perDrawCents: number[]): Promise<string | null> {
  const res = await supabase('rpc/tournament_reserve_order', {
    method: 'POST',
    body: JSON.stringify({
      p_tournament: tournament.id,
      p_items: input.draws.map((d, i) => ({
        category: d.category.id,
        capacity: d.category.capacity,
        amount_cents: perDrawCents[i],
        partner_name: d.partnerName,
        find_partner: d.findPartner,
      })),
      // Outlives the Stripe session by 5 min so a last-second payment never
      // lands on a place that was already released to someone else.
      p_hold_minutes: tournament.holdMinutes + 5,
      p_first_name: input.firstName,
      p_last_name: input.lastName,
      p_email: input.email,
      p_phone: input.phone,
      p_lang: input.lang,
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
  partner_name: string | null;
  find_partner: boolean;
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
  const productName = lang === 'fr'
    ? `Tournoi GSC Pickleball — ${isCombo ? 'Combo ' : ''}${drawNames}`
    : `GSC Pickleball Tournament — ${isCombo ? 'Combo ' : ''}${drawNames}`;
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
    // Stripe accepts 30 min – 24 h; the Supabase hold lasts 5 min longer.
    expires_at: Math.floor(Date.now() / 1000) + tournament.holdMinutes * 60 + 30,
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
    ['Date', t.dateLong],
    [fr ? 'Horaires' : 'Hours', fr ? 'De 9h à 18h (horaires précis de votre tableau communiqués ultérieurement)' : '9am to 6pm (exact times for your draw will be announced later)'],
    [fr ? 'Lieu' : 'Venue', `${tournament.venueName}, ${fr ? 'Genève' : 'Geneva'}`],
    [fr ? 'Montant payé' : 'Amount paid', formatCHF(totalCents, lang)],
  ];

  const subject = fr
    ? `Inscription confirmée — Tournoi GSC Pickleball (${drawNames})`
    : `Registration confirmed — GSC Pickleball Tournament (${drawNames})`;

  const html = `<!doctype html><html><body style="margin:0;background:#f4f7f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937">
<div style="max-width:560px;margin:0 auto;padding:24px">
  <div style="background:#002b2b;color:#fff;border-radius:16px 16px 0 0;padding:28px 24px">
    <p style="margin:0 0 6px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#5eead4">${escapeHtml(t.kicker)}</p>
    <h1 style="margin:0;font-size:24px;line-height:1.25">${fr ? 'C’est confirmé' : 'You’re in'}, ${escapeHtml(reg.first_name)} !</h1>
  </div>
  <div style="background:#fff;border:2px solid #002b2b;border-top:0;border-radius:0 0 16px 16px;padding:24px">
    <p style="margin:0 0 16px;line-height:1.55">${fr
      ? 'Merci pour votre inscription au tournoi de pickleball du Geneva Sports Club. Voici le récapitulatif :'
      : 'Thank you for registering for the Geneva Sports Club pickleball tournament. Here’s your summary:'}</p>
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
