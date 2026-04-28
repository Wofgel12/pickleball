import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

const SITE = 'https://pickleballgeneva.netlify.app';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  output: 'static',
  adapter: netlify(),
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    // No @astrojs/sitemap: we generate a custom sitemap.xml that knows the
    // FR <-> EN URL mapping (apprendre <-> learn, equipement <-> gear, etc.)
    // and emits proper reciprocal hreflang for every URL. See src/pages/sitemap.xml.ts.
  ],
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
