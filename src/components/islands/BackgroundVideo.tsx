import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  webmSrc?: string;
  poster?: string;
  className?: string;
}

/**
 * Background video that respects prefers-reduced-motion and only loads
 * on viewport visibility. Falls back to a static poster if reduced-motion
 * is requested or if autoplay fails.
 */
export default function BackgroundVideo({ src, webmSrc, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reduced) {
    return (
      <div
        className={className}
        style={{
          backgroundImage: poster ? `url(${poster})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      className={className}
      aria-hidden="true"
    >
      {webmSrc && <source src={webmSrc} type="video/webm" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
