# Schema.org Audit — Pickleball Geneva
**Date:** 2026-04-29  
**Build:** `/dist/` (17 HTML files)  
**Live URL:** https://pickleballgeneva.netlify.app  
**Source component:** `src/components/SchemaSportsClub.astro`

---

## 1. Detection Summary

All 17 HTML files contain JSON-LD. No Microdata-only or RDFa-only pages exist, though the footer carries supplementary **Microdata** (`itemscope itemtype="https://schema.org/SportsClub"`) for the address block. This is valid redundancy, not a conflict.

| Page | Blocks | Types present |
|---|---|---|
| `/` | 5 | SportsClub+LocalBusiness, WebSite, BreadcrumbList, Course, FAQPage |
| `/en/` | 5 | SportsClub+LocalBusiness, WebSite, BreadcrumbList, Course, FAQPage |
| `/faq/` | 4 | SportsClub+LocalBusiness, WebSite, BreadcrumbList, FAQPage |
| `/en/faq/` | 4 | SportsClub+LocalBusiness, WebSite, BreadcrumbList, FAQPage |
| `/contact/` | 4 | SportsClub+LocalBusiness, WebSite, BreadcrumbList, LocalBusiness |
| `/en/contact/` | 4 | SportsClub+LocalBusiness, WebSite, BreadcrumbList, LocalBusiness |
| `/participer/` | 4 | SportsClub+LocalBusiness, WebSite, BreadcrumbList, **HowTo** |
| `/en/participate/` | 4 | SportsClub+LocalBusiness, WebSite, BreadcrumbList, **HowTo** |
| `/apprendre/` | 4 | SportsClub+LocalBusiness, WebSite, BreadcrumbList, Article |
| `/equipement/` | 4 | SportsClub+LocalBusiness, WebSite, BreadcrumbList, Article |
| `/en/learn/` | 4 | SportsClub+LocalBusiness, WebSite, BreadcrumbList, Article |
| `/en/gear/` | 4 | SportsClub+LocalBusiness, WebSite, BreadcrumbList, Article |
| `/mentions-legales/` | 3 | SportsClub+LocalBusiness, WebSite, BreadcrumbList |
| `/en/legal-notice/` | 3 | SportsClub+LocalBusiness, WebSite, BreadcrumbList |
| `/politique-confidentialite/` | 3 | SportsClub+LocalBusiness, WebSite, BreadcrumbList |
| `/en/privacy-policy/` | 3 | SportsClub+LocalBusiness, WebSite, BreadcrumbList |
| `/404.html` | 3 | SportsClub+LocalBusiness, WebSite, BreadcrumbList |

---

## 2. Validation Results

### 2.1 JSON Syntax

All 17 files × all blocks: **zero JSON parse errors**. Every block is syntactically valid.

### 2.2 @context

All blocks use `"https://schema.org"` (HTTPS, no trailing slash). **Pass.**

### 2.3 SportsClub + LocalBusiness (global, all pages)

| Field | Value | Status |
|---|---|---|
| @context | https://schema.org | PASS |
| @type | ["SportsClub","LocalBusiness"] | PASS |
| @id | `/#sportsclub` (absolute) | PASS |
| name | Geneva Sports Club | PASS |
| alternateName | ["GSC Pickleball","GSC"] | PASS |
| url | absolute | PASS |
| description | FR/EN per lang | PASS |
| telephone | +41762141203 | PASS |
| email | hello@genevasportsclub.ch | PASS |
| address (PostalAddress) | full, absolute country | PASS |
| geo (GeoCoordinates) | lat/lon present | PASS |
| priceRange | "CHF 10" | PASS |
| openingHoursSpecification | Mon+Fri 18:00-20:00 | PASS |
| sameAs | Meetup URL | PASS |
| areaServed | 4 entries | PASS |
| logo | plain URL string | **WARN** — should be ImageObject |
| contactPoint | absent | INFO — present on contact page only |
| foundingDate | absent | INFO |

**logo is a plain URL string** (`"logo": "https://…/logo-img.png"`). Google's LocalBusiness guidelines recommend `logo` as an `ImageObject` with `url` and `width`/`height`. The current form is technically valid Schema.org but suboptimal for Google Knowledge Panel extraction.

### 2.4 WebSite (all pages)

Present on all 17 pages. Has `name`, `url`, `inLanguage`, `publisher`. Missing `@id` on the WebSite itself and `publisher` references the SportsClub by name only (no `@id` linking back to `/#sportsclub`). **Minor graph coherence issue.**

### 2.5 BreadcrumbList (all pages)

All pages have BreadcrumbList. All items use absolute URLs. Position numbering is sequential from 1.

- Homepage: 1 item (home only) — acceptable.
- 404: 1 item (home only) — acceptable.
- All other pages: 2 items (home → current) — **Pass**.

EN pages correctly root breadcrumbs at `/en/` not `/`. **Pass.**

### 2.6 FAQPage — `/faq/`, `/en/faq/`, `/`, `/en/`

All four pages have FAQPage with full `mainEntity` arrays. FR pages: 15 questions. EN pages: 15 questions. All questions have `name` + `acceptedAnswer.text`. **Valid per Schema.org.**

**Restriction note (INFO):** Google restricted FAQPage rich results to government and healthcare sites (August 2023). This is a commercial/non-profit sports club. FAQPage will **not** generate Google FAQ rich results but **does** benefit AI/LLM citations (ChatGPT, Perplexity, Gemini). Flag as INFO — keep the schema.

FAQPage also appears on the homepage (`/` and `/en/`) as a compact 6-question summary. This is fine — it mirrors a subset of the dedicated FAQ pages.

### 2.7 HowTo — `/participer/`, `/en/participate/`

**CRITICAL:** HowTo rich results were **removed by Google in September 2023**. The `HowTo` blocks on both participate pages produce zero Google rich result value. The schema is syntactically valid but represents dead weight in the SERP. Replace with `Service` (recommended below).

### 2.8 Course — `/`, `/en/`

Schema.org `Course` is still a supported type. Google retired the `CourseInfo` Google-specific extension in June 2025, but `Course` + `CourseInstance` remain valid for rich results.

Issues found:
- `hasCourseInstance` is missing `startDate` — Google Course rich results require either a `startDate` on the instance or at least a `courseSchedule`. The `courseSchedule` (via `Schedule`) is present, but a concrete `startDate` would improve eligibility.
- `provider` has no `@id` — should reference `/#sportsclub` to link entities.
- `educationalLevel` is absent — recommended for richer categorisation.
- `locationCreated` is used instead of `location` on the `CourseInstance` — `CourseInstance` should have `location`, not `locationCreated`.

### 2.9 Article — learn/gear pages (FR + EN)

All four Article blocks pass required-field checks: `headline`, `description`, `image`, `datePublished`, `dateModified`, `author`, `publisher` (with `logo.ImageObject`), `mainEntityOfPage`, `inLanguage`. **Pass.**

Note: `author` is set to `Organization`, not a `Person`. This is acceptable for club editorial content.

### 2.10 LocalBusiness on contact pages

Two separate `LocalBusiness` blocks exist: one at `/contact/#localbusiness` and one at `/en/contact/#localbusiness`. These are **orphaned entities** — they have no `sameAs` or `parentOrganization` linking them to `/#sportsclub`. Crawlers may treat them as distinct businesses.

NAP consistency check:
| Field | `/contact/` | `/en/contact/` |
|---|---|---|
| name | Geneva Sports Club — Pickleball | Geneva Sports Club — Pickleball |
| telephone | +41762141203 | +41762141203 |
| email | hello@genevasportsclub.ch | hello@genevasportsclub.ch |
| addressLocality | **Genève** | **Geneva** (INCONSISTENCY) |

**CRITICAL NAP inconsistency:** `/contact/` uses `"addressLocality": "Genève"` while `/en/contact/` uses `"addressLocality": "Geneva"`. For entity resolution, Google expects the canonical city name to be consistent across all LocalBusiness blocks referring to the same physical location. Use the official French name `Genève` in both, or add `"addressLocality": "Genève"` with an `alternateName` for English.

---

## 3. Gap Analysis

### 3.1 Missing: Event schema for sessions

Sessions occur every Monday and Friday — these are recurring `Event` instances. Currently zero `Event` schema exists anywhere on the site. The `/participer/` and `/en/participate/` pages are the natural location.

**Impact:** Google may surface sessions in the Events SERP feature and in Google Search's AI Overview when users search "pickleball session Geneva this week". This is the **highest-leverage missing schema** given the site's primary conversion goal.

Severity: **HIGH**

### 3.2 HowTo deprecated on participate pages

`HowTo` on `/participer/` and `/en/participate/` delivers no Google rich result benefit. Replace with `Service` schema describing the pickleball session offering, plus `Event` blocks.

Severity: **HIGH**

### 3.3 SportsClub logo not an ImageObject

`logo` is a plain URL string. Google's Knowledge Panel and LocalBusiness documentation explicitly expects `ImageObject` with `url`, `width`, and `height`.

Severity: **MEDIUM**

### 3.4 Contact page LocalBusiness orphaned + NAP mismatch

The `/contact/` and `/en/contact/` `LocalBusiness` blocks are not connected to `/#sportsclub` and have divergent `addressLocality` values (`Genève` vs `Geneva`). Both should include `"sameAs": "https://pickleballgeneva.netlify.app/#sportsclub"` or be replaced by a reference to the canonical entity.

Severity: **MEDIUM**

### 3.5 Course.hasCourseInstance missing `location` and `startDate`

`CourseInstance` should use `location` (not `locationCreated`), and should reference `/#sportsclub` as `organizer`. For Google Course rich results, a `startDate` strengthens eligibility.

Severity: **MEDIUM**

### 3.6 WebSite publisher not linked to canonical @id

`WebSite.publisher` references the organization by name only, not by `@id`. This weakens the entity graph.

Severity: **LOW**

### 3.7 SportsClub missing additional sameAs links

Only Meetup is present in `sameAs`. If the club has an Instagram, Facebook, or a Swiss sports federation profile, those should be added to strengthen entity disambiguation.

Severity: **LOW**

### 3.8 No Event schema for sessions

See 3.1. No pages expose `Event` schema.

### 3.9 WebSite missing `@id`

The `WebSite` block has no `@id`. Best practice: set `"@id": "https://pickleballgeneva.netlify.app/#website"`.

Severity: **LOW**

---

## 4. NAP Consistency Summary

| Field | All pages (global SportsClub) | /contact/ LocalBusiness | /en/contact/ LocalBusiness |
|---|---|---|---|
| name | Geneva Sports Club | Geneva Sports Club — Pickleball | Geneva Sports Club — Pickleball |
| telephone | +41762141203 | +41762141203 | +41762141203 |
| email | hello@genevasportsclub.ch | hello@genevasportsclub.ch | hello@genevasportsclub.ch |
| addressLocality | Genève | Genève | **Geneva** ← fix |
| postalCode | 1205 | 1205 | 1205 |
| streetAddress | La Jonction | La Jonction | La Jonction |
| geo lat | 46.19916 | 46.19916 | 46.19916 |
| geo lon | 6.13186 | 6.13186 | 6.13186 |

One inconsistency: EN contact `addressLocality`. All other NAP fields are consistent across 17 pages.

---

## 5. Recommended JSON-LD Additions

### Fix A — SportsClub: logo as ImageObject + WebSite @id
*Apply in `SchemaSportsClub.astro` and the BaseLayout WebSite block.*

In `SchemaSportsClub.astro`, change:
```js
logo: site + '/logo-img.png',
```
to:
```js
logo: {
  '@type': 'ImageObject',
  url: site + '/logo-img.png',
  width: 400,
  height: 400,
},
```
(Adjust `width`/`height` to match the actual pixel dimensions of `logo-img.png`.)

In the `WebSite` block (BaseLayout), add `@id` and link publisher:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://pickleballgeneva.netlify.app/#website",
  "name": "GSC Pickleball — Geneva Sports Club",
  "url": "https://pickleballgeneva.netlify.app/",
  "inLanguage": ["fr-CH", "en-GB"],
  "publisher": {
    "@type": "SportsClub",
    "@id": "https://pickleballgeneva.netlify.app/#sportsclub",
    "name": "Geneva Sports Club",
    "url": "https://pickleballgeneva.netlify.app/"
  }
}
```

---

### Fix B — Contact pages: fix NAP + link to canonical entity
*Apply to `ContactContent.astro` or the EN contact page source.*

Replace the standalone `LocalBusiness` on `/en/contact/` with the corrected block (use `Genève` not `Geneva`, add `sameAs`):

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://pickleballgeneva.netlify.app/en/contact/#localbusiness",
  "name": "Geneva Sports Club — Pickleball",
  "url": "https://pickleballgeneva.netlify.app/en/contact/",
  "sameAs": "https://pickleballgeneva.netlify.app/#sportsclub",
  "email": "hello@genevasportsclub.ch",
  "telephone": "+41762141203",
  "image": "https://pickleballgeneva.netlify.app/og-pickleball-geneve.jpg",
  "priceRange": "CHF 10",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "La Jonction",
    "addressLocality": "Genève",
    "postalCode": "1205",
    "addressRegion": "GE",
    "addressCountry": "CH"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 46.19916,
    "longitude": 6.13186
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Monday", "opens": "18:00", "closes": "20:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "18:00", "closes": "20:00" }
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "hello@genevasportsclub.ch",
      "telephone": "+41762141203",
      "availableLanguage": ["fr", "en"]
    },
    {
      "@type": "ContactPoint",
      "contactType": "sessions",
      "telephone": "+41788826810",
      "availableLanguage": ["fr", "en"]
    }
  ]
}
```

Same fix for `/contact/` — add `"sameAs": "https://pickleballgeneva.netlify.app/#sportsclub"` to the FR block.

---

### Fix C — Replace HowTo with Service on participate pages
*Apply to `ParticipateContent.astro` or page-level schema.*

Remove the `HowTo` block. Replace with:

**FR (`/participer/`):**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://pickleballgeneva.netlify.app/participer/#service",
  "name": "Sessions de pickleball à Genève",
  "serviceType": "Sport récréatif",
  "description": "Sessions hebdomadaires de pickleball ouvertes à tous les niveaux, lundi et vendredi 18h-20h à La Jonction, Genève. Raquettes fournies, 10 CHF par session.",
  "provider": {
    "@type": "SportsClub",
    "@id": "https://pickleballgeneva.netlify.app/#sportsclub",
    "name": "Geneva Sports Club"
  },
  "areaServed": {
    "@type": "City",
    "name": "Genève"
  },
  "offers": {
    "@type": "Offer",
    "price": 10,
    "priceCurrency": "CHF",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-01-01"
  },
  "serviceOutput": {
    "@type": "Thing",
    "name": "Partie de pickleball"
  }
}
```

**EN (`/en/participate/`):** Same structure, translate `name`, `description`, `serviceType` to English. Set `"@id"` to `…/en/participate/#service`.

---

### New D — Event schema on participate pages (highest-leverage addition)
*Add to `ParticipateContent.astro` alongside the Service block.*

Use two recurring `Event` blocks (one per day). Since sessions are genuinely recurring, use `eventSchedule` with `Schedule`:

**FR Monday session:**
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "@id": "https://pickleballgeneva.netlify.app/participer/#event-monday",
  "name": "Session de pickleball — Lundi soir",
  "description": "Session hebdomadaire de pickleball à Genève, tous niveaux bienvenus. Raquettes fournies, 10 CHF sur place.",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "inLanguage": "fr",
  "organizer": {
    "@type": "SportsClub",
    "@id": "https://pickleballgeneva.netlify.app/#sportsclub",
    "name": "Geneva Sports Club",
    "url": "https://pickleballgeneva.netlify.app/"
  },
  "location": {
    "@type": "Place",
    "name": "La Jonction — Geneva Sports Club",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "La Jonction",
      "addressLocality": "Genève",
      "postalCode": "1205",
      "addressRegion": "GE",
      "addressCountry": "CH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 46.19916,
      "longitude": 6.13186
    }
  },
  "offers": {
    "@type": "Offer",
    "price": 10,
    "priceCurrency": "CHF",
    "availability": "https://schema.org/InStock",
    "url": "https://www.meetup.com/genevasportsclub/"
  },
  "eventSchedule": {
    "@type": "Schedule",
    "byDay": "https://schema.org/Monday",
    "startTime": "18:00",
    "endTime": "20:00",
    "duration": "PT2H",
    "scheduleTimezone": "Europe/Zurich",
    "repeatFrequency": "P1W",
    "startDate": "2026-01-06",
    "endDate": "2026-12-31"
  },
  "image": "https://pickleballgeneva.netlify.app/og-pickleball-geneve.jpg",
  "url": "https://www.meetup.com/genevasportsclub/"
}
```

**FR Friday session** — identical but:
- `"@id"`: `…/participer/#event-friday`
- `"name"`: `"Session de pickleball — Vendredi soir"`
- `"eventSchedule.byDay"`: `"https://schema.org/Friday"`
- `"eventSchedule.startDate"`: `"2026-01-03"`

**EN versions** on `/en/participate/`: same structure, translate `name`/`description`, set `@id` to `/en/participate/#event-monday` and `#event-friday`, set `"inLanguage": "en"`.

---

### Fix E — Course: fix CourseInstance.location + link provider @id
*Apply to the Course block in the homepage schema (FR and EN).*

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Cours de Pickleball à Genève",
  "description": "Sessions hebdomadaires de pickleball à Genève (La Jonction), lundi et vendredi 18h-20h, 10 CHF par session, équipement fourni.",
  "provider": {
    "@type": "SportsClub",
    "@id": "https://pickleballgeneva.netlify.app/#sportsclub",
    "name": "Geneva Sports Club",
    "url": "https://pickleballgeneva.netlify.app/"
  },
  "courseMode": "onsite",
  "inLanguage": "fr",
  "availableLanguage": ["fr", "en"],
  "offers": {
    "@type": "Offer",
    "price": 10,
    "priceCurrency": "CHF",
    "availability": "https://schema.org/InStock"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "onsite",
    "startDate": "2026-01-06",
    "location": {
      "@type": "Place",
      "name": "La Jonction, Genève",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Genève",
        "addressRegion": "GE",
        "addressCountry": "CH"
      }
    },
    "organizer": {
      "@type": "SportsClub",
      "@id": "https://pickleballgeneva.netlify.app/#sportsclub",
      "name": "Geneva Sports Club"
    },
    "courseSchedule": {
      "@type": "Schedule",
      "byDay": [
        "https://schema.org/Monday",
        "https://schema.org/Friday"
      ],
      "startTime": "18:00",
      "endTime": "20:00",
      "duration": "PT2H",
      "scheduleTimezone": "Europe/Zurich"
    }
  }
}
```

---

## 6. Priority Action List

| Priority | Issue | Fix | Pages affected |
|---|---|---|---|
| CRITICAL | HowTo deprecated (no Google rich result) | Replace with Service + Event | /participer/, /en/participate/ |
| CRITICAL | NAP mismatch: addressLocality "Geneva" vs "Genève" | Use "Genève" in EN contact | /en/contact/ |
| HIGH | No Event schema for recurring sessions | Add Event blocks (Fix D) | /participer/, /en/participate/ |
| MEDIUM | logo is plain URL, not ImageObject | Fix A in SchemaSportsClub.astro | All pages (global) |
| MEDIUM | Contact LocalBusiness orphaned (no sameAs to #sportsclub) | Fix B | /contact/, /en/contact/ |
| MEDIUM | Course.hasCourseInstance uses locationCreated + no startDate | Fix E | /, /en/ |
| LOW | WebSite has no @id, publisher not linked by @id | Fix A (WebSite block) | All pages |
| LOW | Article author/publisher not linked to #sportsclub @id | Add @id to author/publisher Organization | /apprendre/, /equipement/, /en/learn/, /en/gear/ |
| INFO | FAQPage on commercial site — no Google rich results | Keep for AI/LLM citation value | /faq/, /en/faq/, /, /en/ |

---

*All JSON validated with `python3 -c "import json; json.loads(...)"`. Zero parse errors across 17 pages × all blocks.*
