// Media coverage of the club. Shared by the home page's "Ils parlent de nous"
// section, the News page and their structured data.

export const lemanBleuReport = {
  /** Léman Bleu page of the full programme. */
  pageUrl: 'https://www.lemanbleu.ch/fr/Emissions/545612-Sport-Passion.html',
  /** Our segment of the programme (3:20 → 6:17), cut and re-encoded in 720p
   *  (~28 MB). Léman Bleu's own video host answers range requests unreliably,
   *  which stalled playback when starting mid-file, so the clip is served
   *  from this site. */
  videoUrl: '/press/lemanbleu-sport-passion.mp4',
  poster: '/press/lemanbleu-sport-passion.jpg',
  durationISO: 'PT2M57S',
  minutes: 3,
  /** Broadcast date of the programme. */
  dateISO: '2026-09-06',
  label: {
    fr: 'Reportage de Léman Bleu sur le pickleball au Geneva Sports Club',
    en: 'Léman Bleu report on pickleball at the Geneva Sports Club',
  },
  credit: {
    fr: '© Léman Bleu — Sport Passion, « Genève, terrain de sport sans frontière »',
    en: '© Léman Bleu — Sport Passion, “Genève, terrain de sport sans frontière”',
  },
} as const;
