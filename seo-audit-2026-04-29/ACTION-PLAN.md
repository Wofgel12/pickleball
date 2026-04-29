# SEO Action Plan — Pickleball Geneva

**Audit date:** 2026-04-29 · **Health score:** 78/100 (B) · **Local score:** 42/100
**Site:** https://pickleballgeneva.netlify.app

Effort key: **XS** ≤ 30 min · **S** 30 min – 2 h · **M** 2 – 8 h · **L** ≥ 1 day

---

## CRITICAL (do this week)

| # | Action | Effort | Where | Source |
|---|---|---|---|---|
| 1 | **Create and verify a Google Business Profile.** Primary category: "Sports Club". Use exact NAP: `Geneva Sports Club / La Jonction (École de Cité-Jonction), 1205 Genève, Suisse / +41 76 214 12 03`. Pre-populate Q&A, upload ≥ 5 venue photos, set hours Mon + Fri 18:00–20:00. | M (off-site, 2–4 h + verification wait) | business.google.com | Local C1 |
| 2 | **Replace `HowTo` schema with `Service` on `/participer/` and `/en/participate/`.** Google removed HowTo rich results 2023-09; current blocks deliver zero SERP value. | S | `src/components/` (likely `ParticipateContent.astro` or schema component) | Schema S-01 |
| 3 | **Fix the `addressLocality` mismatch.** `/en/contact/` page-level `LocalBusiness` uses `"Geneva"`; every other block uses `"Genève"`. Standardise to `"Genève"`. | XS | `src/components/SchemaSportsClub.astro` (or page-level schema in `/en/contact`) | Schema S-02, Local NAP |
| 4 | **Render the member counter's initial value as static `8 000`.** Currently `<span aria-label="8 000">0</span>` — bots see "0" not "8 000". | XS | `src/components/islands/CounterAnimated.{tsx,jsx}` | GEO, Performance |
| 5 | **Fix FAQ count: title says "15", actual count is 16.** Update title and any references on `/faq/`, `/en/faq/`, `/`, `/en/`. | XS | `src/i18n/ui.ts` and FAQ component | Content C-05 |

---

## HIGH (do this month)

### Schema additions

| # | Action | Effort | Where |
|---|---|---|---|
| 6 | **Add `SportsEvent` schema for the recurring Mon + Fri sessions.** Use `eventSchedule` with `repeatFrequency: "P1W"`, `byDay`, `startTime`, `endTime`; `location` set to `Place` with full venue name; `offers` with price 10 CHF; `organizer` linked by `@id` to `/#sportsclub`. Emit on `/`, `/en/`, `/participer/`, `/en/participate/`. | S | `src/components/SchemaSportsClub.astro` (or new `SchemaSessions.astro`) |
| 7 | **Add full venue name to `streetAddress`.** Change `"La Jonction"` → `"École de Cité-Jonction, La Jonction"`. Propagates to all 17 pages. | XS | `src/components/SchemaSportsClub.astro` |
| 8 | **Convert `logo` to `ImageObject`** with `url`, `width`, `height`. Improves Knowledge Panel extraction. | XS | `src/components/SchemaSportsClub.astro` |
| 9 | **Fix `Course.hasCourseInstance`:** use `location` (not `locationCreated`) and add `startDate`. | XS | course schema component |
| 10 | **Link `WebSite.publisher` to `/#sportsclub` by `@id`** instead of by name string. | XS | `src/components/SchemaSportsClub.astro` |

### Performance

| # | Action | Effort | Where |
|---|---|---|---|
| 11 | **Set the LCP hero image to `loading="eager" fetchpriority="high"`** and add `<link rel="preload" as="image" href="...">` to `<head>`. | XS | `src/components/Hero.astro` and `src/layouts/` |
| 12 | **Replace the Lottie animation with SVG/CSS animation** OR ensure container has explicit `width`/`height` to avoid CLS. Saves ~640 KB JS parse + execute. | M | `src/components/islands/LottiePlayer.{tsx,jsx}` |
| 13 | **Run PageSpeed Insights** on `/`, `/en/`, `/participer/`, `/apprendre/`, `/faq/`, `/contact/`. Capture LCP/INP/CLS baseline before/after fixes 11–12. | XS | psi.web.dev |

### Security headers

| # | Action | Effort | Where |
|---|---|---|---|
| 14 | **Add `Content-Security-Policy-Report-Only`** first to identify breakage from external resources (lottie.host, Netlify Image CDN); promote to enforced CSP after a week of report monitoring. | M | `public/_headers` |
| 15 | **Add `X-Frame-Options: SAMEORIGIN`** (or `frame-ancestors 'self'` in CSP). | XS | `public/_headers` |

### Content

| # | Action | Effort | Where |
|---|---|---|---|
| 16 | **Expand `/participer/` to ≥ 900 words.** Add a "first session" narrative section (what to wear, what happens in the first 10 minutes, who greets you, where to put your stuff). FR + EN. | M | `src/components/ParticipateContent.astro` |
| 17 | **Expand `/equipement/` with named product recommendations.** Pick 2–3 specific paddles at different price points (e.g. Selkirk Amped, JOOLA Ben Johns Hyperion, Engage Pursuit) and 1 ball recommendation each indoor/outdoor. | M | `src/components/GearContent.astro` |
| 18 | **Add in-body CTAs to `/apprendre/` and `/equipement/`.** Both are dead ends. End each with "Prêt à essayer ? → Réserver une session" linking to `/participer/`. | XS | content components |
| 19 | **Add a named author/organiser line.** Replace anonymous Organisation `author` in schema and add a visible byline ("Sessions encadrées par [Nom]") on `/participer/` and `/apprendre/`. | S | `src/i18n/ui.ts` + content components |

### Local SEO

| # | Action | Effort | Where |
|---|---|---|---|
| 20 | **Add Google Maps embed to `/contact/` and `/en/contact/`.** Use the GBP-share iframe once GBP is live (action #1). | XS | `src/components/ContactContent.astro` |
| 21 | **Add transit / access section to `/contact/`.** TPG lines 15, 2, 19; walking distance from Cornavin; full venue name (École de Cité-Jonction); door/entry instructions. FR + EN. | S | `src/components/ContactContent.astro` |

### AI / GEO

| # | Action | Effort | Where |
|---|---|---|---|
| 22 | **Add one-line summaries to the EN section in `llms.txt`.** Mirror the FR section format. | XS | `public/llms.txt` |
| 23 | **Add an EN section to `llms-full.txt`.** Minimum: session facts + top 5 FAQ answers in English. | S | `public/llms-full.txt` |
| 24 | **Add `dateModified` (and `WebPage` schema where missing) to `/`, `/en/`, `/participer/`, `/en/participate/`, `/faq/`, `/en/faq/`, `/contact/`, `/en/contact/`.** Currently only `/apprendre/`-class pages have a freshness signal. | S | layout / schema |
| 25 | **Expand `sameAs`** in the `SportsClub` JSON-LD with: GBP URL (after #1), Instagram, Facebook, LinkedIn, YouTube. YouTube has the strongest measured correlation (~0.737) with AI citations. | XS each, ongoing | `src/components/SchemaSportsClub.astro` |

---

## MEDIUM (do this quarter)

| # | Action | Effort | Where | Source |
|---|---|---|---|---|
| 26 | Add `<meta name="robots" content="noindex,nofollow">` to `404.html`. | XS | `src/pages/404.astro` | Tech |
| 27 | Add `noindex` to legal/privacy pages and remove from sitemap. | XS | `src/pages/mentions-legales.astro`, `politique-confidentialite.astro`, EN equivalents, `src/pages/sitemap.xml.ts` | Tech |
| 28 | Remove dead hash-fragment rules from `_redirects`. | XS | `public/_redirects` | Tech |
| 29 | Decide on `fr-CH`+`fr` vs `fr-CH`-only hreflang. If audience is Geneva/Switzerland-only, drop the generic codes. | XS | `src/pages/sitemap.xml.ts` + layout `<head>` | Tech |
| 30 | Configure IndexNow (key file in `public/`, post-deploy POST script). | S | new `scripts/indexnow.mjs` + `public/<key>.txt` | Tech |
| 31 | Submit NAP to local.ch, search.ch, Swiss Pickleball Federation, geneve.ch, sportgeneve.ch. Use exact canonical NAP form. | M (mostly off-site) | external | Local |
| 32 | Begin Google review acquisition — target ≥ 1 review every 10–14 days. Respond within 48 h. Add `aggregateRating` to schema once 5+ reviews exist. | ongoing | external + `SchemaSportsClub.astro` | Local |
| 33 | Add 2–3 visible member testimonials with first name + initials on `/` or `/participer/`. | S | content component | Content / Local |
| 34 | Translate visible address on `/en/contact/` and `/en/privacy-policy/` to "1205 Geneva, Switzerland". | XS | EN content components | Local |
| 35 | Add per-page `lastmod` derived from content dates (e.g. extend `lastReviewedISO` in `facts`) instead of build timestamp. | S | `src/i18n/ui.ts` + `sitemap.xml.ts` | Sitemap |
| 36 | Convert H2 headings on `/`, `/equipement/`, `/contact/` to question form ("Où jouer au pickleball à Genève ?", "Quelle raquette choisir ?"). Lifts AI citability. | S | content components | GEO |
| 37 | Verify geo coordinates against actual École de Cité-Jonction Google Maps pin; update if drift > 50 m. | XS | `src/components/SchemaSportsClub.astro` | Local |

---

## LOW (backlog)

| # | Action | Effort | Source |
|---|---|---|---|
| 38 | Drop `priority` and `changefreq` from sitemap (Google ignores). | XS | Sitemap |
| 39 | Add Cohere-AI explicit allow to robots.txt. | XS | GEO |
| 40 | Add a "Calendrier" / "Schedule" page listing the next 4–6 sessions (or embed Meetup widget). Reduces FAQ load. | S | Local |
| 41 | Surface Meetup member count on `/participer/` ("X membres sur Meetup"). | XS | Content |
| 42 | Once GBP photos exist, add a small venue photo gallery on `/contact/` and `/participer/`. | S | Local / Images |

---

## Suggested rollout

**Week 1 — Critical**
Items 1 (kick off in parallel — verification wait), 2, 3, 4, 5.

**Week 2 — High (schema + perf)**
Items 6, 7, 8, 9, 10, 11, 13 (PSI baseline). Single PR touching `SchemaSportsClub.astro` resolves 6, 7, 8, 10 + the schema parts of items 2, 3.

**Week 3 — High (content + headers)**
Items 14, 15, 16, 17, 18, 19, 22, 23, 24.

**Week 4 — High (local + GBP follow-up)**
Items 20, 21, 25 (after GBP live), 12 (Lottie if not yet done).

**Beyond — Medium / Low**
Sweep through 26–42 over the following 4–8 weeks.

---

## Re-audit checkpoints

- **+2 weeks** — re-run technical + GEO sub-audits to confirm CSP/header fixes and counter-static-text changes.
- **+4 weeks** — re-run schema validator after the `SchemaSportsClub.astro` overhaul.
- **+6 weeks** — full re-audit. Targets: Health ≥ 88, Local ≥ 70, GEO ≥ 85.
- **+12 weeks** — review Google rankings for "pickleball Genève", "pickleball Geneva", "où jouer pickleball Genève" using DataForSEO if available.
