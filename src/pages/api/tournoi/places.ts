import type { APIRoute } from 'astro';
import { tournament } from '../../../i18n/tournament';
import { getTakenCounts, isConfigured, isFakePayment, json } from '../../../lib/tournament-server';

export const prerender = false;

/** Remaining places per draw, polled by the landing page. */
export const GET: APIRoute = async () => {
  if (!isConfigured()) return json({ available: false }, 503);
  try {
    const taken = await getTakenCounts();
    const categories = tournament.categories.map((c) => ({
      id: c.id,
      capacity: c.capacity,
      remaining: Math.max(0, c.capacity - (taken[c.id] ?? 0)),
    }));
    return json({ available: true, testMode: isFakePayment(), categories }, 200, {
      // Short shared cache: absorbs traffic spikes, still feels live.
      'Cache-Control': 'public, max-age=0, s-maxage=10, stale-while-revalidate=20',
    });
  } catch (err) {
    console.error('[tournoi/places]', err);
    return json({ available: false }, 502);
  }
};
