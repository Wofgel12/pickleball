import type { APIRoute } from 'astro';
import { routes, type RouteKey } from '../i18n/ui';
import { facts } from '../i18n/ui';

const SITE = 'https://gscpickleball.ch';

// Indexable pages only — legal/privacy carry noindex via BaseLayout and are
// excluded here so they do not consume crawl budget.
const indexableKeys: RouteKey[] = ['home', 'participate', 'learn', 'gear', 'faq', 'contact'];

export const GET: APIRoute = ({ site }) => {
  const baseUrl = (site?.toString() ?? SITE).replace(/\/$/, '');
  const lastmod = facts.lastReviewedISO;

  const urls: string[] = [];

  for (const key of indexableKeys) {
    for (const lang of ['fr', 'en'] as const) {
      const loc = baseUrl + routes[key][lang];
      const altFr = baseUrl + routes[key].fr;
      const altEn = baseUrl + routes[key].en;
      urls.push(
        `  <url>\n` +
        `    <loc>${loc}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <xhtml:link rel="alternate" hreflang="fr-CH" href="${altFr}" />\n` +
        `    <xhtml:link rel="alternate" hreflang="en-GB" href="${altEn}" />\n` +
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${altFr}" />\n` +
        `  </url>`
      );
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset\n` +
    `  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `  xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    urls.join('\n') +
    `\n</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
