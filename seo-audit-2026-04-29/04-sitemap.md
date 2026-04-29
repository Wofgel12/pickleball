# Sitemap & Hreflang Audit — Pickleball Geneva
**Date:** 2026-04-29  
**Audited files:** `dist/sitemap.xml`, `dist/robots.txt`, `dist/**/*.html`  
**Generator:** `src/pages/sitemap.xml.ts`

---

## Summary

| # | Check | Status |
|---|-------|--------|
| 1 | XML well-formedness | PASS |
| 2 | Valid xmlns declarations | PASS |
| 3 | URL count within 50 k limit | PASS (16 URLs) |
| 4 | Coverage — all 16 indexable pages present | PASS |
| 5 | 404 page absent from sitemap | PASS |
| 6 | lastmod present and reasonable | INFO (dynamic — see note) |
| 7 | Canonical ↔ sitemap URL match | PASS |
| 8 | Hreflang tags present on every URL | PASS |
| 9 | Hreflang reciprocity | PASS |
| 10 | x-default present on every URL | PASS |
| 11 | URL pair correctness (FR ↔ EN slugs) | PASS |
| 12 | In-page hreflang matches sitemap | PASS |
| 13 | robots.txt declares sitemap | PASS |
| 14 | Deprecated tags (priority / changefreq) | INFO (present, ignored by Google) |
| 15 | 404.html hreflang canonical | INFO (cosmetic) |

Overall: **no blocking issues**. Two informational items worth addressing before a production custom domain migration.

---

## 1. XML Validity

```
xmllint --noout dist/sitemap.xml
# Exit code: 0 — no errors
```

- `<?xml version="1.0" encoding="UTF-8"?>` — correct declaration.
- Root element `<urlset>` carries both required namespaces:
  - `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` — correct.
  - `xmlns:xhtml="http://www.w3.org/1999/xhtml"` — required for `xhtml:link` hreflang entries — correct.
- No unescaped characters, no stray attributes.

**Result: PASS**

---

## 2. Coverage

**Sitemap URL count:** 16 (8 route pairs × 2 languages).

**Expected pages from `src/i18n/ui.ts`:**

| Route key | FR URL | EN URL |
|-----------|--------|--------|
| home | `/` | `/en/` |
| participate | `/participer/` | `/en/participate/` |
| learn | `/apprendre/` | `/en/learn/` |
| gear | `/equipement/` | `/en/gear/` |
| faq | `/faq/` | `/en/faq/` |
| contact | `/contact/` | `/en/contact/` |
| legal | `/mentions-legales/` | `/en/legal-notice/` |
| privacy | `/politique-confidentialite/` | `/en/privacy-policy/` |

All 16 URLs are present in the sitemap. Cross-checking against `dist/**/*.html`:

- FR pages in dist: `/ /apprendre/ /equipement/ /participer/ /faq/ /contact/ /mentions-legales/ /politique-confidentialite/` — 8 files. All in sitemap.
- EN pages in dist: `/en/ /en/learn/ /en/gear/ /en/participate/ /en/faq/ /en/contact/ /en/legal-notice/ /en/privacy-policy/` — 8 files. All in sitemap.
- `dist/404.html` — correctly absent from sitemap.

**Result: PASS**

---

## 3. lastmod Accuracy

The generator uses `new Date().toISOString().slice(0, 10)` — the build timestamp.

```ts
// sitemap.xml.ts line 31
const lastmod = new Date().toISOString().slice(0, 10);
```

The built sitemap shows `2026-04-28` on every URL (last build date). This is a common pattern but carries a minor risk:

**[INFO]** All 16 URLs share an identical `lastmod` of `2026-04-28`. Google's documentation notes that identical lastmod dates across all URLs reduce the signal's trustworthiness. The date is reasonable (yesterday), so this is not harmful — but ideally `lastmod` should reflect the actual last content change per page rather than the build date. Consider storing per-page content revision dates in `ui.ts` alongside `facts.lastReviewedISO` (which is already set to `2026-04-28`) and emitting those instead.

**Result: INFO (not blocking)**

---

## 4. Canonical ↔ Sitemap URL Match

Every `<loc>` in the sitemap was verified against the `<link rel="canonical">` in the corresponding HTML file. All 16 match exactly, including trailing slashes:

| Sitemap `<loc>` | HTML `<link rel="canonical">` | Match |
|-----------------|-------------------------------|-------|
| `…/` | `…/` | yes |
| `…/en/` | `…/en/` | yes |
| `…/participer/` | `…/participer/` | yes |
| `…/en/participate/` | `…/en/participate/` | yes |
| `…/apprendre/` | `…/apprendre/` | yes |
| `…/en/learn/` | `…/en/learn/` | yes |
| `…/equipement/` | `…/equipement/` | yes |
| `…/en/gear/` | `…/en/gear/` | yes |
| `…/faq/` | `…/faq/` | yes |
| `…/en/faq/` | `…/en/faq/` | yes |
| `…/contact/` | `…/contact/` | yes |
| `…/en/contact/` | `…/en/contact/` | yes |
| `…/mentions-legales/` | `…/mentions-legales/` | yes |
| `…/en/legal-notice/` | `…/en/legal-notice/` | yes |
| `…/politique-confidentialite/` | `…/politique-confidentialite/` | yes |
| `…/en/privacy-policy/` | `…/en/privacy-policy/` | yes |

No trailing-slash mismatches. No redirect chains to investigate.

**Result: PASS**

---

## 5. Hreflang in Sitemap

Every `<url>` block carries five `xhtml:link` entries:

```xml
<xhtml:link rel="alternate" hreflang="fr-CH" href="…FR URL…" />
<xhtml:link rel="alternate" hreflang="fr"    href="…FR URL…" />
<xhtml:link rel="alternate" hreflang="en-GB" href="…EN URL…" />
<xhtml:link rel="alternate" hreflang="en"    href="…EN URL…" />
<xhtml:link rel="alternate" hreflang="x-default" href="…FR URL…" />
```

Checks:

- `fr-CH` and `fr` both present — targets French-Switzerland specifically and French broadly. Correct for a Geneva audience.
- `en-GB` and `en` both present — targets British English specifically and English broadly. Reasonable for international Geneva visitors.
- `x-default` points to the FR URL on every pair — correct; FR is the default locale.
- Self-referencing: the `<loc>` URL appears in its own hreflang block (i.e. the FR page's `<loc>` is also the `hreflang="fr"` href value). This is the required Google format.
- Reciprocal: the EN `<url>` block's `hreflang="fr"` href points to the FR sibling, and the FR `<url>` block's `hreflang="en"` href points to the EN sibling. Bidirectional links confirmed for all 8 pairs.

**Result: PASS**

---

## 6. URL Pair Correctness

Verified against `src/i18n/ui.ts` routes:

| FR slug in sitemap | EN slug in sitemap | Expected mapping | Correct |
|--------------------|--------------------|-----------------|---------|
| `/` | `/en/` | home | yes |
| `/participer/` | `/en/participate/` | participate | yes |
| `/apprendre/` | `/en/learn/` | learn | yes |
| `/equipement/` | `/en/gear/` | gear | yes |
| `/faq/` | `/en/faq/` | faq | yes |
| `/contact/` | `/en/contact/` | contact | yes |
| `/mentions-legales/` | `/en/legal-notice/` | legal | yes |
| `/politique-confidentialite/` | `/en/privacy-policy/` | privacy | yes |

No mismatches. The generator reads directly from `routes` in `ui.ts`, so the sitemap is structurally impossible to drift from the route definitions.

**Result: PASS**

---

## 7. In-Page Hreflang vs Sitemap

Every HTML file in `dist/` was grepped for `<link rel="alternate" hreflang="...">`. The tags found in-page are identical to what the sitemap declares — same locale codes (`fr-CH`, `fr`, `en-GB`, `en`, `x-default`), same href values, same FR/EN pairing per page. No page emits additional or conflicting locales.

Sample spot-checks:

**`dist/apprendre/index.html`** (FR learn page):
```html
<link rel="alternate" hreflang="fr-CH"    href="https://pickleballgeneva.netlify.app/apprendre/">
<link rel="alternate" hreflang="fr"       href="https://pickleballgeneva.netlify.app/apprendre/">
<link rel="alternate" hreflang="en-GB"    href="https://pickleballgeneva.netlify.app/en/learn/">
<link rel="alternate" hreflang="en"       href="https://pickleballgeneva.netlify.app/en/learn/">
<link rel="alternate" hreflang="x-default" href="https://pickleballgeneva.netlify.app/apprendre/">
```

**`dist/en/learn/index.html`** (EN learn page):
```html
<link rel="alternate" hreflang="fr-CH"    href="https://pickleballgeneva.netlify.app/apprendre/">
<link rel="alternate" hreflang="fr"       href="https://pickleballgeneva.netlify.app/apprendre/">
<link rel="alternate" hreflang="en-GB"    href="https://pickleballgeneva.netlify.app/en/learn/">
<link rel="alternate" hreflang="en"       href="https://pickleballgeneva.netlify.app/en/learn/">
<link rel="alternate" hreflang="x-default" href="https://pickleballgeneva.netlify.app/apprendre/">
```

Reciprocity is confirmed in the HTML layer, not just the sitemap layer. Google can discover the hreflang graph via either channel.

**Result: PASS**

---

## 8. robots.txt

```
Sitemap: https://pickleballgeneva.netlify.app/sitemap.xml
```

- Absolute URL — correct.
- Matches the live sitemap path — correct.
- Declared at the end of the file after all `User-agent` blocks — acceptable position (robots.txt spec does not require a specific position).
- `/api/` is disallowed for all agents — correct.

**Result: PASS**

---

## 9. Informational Items (Non-Blocking)

### [INFO-1] `priority` and `changefreq` tags are present

The sitemap uses both `<priority>` and `<changefreq>` on every URL. Google has publicly stated it ignores both fields. They add ~3–4 lines per URL (64 extra lines for 16 URLs) but cause no harm. They can be stripped from the generator to reduce sitemap payload and remove noise.

Affected: all 16 `<url>` blocks in `sitemap.xml.ts` lines 44–45.

### [INFO-2] `dist/404.html` emits hreflang tags pointing to the home page

The 404 page carries:
```html
<link rel="canonical" href="https://pickleballgeneva.netlify.app/">
<link rel="alternate" hreflang="fr-CH" href="https://pickleballgeneva.netlify.app/">
...
```

The canonical pointing to `/` is debatable for a 404 — it could confuse crawlers that follow `<link>` elements before they observe the HTTP status. In practice Netlify serves the file with a `404` status code so Google will not index it, but the canonical-to-home pattern is inconsistent. A self-referencing canonical (or no canonical) would be cleaner. This does not affect the sitemap itself.

### [INFO-3] `lastmod` is build-time, not content-time

Covered in section 3 above. Not blocking; noted here for completeness.

---

## Files Audited

- `/Users/mikael/Documents/GitHub/pickleball/dist/sitemap.xml`
- `/Users/mikael/Documents/GitHub/pickleball/src/pages/sitemap.xml.ts`
- `/Users/mikael/Documents/GitHub/pickleball/src/i18n/ui.ts`
- `/Users/mikael/Documents/GitHub/pickleball/dist/robots.txt`
- `/Users/mikael/Documents/GitHub/pickleball/dist/index.html` and 15 sibling HTML files
