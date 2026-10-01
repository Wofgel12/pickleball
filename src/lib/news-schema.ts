import { visibleNews } from '../i18n/news';
import { routes, type Lang } from '../i18n/ui';
import { plainText } from './rich-text';

/** NewsArticle JSON-LD for every visible news item on the News page. */
export function newsSchema(site: string, lang: Lang) {
  const pageUrl = site + routes.news[lang];
  return visibleNews().map((item) => ({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${pageUrl}#${item.id}`,
    url: `${pageUrl}#${item.id}`,
    headline: item.title[lang],
    articleBody: item.body[lang].map(plainText).join('\n\n'),
    datePublished: item.date,
    inLanguage: lang === 'fr' ? 'fr-CH' : 'en',
    image: site + '/og-pickleball-geneve.jpg',
    author: { '@id': site + '/#sportsclub' },
    publisher: { '@id': site + '/#sportsclub' },
    isPartOf: { '@id': pageUrl + '#webpage' },
  }));
}
