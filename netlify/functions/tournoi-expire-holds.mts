// Scheduled job (every minute, production only): closes the Stripe payment
// page of tournament orders not paid within tournament.holdMinutes and frees
// their places. See expireStaleOrders in src/lib/tournament-server.ts.
import { expireStaleOrders, isConfigured, isFakePayment } from '../../src/lib/tournament-server';

export default async () => {
  if (!isConfigured() || isFakePayment()) return new Response('skipped');
  try {
    const result = await expireStaleOrders();
    if (result.expired || result.skipped) console.log('[tournoi-expire-holds]', result);
    return Response.json(result);
  } catch (err) {
    console.error('[tournoi-expire-holds]', err);
    return new Response('error', { status: 500 });
  }
};

export const config = { schedule: '* * * * *' };
