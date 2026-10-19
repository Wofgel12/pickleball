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
  /** Show the Léman Bleu clip (src/lib/press.ts) under the text. */
  video?: 'lemanBleu';
  /** Image for the NewsArticle structured data (defaults to the site's OG image). */
  image?: string | Record<Lang, string>;
  visible?: boolean;
}

export const news: NewsItem[] = [
  {
    id: 'tournoi-2026',
    date: '2026-10-15',
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
    image: { fr: '/og-tournoi-fr.jpg', en: '/og-tournoi-en.jpg' },
  },
  {
    id: 'leman-bleu-sport-passion',
    date: '2026-09-06',
    title: {
      fr: 'La chaîne Léman Bleu parle de nous !',
      en: 'Léman Bleu TV talks about us!',
    },
    body: {
      fr: [
        'Le Geneva Sports Club contribue à faire progresser la visibilité du **pickleball à Genève**. Grâce à **Léman Bleu**, nous avons pu expliquer ce qu’est le pickleball, ce sport de raquette accessible et convivial que nous essayons de démocratiser à Genève, et pourquoi il séduit chaque semaine de plus en plus de joueuses et de joueurs.',
        'Dans son émission **Sport Passion** « Genève, terrain de sport sans frontière », présentée par Pierre Pillet et consacrée à toutes celles et ceux qui pratiquent le sport en dehors des clubs traditionnels, la chaîne genevoise a suivi l’une de nos sessions. Notre vice-président y était invité aux côtés de l’Association genevoise de cricket.',
        'Au programme du reportage : des parties en double où l’on change régulièrement de partenaire, des débutants qui prennent la raquette pour la première fois et l’ambiance détendue que l’on retrouve chaque **lundi et vendredi de 20h à 22h**. Un grand merci à Léman Bleu pour cette belle mise en lumière !',
      ],
      en: [
        'The Geneva Sports Club is helping to raise the profile of **pickleball in Geneva**. Thanks to **Léman Bleu**, we were able to explain what pickleball is — an accessible, friendly racket sport we are working to bring to everyone in Geneva — and why more and more players are joining us every week.',
        'In its **Sport Passion** programme “Genève, terrain de sport sans frontière”, presented by Pierre Pillet and dedicated to people who play sport outside traditional clubs, the Geneva TV channel followed one of our sessions. Our vice-president was a guest alongside the Geneva Cricket Association.',
        'In the report: doubles games with regular partner rotations, beginners picking up a paddle for the first time, and the relaxed atmosphere you’ll find every **Monday and Friday from 8pm to 10pm**. A big thank you to Léman Bleu for the spotlight!',
      ],
    },
    video: 'lemanBleu',
    image: '/press/lemanbleu-sport-passion.jpg',
    cta: {
      label: { fr: 'Participer à une session', en: 'Join a session' },
      href: { fr: routes.participate.fr, en: routes.participate.en },
    },
  },
];

/** Visible items, newest first. */
export function visibleNews(): NewsItem[] {
  return news
    .filter((item) => item.visible !== false)
    .sort((a, b) => b.date.localeCompare(a.date));
}
