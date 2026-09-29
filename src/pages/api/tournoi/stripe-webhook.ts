import type { APIRoute } from 'astro';
import {
  confirmOrder,
  json,
  updateRegistrations,
  verifyStripeSignature,
} from '../../../lib/tournament-server';

export const prerender = false;

interface CheckoutSession {
  id: string;
  payment_status: string;
  payment_intent: string | null;
  metadata?: { order_id?: string };
}

/**
 * Stripe webhook — subscribe to:
 *   checkout.session.completed, checkout.session.async_payment_succeeded,
 *   checkout.session.expired
 */
export const POST: APIRoute = async ({ request }) => {
  const payload = await request.text();
  if (!verifyStripeSignature(payload, request.headers.get('stripe-signature'))) {
    return json({ error: 'bad signature' }, 400);
  }

  const event = JSON.parse(payload) as { type: string; data: { object: CheckoutSession } };
  const session = event.data.object;
  const orderId = session.metadata?.order_id;
  if (!orderId) return json({ received: true, ignored: 'no order_id' });

  try {
    const paid =
      (event.type === 'checkout.session.completed' && session.payment_status === 'paid') ||
      event.type === 'checkout.session.async_payment_succeeded';

    if (paid) {
      // Confirms every draw of the order (one row for a single draw, two for a combo).
      await confirmOrder(orderId, session.payment_intent);
    } else if (event.type === 'checkout.session.expired') {
      // Frees the place right away instead of waiting for the hold to lapse.
      await updateRegistrations(`order_id=eq.${orderId}&status=eq.pending`, { status: 'expired', hold_expires_at: null });
    }
    return json({ received: true });
  } catch (err) {
    console.error('[tournoi/stripe-webhook]', err);
    // 500 makes Stripe retry later.
    return json({ error: 'processing failed' }, 500);
  }
};
