import type { APIRoute } from 'astro';
import { applyDiscount, isValidPhone, normalizeSelection, priceSelection } from '../../../i18n/tournament';
import {
  confirmOrder,
  createCheckoutSession,
  isConfigured,
  isFakePayment,
  promoPercent,
  json,
  reserveOrder,
  updateRegistrations,
  type OrderInput,
} from '../../../lib/tournament-server';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: unknown, max = 120): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/**
 * Validates the form, reserves every chosen draw (all or nothing) and
 * returns the Stripe Checkout URL.
 * Body: { draws: [{ category, partnerName, findPartner }], firstName, lastName, email, phone, age, noRefund, lang }
 */
export const POST: APIRoute = async ({ request, url }) => {
  if (!isConfigured()) return json({ error: 'unavailable' }, 503);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid' }, 400);
  }

  const rawDraws = Array.isArray(body.draws) ? (body.draws as Record<string, unknown>[]).slice(0, 3) : [];
  const categories = normalizeSelection(rawDraws.map((d) => clean(d?.category)));
  if (!categories) return json({ error: 'invalid' }, 400);

  const draws = categories.map((category) => {
    const raw = rawDraws.find((d) => d?.category === category.id) ?? {};
    const findPartner = category.double && raw.findPartner === true;
    return {
      category,
      findPartner,
      partnerName: category.double && !findPartner ? clean(raw.partnerName, 160) || null : null,
    };
  });

  const input: OrderInput = {
    draws,
    firstName: clean(body.firstName),
    lastName: clean(body.lastName),
    email: clean(body.email, 200).toLowerCase(),
    phone: clean(body.phone, 40) || null,
    lang: body.lang === 'en' ? 'en' : 'fr',
    needsPaddle: body.needsPaddle === true,
    discountCode: null,
  };

  if (
    !input.firstName ||
    !input.lastName ||
    !EMAIL_RE.test(input.email) ||
    !input.phone ||
    !isValidPhone(input.phone) ||
    draws.some((d) => d.category.double && !d.findPartner && !d.partnerName) ||
    body.age !== true ||
    body.noRefund !== true ||
    typeof body.needsPaddle !== 'boolean'
  ) {
    return json({ error: 'invalid' }, 400);
  }

  // Optional discount code: re-checked here, whatever the form displayed.
  const rawPromo = typeof body.promoCode === 'string' ? body.promoCode.trim() : '';
  const percent = rawPromo ? promoPercent(rawPromo) : null;
  if (rawPromo && percent === null) return json({ error: 'promo' }, 400);
  if (percent !== null) input.discountCode = rawPromo.toUpperCase();

  try {
    const base = priceSelection(categories);
    const priced = percent !== null
      ? applyDiscount(base.perDrawCents, percent)
      : { perDrawCents: base.perDrawCents, discountPerDrawCents: [], totalCents: base.totalCents };
    const { totalCents, perDrawCents, discountPerDrawCents } = priced;
    const orderId = await reserveOrder(input, perDrawCents, discountPerDrawCents);
    if (!orderId) return json({ error: 'full' }, 409);

    if (isFakePayment()) {
      // Test mode: no Stripe — confirm straight away and land on the success banner.
      await updateRegistrations(`order_id=eq.${orderId}`, { stripe_session_id: `fake_${orderId}` });
      await confirmOrder(orderId, 'fake_payment');
      const pagePath = input.lang === 'fr' ? '/tournoi/' : '/en/tournament/';
      return json({ url: `${pagePath}?inscription=ok#inscription` });
    }

    const session = await createCheckoutSession({ orderId, input, totalCents, origin: url.origin });
    await updateRegistrations(`order_id=eq.${orderId}`, { stripe_session_id: session.id });

    return json({ url: session.url });
  } catch (err) {
    console.error('[tournoi/checkout]', err);
    return json({ error: 'generic' }, 500);
  }
};
