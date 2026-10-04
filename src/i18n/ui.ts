// Centralised dictionary for the bilingual site.
// fr is the canonical default (Romandy / Geneva audience), en is the secondary locale.

export const languages = ['fr', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'fr';

// Page route map: maps a logical page key to its actual URL per locale.
// FR sits at root (canonical); EN is prefixed with /en/.
export const routes = {
  home: { fr: '/', en: '/en/' },
  participate: { fr: '/participer/', en: '/en/participate/' },
  learn: { fr: '/apprendre/', en: '/en/learn/' },
  gear: { fr: '/equipement/', en: '/en/gear/' },
  faq: { fr: '/faq/', en: '/en/faq/' },
  news: { fr: '/actualites/', en: '/en/news/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
  legal: { fr: '/mentions-legales/', en: '/en/legal-notice/' },
  privacy: { fr: '/politique-confidentialite/', en: '/en/privacy-policy/' },
  // Landing page, deliberately absent from the menu and footer.
  tournament: { fr: '/tournoi/', en: '/en/tournament/' },
  tournamentRules: { fr: '/tournoi/reglement/', en: '/en/tournament/rules/' },
} as const;
export type RouteKey = keyof typeof routes;

// Reverse-map: given the current pathname, what's its logical page + lang?
export function detectFromPath(pathname: string): { lang: Lang; key: RouteKey } {
  const norm = pathname.endsWith('/') ? pathname : pathname + '/';
  for (const key of Object.keys(routes) as RouteKey[]) {
    if (routes[key].fr === norm) return { lang: 'fr', key };
    if (routes[key].en === norm) return { lang: 'en', key };
  }
  // fallback: assume FR home
  return { lang: 'fr', key: 'home' };
}

// Hreflang reciprocal helper
export function alternateUrls(key: RouteKey, site: string) {
  return {
    fr: site.replace(/\/$/, '') + routes[key].fr,
    en: site.replace(/\/$/, '') + routes[key].en,
  };
}

// Per-page metadata (titles + descriptions) optimised for SEO.
// Each title 50-60 chars, each description 150-160 chars.
export const meta: Record<RouteKey, Record<Lang, { title: string; description: string }>> = {
  home: {
    fr: {
      title: 'Sessions de Pickleball à Genève | Tous niveaux | GSC Pickleball',
      description: 'Sessions de pickleball à Genève (La Jonction) avec le Geneva Sports Club : lundis & vendredis 20h-22h, 10 CHF, sans adhésion. Tous niveaux bienvenus.',
    },
    en: {
      title: 'Pickleball Sessions in Geneva | All Levels | GSC Pickleball',
      description: 'Pickleball sessions in Geneva (La Jonction) with the Geneva Sports Club: Mondays & Fridays 8pm-10pm, CHF 10, no membership required. All levels welcome.',
    },
  },
  participate: {
    fr: {
      title: 'Apprenez le Pickleball à Genève : lundi & vendredi | GSC',
      description: 'Venez apprendre le pickleball à Genève avec le Geneva Sports Club : lundis & vendredis 20h-22h, 10 CHF, raquettes fournies. Tous niveaux bienvenus.',
    },
    en: {
      title: 'Learn Pickleball in Geneva: Mondays & Fridays | GSC Pickleball',
      description: 'Come learn pickleball in Geneva with the Geneva Sports Club: Mondays & Fridays 8pm-10pm, CHF 10, paddles provided. All levels welcome.',
    },
  },
  learn: {
    fr: {
      title: 'Apprendre le Pickleball à Genève — Guide Débutant | GSC',
      description: 'Apprenez les règles du pickleball : terrain, service, cuisine, scoring en 11 points, technique et lexique. Guide complet pour débutants à Genève — GSC.',
    },
    en: {
      title: 'Learn Pickleball in Geneva — Beginner Guide | GSC',
      description: 'Learn pickleball rules: court, serve, kitchen, 11-point scoring, technique and glossary. Complete beginner guide in Geneva — Geneva Sports Club.',
    },
  },
  gear: {
    fr: {
      title: 'Équipement Pickleball — Guide Raquettes & Balles 2026',
      description: 'Guide pour choisir votre raquette de pickleball : poids, matériaux (graphite, composite), niveau. Recommandations balles indoor/outdoor pour Genève.',
    },
    en: {
      title: 'Pickleball Gear — Paddle & Ball Buying Guide 2026',
      description: 'Pickleball paddle buying guide: weight, materials (graphite, composite), skill level. Indoor/outdoor ball recommendations for Geneva players.',
    },
  },
  faq: {
    fr: {
      title: 'FAQ Pickleball Genève — 16 questions fréquentes',
      description: 'Réponses aux questions sur le pickleball à Genève : tarifs, niveaux, indoor, padel vs pickleball, seniors, enfants, tournois Suisse romande, vacances.',
    },
    en: {
      title: 'Pickleball Geneva FAQ — 16 frequent questions',
      description: 'Pickleball Geneva FAQ: prices, levels, indoor play, padel vs pickleball, seniors, kids, Swiss tournaments, school holidays. Everything you need to know.',
    },
  },
  news: {
    fr: {
      title: 'Actualités Pickleball Genève — Geneva Sports Club',
      description: 'Les dernières nouvelles du pickleball au Geneva Sports Club : tournois, événements, nouveautés des sessions à Genève et vie du club.',
    },
    en: {
      title: 'Pickleball Geneva News — Geneva Sports Club',
      description: 'The latest pickleball news from the Geneva Sports Club: tournaments, events, session updates in Geneva and club life.',
    },
  },
  contact: {
    fr: {
      title: 'Contact Pickleball Genève — Geneva Sports Club',
      description: 'Contactez Geneva Sports Club pour le pickleball à Genève : email, téléphone, adresse à La Jonction (1205 Genève). Sessions lundi & vendredi 20h-22h.',
    },
    en: {
      title: 'Contact — Geneva Sports Club Pickleball',
      description: 'Contact Geneva Sports Club for pickleball in Geneva: email, phone, address at La Jonction (1205 Geneva). Sessions Monday & Friday 8pm-10pm.',
    },
  },
  legal: {
    fr: {
      title: 'Mentions légales — GSC Pickleball Genève',
      description: 'Mentions légales du site Geneva Sports Club Pickleball : éditeur, hébergeur, responsable de publication, propriété intellectuelle, droit applicable.',
    },
    en: {
      title: 'Legal Notice — GSC Pickleball Geneva',
      description: 'Legal notice for the Geneva Sports Club Pickleball website: publisher, hosting, editorial responsibility, intellectual property, applicable law.',
    },
  },
  privacy: {
    fr: {
      title: 'Politique de confidentialité — GSC Pickleball Genève',
      description: 'Politique de confidentialité du site Geneva Sports Club Pickleball : données collectées, cookies, durée de conservation, vos droits, contact.',
    },
    en: {
      title: 'Privacy Policy — GSC Pickleball Geneva',
      description: 'Privacy policy for the Geneva Sports Club Pickleball website: data collected, cookies, retention, your rights, contact details.',
    },
  },
  tournament: {
    fr: {
      title: 'Tournoi de Pickleball à Genève — 15 novembre 2026 | GSC',
      description: 'Tournoi de pickleball du Geneva Sports Club le 15 novembre 2026 au Collège Calvin, Genève : doubles hommes, dames et mixte. Places limitées.',
    },
    en: {
      title: 'Pickleball Tournament in Geneva — 15 Nov 2026 | GSC',
      description: 'Geneva Sports Club pickleball tournament on 15 November 2026 at Collège Calvin, Geneva: men’s, women’s and mixed doubles. Limited places.',
    },
  },
  tournamentRules: {
    fr: {
      title: 'Règlement du tournoi de pickleball — 15 novembre 2026 | GSC',
      description: 'Règlement du tournoi de pickleball du Geneva Sports Club : inscription, paiement, annulation et remboursement, déroulement, responsabilité.',
    },
    en: {
      title: 'Pickleball Tournament Rules — 15 November 2026 | GSC',
      description: 'Rules of the Geneva Sports Club pickleball tournament: registration, payment, cancellation and refunds, how the day runs, liability.',
    },
  },
};

// Navigation links (visible labels per language)
export const navLabels: Record<RouteKey, Record<Lang, string>> = {
  home:        { fr: 'Accueil',                       en: 'Home' },
  participate: { fr: 'Participer',                    en: 'Participate' },
  learn:       { fr: 'Apprendre',                     en: 'Learn' },
  gear:        { fr: 'Équipement',                    en: 'Gear' },
  faq:         { fr: 'FAQ',                           en: 'FAQ' },
  news:        { fr: 'Actualités',                    en: 'News' },
  contact:     { fr: 'Contact',                       en: 'Contact' },
  legal:       { fr: 'Mentions légales',              en: 'Legal Notice' },
  privacy:     { fr: 'Politique de confidentialité',  en: 'Privacy Policy' },
  tournament:  { fr: 'Tournoi',                       en: 'Tournament' },
  tournamentRules: { fr: 'Règlement du tournoi',      en: 'Tournament rules' },
};

// Common UI strings used across components
export const ui = {
  switchLang:     { fr: 'EN', en: 'FR' },
  meetupCta:      { fr: 'Voir nos événements sur Meetup', en: 'View our events on Meetup' },
  joinSession:    { fr: 'Rejoindre une session', en: 'Join a session' },
  howToParticipate: { fr: 'Comment participer ?', en: 'How to participate?' },
  lastUpdated:    { fr: 'Dernière mise à jour', en: 'Last updated' },
  brandLong:      { fr: 'Geneva Sports Club', en: 'Geneva Sports Club' },
  brandPickle:    { fr: 'GSC Pickleball', en: 'GSC Pickleball' },
  ariaFooter:     { fr: 'Pied de page Geneva Sports Club', en: 'Geneva Sports Club footer' },
  pickleballGroup:{ fr: 'Le Pickleball', en: 'Pickleball' },
};

// Single source of truth for facts cited across the site (LLM-friendly).
export const facts = {
  location: 'La Jonction, 1205 Genève, Suisse',
  locationEn: 'La Jonction, 1205 Geneva, Switzerland',
  venueName: 'École de Cité-Jonction',
  email: 'hello@genevasportsclub.ch',
  phonePrimary: '+41762141203',
  phonePrimaryDisplay: '+41 76 214 12 03',
  phoneSession: '+41788826810',
  phoneSessionDisplay: '+41 78 882 68 10',
  meetupUrl: 'https://www.meetup.com/genevasportsclub/',
  meetupUrlFr: 'https://www.meetup.com/fr-FR/genevasportsclub/',
  // Meetup member count (all sports), shown in the hero, FAQ and schema.
  meetupMembers: 9400,
  // Canonical Google Maps URL for the GBP "Pickleball Geneva Sports Club"
  // (CID derived from place ID 0x478c65a6c4ab4dc7:0x554b55d62ef23749).
  gbpMapUrl: 'https://www.google.com/maps?cid=6146100494876161865',
  parentSiteUrl: 'https://genevasportsclub.ch/',
  daysFr: 'Lundi & vendredi',
  daysEn: 'Monday & Friday',
  hours: '20:00 – 22:00',
  hoursEn: '8:00pm – 10:00pm',
  priceCHF: 10,
  geo: { lat: 46.19916, lon: 6.13186 },
  // ISO date for "last updated" in the visible footer (E-E-A-T signal).
  // Updated each time content is meaningfully edited.
  lastReviewedISO: '2026-04-29',
} as const;
