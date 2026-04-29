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
  contact: { fr: '/contact/', en: '/en/contact/' },
  legal: { fr: '/mentions-legales/', en: '/en/legal-notice/' },
  privacy: { fr: '/politique-confidentialite/', en: '/en/privacy-policy/' },
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
      title: 'Pickleball Genève — Cours & Sessions | GSC Pickleball',
      description: 'Cours de pickleball à Genève (La Jonction), lundi & vendredi 18h-20h, 10 CHF la session. Tous niveaux, raquettes fournies. Rejoignez le Geneva Sports Club.',
    },
    en: {
      title: 'Pickleball Geneva — Lessons & Sessions | GSC Pickleball',
      description: 'Pickleball sessions in Geneva (La Jonction), Monday & Friday 6pm-8pm, CHF 10 per session. All levels, paddles provided. Join the Geneva Sports Club.',
    },
  },
  participate: {
    fr: {
      title: 'Participer à une session de Pickleball à Genève — GSC',
      description: 'Inscrivez-vous en 5 étapes via Meetup à nos sessions de pickleball à Genève. Lundi & vendredi 18h-20h, 10 CHF, équipement fourni. Tous niveaux bienvenus.',
    },
    en: {
      title: 'Join a Pickleball Session in Geneva — GSC Pickleball',
      description: 'Register via Meetup in 5 steps for pickleball sessions in Geneva. Monday & Friday 6pm-8pm, CHF 10, equipment provided. All levels welcome.',
    },
  },
  learn: {
    fr: {
      title: 'Apprendre le Pickleball — Règles & Technique | Genève',
      description: 'Apprenez les règles du pickleball : terrain, service, cuisine, scoring en 11 points, technique, lexique. Guide complet pour débuter à Genève avec le GSC.',
    },
    en: {
      title: 'Learn Pickleball — Rules & Technique | Geneva',
      description: 'Learn pickleball rules: court, serve, kitchen, scoring to 11, basic technique, glossary. Complete beginner guide for Geneva — Geneva Sports Club.',
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
  contact: {
    fr: {
      title: 'Contact Pickleball Genève — Geneva Sports Club',
      description: 'Contactez Geneva Sports Club pour le pickleball à Genève : email, téléphone, adresse à La Jonction (1205 Genève). Sessions lundi & vendredi 18h-20h.',
    },
    en: {
      title: 'Contact — Geneva Sports Club Pickleball',
      description: 'Contact Geneva Sports Club for pickleball in Geneva: email, phone, address at La Jonction (1205 Geneva). Sessions Monday & Friday 6pm-8pm.',
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
};

// Navigation links (visible labels per language)
export const navLabels: Record<RouteKey, Record<Lang, string>> = {
  home:        { fr: 'Accueil',                       en: 'Home' },
  participate: { fr: 'Participer',                    en: 'Participate' },
  learn:       { fr: 'Apprendre',                     en: 'Learn' },
  gear:        { fr: 'Équipement',                    en: 'Gear' },
  faq:         { fr: 'FAQ',                           en: 'FAQ' },
  contact:     { fr: 'Contact',                       en: 'Contact' },
  legal:       { fr: 'Mentions légales',              en: 'Legal Notice' },
  privacy:     { fr: 'Politique de confidentialité',  en: 'Privacy Policy' },
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
  // Canonical Google Maps URL for the GBP "Pickleball Geneva Sports Club"
  // (CID derived from place ID 0x478c65a6c4ab4dc7:0x554b55d62ef23749).
  gbpMapUrl: 'https://www.google.com/maps?cid=6146100494876161865',
  parentSiteUrl: 'https://genevasportsclub.ch/',
  daysFr: 'Lundi & vendredi',
  daysEn: 'Monday & Friday',
  hours: '18:00 – 20:00',
  hoursEn: '6:00pm – 8:00pm',
  priceCHF: 10,
  geo: { lat: 46.19916, lon: 6.13186 },
  // ISO date for "last updated" in the visible footer (E-E-A-T signal).
  // Updated each time content is meaningfully edited.
  lastReviewedISO: '2026-04-29',
} as const;
