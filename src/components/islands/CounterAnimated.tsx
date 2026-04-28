import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';

interface Props {
  to: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Locale for number formatting (default: fr-CH) */
  locale?: string;
}

/**
 * Animated count-up. Renders the final number on SSR (so the value is in the
 * DOM for SEO/no-JS), then on hydration animates from 0 → `to`.
 */
export default function CounterAnimated({ to, duration = 1.6, locale = 'fr-CH' }: Props) {
  const reduce = useReducedMotion();
  const count = useMotionValue(reduce ? to : 0);
  const formatted = useTransform(count, (v) =>
    Math.round(v).toLocaleString(locale).replace(/ | /g, ' ')
  );

  useEffect(() => {
    if (reduce) {
      count.set(to);
      return;
    }
    const controls = animate(count, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [to, duration, reduce, count]);

  return <motion.span aria-label={to.toLocaleString(locale)}>{formatted}</motion.span>;
}
