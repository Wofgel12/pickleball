import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface ReviewBubble {
  author: string;
  photo: string;
  rating: number;
  text: string;
  relativeTime: string;
}

interface Props {
  reviews: ReviewBubble[];
  mapsUri: string;
}

/**
 * Floating Google review bubbles on the hero. One review at a time appears in
 * a corner (avoiding the centered text area), stays a few seconds, then fades
 * out and a different review appears in another corner.
 *
 * - Disabled on small screens (< 1024px) to avoid overlapping the hero text.
 * - Respects prefers-reduced-motion.
 * - If `reviews` is empty (API failed or env missing), nothing renders.
 * - Each bubble is clickable → opens the Google Maps page in a new tab.
 */

const VISIBLE_MS = 5000;
const GAP_MS = 600;
const MAX_TEXT_LENGTH = 180;

type CornerKey = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const corners: Record<CornerKey, string> = {
  'top-left':     'top-6 left-6',
  'top-right':    'top-6 right-6',
  'bottom-left':  'bottom-24 left-6',
  'bottom-right': 'bottom-24 right-6',
};
const cornerKeys: CornerKey[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

function pickNextCorner(prev: CornerKey | null): CornerKey {
  const pool = cornerKeys.filter((c) => c !== prev);
  return pool[Math.floor(Math.random() * pool.length)];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.map((p) => p[0] ?? '').join('').slice(0, 2).toUpperCase();
}

function GoogleG() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" aria-label="Google" role="img">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="flex items-center gap-px text-[#fbbc05]" aria-label={`${count} étoiles sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < count ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );
}

function Avatar({ photo, name }: { photo: string; name: string }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const initials = getInitials(name);

  if (photo && !photoFailed) {
    return (
      <img
        src={photo}
        alt=""
        className="flex-shrink-0 w-8 h-8 rounded-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setPhotoFailed(true)}
      />
    );
  }
  return (
    <div
      className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-700 text-white text-xs font-semibold flex items-center justify-center"
      aria-hidden="true"
    >
      {initials || '👤'}
    </div>
  );
}

function truncate(text: string, max = MAX_TEXT_LENGTH): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}

function Bubble({ review, corner, mapsUri }: { review: ReviewBubble; corner: CornerKey; mapsUri: string }) {
  const reduce = useReducedMotion();

  const initial = reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.92 };
  const animate = reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 };
  const exit = reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 };

  return (
    <motion.a
      href={mapsUri}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Voir l'avis de ${review.author} sur Google Maps`}
      className={`absolute ${corners[corner]} z-30 block max-w-[260px] rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40 p-3 hover:shadow-xl hover:-translate-y-0.5 transition-transform`}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start gap-2.5">
        <Avatar photo={review.photo} name={review.author} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1.5 mb-0.5">
            <span className="font-semibold text-gray-900 text-xs truncate">{review.author}</span>
            <GoogleG />
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <Stars count={review.rating} />
            <span className="text-[10px] text-gray-500 truncate">{review.relativeTime}</span>
          </div>
          <p className="text-[11.5px] text-gray-700 leading-snug line-clamp-3">
            {truncate(review.text)}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

export default function ReviewsBubbles({ reviews, mapsUri }: Props) {
  const [index, setIndex] = useState(0);
  const [corner, setCorner] = useState<CornerKey>('top-right');
  const [showing, setShowing] = useState(true);

  // Don't render at all on small screens (< 1024px).
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setEnabled(mq.matches);
    const handler = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Cycle: visible → fade out → switch → visible (different corner).
  useEffect(() => {
    if (!enabled || reviews.length === 0) return;
    let cancelled = false;

    const loop = async () => {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, VISIBLE_MS));
        if (cancelled) return;
        setShowing(false);
        await new Promise((r) => setTimeout(r, GAP_MS));
        if (cancelled) return;
        setIndex((i) => (i + 1) % reviews.length);
        setCorner((prev) => pickNextCorner(prev));
        setShowing(true);
      }
    };
    loop();
    return () => {
      cancelled = true;
    };
  }, [enabled, reviews.length]);

  // No reviews from the API → render nothing (graceful fallback).
  if (!enabled || reviews.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30" aria-live="polite" aria-label="Avis Google récents">
      <AnimatePresence mode="wait">
        {showing && (
          <div key={`${index}-${corner}`} className="pointer-events-auto absolute inset-0">
            <Bubble review={reviews[index]} corner={corner} mapsUri={mapsUri} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
