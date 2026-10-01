// News items shown on /actualites/ (FR) and /en/news/ (EN), newest first.
// To publish a news item: add an entry below (FR + EN), commit, deploy.
// `visible: false` keeps an item out of the page without deleting it.

import { routes, type Lang } from './ui';
import { tournament } from './tournament';

export interface NewsItem {
  /** Stable anchor id: the item can be shared as /actualites/#<id>. */
  id: string;
  /** Publication date (YYYY-MM-DD). */
  date: string;
  title: Record<Lang, string>;
  /** One string per paragraph. **text** = bold (see src/lib/rich-text.ts). */
  body: Record<Lang, string[]>;
  /** Optional call-to-action button. */
  cta?: { label: Record<Lang, string>; href: Record<Lang, string> };
  visible?: boolean;
}

export const news: NewsItem[] = [
  {
    id: 'tournoi-2026',
    date: '2026-09-30',
    // Announced automatically once the tournament page is published.
    visible: tournament.published,
    title: {
      fr: 'Grand tournoi de pickleball le 15 novembre 2026 au Collège Calvin',
      en: 'Big pickleball tournament on 15 November 2026 at Collège Calvin',
    },
    body: {
      fr: [
        'Le Geneva Sports Club organise son premier grand tournoi de pickleball, le dimanche 15 novembre 2026 de 9h à 18h au Collège Calvin, à Genève.',
        'Au programme : doubles hommes et dames le matin, double mixte l’après-midi. Les places sont limitées dans chaque tableau et attribuées selon la règle du premier arrivé, premier servi.',
      ],
      en: [
        'The Geneva Sports Club is organising its first big pickleball tournament on Sunday 15 November 2026, from 9am to 6pm at Collège Calvin, Geneva.',
        'On the programme: men’s and women’s doubles in the morning, mixed doubles in the afternoon. Places are limited in every draw and allocated on a first come, first served basis.',
      ],
    },
    cta: {
      label: { fr: 'Découvrir le tournoi et s’inscrire', en: 'Discover the tournament and register' },
      href: { fr: routes.tournament.fr, en: routes.tournament.en },
    },
  },
];

/** Visible items, newest first. */
export function visibleNews(): NewsItem[] {
  return news
    .filter((item) => item.visible !== false)
    .sort((a, b) => b.date.localeCompare(a.date));
}
