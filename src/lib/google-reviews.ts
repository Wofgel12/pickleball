// Build-time Google Places API integration.
//
// Adapted from animation-culinaire.ch — same pattern, Astro-flavoured:
//   - Server-side fetch only (API key never exposed to clients)
//   - Called from .astro frontmatter, runs once per build
//   - Returns null gracefully if env vars missing or API fails
//
// Required env vars (Netlify → Site settings → Environment variables):
//   GOOGLE_PLACES_API_KEY  — Google Cloud API key with Places API (New) enabled
//   GOOGLE_PLACE_ID        — Place ID (format `ChIJ...`) of the GSC Pickleball place
//
// Cost: ~365 API calls/year (1 per daily rebuild) → well within Google's
// $200/month free tier. Practically free.

export interface GoogleReview {
  /** Reviewer display name (e.g. "Marie L.") */
  author: string;
  /** Reviewer profile photo URL (Google-hosted CDN) */
  photo: string;
  /** Star rating 1-5 */
  rating: number;
  /** Review text */
  text: string;
  /** Relative time string ("il y a 2 mois") */
  relativeTime: string;
  /** ISO publish date */
  publishTime: string;
}

export interface GoogleReviewsData {
  /** Aggregate rating (0-5) */
  rating: number;
  /** Total number of ratings */
  totalRatings: number;
  /** Up to 5 most relevant reviews */
  reviews: GoogleReview[];
  /** Canonical Google Maps URL of the place */
  mapsUri: string;
}

const FIELD_MASK = 'displayName,rating,userRatingCount,reviews,googleMapsUri';

/**
 * Fetch real Google reviews at build time. Returns `null` on any failure so
 * callers can fall back gracefully (hide the bubbles UI rather than crash).
 */
export async function fetchGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY ?? process.env.GOOGLE_PLACES_API_KEY;
  const placeId = import.meta.env.GOOGLE_PLACE_ID ?? process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    // Don't error — just disable the feature.
    // Comment this log out if you want totally silent fallback.
    console.warn('[google-reviews] Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID — bubbles disabled');
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=fr`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': FIELD_MASK,
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!res.ok) {
      console.error('[google-reviews] API error:', res.status, await res.text());
      return null;
    }

    type RawReview = {
      authorAttribution?: { displayName?: string; photoUri?: string };
      rating?: number;
      text?: { text?: string };
      relativePublishTimeDescription?: string;
      publishTime?: string;
    };
    type RawResponse = {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: RawReview[];
    };
    const data = (await res.json()) as RawResponse;

    return {
      rating: data.rating ?? 0,
      totalRatings: data.userRatingCount ?? 0,
      mapsUri: data.googleMapsUri ?? '',
      reviews: (data.reviews ?? []).map((r) => ({
        author: r.authorAttribution?.displayName ?? 'Anonyme',
        photo: r.authorAttribution?.photoUri ?? '',
        rating: r.rating ?? 5,
        text: r.text?.text ?? '',
        relativeTime: r.relativePublishTimeDescription ?? '',
        publishTime: r.publishTime ?? '',
      })),
    };
  } catch (err) {
    console.error('[google-reviews] Fetch failed:', err);
    return null;
  }
}
