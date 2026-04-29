# Local SEO Audit — Geneva Sports Club / Pickleball Geneva
**Date:** 2026-04-29
**Live URL:** https://pickleballgeneva.netlify.app
**Business type:** Brick-and-mortar (SportsClub at fixed venue)
**Industry vertical:** Sports & Recreation — weekly drop-in sessions

---

## Local SEO Score

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|---------|
| GBP Signals | 25% | 20/100 | 5.0 |
| Reviews & Reputation | 20% | 10/100 | 2.0 |
| Local On-Page SEO | 20% | 68/100 | 13.6 |
| NAP Consistency & Citations | 15% | 72/100 | 10.8 |
| Local Schema Markup | 10% | 75/100 | 7.5 |
| Local Link & Authority Signals | 10% | 30/100 | 3.0 |
| **Total** | **100%** | | **41.9 / 100** |

Score is suppressed primarily by the absence of a verified Google Business Profile and zero review corpus. Schema and on-page foundations are solid for a new non-profit site.

---

## 1. NAP Consistency Audit

### Canonical NAP (source of truth: `src/i18n/ui.ts`)
- **Name:** Geneva Sports Club
- **Address:** La Jonction, 1205 Genève, Suisse
- **Phone (asso):** +41 76 214 12 03 (`+41762141203`)
- **Phone (sessions):** +41 78 882 68 10 (`+41788826810`)
- **Email:** hello@genevasportsclub.ch

### NAP Consistency Matrix

| Page | Name | Street addr | Postal + Locality | Phone primary | Phone sessions | Email |
|------|------|-------------|-------------------|---------------|----------------|-------|
| `/` footer | Geneva Sports Club | La Jonction | 1205 Genève | +41 76 214 12 03 | +41 78 882 68 10 | hello@... |
| `/contact/` JSON-LD (SportsClub) | Geneva Sports Club | La Jonction | 1205 **Genève** | +41762141203 | via ContactPoint | hello@... |
| `/contact/` JSON-LD (LocalBusiness) | Geneva Sports Club — Pickleball | La Jonction | 1205 **Genève** | +41762141203 | +41788826810 | hello@... |
| `/contact/` visible body | Geneva Sports Club | La Jonction | 1205 Genève, Suisse | +41 76 214 12 03 | +41 78 882 68 10 | hello@... |
| `/en/contact/` JSON-LD (SportsClub) | Geneva Sports Club | La Jonction | 1205 **Genève** | +41762141203 | via ContactPoint | hello@... |
| `/en/contact/` JSON-LD (LocalBusiness) | Geneva Sports Club — Pickleball | La Jonction | 1205 **Geneva** [FLAG] | +41762141203 | +41788826810 | hello@... |
| `/en/contact/` visible body | Geneva Sports Club | La Jonction | 1205 Genève, Suisse [FLAG] | +41 76 214 12 03 | +41 78 882 68 10 | hello@... |
| `/mentions-legales/` body | Geneva Sports Club | La Jonction, 1205 Genève, Suisse | — | +41 76 214 12 03 | — | hello@... |
| `/en/legal-notice/` body | Geneva Sports Club | La Jonction, 1205 Geneva, Switzerland | — | +41 76 214 12 03 | — | hello@... |
| `/politique-confidentialite/` | Geneva Sports Club | La Jonction, 1205 Genève, Suisse | — | +41 76 214 12 03 | — | hello@... |
| `/en/privacy-policy/` | Geneva Sports Club | La Jonction, 1205 **Geneva**, Switzerland [FLAG] | — | +41 76 214 12 03 | — | hello@... |
| `llms.txt` | Geneva Sports Club | La Jonction, 1205 Genève (École de Cité-Jonction) | — | +41 76 214 12 03 | +41 78 882 68 10 | hello@... |
| `llms-full.txt` | Geneva Sports Club | La Jonction, 1205 Genève (École de Cité-Jonction) | — | +41 76 214 12 03 | +41 78 882 68 10 | hello@... |
| All-pages footer JSON-LD | Geneva Sports Club | La Jonction | 1205 **Genève** | +41762141203 | — (not in global block) | hello@... |

### Discrepancies Found

**[MEDIUM] `addressLocality` inconsistency in the EN-locale page-specific LocalBusiness block:**
`/en/contact/` emits two overlapping JSON-LD objects. The global `SportsClub` block correctly uses `"addressLocality":"Genève"`. The page-level `LocalBusiness` block switches to `"addressLocality":"Geneva"` (English name). Google treats these as the same city, but schema validators flag the mismatch and it introduces entity ambiguity for AI crawlers. Fix: always use the official Swiss Postal name `"Genève"` regardless of page language.

**[LOW] `/en/contact/` visible body displays "1205 Genève, Suisse"** (French form) rather than "1205 Geneva, Switzerland". Not a ranking issue, but inconsistent with the EN user experience expectation. The French form appears because `<address>` content is hardcoded in the component rather than translated.

**[LOW] `streetAddress` omits the full venue name ("École de Cité-Jonction")** across all schema blocks. The schema only carries `"La Jonction"`, while `llms.txt` and `llms-full.txt` correctly record `"La Jonction (École de Cité-Jonction)"`. For a local service pinned to a school, including the building name in `streetAddress` (or a separate `name` field on the venue) helps Google resolve the exact place ID. Recommended: `"streetAddress": "École de Cité-Jonction, La Jonction"`.

**[LOW] Global SportsClub JSON-LD block does not include `phoneSession` (+41 78 882 68 10)** in the main `telephone` field. It only appears in the contact page-level `ContactPoint`. The footer Microdata similarly carries both numbers in visible HTML but only the primary in the JSON-LD primary block. Consistency is good enough for NAP; no critical divergence.

**[INFO] Name form varies by surface:**
- Schema `@id` entity: `"Geneva Sports Club"`
- Page-level LocalBusiness: `"Geneva Sports Club — Pickleball"`
- `og:site_name`: `"GSC Pickleball — Geneva Sports Club"`
- Visible nav: `"GSC X Pickleball"`

These variants are acceptable alternate names (alternateName is declared), but the primary `name` in the canonical GBP should be set to exactly `"Geneva Sports Club"` to match the schema `@id` entity. Avoid operating-name variants on GBP itself.

---

## 2. Local Schema Validation

### Schema types emitted (every page)
1. `["SportsClub", "LocalBusiness"]` — primary entity, `@id: /#sportsclub`
2. `WebSite`
3. `BreadcrumbList`

### Contact page additionally emits
4. `LocalBusiness` with `ContactPoint` array — `@id: /contact/#localbusiness`

### Validation results

| Property | Status | Notes |
|----------|--------|-------|
| `@type` SportsClub | PASS | Correct subtype; dual-typing with LocalBusiness is valid and helps Google |
| `name` | PASS | "Geneva Sports Club" |
| `alternateName` | PASS | ["GSC Pickleball", "GSC"] declared |
| `address / PostalAddress` | PARTIAL | `streetAddress:"La Jonction"` — venue building name absent |
| `addressLocality` | PARTIAL | "Genève" in FR context, "Geneva" in EN page-level block — fix EN block |
| `addressRegion` | PASS | "GE" |
| `addressCountry` | PASS | "CH" |
| `postalCode` | PASS | "1205" |
| `geo / GeoCoordinates` | PASS | 46.19916, 6.13186 — 5 decimal places (meets recommendation); reverse-geocodes to Quai Ernest-Ansermet / Jonction / 1205 Genève — plausible for La Jonction area. Exact school pin should be verified against Google Maps directly. |
| `telephone` | PASS | "+41762141203" (E.164 format) |
| `email` | PASS | "hello@genevasportsclub.ch" |
| `url` | PASS | site root |
| `openingHoursSpecification` | PASS | Monday 18:00-20:00, Friday 18:00-20:00 |
| `priceRange` | PASS | "CHF 10" |
| `currenciesAccepted` | PASS | "CHF" |
| `paymentAccepted` | PASS | "Cash, Twint" |
| `areaServed` | PASS | City: Genève, Lausanne; AdministrativeArea: Suisse romande, Canton of Geneva |
| `sameAs` | PARTIAL | Only Meetup URL. Should add GBP URL, Swiss-Pickleball federation once listing exists |
| `sport` | PASS | "Pickleball" |
| `image` | PASS | og-pickleball-geneve.jpg |
| `logo` | PASS | logo-img.png |
| `knowsLanguage` | PASS | ["fr", "en"] |
| `aggregateRating` | MISSING | No review data yet — add once GBP reviews exist |
| `Event` / `SportsEvent` | MISSING | Weekly recurring sessions not modelled as Event schema |
| `@id` stable URI | PASS | `/#sportsclub` — consistent across all pages |

### Schema issues to fix

**[HIGH] No `Event` or `SportsEvent` schema for weekly sessions.** Google can surface sports events in the local pack and knowledge panel. Each recurring session (Mon 18:00, Fri 18:00) should be represented with `EventSchedule` (via `eventSchedule` on a `SportsEvent`). This is industry-specific for drop-in sports clubs and provides a second structured-data anchor for local visibility.

**[MEDIUM] `streetAddress` should include the building name.** Change from `"La Jonction"` to `"École de Cité-Jonction, La Jonction"` (or separate the venue with a `location` property on the Event). This lets Google resolve the exact gym/hall rather than the neighbourhood.

**[MEDIUM] `addressLocality` in the EN page-level LocalBusiness block uses "Geneva" instead of "Genève".** Patch the contact page EN JSON-LD to use `"Genève"` (official Swiss postal name).

**[LOW] `sameAs` array should be expanded** as new citations are created (GBP profile URL, Swiss Pickleball Federation listing, local.ch entry).

---

## 3. GBP Signals (Off-Site Advisory)

No Google Business Profile signals are detectable on the site: no Maps embed, no place_id reference, no GBP review widget, no GBP post indicators.

### GBP Setup Checklist

| Item | Status | Action |
|------|--------|--------|
| GBP listing created | Unknown — cannot verify without account | Create at business.google.com |
| Primary category | Unknown | Set to "Sports Club" — the single highest-impact local ranking factor (Whitespark 2026 score: 193) |
| Secondary categories | Unknown | Add "Recreation Center", "Racquet Sport Club" |
| Business name on GBP | — | Use exact form: "Geneva Sports Club" (no tagline in name field — against GBP guidelines) |
| Address on GBP | — | La Jonction, École de Cité-Jonction, 1205 Genève |
| Phone on GBP | — | +41 76 214 12 03 (primary); list +41 78 882 68 10 as additional |
| Website on GBP | — | https://pickleballgeneva.netlify.app/ |
| Hours on GBP | — | Monday 18:00-20:00, Friday 18:00-20:00 |
| Description (750 chars) | — | Include: pickleball, sessions, La Jonction, 10 CHF, débutants, raquettes fournies |
| Photos uploaded | — | Minimum 5: venue interior, courts, players, logo, team. Photos are a top local signal. |
| GBP Posts (weekly) | — | Post each session as an "Event" post; link to Meetup RSVP |
| Q&A section seeded | — | Pre-populate: "How much does it cost?" / "Do I need my own paddle?" / "Where exactly is the venue?" |
| Google Maps embed on /contact/ | MISSING | Add iframe embed of the precise pin (École de Cité-Jonction); currently zero map presence on the page |
| Service area set | — | Not applicable — brick-and-mortar venue; do not set service area on GBP |

---

## 4. Reviews & Reputation

### Current state
- **`aggregateRating` in schema:** Absent on all pages.
- **Visible testimonials / star ratings on site:** None found.
- **Review widget embedded:** None.
- **Meetup event ratings:** Meetup shows individual event RSVPs and sometimes ratings; these are not surfaced on the website.

### Review health assessment
No review corpus exists in structured data. This is normal for a new non-profit, but it suppresses the GBP knowledge panel star display and removes a top-3 local pack ranking signal.

**18-day velocity rule (Sterling Sky):** If a GBP listing is created and receives an initial burst of reviews but then no new reviews for 21+ days, rankings cliff. Plan for sustained acquisition, not a one-time ask.

### Recommended strategy

1. **Immediate:** Create GBP listing; send the review link to existing Meetup members via the group message feature.
2. **Ongoing:** After each session, the organiser asks 1-2 participants verbally to leave a Google review. Target: 1 review every 10-14 days minimum.
3. **On-site social proof:** Add a "Ce que disent nos membres" / "What members say" section on the homepage or /participer/ page with 2-3 static quotes (with first name + initials). Even without schema, this builds trust signals.
4. **Schema:** Once 5+ GBP reviews exist, add `aggregateRating` to the SportsClub JSON-LD block (pulled from GBP data or manually maintained). Do not fabricate `ratingValue`.
5. **Response rate:** Respond to every review within 48 hours. Response rate is a confirmed GBP ranking signal.
6. **Meetup as a proxy:** The Meetup group has a public profile that functions as a soft citation. Encourage RSVP and comments there as well.

---

## 5. Citations

### Detected outbound citations
- **Meetup:** `https://www.meetup.com/genevasportsclub/` — linked from footer (every page), llms.txt, llms-full.txt. `sameAs` in JSON-LD. This is the primary operational citation and functions as a Tier-1 source for a sports club in Switzerland.

### Swiss-relevant directory recommendations

| Directory | Priority | URL | Notes |
|-----------|----------|-----|-------|
| Google Business Profile | CRITICAL | business.google.com | Not yet confirmed — #1 action |
| local.ch | HIGH | local.ch | Switzerland's primary local directory; Swisscom-operated; strong DA |
| search.ch | HIGH | search.ch | Swiss yellow pages equivalent; crawled by major engines |
| Swiss Pickleball Federation | HIGH | Verify at swiss-pickleball.ch | Sport-specific citation — highest relevance for niche queries |
| Yelp Switzerland | MEDIUM | yelp.ch | Thin Swiss coverage but still indexed |
| geneve.ch / Ville de Genève | MEDIUM | geneve.ch/loisirs | City portal for associations and leisure activities |
| sportgeneve.ch | MEDIUM | sportgeneve.ch | Canton Geneva sports associations registry |
| association.ch | LOW | association.ch | Swiss non-profit association directory |
| Foursquare / Swarm | LOW | foursquare.com | Data feeds Apple Maps and others |

**Priority note:** 3 of the top 5 AI-visibility factors in 2026 are citation-related (Whitespark). Consistent NAP across local.ch, search.ch, and the GBP will compound AI overview visibility for "pickleball Genève" queries.

### Citation NAP format to use on all directories
```
Name:    Geneva Sports Club
Address: La Jonction (École de Cité-Jonction), 1205 Genève, Suisse
Phone:   +41 76 214 12 03
Website: https://pickleballgeneva.netlify.app/
```
Use this exact form everywhere. Do not vary "Genève" / "Geneva" across directory submissions.

---

## 6. Location Page Quality — /contact/ and /en/contact/

### What is present
- Full NAP: name, address, both phones, email — visible in structured HTML with `<address>` element.
- Dual phone numbers clearly labelled (association vs sessions).
- Contact form (Netlify-powered).
- JSON-LD LocalBusiness block with ContactPoint array.
- Hreflang reciprocal between FR and EN contact pages.
- Breadcrumb schema.
- `geo.position` and `ICBM` meta tags on both pages.

### What is missing

**[HIGH] No map embed.** There is zero map presence — no Google Maps iframe, no OpenStreetMap embed, no static map image, no link to a Google Maps place page. For a brick-and-mortar location page, a map embed is one of the clearest local-intent signals a page can carry. It also directly helps first-time attendees. Add a Google Maps embed pinned to École de Cité-Jonction once the GBP is created (use the GBP embed iframe, not just a generic lat/lon link).

**[HIGH] No transit / access information.** The contact page contains only "La Jonction, 1205 Genève, Suisse" as the location and nothing about how to get there. Users need:
- TPG tram/bus lines serving La Jonction (lines 15, 2, 19 stop nearby)
- Walking distance from Cornavin (~15 min or tram)
- Nearest parking if applicable
- "Look for the school entrance on..." — wayfinding inside the neighbourhood

This content is also a local keyword opportunity ("pickleball La Jonction tram", "accès salle Jonction").

**[MEDIUM] "École de Cité-Jonction" not named in the visible address block.** The contact card shows only "La Jonction, 1205 Genève, Suisse". First-time visitors searching for the specific school cannot confirm from the page alone that they are going to the right building. Add the full venue name above the address.

**[MEDIUM] No link to a Google Maps place page.** Even before a GBP embed is added, a text link "Voir sur Google Maps" / "View on Google Maps" with the coordinates or place ID gives users and search engines a direct geo signal.

**[LOW] `/en/contact/` body displays "1205 Genève, Suisse"** instead of "1205 Geneva, Switzerland" — mixed-language address in the EN version.

### Doorway page test
The FR and EN contact pages contain meaningfully differentiated content (language, translated labels, EN JSON-LD with adapted description). They are not doorway pages. Each carries unique meta, hreflang, and page-level schema. Pass.

---

## 7. Industry-Specific Factors (Sports & Recreation)

### Present and well-executed
- Session schedule visible on homepage and in schema (Mon/Fri 18:00-20:00).
- Price (10 CHF) prominent on homepage key-facts panel, in schema (`priceRange`), and in llms.txt.
- Beginner-friendly signals: "tous niveaux bienvenus, débutants inclus" on homepage and in FAQ (5 explicit FAQ answers on beginner topics).
- Equipment-provided: "raquettes et balles fournies" — on homepage, schema description, FAQ Q6, llms.txt.
- Indoor sessions: "sessions GSC en indoor" — FAQ Q13 confirms year-round indoor play.
- Age range: FAQ Q10 addresses children (16+ for current sessions), FAQ Q9 covers seniors.
- Meetup RSVP flow: 5-step process documented in /participer/ and llms-full.txt — strong conversion signal.
- `sport: "Pickleball"` in schema.
- `knowsLanguage: ["fr","en"]` in schema — appropriate for Geneva's international population.

### Missing or weak

**[MEDIUM] No venue photos on the website.** The site references `og-pickleball-geneve.jpg` for all OG images but there is no photo gallery or in-page images of the actual La Jonction gym, courts, or players. Photos of the venue are a GBP ranking signal and reduce new-player drop-off (people want to see where they are going).

**[MEDIUM] No `Event` / `SportsEvent` schema for individual sessions.** Recurring sessions should be marked up. Google surfaces sports events in local search and the knowledge panel. Use:
```json
{
  "@type": "SportsEvent",
  "name": "Session pickleball — Lundi",
  "sport": "Pickleball",
  "location": { "@type": "Place", "name": "École de Cité-Jonction", "address": {...} },
  "eventSchedule": {
    "@type": "Schedule",
    "repeatFrequency": "P1W",
    "byDay": "Monday",
    "startTime": "18:00",
    "endTime": "20:00"
  },
  "organizer": { "@id": "https://pickleballgeneva.netlify.app/#sportsclub" },
  "offers": { "@type": "Offer", "price": "10", "priceCurrency": "CHF" }
}
```

**[LOW] No cancellation / holiday policy page.** The FAQ and contact page note that sessions may pause during school holidays and that Meetup is the source of truth. A dedicated "Calendrier / Schedule" page with the next 4-6 sessions (embeddable Meetup widget or static list) would reduce FAQ load and create a crawlable schedule page.

**[LOW] No social proof from Meetup.** The Meetup group presumably has member count and event attendance numbers. Surfacing "X membres sur Meetup" or embedding the Meetup RSVP widget on /participer/ would provide a trust signal.

---

## 8. Bilingual Local Signals

| Signal | /contact/ (FR) | /en/contact/ (EN) | Status |
|--------|---------------|-------------------|--------|
| Name visible | Geneva Sports Club | Geneva Sports Club | PASS |
| Address visible | La Jonction, 1205 Genève, Suisse | La Jonction, 1205 Genève, Suisse | PARTIAL — EN shows French form |
| Phone (primary) visible | +41 76 214 12 03 | +41 76 214 12 03 | PASS |
| Phone (sessions) visible | +41 78 882 68 10 | +41 78 882 68 10 | PASS |
| Email visible | hello@genevasportsclub.ch | hello@genevasportsclub.ch | PASS |
| JSON-LD SportsClub | Present | Present | PASS |
| JSON-LD LocalBusiness | Present | Present | PASS |
| `addressLocality` in LocalBusiness block | Genève | Geneva [MISMATCH] | FAIL |
| `hreflang` reciprocal | Present | Present | PASS |
| `geo.position` meta | Present | Present | PASS |
| Map embed | Absent | Absent | FAIL |
| Transit info | Absent | Absent | FAIL |
| `og:locale` | fr_CH | en_GB | PASS |

---

## 9. Top 10 Prioritised Actions

### Critical

**C1. Create and verify a Google Business Profile.**
Without a GBP, the site cannot appear in the local pack (the map results), which drives the majority of local intent clicks. Category: "Sports Club". This single action has the largest potential ranking impact of anything on this list.

**C2. Set GBP primary category to "Sports Club" and verify address.**
Wrong or missing category is the #1 negative local ranking factor (Whitespark 2026). Ensure "Sports Club" is primary, not "Recreation Center" or "Gym".

### High

**H3. Add a Google Maps embed to /contact/ and /en/contact/.**
The contact page has full NAP but zero cartographic signal. Add the GBP embed iframe (available from the GBP "Share" menu) pinned to the exact school building. This is the most impactful on-page local signal missing from the site.

**H4. Add transit and access directions to /contact/.**
Add a "Comment nous trouver" / "How to find us" section with TPG lines, walking distance from landmarks, and the full venue name (École de Cité-Jonction). This removes a friction point for new visitors and adds local keyword coverage.

**H5. Add `SportsEvent` schema for recurring Monday and Friday sessions.**
Emit an `EventSchedule`-based `SportsEvent` block on the homepage and /participer/ page. Enables Google to surface the events in local search and the knowledge panel.

### Medium

**M6. Fix `addressLocality` in the EN page-level LocalBusiness block.**
Change `"addressLocality":"Geneva"` to `"addressLocality":"Genève"` in the contact page EN JSON-LD. Aligns all schema sources on the official Swiss Postal name.

**M7. Add full venue name to `streetAddress` in schema.**
Change `"streetAddress":"La Jonction"` to `"streetAddress":"École de Cité-Jonction, La Jonction"` in `SchemaSportsClub.astro`. Propagates to all 17 pages at build time.

**M8. Begin Google review acquisition.**
Send a review link to existing Meetup members. Target at least one new review every 2 weeks to satisfy the 18-day velocity rule. Respond to every review within 48 hours.

**M9. Submit NAP to local.ch, search.ch, and Swiss Pickleball Federation.**
Use the exact canonical NAP format defined in Section 5. These are the highest-priority Swiss citation sources. Consistent citations on Tier-1 Swiss directories are a top AI-visibility factor in 2026.

### Low

**L10. Translate address display in /en/contact/ body.**
The visible `<address>` element shows "La Jonction, 1205 Genève, Suisse" on the EN page. Update the EN component to render "La Jonction, 1205 Geneva, Switzerland" for language consistency.

---

## Limitations Disclaimer

- **GBP account access unavailable:** GBP listing existence, category, completeness score, photo count, Q&A, post history, and review velocity cannot be audited without account access. All GBP items above are advisory.
- **Live SERP position not checked:** Local pack rankings for "pickleball Genève", "pickleball Geneva", or neighbourhood variants are not assessed. DataForSEO or a logged-out search from a Geneva IP would be required.
- **Meetup page not fetched:** Meetup's authenticated wall prevents auditing member count, event ratings, or photo presence on the group page.
- **Yelp / local.ch citation status unverified:** Citation presence on Swiss directories was not confirmed via live fetch; recommendations are based on directory relevance, not confirmed listing status.
- **Geo precision advisory:** The stored coordinates (46.19916, 6.13186) reverse-geocode to Quai Ernest-Ansermet / Jonction / 1205 Genève — plausible for the La Jonction area. The exact coordinates of École de Cité-Jonction should be confirmed against the school's Google Maps pin and updated if there is a discrepancy of more than ~50 m.
- **Proximity factor:** Approximately 55% of local pack ranking variance is attributable to searcher proximity (Search Atlas ML, 2025). This cannot be optimised on-site; it reinforces the importance of GBP accuracy so Google can confidently pin the exact venue location.
