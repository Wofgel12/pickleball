import type { APIRoute } from 'astro';
import { json, validPromoCode } from '../../../lib/tournament-server';

export const prerender = false;

/**
 * Checks a discount code without revealing it: the expected code lives in the
 * TOURNAMENT_PROMO_CODE env var, never in the (public) source code.
 */
export const POST: APIRoute = async ({ request }) => {
  let code: unknown;
  try {
    code = (await request.json())?.code;
  } catch {
    return json({ valid: false }, 400);
  }
  const valid = validPromoCode(code);
  return valid ? json({ valid: true, code: valid }) : json({ valid: false });
};
