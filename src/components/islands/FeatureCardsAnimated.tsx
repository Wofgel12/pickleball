import { useRef } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';

export interface CardData {
  src: string;
  alt: string;
  title: string;
  /** Pre-rendered HTML body (may include <a> links) */
  bodyHtml: string;
}

interface Props {
  cards: CardData[];
}

// Stack appearance per card index (DOM order). Card 0 sits at the bottom of
// the pile; card 2 is rendered last, so it sits on top — its rotation should
// dominate the visual. The y/rotate values create a fanned "deck" look.
const stackOffsets = [
  { x: 0,        y: 6,  rotate: -3 },
  { x: '-104%',  y: 2,  rotate: 5 },
  { x: '-208%',  y: 0,  rotate: -1 },
] as const;

export default function FeatureCardsAnimated({ cards }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className="grid md:grid-cols-3 gap-8 mb-12">
      {cards.map((c, i) => {
        const stacked = stackOffsets[i] ?? stackOffsets[0];

        // Reduced motion: just fade in.
        // Mobile (single column): fade-up, no horizontal stack (would clip viewport).
        // Desktop: stack-to-grid with spring physics.
        const variants = reduce
          ? {
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: 0.4, delay: i * 0.05 },
              },
            }
          : {
              hidden: {
                opacity: 0,
                scale: 0.94,
                ...stacked,
              },
              visible: {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                rotate: 0,
                transition: {
                  type: 'spring',
                  stiffness: 90,
                  damping: 18,
                  mass: 0.9,
                  delay: 0.15 + i * 0.12,
                },
              },
            };

        return (
          <motion.article
            key={i}
            className="text-center rounded-2xl bg-white/90 backdrop-blur-sm border-2 overflow-hidden card-lift"
            style={{ borderColor: '#002b2b' }}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants}
            whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
          >
            <div className="w-full h-48 overflow-hidden">
              <img
                src={c.src}
                alt={c.alt}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <div className="p-8 pt-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{c.title}</h3>
              <p
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: c.bodyHtml }}
              />
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
