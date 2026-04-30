# Migration `pickleballgeneva.netlify.app` → `gscpickleball.ch`

Code modifications applied 2026-04-29. This checklist covers the **manual steps** (Netlify dashboard + Google Search Console + external profiles) needed to complete the migration and have Google transfer the ranking.

---

## What was already done (in code)

- [x] `astro.config.mjs` — `SITE = 'https://gscpickleball.ch'`
- [x] All page-level `SITE` fallbacks updated
- [x] `sitemap.xml.ts` hardcoded `SITE` updated
- [x] `llms.txt` and `llms-full.txt` — every absolute URL now points to `gscpickleball.ch`
- [x] `robots.txt` — `Sitemap:` line updated
- [x] Footer microdata `itemprop="url"` updated
- [x] Legal/privacy bodies updated
- [x] `netlify.toml` — added 301 redirect from `pickleballgeneva.netlify.app/*` and `www.gscpickleball.ch/*` to `gscpickleball.ch/:splat` (page-to-page, force=true)
- [x] Build verified clean (12 sitemap URLs, all canonicals + schema `@id` on `gscpickleball.ch`)

---

## Step 1 — Deploy

```bash
git add -A
git commit -m "feat(seo): migrate to gscpickleball.ch"
git push
```

Wait for Netlify to deploy (≈1 min). Then:

```bash
curl -I https://gscpickleball.ch/                       # expect 200
curl -I https://www.gscpickleball.ch/                   # expect 301 → gscpickleball.ch
curl -I https://pickleballgeneva.netlify.app/           # expect 301 → gscpickleball.ch
curl -I https://pickleballgeneva.netlify.app/faq/       # expect 301 → gscpickleball.ch/faq/  (page-to-page!)
```

If any of these fails, fix before continuing.

---

## Step 2 — Netlify dashboard

1. **Site configuration → Domain management → Domains**
   - Confirm `gscpickleball.ch` is listed as **Primary domain** (star icon).
   - If not: click the `…` menu next to it → **Set as primary domain**.

2. **Force HTTPS** must be enabled (under HTTPS section). It usually is automatic.

3. **Keep the `.netlify.app` URL active** — do NOT remove it. The 301 in `netlify.toml` redirects it page-by-page. Removing it kills inbound backlinks.

---

## Step 3 — Google Search Console (most critical)

### 3.1 Add `gscpickleball.ch` as a new property

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. **Add property** → choose **Domain** (the upper option, not URL prefix)
3. Enter `gscpickleball.ch`
4. Google gives you a TXT record like `google-site-verification=AbCd...`
5. Add it to your DNS zone:
   - **If DNS is on Netlify:** Domains → `gscpickleball.ch` → **DNS records** → add a TXT record with the value
   - **If DNS is at your registrar:** add the TXT record there
6. Wait 5–15 min for DNS propagation, then click **Verify** in GSC

This single property covers `gscpickleball.ch`, `www.gscpickleball.ch`, and any future subdomain.

### 3.2 Submit the new sitemap

1. Open the new property in GSC
2. **Sitemaps** (left menu) → enter `sitemap.xml` → **Submit**
3. Status should turn green within 24 h.

### 3.3 Use the "Change of address" tool — **the #1 explicit migration signal**

This is the step that tells Google "the old site moved here", and it triggers a fast-track migration in Google's index.

1. **In the OLD GSC property** for `pickleballgeneva.netlify.app` (you presumably already had this; if not, add it as a URL-prefix property using the existing `<meta name="google-site-verification">` token already in [BaseLayout.astro](../src/layouts/BaseLayout.astro:143))
2. Open the old property → ⚙ **Settings** → **Change of address**
3. Choose the new site: `gscpickleball.ch`
4. GSC runs automated checks (verifies the 301s, sitemap, etc.) — should pass since the code-side migration is clean
5. Click **Validate & update**

Confirmation appears: "We'll let users know your site has moved." Done.

### 3.4 Force-index the 6 priority URLs

Speeds up indexation from weeks to days. In the new property:

For each of these URLs, paste in the URL inspector at the top of GSC, then click **Request indexing**:

- `https://gscpickleball.ch/`
- `https://gscpickleball.ch/en/`
- `https://gscpickleball.ch/participer/`
- `https://gscpickleball.ch/en/participate/`
- `https://gscpickleball.ch/faq/`
- `https://gscpickleball.ch/contact/`

(GSC limits this to ~10 requests/day per property, which is fine for 6.)

---

## Step 4 — Update external signals (each takes < 5 min)

| Where | What to do |
|---|---|
| **Google Business Profile** ("Pickleball Geneva Sports Club") | Edit profile → **Website** field → change to `https://gscpickleball.ch/` |
| **Meetup** ([meetup.com/genevasportsclub](https://www.meetup.com/genevasportsclub/)) | Group settings → external website → change to `https://gscpickleball.ch/` |
| **`genevasportsclub.ch`** (parent association site) | Update any "pickleball" link to `https://gscpickleball.ch/` (this is the most powerful internal-network backlink) |
| **Instagram bio (`@gva_pickleball` is the competitor — verify your handle)** | Bio link → `https://gscpickleball.ch/` |
| **Any flyers / printed material** | Update on next reprint cycle |

---

## Step 5 — Monitor (weeks 2–8)

Watch these in GSC:

| Metric | Where | Expected pattern |
|---|---|---|
| Indexed URLs (new property) | Coverage → Pages → Indexed | Climbs to 12 over 2–4 weeks |
| Indexed URLs (old property) | Coverage on old property | Decreases mirror-wise |
| Errors / 404s | Coverage → Pages → Not indexed | Should stay at 0; any 404 means a broken 301 |
| Search performance | Performance → Search results | Possible 10–30 % dip in weeks 1–2, return to baseline by week 4–6 |

In Google Analytics 4: monitor `Acquisition → Traffic → Organic`. Same pattern (dip then recover).

---

## Common pitfalls — do NOT do these

1. **Don't 301 everything to the home.** `…netlify.app/faq/` MUST go to `…gscpickleball.ch/faq/`, not to `…gscpickleball.ch/`. The `:splat` token in `netlify.toml` handles this — confirmed in Step 1.
2. **Don't remove the `.netlify.app` site.** Keep it alive at least 6 months (Netlify keeps it free anyway). It carries the 301 that transfers PageRank.
3. **Don't change content during the migration.** One change at a time — migrate the URL first, then iterate on content. Mixing both confuses Google's algorithms.
4. **Don't unverify the old GSC property** until 6+ months post-migration. You need it active for the Change of Address tool to keep working and for monitoring.
5. **Don't add the `.netlify.app` URL to `sameAs` or anywhere "canonical".** It's now strictly a redirect source.

---

## Realistic timeline

| When | Status |
|---|---|
| Day 0 | Code deployed, 301s live, GSC change-of-address submitted |
| Day 1–2 | Googlebot starts crawling redirects, recognises the move |
| Week 1–2 | Traffic dip 10–30 %, ranking unstable |
| Week 3–4 | New URLs replace old ones in SERP, ranking stabilises |
| Week 6–8 | Back to baseline, possibly above thanks to the `.ch` ccTLD signal |
| Month 3–6 | Full PageRank transfer; old URLs nearly gone from index |

---

## Quick mental model

Google reads three signals in parallel and only believes the move when they all agree:

1. **301 redirect** (the technical signal — already in place)
2. **Canonical tag pointing to the new URL** (already in place — every page's `<link rel="canonical">` now says `gscpickleball.ch`)
3. **GSC Change of Address declaration** (your manual step in 3.3 above)

Get all three aligned and the transfer is fast and clean. Skip any one and you lose ranking. The code side is done — the missing piece is purely you clicking through GSC.
