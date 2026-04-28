import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  items: FaqItem[];
  /** Open the first item by default (good for fold-above SEO/UX) */
  defaultOpen?: number | null;
}

/**
 * Accessible accordion with proper aria-expanded / aria-controls.
 * The full Q+A text is also rendered server-side via <details> in the parent
 * Astro file as a no-JS fallback, so search engines and AI crawlers ALWAYS see
 * every answer regardless of hydration.
 */
export default function FaqAccordion({ items, defaultOpen = 0 }: Props) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {items.map((it, i) => {
        const isOpen = open === i;
        const id = `faq-${i}`;
        return (
          <div
            key={i}
            className="bg-white/90 backdrop-blur-sm rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-md"
            style={{ borderColor: '#002b2b' }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${id}-panel`}
              id={`${id}-trigger`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors hover:bg-teal-50/50"
            >
              <h3 className="font-semibold text-lg text-gray-900 pr-4">{it.question}</h3>
              <ChevronDown
                className={`flex-shrink-0 text-teal-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                size={24}
              />
            </button>
            <div
              id={`${id}-panel`}
              role="region"
              aria-labelledby={`${id}-trigger`}
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <p className="px-6 pb-4 text-gray-700 leading-relaxed">{it.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
