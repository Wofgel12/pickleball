import { visibleNews, newsUrl, type NewsItem } from '../i18n/news';
import { routes, type Lang } from '../i18n/ui';
import { plainText } from './rich-text';
import { lemanBleuReport } from './press';

/** NewsArticle JSON-LD for one news item (its own page or its News-page anchor). */
export function newsArticleSchema(site: string, lang: Lang, item: NewsItem) {
  const url = site + newsUrl(item, lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': url,
    url,
    headline: item.title[lang],
    ...(item.page && { description: item.page.description[lang] }),
    articleBody: item.body[lang].map(plainText).join('\n\n'),
    datePublished: item.date,
    inLanguage: lang === 'fr' ? 'fr-CH' : 'en',
    image: site + (typeof item.image === 'object' ? item.image[lang] : item.image ?? '/og-pickleball-geneve.jpg'),
    author: { '@id': site + '/#sportsclub' },
    publisher: { '@id': site + '/#sportsclub' },
    ...(item.page
      ? { mainEntityOfPage: { '@id': url + '#webpage' } }
      : { isPartOf: { '@id': site + routes.news[lang] + '#webpage' } }),
    ...(item.video === 'lemanBleu' && {
      video: {
        '@type': 'VideoObject',
        name: item.title[lang],
        description: lemanBleuReport.label[lang],
        thumbnailUrl: site + lemanBleuReport.poster,
        contentUrl: site + lemanBleuReport.videoUrl,
        uploadDate: lemanBleuReport.dateISO,
        duration: lemanBleuReport.durationISO,
        inLanguage: 'fr-CH',
        copyrightHolder: { '@type': 'Organization', name: 'Léman Bleu', url: 'https://www.lemanbleu.ch/' },
      },
    }),
  };
}

/** NewsArticle JSON-LD for every visible news item listed on the News page. */
export function newsSchema(site: string, lang: Lang) {
  return visibleNews().map((item) => newsArticleSchema(site, lang, item));
}
