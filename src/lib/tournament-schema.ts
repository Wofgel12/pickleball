import { tournament, tournamentCopy } from '../i18n/tournament';
import { routes, type Lang } from '../i18n/ui';

/** SportsEvent JSON-LD for the tournament landing page. */
export function tournamentSchema(site: string, lang: Lang) {
  const t = tournamentCopy[lang];
  const pageUrl = site + routes.tournament[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    '@id': site + '/tournoi/#event',
    name: lang === 'fr' ? 'Tournoi de pickleball du Geneva Sports Club 2026' : 'Geneva Sports Club Pickleball Tournament 2026',
    description: t.about[0].replace('{members}', tournament.meetupMembers[lang]).replace(/\[|\]/g, ''),
    sport: 'Pickleball',
    startDate: tournament.startISO,
    endDate: tournament.endISO,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    inLanguage: lang === 'fr' ? 'fr-CH' : 'en',
    typicalAgeRange: `${tournament.minAge}-`,
    url: pageUrl,
    image: site + '/og-pickleball-geneve.jpg',
    location: {
      '@type': 'Place',
      name: tournament.venueName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: tournament.venueStreet,
        postalCode: tournament.venuePostalCode,
        addressLocality: tournament.venueLocality,
        addressRegion: 'GE',
        addressCountry: 'CH',
      },
      hasMap: tournament.mapsUrl,
    },
    organizer: { '@id': site + '/#sportsclub' },
    sponsor: tournament.partners.map((p) => ({ '@type': 'Organization', name: p.name, url: p.url })),
    offers: [
      ...tournament.categories.map((c) => ({
        '@type': 'Offer',
        name: c.name[lang],
        price: c.priceCents / 100,
        priceCurrency: 'CHF',
        availability: 'https://schema.org/LimitedAvailability',
        url: pageUrl + '#inscription',
      })),
      {
        '@type': 'Offer',
        name: lang === 'fr' ? 'Combo : double hommes ou dames + double mixte' : 'Combo: men’s or women’s doubles + mixed doubles',
        price: (tournament.combos[0].priceCents ?? 0) / 100,
        priceCurrency: 'CHF',
        availability: 'https://schema.org/LimitedAvailability',
        url: pageUrl + '#inscription',
      },
    ],
  };
}
