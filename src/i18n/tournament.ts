// Single source of truth for the GSC tournament landing page
// (FR /tournoi/ + EN /en/tournament/), the registration API and the
// confirmation e-mail. Edit the values here, nowhere else.

import type { Lang } from './ui';

// Prices in CHF cents — single source for the page copy, the API and Stripe.
const PRICE_DOUBLES_CENTS = 2000;
const PRICE_SINGLES_CENTS = 1500;
/** Discounted price for men's or women's doubles + mixed doubles. */
const PRICE_DOUBLES_MIXED_COMBO_CENTS = 3000;
const doubles = PRICE_DOUBLES_CENTS / 100;
const singlesPrice = PRICE_SINGLES_CENTS / 100;
const combo = PRICE_DOUBLES_MIXED_COMBO_CENTS / 100;
const doublesSinglesTotal = (PRICE_DOUBLES_CENTS + PRICE_SINGLES_CENTS) / 100;

export const tournament = {
  /** Stable id stored with every registration in Supabase. */
  id: 'gsc-2026',

  /**
   * false → page is `noindex` and left out of the sitemap (safe while Stripe
   * and the page links are being set up). Flip to true on launch day.
   */
  published: false,

  /** Start / end in Geneva local time (CET = UTC+1 in November). */
  startISO: '2026-11-15T09:00:00+01:00',
  endISO: '2026-11-15T18:00:00+01:00',

  venueName: 'Collège Calvin',
  venueStreet: 'Rue Théodore-De-Bèze 2-4',
  venuePostalCode: '1206',
  venueLocality: 'Genève',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Coll%C3%A8ge%20Calvin%2C%20Gen%C3%A8ve',
  /** Keyless Google Maps embed; the page appends the interface language (fr/en). */
  mapsEmbedUrl: 'https://maps.google.com/maps?q=Coll%C3%A8ge%20Calvin%2C%20Gen%C3%A8ve&z=16&output=embed&hl=',

  minAge: 18,

  /**
   * Minutes a player has to pay. After that, the scheduled job
   * (netlify/functions/tournoi-expire-holds) closes their Stripe page and frees the place.
   */
  holdMinutes: 15,

  /** Meetup member count quoted in the description (linked to the Meetup page). */
  meetupMembers: { fr: "10'000", en: '10,000' },

  // Capacity counts players (each person registers individually).
  // Morning: men's + women's doubles. Afternoon: mixed doubles + singles.
  // Exact times are announced later.
  categories: [
    { id: 'men',     double: true,  capacity: 30, slot: 'morning',   priceCents: PRICE_DOUBLES_CENTS, name: { fr: 'Double hommes', en: "Men's doubles" } },
    { id: 'women',   double: true,  capacity: 20, slot: 'morning',   priceCents: PRICE_DOUBLES_CENTS, name: { fr: 'Double dames',  en: "Women's doubles" } },
    { id: 'mixed',   double: true,  capacity: 36, slot: 'afternoon', priceCents: PRICE_DOUBLES_CENTS, name: { fr: 'Double mixte',  en: 'Mixed doubles' } },
    { id: 'singles', double: false, capacity: 12, slot: 'afternoon', priceCents: PRICE_SINGLES_CENTS, name: { fr: 'Simple',        en: 'Singles' } },
  ],

  /**
   * The only draw pairs a player may book together. `priceCents` is the
   * discounted total; without it the pair costs the sum of both draws.
   */
  combos: [
    { ids: ['men', 'mixed'],   priceCents: PRICE_DOUBLES_MIXED_COMBO_CENTS },
    { ids: ['women', 'mixed'], priceCents: PRICE_DOUBLES_MIXED_COMBO_CENTS },
    { ids: ['men', 'singles'] },
    { ids: ['women', 'singles'] },
  ],

  partners: [
    {
      id: 'fluffypuffy',
      name: 'FluffyPuffy',
      url: 'https://fluffypuffy.ch',
      role: { fr: 'Partenaire restauration', en: 'Food partner' },
      text: {
        fr: 'Des crêpes, des mini-pancakes et plein d’autres spécialités délicieuses pour recharger les batteries entre deux matchs.',
        en: 'Crêpes, mini pancakes and plenty of other treats to refuel between matches.',
      },
    },
    {
      id: 'pickleballcorner',
      name: 'Pickleball Corner',
      url: 'https://pickleballcorner.ch/fr',
      role: { fr: 'Partenaire matériel', en: 'Equipment partner' },
      text: {
        fr: 'Le spécialiste suisse du pickleball sera présent sur place : raquettes, balles et conseils de pro.',
        en: 'Switzerland’s pickleball specialist will be on site: paddles, balls and expert advice.',
      },
    },
  ],
} as const;

export type TournamentCategory = (typeof tournament.categories)[number];
export type CategoryId = TournamentCategory['id'];

export function findCategory(id: string): TournamentCategory | undefined {
  return tournament.categories.find((c) => c.id === id);
}

type Combo = { ids: readonly string[]; priceCents?: number };

/** The combo matching exactly this set of draw ids, if any. */
export function findCombo(ids: readonly string[]): Combo | undefined {
  const unique = [...new Set(ids)];
  return (tournament.combos as readonly Combo[]).find(
    (combo) => combo.ids.length === unique.length && combo.ids.every((id) => unique.includes(id)),
  );
}

/**
 * Valid selections: one draw, or one of the `combos`. Returns the draws in
 * programme order, or null when the selection isn't allowed.
 */
export function normalizeSelection(ids: readonly string[]): TournamentCategory[] | null {
  const unique = [...new Set(ids)];
  const cats = unique.map(findCategory);
  if (cats.length === 0 || cats.some((c) => !c)) return null;
  if (cats.length > 1 && !findCombo(unique)) return null;
  const order = tournament.categories.map((c) => c.id) as string[];
  return (cats as TournamentCategory[]).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

/**
 * Total price, per-draw split (stored on each registration row) and whether
 * a combo discount applies.
 */
export function priceSelection(cats: readonly TournamentCategory[]): {
  totalCents: number;
  perDrawCents: number[];
  discounted: boolean;
} {
  const fullPrices = cats.map((c) => c.priceCents);
  const comboPrice = cats.length > 1 ? findCombo(cats.map((c) => c.id))?.priceCents : undefined;
  if (comboPrice === undefined) {
    return { totalCents: fullPrices.reduce((a, b) => a + b, 0), perDrawCents: fullPrices, discounted: false };
  }
  const half = Math.floor(comboPrice / 2);
  return { totalCents: comboPrice, perDrawCents: [half, comboPrice - half], discounted: true };
}

/** Loose phone check: 8–15 digits, optional leading +, spaces/dots/dashes/brackets allowed. */
export function isValidPhone(raw: string): boolean {
  const v = raw.trim();
  const digits = (v.match(/\d/g) ?? []).length;
  return /^\+?[\d\s().-]+$/.test(v) && digits >= 8 && digits <= 15;
}

export function formatCHF(cents: number, lang: Lang): string {
  const n = cents / 100;
  const s = Number.isInteger(n) ? String(n) : n.toFixed(2);
  return lang === 'fr' ? `${s} CHF` : `CHF ${s}`;
}

export const tournamentCopy = {
  fr: {
    kicker: 'Tournoi de pickleball · 1re édition',
    title: 'Le plus grand tournoi de Suisse romande !',
    dateLong: 'Dimanche 15 novembre 2026',
    hours: '9h – 18h',
    ctaRegister: 'Je m’inscris',
    ctaMap: 'Voir sur Google Maps',
    countdownLabel: 'Coup d’envoi dans',
    countdownUnits: { days: 'jours', hours: 'heures', minutes: 'minutes', seconds: 'secondes' },
    countdownToday: 'C’est aujourd’hui ! Rendez-vous au Collège Calvin.',
    countdownOver: 'Merci à toutes et à tous ! Rendez-vous à la prochaine édition.',
    aboutTitle: 'Une journée de pickleball comme on n’en a jamais vu à Genève',
    // Mise en forme : **texte en gras**, [texte du lien vers Meetup].
    about: [
      'Le Geneva Sports Club, avec ses [près de {members} membres sur Meetup], organise le plus grand tournoi de pickleball de Suisse romande. Il est oouvert à **tous les niveaux !** Venez vous amuser et rencontrer des joueuses et des joueurs d’horizons différents qui partagent la même passion que vous. Une journée unique, on vous le promet, avec plein de cadeaux à la clé — et de nouvelles amitiés à tisser.',
      'Inscrivez-vous le plus tôt possible : malgré tous nos efforts, le nombre de places est limité et nous appliquons la règle du premier arrivé, premier servi. Nos membres bénéficient toutefois d’inscriptions en avant-première : c’est quand même à eux qu’on doit cette idée !',
      'Nous espérons que vous êtes prêts à beaucoup jouer, car ce sera LE jour pour ça :)',
    ],
    highlights: [
      { title: '4 tableaux', text: 'Doubles hommes et dames le matin, double mixte et simple l’après-midi.' },
      { title: 'Des cadeaux', text: 'On garde la surprise… mais il y en aura plein. Et pour tout le monde.' },
      { title: 'Toute la journée', text: 'De 9h à 18h, pour jouer, encore et encore.' },
    ],
    categoriesTitle: 'Choisissez votre ou vos tableaux',
    categoriesLead: 'Les places restantes se mettent à jour en temps réel. Chacun·e s’inscrit individuellement : indiquez votre partenaire ou laissez-nous vous en trouver un·e.',
    comboBanner: `Combo : double hommes ou dames le matin + double mixte l’après-midi = ${combo} CHF au lieu de ${doubles * 2} CHF`,
    slots: { morning: 'Matin', afternoon: 'Après-midi' },
    pricing: { single: `${doubles} CHF le tableau`, combo: `${combo} CHF les deux` },
    total: 'Total',
    comboSaving: 'Combo',
    comboHint: (draw: string, slot: string, total: string) =>
      `Ajoutez le ${draw.toLowerCase()} (${slot.toLowerCase()}) : ${total} pour les deux tableaux.`,
    conflictHint: `Horaires précis communiqués ultérieurement. Combinaisons possibles : double hommes ou dames + double mixte (${combo} CHF), double hommes ou dames + simple (${doublesSinglesTotal} CHF).`,
    placesLeft: (n: number) => (n === 1 ? '1 place restante' : `${n} places restantes`),
    placesOf: (cap: number) => `sur ${cap}`,
    placesLoading: 'Places limitées',
    full: 'Complet',
    fullNote: 'Contactez les organisateurs si vous avez des questions.',
    perPerson: 'par personne',
    choose: 'Choisir',
    chosen: 'Sélectionné',
    unavailableSlot: 'Même horaire',
    formTitle: 'Inscription',
    formLead: 'Aucun compte à créer : remplissez le formulaire, payez en ligne en toute sécurité avec Stripe et recevez votre confirmation par e-mail.',
    fields: {
      category: 'Tableaux',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'E-mail',
      phone: 'Téléphone mobile (WhatsApp)',
      phoneHint: 'Nous vous ajouterons au groupe WhatsApp du tournoi avec ce numéro.',
      partner: (draw: string) => `Votre partenaire — ${draw}`,
      partnerName: 'Nom et prénom de votre partenaire',
      partnerHint: 'Votre partenaire doit aussi s’inscrire de son côté.',
      findPartner: 'Trouvez-moi un·e partenaire',
      withPartner: 'J’ai déjà un·e partenaire',
      age: 'J’ai 18 ans ou plus.',
      noRefund: 'Je comprends que l’inscription n’est pas remboursable.',
      paddle: 'Avez-vous besoin d’une raquette de prêt ?',
      paddleYes: 'Oui',
      paddleNo: 'Non, j’ai ma raquette',
    },
    submit: (price: string) => `Payer ${price} et m’inscrire`,
    submitting: 'Redirection vers le paiement…',
    secure: 'Paiement sécurisé par Stripe',
    holdNotice: 'Votre place est réservée 15 minutes : passé ce délai, le paiement n’est plus possible et la place est libérée.',
    privacyNotice: 'Vos données servent à organiser le tournoi et à vous ajouter au groupe WhatsApp.',
    privacyLink: 'Politique de confidentialité',
    testModeBanner: '⚠️ MODE TEST — aucun paiement réel : les inscriptions sont confirmées sans passer par Stripe.',
    errors: {
      required: 'Champ requis',
      email: 'E-mail invalide',
      phone: 'Numéro invalide (ex. +41 79 123 45 67)',
      category: 'Choisissez au moins un tableau',
      partner: 'Indiquez votre partenaire ou choisissez « Trouvez-moi un·e partenaire »',
      checkbox: 'Merci de cocher cette case',
      choice: 'Merci de choisir une réponse',
      full: 'Un des tableaux choisis vient d’être complet. Contactez les organisateurs si vous avez des questions.',
      generic: 'Une erreur est survenue. Réessayez ou contactez-nous.',
      unavailable: 'Les inscriptions ouvrent très bientôt. Revenez un peu plus tard !',
    },
    successTitle: 'Paiement reçu, merci !',
    successText: 'Votre inscription est confirmée. Un e-mail de confirmation vient de vous être envoyé (pensez à vérifier vos spams).',
    cancelledText: 'Paiement annulé : votre place n’a pas été réservée. Vous pouvez recommencer quand vous voulez.',
    infoTitle: 'Infos pratiques',
    info: [
      { dt: 'Date', dd: 'Dimanche 15 novembre 2026' },
      { dt: 'Horaires', dd: 'De 9h à 18h' },
      { dt: 'Programme', dd: 'Matin : doubles hommes et dames. Après-midi : double mixte et simple. Horaires précis communiqués ultérieurement.' },
      { dt: 'Tarif', dd: `Double : ${doubles} CHF. Simple : ${singlesPrice} CHF. Double hommes ou dames + double mixte : ${combo} CHF. Double hommes ou dames + simple : ${doublesSinglesTotal} CHF.` },
      { dt: 'Lieu', dd: 'Collège Calvin, Rue Théodore-De-Bèze 2-4, 1206 Genève' },
      { dt: 'Âge', dd: 'Dès 18 ans' },
      { dt: 'Matériel', dd: 'Des raquettes peuvent être prêtées en cas de besoin' },
      { dt: 'Tenue', dd: 'Chaussures de salle à semelle non marquante' },
      { dt: 'Restauration', dd: 'Restauration sur place disponible' },
      { dt: 'Remboursement', dd: 'Les inscriptions ne sont pas remboursables' },
      { dt: 'Cadeaux', dd: 'Surprise !' },
    ],
    partnersTitle: 'Nos partenaires',
    partnersLead: 'Cette année, deux partenaires de renom nous accompagnent dans cette aventure.',
    contactTitle: 'Une question ?',
    contactText: 'Écrivez-nous, on vous répond rapidement.',
    backToSite: 'Découvrir le Geneva Sports Club',
  },
  en: {
    kicker: 'Pickleball tournament · 1st edition',
    title: 'The biggest tournament in French-speaking Switzerland!',
    dateLong: 'Sunday 15 November 2026',
    hours: '9am – 6pm',
    ctaRegister: 'Register now',
    ctaMap: 'View on Google Maps',
    countdownLabel: 'Kick-off in',
    countdownUnits: { days: 'days', hours: 'hours', minutes: 'minutes', seconds: 'seconds' },
    countdownToday: 'It’s today! See you at Collège Calvin.',
    countdownOver: 'Thank you all! See you at the next edition.',
    aboutTitle: 'A pickleball day like Geneva has never seen',
    about: [
      'The Geneva Sports Club, with [nearly {members} members on Meetup], is organising the biggest pickleball tournament in French-speaking Switzerland. Come have fun and meet players from all walks of life who share your passion. A unique day, we promise — with plenty of prizes up for grabs, and new friendships to make.',
      'Register as early as you can: despite all our efforts, places are limited and it’s first come, first served. Our members do get early-bird registration — after all, it was their idea!',
      'We hope you’re ready to play a lot, because this will be THE day for it :)',
    ],
    highlights: [
      { title: '4 draws', text: 'Men’s and women’s doubles in the morning, mixed doubles and singles in the afternoon.' },
      { title: 'Prizes', text: 'We’re keeping it a surprise… but there will be plenty. And for everyone.' },
      { title: 'All day long', text: 'From 9am to 6pm — play, and play again.' },
    ],
    categoriesTitle: 'Choose your draw(s)',
    categoriesLead: 'Remaining places update in real time. Everyone registers individually: name your partner or let us find one for you.',
    comboBanner: `Combo: men’s or women’s doubles in the morning + mixed doubles in the afternoon = CHF ${combo} instead of CHF ${doubles * 2}`,
    slots: { morning: 'Morning', afternoon: 'Afternoon' },
    pricing: { single: `CHF ${doubles} per draw`, combo: `CHF ${combo} for both` },
    total: 'Total',
    comboSaving: 'Combo',
    comboHint: (draw: string, slot: string, total: string) =>
      `Add ${draw} (${slot.toLowerCase()}): ${total} for both draws.`,
    conflictHint: `Exact times will be announced later. Possible combinations: men’s or women’s doubles + mixed doubles (CHF ${combo}), men’s or women’s doubles + singles (CHF ${doublesSinglesTotal}).`,
    placesLeft: (n: number) => (n === 1 ? '1 place left' : `${n} places left`),
    placesOf: (cap: number) => `of ${cap}`,
    placesLoading: 'Limited places',
    full: 'Full',
    fullNote: 'Contact the organisers if you have any questions.',
    perPerson: 'per person',
    choose: 'Choose',
    chosen: 'Selected',
    unavailableSlot: 'Same time slot',
    formTitle: 'Registration',
    formLead: 'No account needed: fill in the form, pay securely online with Stripe and get your confirmation by e-mail.',
    fields: {
      category: 'Draws',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'E-mail',
      phone: 'Mobile phone (WhatsApp)',
      phoneHint: 'We’ll use this number to add you to the tournament WhatsApp group.',
      partner: (draw: string) => `Your partner — ${draw}`,
      partnerName: 'Your partner’s full name',
      partnerHint: 'Your partner must register separately too.',
      findPartner: 'Find me a partner',
      withPartner: 'I already have a partner',
      age: 'I am 18 or older.',
      noRefund: 'I understand registration is non-refundable.',
      paddle: 'Do you need to borrow a paddle?',
      paddleYes: 'Yes',
      paddleNo: 'No, I have my own',
    },
    submit: (price: string) => `Pay ${price} and register`,
    submitting: 'Redirecting to payment…',
    secure: 'Secure payment by Stripe',
    holdNotice: 'Your place is held for 15 minutes: after that, payment is no longer possible and the place is released.',
    privacyNotice: 'Your data is used to organise the tournament and add you to the WhatsApp group.',
    privacyLink: 'Privacy policy',
    testModeBanner: '⚠️ TEST MODE — no real payment: registrations are confirmed without going through Stripe.',
    errors: {
      required: 'Required',
      email: 'Invalid e-mail',
      phone: 'Invalid number (e.g. +41 79 123 45 67)',
      category: 'Choose at least one draw',
      partner: 'Name your partner or choose “Find me a partner”',
      checkbox: 'Please tick this box',
      choice: 'Please choose an answer',
      full: 'One of your draws just filled up. Contact the organisers if you have any questions.',
      generic: 'Something went wrong. Please try again or contact us.',
      unavailable: 'Registration opens very soon. Please check back a little later!',
    },
    successTitle: 'Payment received — thank you!',
    successText: 'Your registration is confirmed. A confirmation e-mail is on its way (check your spam folder just in case).',
    cancelledText: 'Payment cancelled: your place has not been reserved. You can try again any time.',
    infoTitle: 'Practical info',
    info: [
      { dt: 'Date', dd: 'Sunday 15 November 2026' },
      { dt: 'Hours', dd: '9am to 6pm' },
      { dt: 'Programme', dd: 'Morning: men’s and women’s doubles. Afternoon: mixed doubles and singles. Exact times will be announced later.' },
      { dt: 'Fee', dd: `Doubles: CHF ${doubles}. Singles: CHF ${singlesPrice}. Men’s or women’s doubles + mixed doubles: CHF ${combo}. Men’s or women’s doubles + singles: CHF ${doublesSinglesTotal}.` },
      { dt: 'Venue', dd: 'Collège Calvin, Rue Théodore-De-Bèze 2-4, 1206 Geneva' },
      { dt: 'Age', dd: '18 and over' },
      { dt: 'Equipment', dd: 'Paddles can be lent if needed' },
      { dt: 'Shoes', dd: 'Non-marking indoor shoes' },
      { dt: 'Food', dd: 'Food and drinks available on site' },
      { dt: 'Refunds', dd: 'Registrations are non-refundable' },
      { dt: 'Prizes', dd: 'Surprise!' },
    ],
    partnersTitle: 'Our partners',
    partnersLead: 'This year, two renowned partners are joining us on this adventure.',
    contactTitle: 'Any questions?',
    contactText: 'Drop us a line — we’ll get back to you quickly.',
    backToSite: 'Discover the Geneva Sports Club',
  },
} as const;
