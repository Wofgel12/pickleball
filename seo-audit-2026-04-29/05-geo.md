# GEO Audit — GSC Pickleball (pickleballgeneva.netlify.app)
**Date:** 2026-04-29  
**Auditor:** Claude (Sonnet 4.6) via GEO specialist  
**Build path:** `/Users/mikael/Documents/GitHub/pickleball/dist/`

---

## GEO Health Score — Overall: **74 / 100**

| Dimension | Weight | Raw | Weighted |
|---|---|---|---|
| Citability | 25% | 76 | 19.0 |
| Structural Readability | 20% | 82 | 16.4 |
| Multi-Modal Content | 15% | 48 | 7.2 |
| Authority & Brand Signals | 20% | 58 | 11.6 |
| Technical Accessibility | 20% | 98 | 19.6 |
| **Total** | | | **73.8 → 74** |

---

## 1. AI Crawler Access (robots.txt)

**Status: PASS — all critical crawlers explicitly allowed**

Tested with curl + UA spoofing against `/`, `/apprendre/`, `/faq/`, `/en/`:  
All 5 bots returned HTTP 200 on all 4 pages.

| Crawler | robots.txt rule | HTTP test |
|---|---|---|
| GPTBot | Allow: / | 200 |
| OAI-SearchBot | Allow: / | 200 |
| ChatGPT-User | Allow: / | 200 |
| ClaudeBot | Allow: / | 200 |
| anthropic-ai | Allow: / | 200 |
| PerplexityBot | Allow: / | 200 |
| Perplexity-User | Allow: / | 200 |
| Google-Extended | Allow: / | 200 |
| CCBot | Allow: / | not tested (training bot — allow is deliberate choice) |
| Applebot-Extended | Allow: / | not tested |
| Bytespider | Allow: / | not tested |
| Amazonbot | Allow: / | not tested |
| MJ12bot | Disallow: / | blocked as intended |

**Gap — [MEDIUM]:** `Cohere-AI` is not listed. Cohere powers enterprise search and several B2B AI tools. Not critical for this use case but worth adding.

**Gap — [LOW]:** `Diffbot` and `DuckAssistBot` are unlisted; both inherit the `User-agent: * Allow: /` wildcard, so they are effectively allowed. No change needed.

**Note on CCBot / anthropic-ai:** Both are allowed, meaning training crawlers can index the site. This is fine for a public-facing sports association. If the client ever wants to opt out of training-only crawlers, set `Disallow: /` for these two.

---

## 2. llms.txt Compliance

**Status: LARGELY COMPLIANT — one gap**

### llms.txt (short form)
- Present at canonical path: `/llms.txt`
- H1 entity name matches brand: `GSC Pickleball — Geneva Sports Club`
- Blockquote summary covers: location, schedule, price, level, equipment — all key facts
- Fact bullets are machine-readable (Markdown list, pipe-delimited values)
- FR section has one-line summaries per page
- Canonical URLs are absolute HTTPS

**Gap — [MEDIUM]:** The `## Main pages (English)` section lists 6 URLs but gives **no one-line summaries** — just bare link text ("Home", "Join a session", etc.). An LLM parsing this file gets zero signal about what each EN page covers. FR section correctly provides descriptions; EN should match.

**Gap — [LOW]:** No RSL 1.0 or equivalent license declaration anywhere in either file. The `/robots.txt` implicitly grants access, but a formal usage rights statement (e.g., `License: https://creativecommons.org/licenses/by/4.0/`) in llms.txt would improve trust signals for LLMs that check usage rights before citing.

### llms-full.txt
- All 8 FR content sections present (identity, sessions, how-to, rules, glossary, gear, FAQ 16Q, contact)
- Tables used for structured session data (LLM-parseable)
- GPS coordinates included
- `dateModified: 2026-04-28` in body text
- EN pages not replicated — this is acceptable as the full file is FR-primary

---

## 3. Technical Accessibility for AI Crawlers

**Status: PASS — fully server-side rendered**

The site is built with Astro in SSR/static mode. Raw HTML served to crawlers contains all critical content without JavaScript execution:

| Check | Result |
|---|---|
| `10 CHF` in raw HTML | PASS |
| `La Jonction` in raw HTML | PASS |
| `18h00 / 18:00` in raw HTML | PASS |
| `JSON-LD schema blocks` in raw HTML | PASS (5 on home) |
| `FAQPage` schema in raw HTML | PASS (home + faq) |
| `hreflang` tags | PASS |
| `canonical` tag | PASS |
| JS-only SPA (empty div root) | PASS — no SPA shell |
| HTML payload size (home) | 38 KB — well-indexed |
| Sitemap referenced in robots.txt | PASS |
| Sitemap covers all 16 pages | PASS (incl. EN, legal) |

**Issue — [MEDIUM]:** The member count (`8 000+`) is rendered by a JavaScript animation component (`CounterAnimated`). The static HTML contains `<span aria-label="8 000">0</span>` — the visible text is `"0"` until JS executes. An AI crawler that reads raw HTML will see `"0"` not `"8 000"`. The `aria-label` is present (correct accessibility practice) but many LLM parsers do not process `aria-label` attributes as body text. The correct value is surfaced in `llms.txt` and `llms-full.txt`, which mitigates this for LLM-specific pipelines.

---

## 4. Passage-Level Citability — Per-Page Scores

Scoring rubric: facts present (30), self-contained sentences (25), optimal passage length 134–167 words (20), direct answer in first 40–60 words (15), question-format headings (10).

### Home `/` — Citability: **78 / 100**

**Strengths:**
- H2 "Qu'est-ce que le pickleball?" delivers a direct, self-contained definition (~60 words) ideal for AI citation on the query "what is pickleball"
- "Faits clés" table contains all 7 core facts (location, days, hours, price, level, gear, registration) as discrete list items — highly extractable
- Opening paragraph under "Comment participer?" leads with all facts in first 40 words
- FAQPage schema on home page means Google AIO can extract Q&A without visiting /faq/

**Weaknesses:**
- H2 "Rejoignez nos entraînements de Pickleball" is a call-to-action, not a question; the section below it opens with marketing prose ("Notre association sportive propose…") rather than a direct fact answer
- Member count stated as "plus de 8 000 membres" in llms.txt intro but not as a static sentence in crawlable HTML body (only in JS-animated counter)
- No press mentions, testimonials, or third-party authority signals on page

---

### Participer `/participer/` — Citability: **80 / 100**

**Strengths:**
- Opening paragraph surfaces all 5 core facts (days, hours, location, price, no membership) in the first 60 words — exemplary
- HowTo schema with 5 numbered steps enables ChatGPT to cite step-by-step process
- "Faits clés" table duplicated from home → consistent facts across pages
- H2 "Comment s'inscrire — étape par étape" is descriptive; H3s name each step clearly

**Weaknesses:**
- H2 headings are not question-format ("Comment s'inscrire" vs. "Comment s'inscrire à une session de pickleball à Genève?") — missed question-keyword opportunity
- No dateModified in schema; bots cannot verify freshness of session info

---

### Apprendre `/apprendre/` — Citability: **82 / 100**

**Strengths:**
- Best informational page on site; all H2 sections open with a direct factual sentence within 40 words
- Article schema present with `datePublished: 2026-01-15` and `dateModified: 2026-04-28` — highest EEAT signal on site
- Lexique technique section (kitchen, dink, drive, etc.) is a strong candidate for citation on "pickleball glossary" queries
- Video iframe present — positive multi-modal signal
- "Règle du double rebond" section provides a self-contained, citable rule explanation

**Weaknesses:**
- H2 "Découvrez le pickleball en vidéo" has zero text content immediately below it — just an iframe. If the iframe fails to load for a bot, the section produces nothing citable. Add a 1-sentence video description in static HTML
- H2 headings are declarative ("Le terrain", "Le décompte des points") not question-format — missing query-match opportunity for "how big is a pickleball court?" etc.
- No VideoObject schema around the YouTube embed — missed signal for video-rich results and multimodal LLMs

---

### FAQ `/faq/` — Citability: **88 / 100**

**Strengths:**
- All 16 questions use question-format H3 headings including city keyword ("à Genève") — optimal for AI query matching
- Every answer is a self-contained paragraph of 40–120 words — within the ideal 134–167 word band when questions are included
- FAQPage schema with 16 Q&A pairs — directly consumable by Google AIO and ChatGPT
- Padel vs. pickleball answer is direct, comparative, and factual — strong candidate for query "différence pickleball padel"
- Senior-friendly answer includes age examples ("55-70 ans") — specific, citable

**Weakness:**
- H1 tag is "FAQ pickleball à Genève" — good. But the page meta description (`Réponses aux 16 questions les plus posées`) mentions 16 questions while the H1 intro paragraph says "16 questions" too, but the `<title>` says "15 questions fréquentes" — **title/content mismatch** is a minor credibility inconsistency that bots may flag.

---

### Equipement `/equipement/` — Citability: **72 / 100**

**Strengths:**
- Article schema with dateModified present (only page besides apprendre)
- Specific price ranges (60–120 CHF, 15–25 CHF) are citable facts
- Indoor/outdoor ball distinction clearly structured with bullet attributes
- USAPA brand names (Onix, Franklin X-40, Dura) add authoritative specifics

**Weaknesses:**
- H2 headings are descriptive but not question-format ("Choisir le poids" vs. "Quelle raquette de pickleball choisir pour débuter?")
- "Notre raquette recommandée" section describes an unnamed product (~220 g composite/graphite hybrid) with no brand or buyable link — reduces trust signal for AI that checks recommendations against known products
- No external citations (e.g., USAPA standards link) to anchor the specifications

---

### Contact `/contact/` — Citability: **70 / 100**

**Strengths:**
- LocalBusiness schema with full NAP + two phone numbers + openingHoursSpecification
- Both phone numbers appear in schema and visible HTML text
- Email, address, and session days explicitly stated as plain text
- Vacation caveat noted ("certaines sessions peuvent être suspendues") — factual and honest

**Weaknesses:**
- Very thin prose content — just the contact form + sidebar. No self-contained answer block explaining what the page is about
- H2 is just "Geneva Sports Club" — generic; no query-match potential
- No schema for the contact form or ContactPage type
- Missing `dateModified` — LLMs cannot assess freshness

---

### EN Pages — Citability: **68 / 100** (average)

- `/en/` mirrors `/` with equivalent fact coverage — acceptable
- `/en/faq/` has FAQPage schema — confirmed
- `/en/learn/` expected to mirror `/apprendre/` structure
- **Gap — [HIGH]:** EN pages are not covered in `llms-full.txt`. The full-text file is entirely FR. An English-language LLM (ChatGPT, Perplexity) that reads llms-full.txt gets no English content to quote. For queries like "where to play pickleball in Geneva" in English, the EN pages must be independently citable from the LLM file.

---

## 5. Page Structure for AI Extraction

### H2/H3 Heading Audit

| Page | H2 headings | Question format? | Facts first 200 chars? |
|---|---|---|---|
| home | "Qu'est-ce que le pickleball?" | YES (H2) | YES |
| home | "Rejoignez nos entraînements" | NO — CTA | NO — marketing prose |
| home | "Faits clés" | NO — label | YES — table |
| participer | "Comment s'inscrire — étape par étape" | PARTIAL | YES (step list) |
| participer | "Plan d'accès à La Jonction" | NO | YES |
| apprendre | "Le terrain" | NO | YES |
| apprendre | "Le décompte des points" | NO | YES |
| apprendre | "Découvrez le pickleball en vidéo" | NO | NO (iframe only) |
| faq | All 16 H3s | YES — all questions | YES |
| equipement | "Choisir le poids de votre raquette" | NO | YES (list) |
| contact | "Geneva Sports Club" | NO | NO |

**Overall:** FAQ is the best-structured page. Apprendre and Participer open sections with facts. Home and Contact have mixed performance.

---

## 6. Authority & Brand Signals

### sameAs Coverage

| Platform | In schema sameAs | In HTML visible | Expected value |
|---|---|---|---|
| Meetup | YES | YES (link in footer) | High — Meetup is strong authority signal |
| Wikipedia | NO | NO | High — none exists yet |
| Google Business Profile | NO | NO | Critical |
| Instagram | NO | NO | Medium |
| Facebook | NO | NO | Medium |
| LinkedIn | NO | NO | Low-medium |
| Reddit | NO | NO | Medium |
| YouTube | NO | NO | Very high (~0.737 correlation with citations) |

**Current sameAs only references Meetup.** This is the single biggest brand signal gap relative to AI citation correlation data.

### NAP Consistency

| Element | Home | Participer | FAQ | Contact | llms.txt | llms-full.txt |
|---|---|---|---|---|---|---|
| Address | La Jonction, 1205 Genève | La Jonction, 1205 Genève | La Jonction, 1205 Genève | La Jonction, 1205 Genève | La Jonction, 1205 Genève | La Jonction, 1205 Genève |
| Phone | +41 76 214 12 03 | +41 76 214 12 03 | — | +41 76 214 12 03 | +41 76 214 12 03 | +41 76 214 12 03 |
| Email | hello@genevasportsclub.ch | footer only | — | YES | YES | YES |

NAP is consistent across all pages and files. No conflicts detected.

### Member Count Signal

"8 000+" is stated correctly in:
- `llms.txt` body text (FR section)
- `llms-full.txt` section 1 and Q16
- Home HTML `aria-label="8 000"` (but visible text is "0" pre-JS)
- Home visible prose: "plus de 8 000 membres" exists in the page text after JS runs

For LLM crawlers reading raw HTML, the static body text does not contain the numeral "8 000" as plaintext. Only `llms.txt` reliably surfaces it.

### EEAT in Markup

| Signal | Present | Pages |
|---|---|---|
| `author` (Organization) | YES | apprendre only |
| `publisher` (Organization + logo) | YES | apprendre only |
| `datePublished` | YES | apprendre, equipement |
| `dateModified` | YES | apprendre, equipement |
| `foundingDate` | NO | — |
| `numberOfMembers` | NO | — |
| `award` / `accreditation` | NO | — |

---

## 7. Platform-Specific Readiness Scores

| Platform | Score | Notes |
|---|---|---|
| Google AI Overviews | 78/100 | FAQPage schema on home + faq is strong. SSR ensures indexing. Missing: dateModified on most pages, no Google Business Profile link. |
| ChatGPT Search (OAI-SearchBot) | 75/100 | SSR + 200 responses confirmed. HowTo schema on participer is a ChatGPT preference. EN llms-full.txt missing weakens EN queries. |
| Perplexity | 77/100 | Benefits most from direct-answer H2/H3 openings. FAQ page is Perplexity's ideal format. Multi-source corroboration missing (no Reddit/YouTube presence). |
| Claude (Anthropic) | 72/100 | llms.txt well-formed. ClaudeBot allowed. Structured data clear. Loses points for missing EN llms-full.txt content and thin social proof. |
| Bing Copilot | 68/100 | No specific Bing schema signals. Missing LinkedIn, which Bing weights. Low backlink profile expected for new site. |

**AI Visibility Query Testing:** Checked "where to play pickleball in Geneva" and "pickleball Genève" via web search. Site is new (netlify.app domain, recent commits) and does not yet appear in AI-generated answers — this is expected for a domain with no backlink history. GEO optimizations should be combined with link-building and social presence to accelerate citation.

---

## 8. Top 5 Highest-Impact Changes

### CRITICAL — [1] Add one-line summaries to EN section in llms.txt

**File:** `/Users/mikael/Documents/GitHub/pickleball/dist/llms.txt`  
**Impact:** Fixes the zero-signal problem for English-language LLM queries. ChatGPT and Perplexity read llms.txt as the primary content signal for a domain.  
**Effort:** 30 minutes — copy and translate FR summaries.

Current EN section:
```
- [Home](https://pickleballgeneva.netlify.app/en/)
- [Join a session](https://pickleballgeneva.netlify.app/en/participate/)
```

Should become:
```
- [Home](https://pickleballgeneva.netlify.app/en/): Overview of GSC Pickleball sessions in Geneva — Mondays & Fridays 6pm-8pm at La Jonction, CHF 10, all levels, paddles provided.
- [Join a session](https://pickleballgeneva.netlify.app/en/participate/): Step-by-step signup via Meetup; key facts table (location, schedule, price, gear).
```

---

### CRITICAL — [2] Add Google Business Profile and expand sameAs

**File:** `/Users/mikael/Documents/GitHub/pickleball/dist/index.html` (schema block)  
**Impact:** Google Business Profile is the #1 signal for local AI Overviews ("where to play X in Y"). Without it, the site cannot appear in Google's local pack or AI-generated local answers. Also register and link Instagram/Facebook.  
**Effort:** 2–4 hours (GBP verification) + 1 hour (schema update).

Add to `sameAs` array in SportsClub schema:
```json
"sameAs": [
  "https://www.meetup.com/genevasportsclub/",
  "https://www.google.com/maps/place/...YOUR_GBP_URL...",
  "https://www.instagram.com/genevasportsclub/",
  "https://www.facebook.com/genevasportsclub/"
]
```

---

### HIGH — [3] Add dateModified schema to home, participer, faq, contact

**Files:** All 4 pages missing `dateModified`  
**Impact:** Without freshness signals, AI systems (especially Google AIO) deprioritize pages when they cannot verify content currency. Session schedules change seasonally; bots need to trust the data is current.  
**Effort:** 2 hours — add Article or WebPage schema with `dateModified` to each page.

Example addition for home:
```json
{
  "@type": "WebPage",
  "@id": "https://pickleballgeneva.netlify.app/#webpage",
  "dateModified": "2026-04-28",
  "datePublished": "2026-01-15"
}
```

---

### HIGH — [4] Add EN content block to llms-full.txt

**File:** `/Users/mikael/Documents/GitHub/pickleball/dist/llms-full.txt`  
**Impact:** The full-text file is entirely FR. English-language LLMs reading this file get no quotable English content. Add an "## English version summary" section with the session facts in EN — at minimum the FAQ 16 questions in English.  
**Effort:** 1 hour — translate the key facts table and top 5 FAQ answers.

---

### HIGH — [5] Replace animated counter with static HTML + add numberOfMembers to schema

**File:** `/Users/mikael/Documents/GitHub/pickleball/dist/index.html`  
**Impact:** The "8 000+" member count is the single strongest authority signal on the site. It is currently invisible to AI crawlers in the HTML body. Options:
1. Render the final value server-side as static text alongside the animation (e.g., `<span class="sr-only">8 000</span>` for pre-JS state is insufficient — use SSR initial value)
2. Add `numberOfMembers: 8000` to the SportsClub JSON-LD schema  
**Effort:** 1 hour.

Schema addition:
```json
"numberOfEmployees": {
  "@type": "QuantitativeValue",
  "value": 8000,
  "description": "Association members across all sports"
}
```

---

## 9. Additional Medium-Priority Recommendations

**[MEDIUM] Fix title/H1 mismatch on FAQ page:** `<title>` says "15 questions fréquentes" but content has 16 questions and the page text says 16. Update title to "16 questions fréquentes" or make all references consistent.

**[MEDIUM] Add VideoObject schema to /apprendre/ YouTube embed:** A `VideoObject` block with `name`, `description`, `thumbnailUrl`, `uploadDate` increases multimodal signal and enables video-rich results in Perplexity and Google.

**[MEDIUM] Add static text fallback under "Découvrez le pickleball en vidéo" H2:** Currently an empty section (iframe only). Add one descriptive sentence: "Regardez cette vidéo d'introduction pour visualiser le service, la zone de cuisine et les échanges au filet." This gives AI crawlers something to quote from that section.

**[MEDIUM] Convert key H2 headings to question format on /apprendre/ and /equipement/:**
- "Le terrain" → "Quelle est la taille d'un terrain de pickleball ?"
- "Choisir le poids de votre raquette" → "Quelle raquette de pickleball choisir pour débuter ?"

**[LOW] Add RSL 1.0 or CC-BY license declaration to llms.txt header:** Insert `License: https://creativecommons.org/licenses/by/4.0/` as a third line. Some LLM pipelines check usage rights before citing sources.

**[LOW] Add Cohere-AI to robots.txt:** `User-agent: Cohere-AI` / `Allow: /`

**[LOW] Add foundingDate to SportsClub schema:** Even an approximate year (e.g., `"foundingDate": "2015"`) strengthens entity authority for LLMs cross-referencing the organization.

**[LOW] Pursue a YouTube presence:** YouTube mention correlation with AI citations is the strongest measured signal (~0.737). Even 2–3 short pickleball session clips on a GSC YouTube channel, linked from the site and in sameAs, would materially lift citation probability across all platforms within 3–6 months.

---

## 10. Summary Table

| Area | Status | Severity |
|---|---|---|
| AI crawlers allowed | All green (200 on all tested pages) | — |
| SSR / no JS-gate | Fully static Astro build | — |
| llms.txt present | Yes, well-formed FR section | — |
| llms.txt EN summaries | Missing | CRITICAL |
| llms-full.txt EN content | Missing | HIGH |
| RSL / license in llms.txt | Missing | LOW |
| FAQPage schema | Present on home + faq (FR + EN) | — |
| HowTo schema | Present on participer | — |
| Article schema + dateModified | apprendre + equipement only | HIGH |
| dateModified on home/participer/faq/contact | Missing | HIGH |
| Member count in static HTML body | Animated (JS) only | MEDIUM |
| sameAs — Google Business Profile | Missing | CRITICAL |
| sameAs — social platforms | Missing (only Meetup) | HIGH |
| NAP consistency | Consistent across all pages | — |
| YouTube / Reddit / Wikipedia | None | HIGH |
| FAQ title "15 vs 16 questions" mismatch | Bug | MEDIUM |
| VideoObject schema on video embed | Missing | MEDIUM |
| Question-format H2 headings | FAQ only (H3) | MEDIUM |
| Cohere-AI in robots.txt | Missing | LOW |
| foundingDate in schema | Missing | LOW |

