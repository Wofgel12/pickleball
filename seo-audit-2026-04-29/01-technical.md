# Technical SEO Audit — Pickleball Geneva (GSC)
**Site:** https://pickleballgeneva.netlify.app  
**Audit date:** 2026-04-29  
**Stack:** Astro 5 static, Netlify hosting, FR (default / no prefix) + EN (/en/ prefix), 17 pages  
**Auditor:** Claude Sonnet 4.6 — automated static + live HTTP analysis

---

## Score Summary

| Category | Status | Score |
|---|---|---|
| 1. Crawlability | PASS | 95/100 |
| 2. Indexability | PASS with notes | 82/100 |
| 3. Security Headers | PARTIAL FAIL | 68/100 |
| 4. URL Structure | PASS | 92/100 |
| 5. Mobile | PASS | 98/100 |
| 6. Core Web Vitals (lab estimate) | PARTIAL | 74/100 |
| 7. JS Rendering | PASS | 96/100 |
| 8. Internal Linking | PASS | 90/100 |
| 9. IndexNow Protocol | FAIL | 0/100 |
| **OVERALL** | | **77/100** |

---

## Issue Register (17 total)

| # | Severity | Category | Issue |
|---|---|---|---|
| 1 | High | Security | No Content-Security-Policy header |
| 2 | High | Security | No X-Frame-Options header |
| 3 | High | Core Web Vitals | Hero image(s) marked loading="lazy" — LCP risk |
| 4 | High | Core Web Vitals | LottiePlayer bundle 640 KB (pre-gzip) loaded on every page that uses it |
| 5 | High | IndexNow | No IndexNow key or API submission configured |
| 6 | Medium | Indexability | 404 page missing `<meta name="robots" content="noindex">` |
| 7 | Medium | Indexability | Legal/privacy pages indexed (in sitemap with priority 0.20) — consider noindex |
| 8 | Medium | Core Web Vitals | No `fetchpriority="high"` on above-fold image |
| 9 | Medium | Core Web Vitals | No `<link rel="preload">` for hero image in `<head>` |
| 10 | Medium | Crawlability | robots.txt has no Crawl-delay for Bytespider/Amazonbot (aggressive bots) |
| 11 | Medium | Hreflang | Dual `fr-CH` + `fr` and `en-GB` + `en` tags on every page — redundant but not incorrect; however `fr` generic tag overrides `fr-CH` for French users outside Switzerland |
| 12 | Medium | URL Structure | `_redirects` fragment redirects (#hash) will NOT work on Netlify — hash is never sent to the server |
| 13 | Low | Security | HSTS max-age=31536000 (1 year) — consider upgrading to 2 years (63072000) per HSTS preload list best practice |
| 14 | Low | Indexability | `logo-img.png` is 50 KB as PNG — convert to WebP for marginal performance gain |
| 15 | Low | Core Web Vitals | Single shared CSS bundle (apprendre.DVwScaR1.css, 24 KB) loaded on every page including pages that don't use /apprendre/ styles |
| 16 | Low | Structured Data | `WebSite` schema missing `potentialAction` (SearchAction) — low value but easy win |
| 17 | Low | Crawlability | `llms.txt` / `llms-full.txt` present but no `robots.txt` Sitemap pointer for AI crawlers specifically (existing Sitemap line covers all — informational only) |

---

## 1. Crawlability — PASS (95/100) | 2 issues

**Live checks:**
- `robots.txt` returns HTTP 200, content-type `text/plain` — PASS
- `sitemap.xml` returns HTTP 200, content-type `application/xml` — PASS
- Sitemap referenced correctly in robots.txt: `Sitemap: https://pickleballgeneva.netlify.app/sitemap.xml`
- All major crawlers allowed: Googlebot, GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot — PASS
- MJ12bot blocked — good
- AhrefsBot / SemrushBot rate-limited to Crawl-delay: 10 — good
- `Disallow: /api/` only — clean, no valuable paths blocked

**Issue #10 — Medium:** Bytespider (ByteDance/TikTok) and Amazonbot have explicit `Allow: /` but no `Crawl-delay`. Both are known high-frequency crawlers with no current throttle.

**Fix:** In `/Users/mikael/Documents/GitHub/pickleball/public/robots.txt`, add after the existing Bytespider block:
```
User-agent: Bytespider
Crawl-delay: 10

User-agent: Amazonbot
Crawl-delay: 10
```

**Issue #17 — Low (informational):** `llms.txt` and `llms-full.txt` are present in `/public/` and served correctly with `content-type: text/plain; charset=utf-8` (per `_headers` override). The cache TTL is 1 hour — appropriate for frequently updated content. No action needed.

---

## 2. Indexability — PASS with notes (82/100) | 3 issues

**Sitemap:** 16 `<loc>` entries, all 17 HTML pages minus `404.html` (correct). All URLs use trailing slash form. Sitemap includes `xhtml:link` hreflang blocks per URL — good practice for Google.

**Canonicals (all pages checked):**
- FR homepage: `<link rel="canonical" href="https://pickleballgeneva.netlify.app/">` — PASS
- EN homepage: `<link rel="canonical" href="https://pickleballgeneva.netlify.app/en/">` — PASS
- `/faq/`, `/en/faq/`, `/participer/`, `/en/participate/`, `/contact/`, `/en/contact/` — all self-referencing canonicals — PASS
- `/mentions-legales/`, `/politique-confidentialite/`, `/en/legal-notice/`, `/en/privacy-policy/` — self-referencing canonicals — PASS

**No `noindex` found anywhere** — all 17 pages are indexable.

**Issue #6 — Medium:** The 404 error page (`dist/404.html`) has no `<meta name="robots" content="noindex, nofollow">`. Although Googlebot won't index a page served with a 4xx HTTP status code, some crawlers do index the document. The canonical on the 404 page currently points to `/` (homepage) which partially mitigates this, but an explicit noindex is cleaner.

**Fix:** In `/Users/mikael/Documents/GitHub/pickleball/src/layouts/BaseLayout.astro` or the 404 page source, add a conditional:
```astro
{pageKey === '404' && <meta name="robots" content="noindex, nofollow" />}
```
Or create a dedicated `404Layout.astro` that always emits noindex.

**Issue #7 — Medium:** Legal (`/mentions-legales/`, `/en/legal-notice/`) and privacy (`/politique-confidentialite/`, `/en/privacy-policy/`) pages are in the sitemap at priority 0.20 and are fully indexable. These pages generate zero search traffic and can consume crawl budget. Recommended to add `noindex, nofollow` and remove from sitemap — they are still navigable from the footer.

**Fix:** Add `noindex` meta to those four pages and remove their `<url>` entries from the sitemap generation logic.

**Issue #11 — Medium:** Every page emits both `hreflang="fr-CH"` and `hreflang="fr"` pointing to the same URL, and both `hreflang="en-GB"` and `hreflang="en"` pointing to the same EN URL. The generic `hreflang="fr"` tag will be used for French speakers outside Switzerland (France, Belgium, etc.) and will direct them to the same CH content. This is not wrong if intentional, but it means French-FR users see Swiss prices/context. If you only serve Geneva/Switzerland, dropping the generic `hreflang="fr"` and `hreflang="en"` and keeping only `fr-CH`, `en-GB`, and `x-default` is cleaner and avoids unintentional signals to Google for non-CH French markets.

**Hreflang reciprocity check (PASS):** Each page correctly lists its counterpart in both the `<head>` hreflang tags and the sitemap `xhtml:link` blocks. No broken pairs found.

---

## 3. Security Headers — PARTIAL FAIL (68/100) | 2 issues

**Live HTTP headers on `https://pickleballgeneva.netlify.app/`:**

| Header | Present | Value |
|---|---|---|
| `Strict-Transport-Security` | YES | `max-age=31536000; includeSubDomains; preload` |
| `X-Content-Type-Options` | YES | `nosniff` |
| `Referrer-Policy` | YES | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | YES | `camera=(), microphone=(), geolocation=(self)` |
| `Content-Security-Policy` | **NO** | Missing |
| `X-Frame-Options` | **NO** | Missing |
| `X-XSS-Protection` | Not expected | (deprecated, correct to omit) |

HTTPS enforcement is active — Netlify redirects HTTP to HTTPS at edge level.

**Issue #1 — High: No Content-Security-Policy**  
CSP is a primary defence against XSS. Given the site loads external resources (`lottie.host`, `/.netlify/images`), an absent CSP means any injected script executes freely. Google's CrUX and Core Web Vitals are unaffected, but this is a meaningful security gap and increasingly factored into trust signals.

**Fix:** Add to `/Users/mikael/Documents/GitHub/pickleball/public/_headers` under the `/*` block:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.netlify.app https://*.netlify.com /.netlify/images; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://formspree.io https://submit-form.com
  X-Frame-Options: DENY
```

Note: Astro's inline scripts and Tailwind's inline styles require `'unsafe-inline'` for script-src and style-src unless you adopt nonce-based CSP (non-trivial with Astro static output). Start with `report-only` mode using a `Content-Security-Policy-Report-Only` header and a reporting endpoint to identify what breaks before enforcing.

**Issue #2 — High: No X-Frame-Options**  
Without this header the site can be embedded in an `<iframe>` on any origin, enabling clickjacking attacks. The `frame-ancestors 'none'` directive in CSP above is the modern replacement, but `X-Frame-Options: DENY` provides defence-in-depth for older browsers.

**Fix:** Included in the `_headers` fix above.

**Issue #13 — Low:** HSTS `max-age=31536000` (1 year) meets the minimum for the HSTS preload list, but the recommended value is 2 years (63072000). If you intend to submit to hstspreload.org (required for the `preload` flag to take effect), upgrade the max-age.

**Fix:** In `netlify.toml` or `_headers`, change to `max-age=63072000; includeSubDomains; preload`.

---

## 4. URL Structure — PASS (92/100) | 1 issue

**Trailing slash behaviour (live):**
- `/faq` → 301 → `/faq/` — consistent, single redirect — PASS
- `/en` → 301 → `/en/` — consistent — PASS
- `/faq/` → 200 — PASS
- `/en/` → 200 — PASS
- `/participer/` → 200 — PASS
- `/en/participate/` → 200 — PASS

**www redirect:**
- `netlify.toml` has `[[redirects]]` from `https://www.pickleballgeneva.netlify.app/*` → canonical — PASS (note: this only matters if a custom domain is configured; on a `.netlify.app` subdomain the www variant doesn't resolve by default)

**No redirect chains detected** — all canonical URLs resolve in a single hop.

**Issue #12 — Medium: Hash fragment redirects in `_redirects` will never fire**  
The file `/Users/mikael/Documents/GitHub/pickleball/public/_redirects` contains 10 entries like:
```
/index.html#participate /participer/ 301!
/#faq /faq/ 301!
```
HTTP redirects operate server-side; the fragment (`#participate`, `#faq`) is never sent to the server by the browser. Netlify will never see these rules match. The `/index.html` → `/participer/` part (without fragment) would match, but since `index.html` is served as the root page, this would incorrectly redirect the homepage for some edge cases.

**Verdict:** These rules are dead code. If they were intended to handle legacy SPA anchor URLs shared externally, they will silently fail.

**Fix:** Remove or comment out all `#`-containing redirect rules from `/Users/mikael/Documents/GitHub/pickleball/public/_redirects`. If you need to handle legacy anchor URLs (e.g. from old social shares), you would need a JavaScript-based solution on the landing page: detect `window.location.hash` on load and redirect accordingly.

---

## 5. Mobile — PASS (98/100) | 0 issues

- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present on all pages — PASS
- `html lang` correctly set to `fr-CH` (FR pages) and `en-GB` (EN pages) — PASS
- Responsive nav: desktop uses `hidden md:flex`, mobile uses `details`/`summary` hamburger — PASS (no JS dependency for mobile menu open/close; uses native `<details>` element)
- Touch targets: nav links have `px-4 py-2` padding (~16px vertical, ~32px horizontal) — meets 48px minimum when combined with line-height
- `theme-color` meta set to `#002b2b` — PASS
- Web App Manifest (`/site.webmanifest`) linked — PASS

No mobile-blocking CSS or JS found. Astro static output is fully rendered HTML — no hydration gating required to display content.

---

## 6. Core Web Vitals — Lab Estimate (74/100) | 4 issues

**Note:** No field data (CrUX) is available for this domain. The following are lab estimates from source inspection. Measure with Lighthouse and PageSpeed Insights to get real scores.

### LCP (Largest Contentful Paint) — Risk: MEDIUM-HIGH

**Issue #3 — High: Hero image(s) use `loading="lazy"`**

The homepage has three `<img>` tags served via Netlify Image CDN (`/.netlify/images`). All three have `loading="lazy"`:

```html
<img src="/.netlify/images?url=_astro%2Fistockphoto-1301500044...&fm=webp&w=800&h=489"
     alt="Joueur frappant une balle..."
     class="w-full h-full object-cover object-center"
     loading="lazy"/>
```

If any of these images is above the fold (visible in viewport on load), `loading="lazy"` actively delays LCP. The browser will not start fetching the image until layout is complete. Combined with no `fetchpriority="high"` and no `<link rel="preload">`, the LCP element will likely be discovered late.

**Fix:** For the first/hero image in `/Users/mikael/Documents/GitHub/pickleball/src/` (whichever image component renders the above-fold slide), change to:
```html
<img ... loading="eager" fetchpriority="high" />
```
And in `BaseLayout.astro` (or the hero component's `<slot name="head">`), add:
```html
<link rel="preload" as="image" 
      href="/.netlify/images?url=_astro%2Fistockphoto-1301500044-612x612.Do3vncC-.jpg&fm=webp&w=800&h=489"
      fetchpriority="high" />
```

**Issue #8 — Medium: No `fetchpriority="high"` on above-fold image** (same root cause as #3, distinct attribute).

**Issue #9 — Medium: No `<link rel="preload">` for hero image** — browser discovers the image via layout paint, not the preload scanner. On 4G this costs 200–400ms of LCP.

### INP (Interaction to Next Paint) — Risk: LOW

Astro static output means most interactions are native HTML or lightly hydrated islands. The only `client:load` island is `LangSwitcher` (1.1 KB). Other islands use `client:visible` (ReviewsBubbles, CounterAnimated, LottiePlayer) which defer hydration until intersection — correct behaviour. INP risk is low.

### CLS (Cumulative Layout Shift) — Risk: LOW-MEDIUM

**Issue #4 — High: LottiePlayer bundle is 640 KB (pre-gzip)**

`LottiePlayer.DhU_LUuS.js` is 640 KB on disk. Even with Brotli compression this will be ~100-150 KB over the wire for a single animation. It loads with `client:visible` which prevents render-blocking, but once it triggers it will download and parse a large JS payload, potentially causing layout shift if the Lottie animation element has no explicit dimensions reserved. The `className` has `w-full max-w-[200px] md:max-w-none md:w-auto md:h-24` — the `h-24` (96px) fixed height on desktop is good, but mobile may shift.

Additionally, the Lottie animation is loaded from an external CDN (`https://lottie.host/...`). This is a `<link rel="preconnect" href="https://lottie.host" crossorigin>` in the head — correct, but preconnect only covers DNS + TLS handshake, not the actual asset fetch.

**Fix options (in order of impact):**
1. Replace the Lottie animation with a static SVG or CSS animation to eliminate the 640 KB bundle entirely.
2. If keeping Lottie, ensure the container has explicit `width` and `height` (not just Tailwind classes that may evaluate to zero before JS runs), preventing layout shift.
3. Use `client:idle` instead of `client:visible` so it only loads after the browser is idle.

### Caching — PASS

`/_astro/*` assets have `Cache-Control: public, max-age=31536000, immutable` (1 year + immutable) — optimal, because Astro content-hashes filenames. HTML pages have `max-age=0, must-revalidate` — correct for always-fresh pages.

**Issue #15 — Low: Single shared CSS bundle (24 KB)**  
`apprendre.DVwScaR1.css` (24 KB) is loaded on every page including pages that have nothing to do with `/apprendre/`. Astro's default CSS scoping should prevent unused styles from being painted, but the bytes are still downloaded. Consider splitting page-specific CSS if bundle size becomes a concern. At 24 KB this is minor.

---

## 7. JavaScript Rendering — PASS (96/100) | 0 issues

- **Rendering model:** Astro 5 static output. All 17 pages are pre-rendered HTML. Content is fully available to crawlers without JS execution — confirmed by inspecting HTML source (navigation, headings, body text, schema markup all in raw HTML).
- **No CSR-only routes** — no `output: 'server'` or `output: 'hybrid'` detected in config.
- **Hydration islands used correctly:**
  - `LangSwitcher` — `client:load` (needs to be interactive immediately for nav) — PASS
  - `LottiePlayer` — `client:visible` (deferred until visible) — PASS
  - `ReviewsBubbles` — `client:visible` — PASS
  - `CounterAnimated` — `client:visible` — PASS
  - `FaqAccordion` — `client:visible` — PASS
  - `ContactForm` — `client:visible` — PASS
- **SSR server-side rendered markup** is emitted for all islands (confirmed via `ssr` attribute on `<astro-island>` elements) — crawlers receive full content before JS runs.
- `react` client runtime (`client.Ck_OXNAA.js`, 133 KB) and `use-reduced-motion.esEGpfJi.js` (120 KB) are loaded as ES modules — deferred by default, no render-blocking.

---

## 8. Internal Linking — PASS (90/100) | 0 issues

**Link depth from homepage:**
- Depth 1 (directly linked from nav): `/participer/`, `/apprendre/`, `/equipement/`, `/faq/`, `/contact/` — PASS
- Depth 1 (linked from footer on every page): `/mentions-legales/`, `/politique-confidentialite/` — PASS
- EN variants all linked via language switcher from every FR page — PASS

**No orphan pages detected.** All 17 pages (excluding 404) are reachable within 1 click from the homepage. The footer on every page links to legal/privacy pages.

**Cross-language linking:** The `LangSwitcher` component uses `pageKey` to resolve the correct alternate URL for each page (e.g. `/faq/` ↔ `/en/faq/`), confirming language switcher links are accurate, not just pointing to `/` and `/en/`.

---

## 9. IndexNow Protocol — FAIL (0/100) | 1 issue

**Issue #5 — High: IndexNow not configured**

IndexNow is supported by Bing, Yandex, Naver, and Seznam. It allows instant URL submission on content change, bypassing recrawl latency. No IndexNow key file found in `/public/` or `/dist/`. No robots.txt entry for IndexNow.

**Fix (3 steps):**

1. Generate a key at https://www.bing.com/indexnow/getstarted and download the `.txt` key file.
2. Place the key file in `/Users/mikael/Documents/GitHub/pickleball/public/{key}.txt` so it's served at `https://pickleballgeneva.netlify.app/{key}.txt`.
3. Add to `/Users/mikael/Documents/GitHub/pickleball/public/robots.txt`:
```
# IndexNow key
IndexNow: https://pickleballgeneva.netlify.app/{your-key}.txt
```
4. On each deployment, trigger a batch submission:
```bash
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "host": "pickleballgeneva.netlify.app",
    "key": "{your-key}",
    "urlList": [
      "https://pickleballgeneva.netlify.app/",
      "https://pickleballgeneva.netlify.app/participer/",
      "https://pickleballgeneva.netlify.app/faq/",
      "https://pickleballgeneva.netlify.app/en/",
      "https://pickleballgeneva.netlify.app/en/participate/",
      "https://pickleballgeneva.netlify.app/en/faq/"
    ]
  }'
```
This can be added as a Netlify post-deploy notification webhook or an `npm run postbuild` script.

---

## Structured Data — PASS (informational)

Not scored separately — schemas are well implemented.

**Detected schemas (FR homepage):**
- `SportsClub` + `LocalBusiness` (dual @type) with `@id`, address, geo, openingHours, priceRange, paymentAccepted — PASS
- `WebSite` — PASS
- `BreadcrumbList` (2-level on interior pages) — PASS
- `Course` + `CourseInstance` — PASS
- `FAQPage` (6 Q&A on homepage, additional on `/faq/`) — PASS

**Issue #16 — Low:** `WebSite` schema is missing a `potentialAction` SearchAction. For a small site without site search this is not impactful, but Google can display a sitelinks searchbox for sites with this markup.

**Fix:** In `BaseLayout.astro`, extend the `websiteSchema` object:
```js
potentialAction: {
  '@type': 'SearchAction',
  target: {
    '@type': 'EntryPoint',
    urlTemplate: 'https://pickleballgeneva.netlify.app/?q={search_term_string}'
  },
  'query-input': 'required name=search_term_string'
}
```
Only add this if the site has a search function. If not, omit.

---

## Priority Action Plan

### Immediate (before next deploy)

| # | Action | File |
|---|---|---|
| 1 | Add CSP + X-Frame-Options headers | `/public/_headers` |
| 2 | Remove `loading="lazy"` from hero/first image; add `fetchpriority="high"` | Hero image component in `src/` |
| 3 | Add `<link rel="preload">` for hero image in `BaseLayout.astro` or page slot | `src/layouts/BaseLayout.astro` |
| 4 | Add `noindex, nofollow` to 404 page | 404 source page |

### Short-term (next sprint)

| # | Action | File |
|---|---|---|
| 5 | Configure IndexNow key + post-deploy submission script | `/public/` + `package.json` |
| 6 | Evaluate replacing LottiePlayer with SVG/CSS animation (eliminate 640 KB bundle) | Hero/animation component |
| 7 | Remove dead hash-fragment redirect rules | `/public/_redirects` |
| 8 | Add `noindex` to 4 legal/privacy pages + remove from sitemap | Page sources + sitemap config |

### Backlog

| # | Action | File |
|---|---|---|
| 9 | Upgrade HSTS max-age to 63072000 | `/public/_headers` or `netlify.toml` |
| 10 | Add Crawl-delay: 10 for Bytespider and Amazonbot | `/public/robots.txt` |
| 11 | Consider dropping generic `hreflang="fr"` / `hreflang="en"` tags | `src/layouts/BaseLayout.astro` |
| 12 | Convert `logo-img.png` (50 KB) to WebP | `/public/` + image references |

---

*End of report. 17 issues identified across 9 categories.*
