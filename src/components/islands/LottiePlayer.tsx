import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface Props {
  src: string;
  /** Loop the animation (default false — replay on each scroll-into-view) */
  loop?: boolean;
  /** Speed (default 1) */
  speed?: number;
  /** If true, reset+replay each time the element scrolls back into view */
  replayOnView?: boolean;
  /** Optional pixel size; defaults to fill parent */
  className?: string;
  /** Inline style passthrough */
  style?: React.CSSProperties;
  /** Apply rotation/flip transforms via wrapper */
  transform?: string;
}

/**
 * IntersectionObserver-driven Lottie wrapper.
 * Replaces the manual observer code that lived inside individual sections.
 * Animation URLs come unchanged from the original code — DO NOT TOUCH.
 */
export default function LottiePlayer({
  src,
  loop = false,
  speed = 1,
  replayOnView = true,
  className,
  style,
  transform,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (!wrapRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldPlay(true);
            if (replayOnView) setAnimationKey((k) => k + 1);
          } else {
            setShouldPlay(false);
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, [replayOnView]);

  return (
    <div ref={wrapRef} className={className} style={{ ...style, transform }}>
      {shouldPlay && (
        <DotLottieReact
          key={animationKey}
          src={src}
          loop={loop}
          autoplay
          speed={speed}
        />
      )}
    </div>
  );
}
