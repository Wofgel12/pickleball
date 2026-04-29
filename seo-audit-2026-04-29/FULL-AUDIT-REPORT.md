# Full SEO Audit — Pickleball Geneva (Geneva Sports Club)

**Site:** https://pickleballgeneva.netlify.app
**Audit date:** 2026-04-29
**Stack:** Astro 5 (static) on Netlify · FR (default) + EN (`/en/`) · 17 pages
**Business type:** Local Service / SportsClub — non-profit association running pickleball sessions at La Jonction (École de Cité-Jonction), 1205 Genève, Switzerland

---

## 1. Executive Summary

### Overall SEO Health Score: **78 / 100** (B)

Computed using the standard weighting in `seo-audit/SKILL.md`:

| Category | Weight | Score | Weighted |
|---|---:|---:|---:|
| Technical SEO | 22% | 77 | 16.9 |
| Content Quality (E-E-A-T, AI citability) | 23% | 78 | 17.9 |
| On-Page SEO (titles, meta, headings, internal links) | 20% | 80 | 16.0 |
| Schema / Structured Data | 10% | 80 | 8.0 |
| Performance (Core Web Vitals — lab estimate only) | 10% | 70 | 7.0 |
| AI Search Readiness (GEO) | 10% | 74 | 7.4 |
| Images | 5% | 95 | 4.8 |
| **Total** |  |  | **78.0** |

**Supplementary local SEO score: 42 / 100** — heavily suppressed by absence of a verified Google Business Profile and zero Google review corpus. The on-site local foundation (NAP, schema, hreflang) is solid; the gap is off-site.

### Top 5 Critical / High issues

1. **No Google Business Profile.** The single highest-impact action on the entire audit. Without a GBP, the site cannot enter the Geneva local pack — that's where the majority of "pickleball Genève" traffic converts. *(Local — Critical)*
2. **No `Event` / `SportsEvent` schema for recurring sessions.** Mon + Fri 18:00–20:00 sessions are the primary CTA but are not modelled in structured data. Adding `EventSchedule`-based `SportsEvent` blocks unlocks Google event surfacing in local search and the knowledge panel. *(Schema — High)*
3. **`HowTo` schema on `/participer/` and `/en/participate/` is dead code.** Google removed HowTo rich results in September 2023; these blocks deliver zero SERP value and should be replaced with `Service` schema. *(Schema — Critical)*
4. **Hero images marked `loading="lazy"` with no `fetchpriority="high"` and no preload.** Largest Contentful Paint is at risk on mobile (~200–400 ms regression). *(Performance — High)*
5. **Missing CSP and X-Frame-Options headers.** HSTS, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy are present, but the site loads external resources (lottie.host, Netlify Image CDN) without script/frame protection. *(Technical — High)*

### Top 5 Quick wins (≤ 1 hour each)

1. **Fix the FAQ count: title tags say "15 questions" but 16 exist** — `/faq/` and `/en/faq/`. Five-minute change, removes a visible inconsistency that AI engines will quote against you.
2. **Standardise `addressLocality` to "Genève" everywhere** — `/en/contact/` page-level `LocalBusiness` block currently uses `"Geneva"`, creating a Google entity-resolution conflict against every other block on the site. Use the official Swiss Postal name.
3. **Add one-line summaries to the EN section in `llms.txt`** — currently 6 bare links with no descriptions; FR section is exemplary. Direct citability loss for ChatGPT and Perplexity on English queries.
4. **Render the member-counter initial value as static `8 000`** — currently `<span aria-label="8 000">0</span>`, so AI crawlers reading raw HTML see "0" not "8,000 members" — kills your most quotable authority signal.
5. **Add an explicit `<meta name="robots" content="noindex, nofollow">` to `404.html`** — defence in depth (status code already returns 404, but the canonical-to-home pattern is cosmetically inconsistent).

---

## 2. Technical SEO — 77 / 100

Detailed report: [01-technical.md](01-technical.md)

### What works
- Astro static output: zero JS-rendering dependency for crawlers.
- Robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User, Google-Extended, Applebot-Extended, Bytespider, Amazonbot, CCBot.
- All 17 pages have self-referencing canonicals, correct `<html lang>`, unique title + description.
- Hreflang reciprocity valid across all 14 FR↔EN pairs in both `<head>` and the sitemap `xhtml:link` blocks.
- Trailing-slash behaviour consistent: bare paths 301 to slashed canonical, no chains.
- HSTS with `includeSubDomains; preload`, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all present.
- Island hydration strategy correct (`client:visible` for below-fold, `client:load` only for nav language switcher).

### Critical / High issues
| ID | Severity | Issue |
|---|---|---|
| T-01 | **High** | Missing `Content-Security-Policy` and `X-Frame-Options` headers. |
| T-02 | **High** | Hero images marked `loading="lazy"` with no `fetchpriority="high"` and no `<link rel="preload">` — LCP risk on mobile. |
| T-03 | **High** | `LottiePlayer.DhU_LUuS.js` is ~640 KB pre-gzip — large JS asset on home; consider replacing the animation with SVG/CSS. |
| T-04 | **High** | No IndexNow configured — Bing/Yandex indexing latency is fully dependent on recrawl schedules. |

### Medium issues
- 404 page lacks explicit `meta robots="noindex,nofollow"`.
- Legal pages indexed and in sitemap (priority 0.20) — small crawl-budget waste.
- Hash-fragment rules in `_redirects` are dead code (browsers strip the fragment before sending the request).
- Dual `fr-CH`+`fr` and `en-GB`+`en` hreflang tags — fine, but if audience is Geneva/Switzerland only, drop the generic codes.

---

## 3. Content Quality — 78 / 100

Detailed report: [02-content.md](02-content.md)

### E-E-A-T composite: 68 / 100

| Pillar | Score | Why |
|---|---:|---|
| Experience | 6/10 | No member testimonials, no on-the-ground photos of the venue/players, no organiser-told anecdotes. |
| Expertise | 8/10 | `/apprendre/` rules guide is technically accurate; lexicon (cuisine, dink, drive) correct. |
| Authoritativeness | 5/10 | No named author/organiser anywhere; no association registration number; only one `sameAs` reference (Meetup). |
| Trust | 9/10 | Full NAP, dedicated contact + legal + privacy pages, HTTPS, valid schema. |

### Critical / High findings
| ID | Severity | Page(s) | Issue |
|---|---|---|---|
| C-01 | **High** | `/participer/`, `/en/participate/` | Thin for a primary conversion page (~560 body words, 240 short of the 800-word service-page floor). |
| C-02 | **High** | `/equipement/`, `/en/gear/` | Underdeveloped buying guide (~480 words); recommendations are generic, no named products. |
| C-03 | **High** | All pages | No named author. All schema `author` fields point to the Organisation; one credited session organiser would lift Experience. |
| C-04 | **High** | `/apprendre/`, `/equipement/` | Dead-end pages: no in-body CTAs, no contextual links to `/participer/`. |
| C-05 | **Medium** | `/faq/`, `/en/faq/` | Title says "15 questions" but 16 are present. |

### What works
- **Image alt coverage: 100 %** across all 17 pages.
- llms.txt FR section is exemplary — machine-readable bullets with absolute canonical URLs.
- Heading hierarchy is clean across every page (single H1, logical H2/H3).
- Title tags average 55 characters, meta descriptions 145 characters — within best-practice ranges and unique per page.
- AI Citation Readiness composite: **82 / 100** — genuine strength; both `llms.txt` and `llms-full.txt` are factually dense.

---

## 4. Schema / Structured Data — 80 / 100

Detailed report: [03-schema.md](03-schema.md)

**17 HTML files scanned. Zero JSON parse errors.** All blocks use `https://schema.org` and absolute URLs.

### What's in place
- `["SportsClub", "LocalBusiness"]` on every page with full NAP, geo, openingHoursSpecification, priceRange, areaServed, sport, knowsLanguage. `@id: /#sportsclub` is stable across all pages.
- `BreadcrumbList` on every page (correct positions, EN root at `/en/`).
- `WebSite` on every page.
- `FAQPage` on `/faq/`, `/en/faq/`, `/`, `/en/` — 15 entries each, all valid.
- `Article` on all 4 content pages (learn + gear, FR + EN).

### Critical / High gaps
| ID | Severity | Issue |
|---|---|---|
| S-01 | **Critical** | `HowTo` on `/participer/` and `/en/participate/` — Google deprecated HowTo rich results 2023-09. Replace with `Service`. |
| S-02 | **Critical** | NAP mismatch: `/en/contact/` page-level `LocalBusiness` uses `"addressLocality":"Geneva"`, every other block uses `"Genève"`. |
| S-03 | **High** | No `Event` / `SportsEvent` schema anywhere — primary CTA (Mon/Fri sessions) has zero event structured data. |

### Medium
- `logo` is a plain URL string instead of `ImageObject` with `url`/`width`/`height` — affects Knowledge Panel extraction.
- Contact page `LocalBusiness` blocks are orphaned — no `sameAs` linking back to `/#sportsclub`.
- `Course.hasCourseInstance` uses `locationCreated` (wrong property) instead of `location`, and has no `startDate`.
- `WebSite.publisher` references the org by name only, not by `@id`.

---

## 5. Sitemap & Hreflang — 95 / 100

Detailed report: [04-sitemap.md](04-sitemap.md)

**15/15 structural checks pass. Zero blocking issues.** Three informational items only:

- `priority` and `changefreq` are present (Google ignores both — could be removed for a cleaner file).
- All 16 indexable URLs share the same build-timestamp `lastmod` of 2026-04-28 — trustworthiness as a crawl-priority signal is low when every page shares the same date. Consider per-page content dates.
- `dist/404.html` has a canonical pointing to `/` — cosmetic only, no sitemap impact.

XML validity: PASS (`xmllint --noout` clean). Coverage: 100 %. Reciprocity: every FR entry points to its EN sibling and vice versa, both in the sitemap and in the in-page `<link rel="alternate">` tags. URL pair correctness verified across all 8 pairs (`/apprendre/ ↔ /en/learn/`, `/equipement/ ↔ /en/gear/`, `/participer/ ↔ /en/participate/`, etc.).

---

## 6. Performance (Core Web Vitals) — 70 / 100 (lab estimate only)

**No field data available** — no GSC/CrUX credentials provided, so this score is based on static analysis of the build output and the Netlify production response. Field data should be measured before/after fixes.

### Concerns
1. **LCP risk** — all three home-page content images set to `loading="lazy"`; no `fetchpriority="high"`, no preload. Mobile penalty estimate: 200–400 ms.
2. **JS payload** — `LottiePlayer.DhU_LUuS.js` is ~640 KB pre-gzip, the largest single asset. Loads with `client:visible` (correct deferral) but the parse + execute cost when triggered is significant. Recommend replacing the Lottie animation with an SVG/CSS animation.
3. **Counter component** — `CounterAnimated.js` renders `<span aria-label="8 000">0</span>` in static HTML. CLS risk if the digit width changes when JS hydrates; also bot-readable text says "0" instead of "8 000".

### Strengths
- Astro static output: minimal critical-path CSS, inline-style budget respected (`inlineStylesheets: 'auto'`).
- Prefetch enabled (`prefetchAll: true`, `defaultStrategy: 'viewport'`) — improves perceived navigation.
- Sharp-based image optimisation pipeline.
- WebP/MP4 dual-format background video.

**Action:** measure actual LCP/INP/CLS on real devices via PageSpeed Insights or a synthetic monitoring tool, then re-score.

---

## 7. AI Search Readiness (GEO) — 74 / 100

Detailed report: [05-geo.md](05-geo.md)

| Sub-dimension | Score |
|---|---:|
| Technical Accessibility | 98 |
| Structural Readability | 82 |
| Citability | 76 |
| Authority & Brand Signals | 58 |
| Multi-Modal Content | 48 |

### What works
- All 5 tested AI bots (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended) return HTTP 200 on every tested page.
- llms.txt FR section is best-in-class — machine-readable fact bullets with absolute canonical URLs.
- Static HTML means every AI crawler gets full content with JSON-LD, no JS gate.

### Critical gaps
1. **Counter rendered as `0`** — the visible "8 000+ membres" authority signal is invisible to non-JS crawlers. Render `8 000` as static text.
2. **EN llms.txt section** — 6 bare links with no one-line summaries (FR section has them). Hurts ChatGPT/Perplexity citability for English queries.
3. **`llms-full.txt` is entirely in French** — English LLMs get no quotable English prose. Add at minimum the session facts and top 5 FAQ answers in English.
4. **Authority signals minimal** — `sameAs` contains only Meetup. Missing: GBP URL, Instagram, Facebook, YouTube, LinkedIn. Per citation-correlation research, YouTube has the strongest measured correlation (~0.737) with AI citations.

### Per-page citability
| Page | Score | Standout |
|---|---:|---|
| `/faq/` | 88 | Best on site. FAQ count title bug. |
| `/apprendre/` | 82 | Article schema + dateModified — only such page. Video section has zero static text. |
| `/participer/` | 80 | Exemplary opening paragraph. H2s not in question form. |
| `/` (FR home) | 78 | Good fact table. Counter invisible to bots. |
| `/equipement/` | 72 | Unnamed product recommendation reduces trust. |
| `/contact/` | 70 | Correct LocalBusiness schema but very thin prose. |
| EN pages (avg) | 68 | Mirrors FR; loses points for absent EN llms-full.txt. |

---

## 8. Local SEO — 41.9 / 100 (supplementary)

Detailed report: [06-local.md](06-local.md)

| Dimension | Weight | Score | Weighted |
|---|---:|---:|---:|
| GBP Signals | 25% | 20 | 5.0 |
| Reviews & Reputation | 20% | 10 | 2.0 |
| Local On-Page SEO | 20% | 68 | 13.6 |
| NAP Consistency & Citations | 15% | 72 | 10.8 |
| Local Schema Markup | 10% | 75 | 7.5 |
| Local Link & Authority Signals | 10% | 30 | 3.0 |
| **Total** |  |  | **41.9** |

### Critical
- **C1 — No verified Google Business Profile.** Without GBP the site cannot enter the local pack (the map results); this is the largest unrealised ranking opportunity on the entire audit. Set primary category to "Sports Club".
- **C2 — Zero review corpus.** No `aggregateRating` in schema, no on-site testimonials, no review widget. Plan for steady acquisition (1 review every 10–14 days) — bursts followed by silence trigger the 18-day-velocity ranking cliff (Sterling Sky).

### High
- **H3 — No map embed on `/contact/` or `/en/contact/`.** Add the GBP iframe pinned to École de Cité-Jonction once GBP is live.
- **H4 — No transit / access information.** Add TPG lines (15, 2, 19), walking distance from Cornavin, full venue name (École de Cité-Jonction).
- **H5 — `SportsEvent` schema for recurring sessions** (also schema-section finding S-03).

### NAP consistency

Mostly clean. One MEDIUM mismatch and two LOW issues:
- **[Medium]** `/en/contact/` page-level `LocalBusiness` uses `"addressLocality":"Geneva"`; every other block uses `"Genève"`. Standardise to `"Genève"` (official Swiss postal name).
- **[Low]** `/en/contact/` and `/en/privacy-policy/` show "1205 Genève, Suisse" in EN context — translate to "1205 Geneva, Switzerland" in the visible body (keep schema fields in canonical Swiss form).
- **[Low]** `streetAddress` schema field carries only `"La Jonction"`; full venue name `"École de Cité-Jonction"` is omitted. Add it for stronger entity resolution.

### Geo coordinates
Stored: 46.19916, 6.13186 — reverse-geocodes to Quai Ernest-Ansermet / Jonction / 1205 Genève (plausible for the area). Verify against the actual Google Maps pin for École de Cité-Jonction; update if drift exceeds ~50 m.

### Citations checklist (Swiss-relevant)
| Directory | Priority |
|---|---|
| Google Business Profile | **CRITICAL** |
| local.ch (Swisscom) | High |
| search.ch | High |
| Swiss Pickleball Federation | High |
| geneve.ch / sportgeneve.ch | Medium |

---

## 9. Images — 95 / 100

- **Alt-text coverage: 100 %** (no missing or empty `alt` attributes across the dist).
- Logo and OG images well-defined; OG image (`og-pickleball-geneve.jpg`) referenced from every page.
- Performance concerns covered in Section 6: hero `loading="lazy"`, large Lottie bundle.
- Missing: photo gallery / venue photos. Recommended once GBP photos exist — reuse them on `/contact/` and `/participer/`.

---

## Cross-Cutting Themes

Several findings recur across categories — addressing them once delivers compounding wins:

1. **The single-source `SchemaSportsClub.astro` component** is the leverage point for fixes S-01 (HowTo→Service), S-02 (NAP locality), S-03 (Event schema), and several Local fixes (streetAddress with venue name, sameAs expansion). One PR resolves 6+ findings.
2. **The counter component** is both a performance issue (CLS risk) and a GEO issue (bot-visible "0"). Single fix improves both scores.
3. **GBP creation** unlocks (a) local-pack visibility, (b) reviews → `aggregateRating`, (c) `sameAs` URL, (d) map embed, (e) photo set. Prerequisite for ~5 separate findings.
4. **EN parity gap**: llms.txt one-liners, llms-full.txt translation, EN contact-page address translation, EN locality consistency. All point to the same EN-content investment.

---

## Limitations & What Was Not Audited

- **No Core Web Vitals field data** — CrUX credentials not provided. All performance numbers are lab/static estimates.
- **No GSC indexation data** — actual indexed-URL count vs sitemap submitted count not verified.
- **No GBP account access** — listing existence, category, photo count, post history, review velocity all advisory.
- **No live SERP rankings** — DataForSEO not configured. Local-pack rank for "pickleball Genève" / "pickleball Geneva" / La Jonction variants not measured.
- **No backlink profile** — link-building/disavow analysis out of scope without DataForSEO.
- **No Lighthouse run** — recommend running PSI on the 6 main pages once T-01 through T-04 are fixed for a clean before/after.

---

**See [ACTION-PLAN.md](ACTION-PLAN.md) for the prioritised punch list with effort estimates.**
