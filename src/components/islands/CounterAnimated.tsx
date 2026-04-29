import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';

interface Props {
  to: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Locale for number formatting (default: fr-CH) */
  locale?: string;
}

export default function CounterAnimated({ to, duration = 1.6, locale = 'fr-CH' }: Props) {
  const reduce = useReducedMotion();
  const finalText = to.toLocaleString(locale).replace(/ | /g, ' ');
  const [hydrated, setHydrated] = useState(false);
  const count = useMotionValue(reduce ? to : 0);
  const formatted = useTransform(count, (v) =>
    Math.round(v).toLocaleString(locale).replace(/ | /g, ' ')
  );

  useEffect(() => {
    setHydrated(true);
    if (reduce) {
      count.set(to);
      return;
    }
    const controls = animate(count, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [to, duration, reduce, count]);

  if (!hydrated) {
    return <span aria-label={finalText}>{finalText}</span>;
  }
  return <motion.span aria-label={finalText}>{formatted}</motion.span>;
}
