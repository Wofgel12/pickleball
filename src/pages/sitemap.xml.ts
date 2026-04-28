import type { APIRoute } from 'astro';
import { routes, type RouteKey } from '../i18n/ui';

const SITE = 'https://pickleballgeneva.netlify.app';

// Per-page priority: home highest, conversion pages high, content pages medium.
const priority: Record<RouteKey, number> = {
  home: 1.0,
  participate: 0.95,
  faq: 0.85,
  learn: 0.85,
  gear: 0.75,
  contact: 0.7,
  legal: 0.2,
  privacy: 0.2,
};

const changefreq: Record<RouteKey, string> = {
  home: 'weekly',
  participate: 'weekly',
  faq: 'monthly',
  learn: 'monthly',
  gear: 'monthly',
  contact: 'yearly',
  legal: 'yearly',
  privacy: 'yearly',
};

export const GET: APIRoute = ({ site }) => {
  const baseUrl = (site?.toString() ?? SITE).replace(/\/$/, '');
  const lastmod = new Date().toISOString().slice(0, 10);

  const keys = Object.keys(routes) as RouteKey[];
  const urls: string[] = [];

  for (const key of keys) {
    for (const lang of ['fr', 'en'] as const) {
      const loc = baseUrl + routes[key][lang];
      const altFr = baseUrl + routes[key].fr;
      const altEn = baseUrl + routes[key].en;
      urls.push(
        `  <url>\n` +
        `    <loc>${loc}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>${changefreq[key]}</changefreq>\n` +
        `    <priority>${priority[key].toFixed(2)}</priority>\n` +
        `    <xhtml:link rel="alternate" hreflang="fr-CH" href="${altFr}" />\n` +
        `    <xhtml:link rel="alternate" hreflang="fr"    href="${altFr}" />\n` +
        `    <xhtml:link rel="alternate" hreflang="en-GB" href="${altEn}" />\n` +
        `    <xhtml:link rel="alternate" hreflang="en"    href="${altEn}" />\n` +
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
