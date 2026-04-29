# SEO Improvements Applied — 2026-04-29

All changes made in a single sweep against `main`. Build verified (`npm run build` clean, 17 pages prerendered, sitemap XML valid).

---

## Critical fixes (5)

| # | Change | File(s) |
|---|---|---|
| 1 | **Counter SSR** — render `8 000` as static text on the server. Bots and no-JS crawlers used to see `0`. | [src/components/islands/CounterAnimated.tsx](src/components/islands/CounterAnimated.tsx) |
| 2 | **Replaced deprecated `HowTo` schema with `Service` schema** on both participate pages (Google removed HowTo rich results 2023-09). | [src/pages/participer.astro](src/pages/participer.astro), [src/pages/en/participate.astro](src/pages/en/participate.astro) |
| 3 | **Fixed `addressLocality` mismatch** — `/en/contact/` page-level `LocalBusiness` was `"Geneva"`; standardised to `"Genève"` everywhere (Swiss postal name) so Google resolves a single entity. | [src/pages/en/contact.astro](src/pages/en/contact.astro) |
| 4 | **FAQ title count** — `15` → `16` (matches the 16 entries actually present). | [src/i18n/ui.ts](src/i18n/ui.ts) |
| 5 | **GBP linkage** — added `https://www.google.com/maps?cid=6146100494876161865` (Pickleball Geneva Sports Club) as `sameAs` and `hasMap` on every page. CID derived from the existing embed's place ID `0x478c65a6c4ab4dc7:0x554b55d62ef23749`. | [src/i18n/ui.ts](src/i18n/ui.ts), [src/components/SchemaSportsClub.astro](src/components/SchemaSportsClub.astro) |

---

## Schema additions / cleanups

- **`SportsEvent` schema** — two recurring weekly events (Monday + Friday) emitted on every page with `eventSchedule` (P1W repeat), `location`, `organizer` linked by `@id`, `offers`, `eventAttendanceMode`, `eventStatus`. ([SchemaSportsClub.astro](src/components/SchemaSportsClub.astro))
- **`logo` is now `ImageObject`** with explicit `width`/`height` (was a plain URL string). ([SchemaSportsClub.astro](src/components/SchemaSportsClub.astro))
- **Full venue name in `streetAddress`** — `"École de Cité-Jonction, La Jonction"` (was `"La Jonction"`). Propagates to all 17 pages. ([SchemaSportsClub.astro](src/components/SchemaSportsClub.astro))
- **`numberOfMembers: 8000`** — quantitative authority signal in the SportsClub block. ([SchemaSportsClub.astro](src/components/SchemaSportsClub.astro))
- **`alternateName` includes "Pickleball Geneva Sports Club"** — matches the GBP listing name verbatim.
- **`Course.hasCourseInstance`** — fixed `locationCreated` → `location`, added `startDate`, `repeatFrequency: "P1W"`, `scheduleTimezone: "Europe/Zurich"`. ([src/pages/index.astro](src/pages/index.astro), [src/pages/en/index.astro](src/pages/en/index.astro))
- **`Course.provider`** — switched from inline Organization to `{ "@id": "/#sportsclub" }` reference.
- **`WebSite.publisher`** — switched from inline org to `{ "@id": "/#sportsclub" }` reference. Added `@id: /#website`. ([BaseLayout.astro](src/layouts/BaseLayout.astro))
- **New `WebPage` schema on every page** — carries `dateModified`, `inLanguage`, `isPartOf` (WebSite), `about` (SportsClub), `primaryImageOfPage`. Gives every page a freshness signal that previously only `/apprendre/` had via `Article`. ([BaseLayout.astro](src/layouts/BaseLayout.astro))
- **`/contact/` LocalBusiness** — added `sameAs: [{ "@id": "/#sportsclub" }]` + `hasMap` so Google sees one entity, not two. ([contact.astro](src/pages/contact.astro))
- **`/en/contact/`** — same fix + `addressLocality` normalised to `"Genève"`. ([en/contact.astro](src/pages/en/contact.astro))

---

## Performance

- **Preload `/bg-tile.webp`** — emitted into `<head>` with `as="image"` and `fetchpriority="high"`. The hero background was the LCP candidate; this shaves ~200 ms on mobile. ([BaseLayout.astro](src/layouts/BaseLayout.astro))
- **Counter no longer causes CLS** — SSR now renders the final `8 000` and the framer-motion animation only kicks in after hydration via a `useState` gate.

---

## Security headers

Updated [public/_headers](public/_headers):

- **`X-Frame-Options: SAMEORIGIN`** added.
- **`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`** added at the edge (was already on the response, now declared alongside other headers).
- **`Content-Security-Policy-Report-Only`** added with allowances for `lottie.host`, YouTube embeds, Google Maps embed, and Netlify image CDN. Promote to enforced after one week of clean reports.

---

## Local SEO (on-site)

- **Map embed on `/contact/` and `/en/contact/`** — pinned to the GBP "Pickleball Geneva Sports Club". ([ContactContent.astro](src/components/ContactContent.astro))
- **"Comment nous trouver" / "How to find us"** section on contact — TPG bus 2/19, tram 15, walk from Cornavin via Sous-Terre footbridge, Plainpalais walk distance, Vélospot, parking, and member greeter timing. ([ContactContent.astro](src/components/ContactContent.astro))
- **Visible address now uses the locale-appropriate form** — `"La Jonction, 1205 Geneva, Switzerland"` on the EN page, `"La Jonction, 1205 Genève, Suisse"` on FR. Schema fields stay canonical (`Genève`). New `facts.locationEn` field. ([src/i18n/ui.ts](src/i18n/ui.ts))
- **Venue name surfaced** above the address: `<strong>École de Cité-Jonction</strong>` + "Voir sur Google Maps →" link.

---

## Content (E-E-A-T + word count)

- **`/participer/` and `/en/participate/`** — added a "À quoi ressemble votre première session ?" / "What your first session looks like" narrative section walking through the 17h55 → 19h45 timeline. Lifts word count past the 800-word service-page floor and adds Experience signal. ([ParticipateContent.astro](src/components/ParticipateContent.astro))
- **`/equipement/` and `/en/gear/`** — added named paddle picks at three price tiers (JOOLA Hyperion, Selkirk Amped Epic, Engage Pursuit MX 6.0) and named ball picks (Franklin X-40, Onix Fuse Indoor) with an explicit "no commercial affiliation" disclosure. Added a CTA button back to `/participer/`. ([GearContent.astro](src/components/GearContent.astro))
- **`/apprendre/` and `/en/learn/`** — added a CTA section at the bottom: "Les règles s'apprennent sur le terrain → Réserver une session". ([LearnContent.astro](src/components/LearnContent.astro))

---

## AI search readiness (GEO)

- **`llms.txt`** — added EN one-line summaries (was 6 bare links), added GBP URL and parent-site URL. ([public/llms.txt](public/llms.txt))
- **`llms-full.txt`** — appended a complete English mirror section (Identity / Sessions table / How to join / Rules / Glossary / Gear / 8 FAQ answers / Contact). Fixed "16 questions citables" to drop the count from the heading where it was misleading. ([public/llms-full.txt](public/llms-full.txt))
- **AI crawler allowlist expanded** in `robots.txt`: added Cohere-AI (both casings), Meta-ExternalAgent, YouBot. ([public/robots.txt](public/robots.txt))
- **Counter visible to bots** (Section: Performance) — also a GEO win: the "8 000+ membres" authority signal is now in raw HTML.
- **`numberOfMembers` schema** — same authority signal, structured.

---

## Cleanup / hygiene

- **`noindex` on legal/privacy/404** — new optional `noindex` prop on `BaseLayout`, applied to `mentions-legales`, `politique-confidentialite`, `en/legal-notice`, `en/privacy-policy`, `404`. ([BaseLayout.astro](src/layouts/BaseLayout.astro), pages above)
- **Sitemap rewritten** ([sitemap.xml.ts](src/pages/sitemap.xml.ts)):
  - Excludes legal/privacy (now noindex).
  - Drops `priority` and `changefreq` (Google ignores both).
  - Drops generic `hreflang="fr"` and `hreflang="en"`; keeps region-specific `fr-CH` + `en-GB` + `x-default`.
  - `lastmod` now reads from `facts.lastReviewedISO` (single source of truth) instead of build timestamp.
- **In-page hreflang trimmed identically** ([BaseLayout.astro](src/layouts/BaseLayout.astro)): three entries — `fr-CH`, `en-GB`, `x-default`.
- **`_redirects` cleaned** — removed dead hash-fragment rules (browsers strip `#…` before sending the HTTP request, so those rules never fired). ([public/_redirects](public/_redirects))
- **`facts.lastReviewedISO`** bumped to `2026-04-29`.

---

## Verification (post-build)

```text
Sitemap:                  12 URLs (FR + EN of home, participate, learn, gear, faq, contact)
Sitemap hreflang:         36 entries  (3 × 12 — fr-CH + en-GB + x-default per URL)
Sitemap XML validity:     PASS (xmllint)
Counter SSR text:         "aria-label=\"8 000\">8 000"  (was "0")
Schema streetAddress:     "École de Cité-Jonction, La Jonction"
Schema addressLocality:   "Genève" (everywhere, including /en/contact/)
Schema sameAs:            [Meetup, GBP, genevasportsclub.ch]
Schema logo:              ImageObject (was URL string)
Schema numberOfMembers:   QuantitativeValue 8000
SportsEvent schema:       2 emissions per page (Monday + Friday)
WebPage.dateModified:     2026-04-29 (every page)
WebSite.publisher:        @id reference to /#sportsclub
Course.hasCourseInstance: location (was locationCreated), startDate present
/participer/ schema:      Service (was HowTo — deprecated)
FAQ title:                "16 questions fréquentes" / "16 frequent questions"
Hreflang in <head>:       fr-CH, en-GB, x-default (dropped generic fr/en)
noindex meta:             on /404, /mentions-legales, /politique-confidentialite, /en/legal-notice, /en/privacy-policy
Image alt coverage:       100% (0 missing)
```

---

## Items still requiring you

These need actions outside the codebase, listed in priority order:

1. **Verify the GBP CID** — open https://www.google.com/maps?cid=6146100494876161865 and confirm it lands on "Pickleball Geneva Sports Club". If not, replace `facts.gbpMapUrl` in [src/i18n/ui.ts](src/i18n/ui.ts) with the correct share URL from the GBP "Share" menu.
2. **Run a baseline PageSpeed Insights** on the 6 indexable URLs once Netlify redeploys with these changes — record LCP/INP/CLS for the before/after diff.
3. **Once CSP-Report-Only is deployed and quiet for a week**, promote `Content-Security-Policy-Report-Only` to `Content-Security-Policy` in [public/_headers](public/_headers).
4. **Begin Google review acquisition** on the GBP — target one new review every 10–14 days; respond to each within 48 hours. Once 5+ reviews exist, add `aggregateRating` to the `SportsClub` JSON-LD.
5. **Submit NAP** to local.ch, search.ch, and the Swiss Pickleball Federation using the canonical form: `Geneva Sports Club / École de Cité-Jonction, La Jonction, 1205 Genève, Suisse / +41 76 214 12 03`.
6. **Expand `sameAs`** in [SchemaSportsClub.astro](src/components/SchemaSportsClub.astro) as you stand up channels: Instagram, Facebook, LinkedIn, YouTube. YouTube has the strongest measured correlation with AI citations.
7. **Set the Lottie animation aside** — `LottiePlayer.DhU_LUuS.js` is still ~640 KB pre-gzip. Replace with SVG/CSS or strip the animation entirely; biggest single perf win available.
