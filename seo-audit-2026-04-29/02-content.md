# 02 — Content Quality Audit
**Site:** GSC Pickleball — Geneva Sports Club (pickleballgeneva.netlify.app)
**Audited:** 2026-04-29
**Auditor:** Content Quality (E-E-A-T / Sept 2025 QRG)
**Scope:** 16 live HTML pages (8 FR canonical + 8 EN mirror) + llms.txt / llms-full.txt

---

## 1. Overall Content Quality Score

| Dimension | Score (0–100) |
|---|---|
| E-E-A-T (weighted) | **68 / 100** |
| AI Citation Readiness | **82 / 100** |
| Keyword Optimisation | **76 / 100** |
| Readability (FR) | **74 / 100** |
| Heading Structure | **80 / 100** |
| Image Alt Coverage | **100 / 100** |
| **Composite** | **78 / 100** |

---

## 2. E-E-A-T Breakdown

### 2.1 Experience — 6 / 10
**Weight: 20% → weighted contribution: 12 / 20**

Positive signals:
- Real Google reviews embedded on the home page (4 reviews visible with timestamps, all 5-star, dated April 2026). Authors have profile photos.
- "8 000 membres" figure is cited and linked to the Meetup member page — verifiable claim.
- Specific venue name (École de Cité-Jonction, La Jonction) gives first-hand placement specificity.
- FAQ answer for seniors explicitly notes "plusieurs membres GSC ont 55-70 ans" — personal community observation.

Gaps:
- No named human author on any page. All schema `author` fields point to the Organisation, not a person.
- No first-person narrative or coach/organiser bio anywhere on the site.
- No photos of actual sessions at La Jonction (images appear to be stock / purchased; alt text says "session indoor à Genève" but there is no indication these are original).
- No testimonials page, no Meetup attendance numbers shown on-page, no play-count milestones.

### 2.2 Expertise — 7 / 10
**Weight: 25% → weighted contribution: 17.5 / 25**

Positive signals:
- Pickleball rules are technically accurate (court dimensions 6.10 × 13.41 m, net heights 91/86 cm, double-bounce rule, 3-number score call format).
- Lexique technique section on /apprendre/ uses correct anglophone terms (kitchen, dink, drive, third-shot drop, ATP, stacking) with accurate definitions.
- Equipment guide correctly distinguishes graphite vs composite vs wood, indoor (26-hole) vs outdoor (40-hole) balls, and USAPA-approved brands.
- FAQ answer on padel vs pickleball distinction is accurate and useful.
- Schema `Article` on /apprendre/ and /equipement/ includes `datePublished` and `dateModified`.

Gaps:
- No author credential — impossible for Google to attribute expertise to a named expert.
- "scientifiquement prouvé" (health claim on homepage) links to a Men's Health article, not a peer-reviewed source. Weak citation for a health benefit claim.
- Equipment guide does not cite any specific raquette testing or hands-on experience beyond generic advice — reads as compiled rather than practitioner-authored.

### 2.3 Authoritativeness — 5 / 10
**Weight: 25% → weighted contribution: 12.5 / 25**

Positive signals:
- Meetup profile link (`sameAs`) is the primary external verification point.
- Google Business Profile is implied by the embedded Google reviews and Maps URI in the HTML.
- llms-full.txt is a substantive, well-structured knowledge base that could feed AI citations.

Gaps:
- Only one `sameAs` reference (Meetup). No Facebook page, Instagram, Swiss sports federation membership, or local press mentions linked from schema or on-page.
- No external sites link to this site (cannot verify from HTML alone, but no press/media mentions are referenced on-page).
- No association registration number (e.g., RC Genève) despite the Mentions Légales page — the legal page says "association" but gives no registration number, weakening trust for Swiss regulatory context.
- No backlink-worthy content (no original research, no statistics sourced here first).

### 2.4 Trustworthiness — 7 / 10
**Weight: 30% → weighted contribution: 21 / 30**

Positive signals:
- HTTPS enforced (Netlify).
- Email, two phone numbers, and postal address are published on /contact/ and in footer.
- Mentions légales page exists and names "Geneva Sports Club" as publisher.
- Politique de confidentialité is substantive (1,016 words FR) and covers GDPR-level obligations.
- Canonical tags, hreflang reciprocals, and sitemap are all correctly implemented.
- `"Dernière mise à jour : 28 avril 2026"` footer timestamp shows active maintenance.

Gaps:
- Mentions légales omits the association's formal registration number (numéro de RC or RCE). Without it the legal notice is legally incomplete for a Swiss association under cantonal law, and Google's QRG flags missing or incomplete legal info as a trust negative.
- Contact page (FR) has no embedded map. Text only gives "La Jonction, 1205 Genève" — a Google Maps iframe would strengthen local trust signals.
- Contact page has no contact form. Only bare email and phone numbers. This is acceptable for a small club but reduces conversion and trust for first-time visitors.
- Privacy policy does not name a specific Data Protection Officer (DPO) or supervisory authority, which is expected under the Swiss nFADP (in force Sept 2023).

---

## 3. Title + Meta Description Per-Page Table

| Page (FR) | Title | Title chars | Keyword present | Grade | Meta desc | Desc chars | Grade |
|---|---|---|---|---|---|---|---|
| / (Home) | Pickleball Genève — Cours & Sessions \| GSC Pickleball | 57 | pickleball Genève | A | Cours de pickleball à Genève (La Jonction), lundi & vendredi 18h-20h, 10 CHF… | 159 | A |
| /participer/ | Participer à une session de Pickleball à Genève — GSC | 53 | pickleball Genève | A | Inscrivez-vous en 5 étapes via Meetup… | 157 | A |
| /apprendre/ | Apprendre le Pickleball — Règles & Technique \| Genève | 57 | pickleball Genève | A | Apprenez les règles du pickleball… Guide complet pour débuter à Genève | 153 | A |
| /equipement/ | Équipement Pickleball — Guide Raquettes & Balles 2026 | 57 | pickleball | B+ | Guide pour choisir votre raquette… Recommandations balles indoor/outdoor pour Genève | 148 | A |
| /faq/ | FAQ Pickleball Genève — 15 questions fréquentes | 47 | pickleball Genève | A | Réponses aux questions sur le pickleball à Genève… | 150 | A |
| /contact/ | Contact Pickleball Genève — Geneva Sports Club | 46 | pickleball Genève | A | Contactez Geneva Sports Club pour le pickleball à Genève… | 152 | A |
| /mentions-legales/ | Mentions légales — GSC Pickleball Genève | 40 | GSC Pickleball Genève | C | Mentions légales du site Geneva Sports Club Pickleball… | 148 | B |
| /politique-confidentialite/ | Politique de confidentialité — GSC Pickleball Genève | 52 | n/a (utility) | n/a | Politique de confidentialité du site… vos droits, contact | 141 | B |

| Page (EN) | Title | Title chars | Keyword present | Grade | Meta desc | Desc chars | Grade |
|---|---|---|---|---|---|---|---|
| /en/ | Pickleball Geneva — Lessons & Sessions \| GSC Pickleball | 59 | pickleball Geneva | A | Pickleball sessions in Geneva (La Jonction), Monday & Friday 6pm-8pm, CHF 10… | 152 | A |
| /en/participate/ | Join a Pickleball Session in Geneva — GSC Pickleball | 52 | pickleball Geneva | A | Register via Meetup in 5 steps… All levels welcome | 142 | A |
| /en/learn/ | Learn Pickleball — Rules & Technique \| Geneva | 49 | pickleball Geneva | A | Learn pickleball rules: court, serve, kitchen… beginner guide for Geneva | 145 | A |
| /en/gear/ | Pickleball Gear — Paddle & Ball Buying Guide 2026 | 53 | pickleball | B+ | Pickleball paddle buying guide… Indoor/outdoor ball recommendations for Geneva | 141 | A |
| /en/faq/ | Pickleball Geneva FAQ — 15 frequent questions | 45 | pickleball Geneva | A | Pickleball Geneva FAQ: prices, levels… everything you need to know | 152 | A |
| /en/contact/ | Contact — Geneva Sports Club Pickleball | 39 | pickleball Geneva | B | Contact Geneva Sports Club for pickleball in Geneva… | 142 | A |
| /en/legal-notice/ | Legal Notice — GSC Pickleball Geneva | 36 | n/a | n/a | Legal notice for the Geneva Sports Club Pickleball website… | 144 | B |
| /en/privacy-policy/ | Privacy Policy — GSC Pickleball Geneva | 38 | n/a | n/a | Privacy policy for the Geneva Sports Club Pickleball website… | 127 | B |

**Notes:**
- All commercial pages are within the 50–60 character sweet spot for titles.
- All meta descriptions are within Google's displayed range (120–160 chars). No truncation risk.
- /equipement/ and /en/gear/ omit "Genève / Geneva" from the title — missed geo-modifier for local intent.
- /en/contact/ title drops "pickleball" — weaker than FR equivalent.
- FAQ title says "15 questions" but the page/llms-full.txt reference 16 questions. Inconsistency.

---

## 4. Word Count + Thin Content

Content minimums applied: Homepage 500 w, Service pages 800 w, Blog/Guide 1,500 w, Contact/Legal 300 w.
Word counts are raw token counts from stripped HTML (includes nav/footer boilerplate, ~100–150 words per page).

| Page | Raw WC | Est. body-only WC | Minimum | Status |
|---|---|---|---|---|
| FR / | 939 | ~780 | 500 | Pass |
| FR /participer/ | 714 | ~560 | 800 | **FAIL — thin** |
| FR /apprendre/ | 993 | ~840 | 1,500 (guide) | **BORDERLINE** |
| FR /equipement/ | 635 | ~480 | 800 | **FAIL — thin** |
| FR /faq/ | 2,814 | ~2,650 | 1,500 | Pass (strong) |
| FR /contact/ | 374 | ~220 | 300 | Pass (utility) |
| FR /mentions-legales/ | 672 | ~520 | 300 | Pass (utility) |
| FR /politique-confidentialite/ | 1,016 | ~860 | 300 | Pass (utility) |
| EN /en/ | 838 | ~680 | 500 | Pass |
| EN /en/participate/ | 657 | ~510 | 800 | **FAIL — thin** |
| EN /en/learn/ | 889 | ~740 | 1,500 (guide) | **BORDERLINE** |
| EN /en/gear/ | 564 | ~420 | 800 | **FAIL — thin** |
| EN /en/faq/ | 2,374 | ~2,220 | 1,500 | Pass |
| EN /en/contact/ | 356 | ~210 | 300 | Pass (utility) |
| EN /en/legal-notice/ | 620 | ~480 | 300 | Pass |
| EN /en/privacy-policy/ | 927 | ~780 | 300 | Pass |

**Summary of thin-content pages (4 FR + 4 EN):**
- /participer/ and /en/participate/ (~560/510 body words): The 5-step Meetup registration process is well-structured but very brief. There is no content about what to expect at a session, typical participant profiles, or what happens after you arrive.
- /equipement/ and /en/gear/ (~480/420 body words): The buying guide is skeletal. No price ranges, no specific product comparisons, no brand review details. Borderline for a "guide" page type.
- /apprendre/ and /en/learn/ (~840/740 body words): For a rules + technique guide, these are underweight. The rules sections are accurate but short. A 1,500-word target would require adding: common beginner mistakes (already hinted), drills, scoring examples, and strategy basics.

---

## 5. Heading Structure

### FR Pages

| Page | H1 | H2 count | H3 count | Issues |
|---|---|---|---|---|
| / | "Venez jouer au Pickleball à Genève" | 3 (Qu'est-ce que…, Rejoignez…, Faits clés) | 3 (feature cards) | None. H2s are logical and topically distinct. |
| /participer/ | "Participer à une session de pickleball à Genève" | 3 (Comment s'inscrire, Plan d'accès, Faits clés) | 5 (each step is H3) | None. |
| /apprendre/ | "Apprendre le pickleball à Genève" | 7 (terrain, scoring, rebond, vidéo, lexique, équipement, fautes, format) | 0 | No H3s — the H2-only flat structure works for this length, but longer content expansion would need H3 nesting. |
| /equipement/ | "Équipement de pickleball : raquettes & balles" | 4 (poids, matériaux, recommandée, balles) | 0 | Flat structure acceptable at current word count. |
| /faq/ | "FAQ pickleball à Genève" | 16 (one per FAQ question) | 0 | Each FAQ Q is an H2. Correct for FAQPage schema. However, 16 H2s on one page without any grouping into H3 subcategories can feel overwhelming and misses topical clustering. |
| /contact/ | "Contact — Geneva Sports Club Pickleball" | 1 (Geneva Sports Club) | 0 | Very sparse. Only 1 H2 on a functional page — acceptable. |

**H1 uniqueness:** All H1s are unique across the site. No duplicate H1s detected between FR and EN (EN H1s are translations, not copies).

**Issue — FAQ FAQ title count discrepancy:** H1 on /faq/ says "FAQ pickleball à Genève" (no number), title tag says "15 questions fréquentes", but llms-full.txt lists 16 questions. Inconsistency affects snippet trustworthiness.

### EN Pages
Mirror structure of FR. No heading issues beyond those inherited from FR originals.

---

## 6. Readability (French Content)

**Assessment method:** Manual analysis of sentence length, vocabulary, and jargon density.

**Overall FR readability: Good for a sports community site.** The writing is clear, direct, and uses accessible vocabulary. The informal register ("À vos raquettes — on s'occupe du reste!") is appropriate for the audience (recreational players, mixed age/background).

Specific observations:

- **Home page:** Short paragraphs, 1–2 sentences each. Bullet-point Faits clés block is scannable. One paragraph is longer ("Notre association sportive propose deux sessions…", ~60 words) but still within acceptable length.
- **/apprendre/:** Rule explanations are clear. Technical terms (cuisine, dink, third-shot drop) are defined in context or in the Lexique section. No jargon left unexplained.
- **/equipement/:** Short, scannable paragraphs. The weight table format (< 210g, 210–230g, > 230g) is efficient. Plain language.
- **/faq/:** Questions are in natural spoken French. Answers average 2–4 sentences each. Appropriate for FAQ content.
- **/participer/:** Slightly formal in the step-by-step section ("Accéder à la page de l'association") — could be more conversational.

**Concerns:**
- One external link claims health benefits are "scientifiquement prouvé" but the citation is to a consumer magazine (Men's Health), not a study. Risk: a Quality Rater may flag this as an unsupported claim pointing to a low-authority source.
- "8 000 membres" is claimed on the homepage with a link to Meetup members — the number should be periodically verified against the live Meetup profile.

---

## 7. AI Citation Readiness

**AI Citation Readiness Score: 82 / 100**

### 7.1 llms.txt
Exists at `/dist/llms.txt`. Well-structured with:
- Key facts block (location, schedule, price, payment, equipment, registration)
- Contact details (email + two phone numbers)
- Organised page links for both FR and EN
- Brief organisational context

Verdict: Suitable for AI crawlers. Concise, factual, linkable. Would score well in AI overview extraction.

### 7.2 llms-full.txt
Exists at `/dist/llms-full.txt`. Excellent — comprehensive 9-section knowledge base:
- Section 1: Identity (name, type, GPS coordinates)
- Section 2: Session facts in tabular format
- Section 3: 5-step registration process
- Section 4: Rules (court, net, kitchen, serve, scoring)
- Section 5: Glossary (8 terms with definitions)
- Section 6: Equipment buying guide
- Section 7: 16 FAQ Q&A pairs — all citable
- Section 8: Contact details
- Section 9: Language/version notes + last revision date

**Strengths:** GPS coordinates present (46.19916, 6.13186), payment methods named, all key facts deduplicated and consistent across sections.

**Gaps in AI Citation Readiness:**

| Gap | Impact |
|---|---|
| No `dateModified` in llms.txt itself (only in llms-full.txt footer) | LLMs may not know when facts were last verified |
| FAQ count discrepancy (title says 15, content has 16) | Could cause contradictory AI citations |
| No official association registration number | LLMs cannot confirm legal entity to AI queries about club legitimacy |
| No explicit "sessions may be cancelled during school holidays" language in llms.txt summary | LLMs may cite fixed schedule and mislead users about holiday availability |
| `areaServed` includes Lausanne but no Lausanne-specific content exists | Overstated geographic reach; could generate misleading AI responses |

### 7.3 On-page citation readiness (per page)

| Page | Location | Schedule | Price | Contact | Verdict |
|---|---|---|---|---|---|
| / | Yes (footer + Faits clés) | Yes (lundi & vendredi 18h-20h) | Yes (10 CHF) | Yes (email + phones) | Excellent |
| /participer/ | Yes | Yes | Yes | Partial (Meetup link, no email on page) | Good |
| /apprendre/ | Implicit (Genève in H1) | No | No | No | Poor for citation |
| /equipement/ | Partial | No | No | No | Poor for citation |
| /faq/ | Yes (Q3, Q4) | Yes (Q4) | Yes (Q2) | Indirect | Good |
| /contact/ | Yes | Yes | Indirect | Excellent | Excellent |

**Recommendation:** /apprendre/ and /equipement/ should each include a brief "factbox" at the top or bottom naming the club, location, and linking to /contact/ — this makes them citation-ready for AI responses about "pickleball in Geneva."

---

## 8. Duplicate / Near-Duplicate Content

### 8.1 FR ↔ EN Content Parity

| Page | FR words (body est.) | EN words (body est.) | Delta | Risk |
|---|---|---|---|---|
| Home | ~780 | ~680 | -13% | Low — translation naturally shorter in EN |
| Participer / Participate | ~560 | ~510 | -9% | Low |
| Apprendre / Learn | ~840 | ~740 | -12% | Low |
| Equipement / Gear | ~480 | ~420 | -13% | Low |
| FAQ | ~2,650 | ~2,220 | -16% | Medium — some FR content missing from EN |
| Contact | ~220 | ~210 | -5% | Low |

The EN pages are consistent translations — not machine-translated in a detectable way, register is appropriate, and local details (CHF, La Jonction) are preserved. The larger FAQ delta (16% fewer EN words) suggests some FR FAQ answers were summarised more aggressively in EN, which is acceptable for a mirror.

**Hreflang** is correctly implemented on all pages checked. Canonical signals point to FR pages as default (x-default = FR root). No self-referencing canonical errors found.

### 8.2 Cross-Page Duplicate Risks

- **"Faits clés" block** appears on both /index.html and /participer/index.html with the same content (location, hours, price). This is acceptable duplication (it serves user intent on both pages) but may dilute the signal for /participer/ in competitive queries.
- The global `SportsClub` / `LocalBusiness` JSON-LD block is injected identically on every page. This is technically correct practice for sitewide schema anchoring, but the sheer volume of identical boilerplate (the same ~800-character JSON-LD block on all 16 pages) slightly inflates apparent "duplicate content" in raw HTML diffs.
- No page-to-page near-duplicate body copy detected. Each page has a distinct primary subject.

---

## 9. Internal Linking + Anchor Text Quality

**Navigation:** All 6 core pages (Accueil, Participer, Apprendre, Équipement, FAQ, Contact) are linked in the top nav on every page. Apprendre and Équipement are grouped under a "Le Pickleball" dropdown.

**Footer links:** Participer, Apprendre, Équipement, FAQ, Contact — duplicates nav, standard practice.

**In-body links found:**

| Source page | Anchor text | Target | Quality |
|---|---|---|---|
| / | "Nos sessions" | /participer/ | Good — descriptive |
| / | "Comment participer ?" | /participer/ | Good |
| / | "Rejoindre l'une de nos sessions" | /participer/ | Good |
| / | "scientifiquement prouvé" | external (Men's Health) | Weak (low-authority external) |
| /apprendre/ | none found in body content | — | Missing — no in-content CTAs |
| /equipement/ | none found in body content | — | Missing |
| /faq/ | Q12 mentions guide d'équipement | implied /equipement/ | No actual link in FAQ answer |
| /contact/ | "Meetup" | Meetup external | OK |

**Gaps:**
- /apprendre/ has no in-body CTA or contextual link to /participer/ or /equipement/. A reader finishing the rules guide has no logical next step offered within the content.
- /equipement/ has no link to /apprendre/ (lexique) or /participer/. Another dead-end in terms of journey.
- FAQ Q12 ("Où acheter une raquette?") mentions "notre guide d'équipement" but the answer does not hyperlink to /equipement/. This is a missed internal link.
- No page links to the Mentions légales or Politique de confidentialité from the body (footer only) — acceptable.

---

## 10. Image Alt Coverage

**Total `<img>` tags across all 16 HTML pages: 23**
**Missing alt attribute (no `alt` at all): 0**
**Empty alt attribute (`alt=""`): 0**

All images have non-empty, descriptive alt text. Examples:
- "Joueur frappant une balle de pickleball lors d'une session indoor à Genève"
- "Schéma d'un terrain de pickleball avec dimensions et zones de jeu"
- "Raquette de pickleball recommandée pour jouer à Genève"
- "Balles de pickleball indoor et outdoor"
- "Logo Geneva Sports Club Pickleball" (used 17 times — same logo in nav on each page)

**Alt text quality:** All alts are descriptive and geo-contextualised where relevant. The logo alt "Logo Geneva Sports Club Pickleball" is appropriate and consistent across all 17 instances.

No alt coverage issues to flag. This is a strength of the site.

---

## 11. AI-Generated Content Assessment (Sept 2025 QRG)

The content shows a **mixed profile**: factual sections (rules, glossary, FAQ answers) are specific and accurate. Some marketing sections (feature cards on home, CTA paragraphs) show generic phrasing patterns.

| Signal | Status |
|---|---|
| Generic phrasing ("Accessible à tous les âges et niveaux, progressez rapidement!") | Present — low impact for utility, acceptable for marketing |
| Specific, verifiable facts | Strong (dimensions, prices, phone numbers, GPS coords) |
| Original insight or unique perspective | Weak — no original research, no named expert voice |
| First-hand experience signals | Partial — real Google reviews embedded, but no staff narrative |
| Factual accuracy | High — rules and equipment specs are correct |
| Repetitive structure across pages | Low risk — pages have distinct purposes |
| Helpful Content alignment (March 2024) | Pass — content is written for the user, not search engines |

**Verdict:** The site does not exhibit the primary QRG markers of low-quality AI content (factual errors, keyword stuffing, meaningless filler). The main risk is generic marketing prose on feature cards that adds nothing beyond what any similar sports club site would say. The FAQ and /apprendre/ pages are the highest-quality content and would score well in any core update assessment.

---

## 12. Per-Page Summary Table

| Page | Word Count | Title Grade | E-E-A-T Signal | Thin Risk | AI Citation | Priority |
|---|---|---|---|---|---|---|
| FR / | 939 | A | Good (reviews, facts) | None | Excellent | Maintain |
| FR /participer/ | 714 | A | Moderate | Medium | Good | Expand |
| FR /apprendre/ | 993 | A | Moderate | Low-Medium | Poor | Expand + add factbox |
| FR /equipement/ | 635 | B+ | Moderate | Medium | Poor | Expand + add factbox |
| FR /faq/ | 2,814 | A | Good | None | Good | Fix count inconsistency |
| FR /contact/ | 374 | A | Good (contact info) | None (utility) | Excellent | Add map embed |
| FR /mentions-legales/ | 672 | C | Weak (no reg. number) | None (utility) | Low | Add registration no. |
| FR /politique-confidentialite/ | 1,016 | n/a | Good | None | n/a | Add nFADP DPO mention |
| EN /en/ | 838 | A | Good | None | Excellent | Maintain |
| EN /en/participate/ | 657 | A | Moderate | Medium | Good | Expand (mirror FR) |
| EN /en/learn/ | 889 | A | Moderate | Low-Medium | Poor | Expand + add factbox |
| EN /en/gear/ | 564 | B+ | Moderate | Medium | Poor | Expand (mirror FR) |
| EN /en/faq/ | 2,374 | A | Good | None | Good | Fix count inconsistency |
| EN /en/contact/ | 356 | B | Good | None | Good | Add map embed |
| EN /en/legal-notice/ | 620 | n/a | Weak | None | Low | Mirror FR fix |
| EN /en/privacy-policy/ | 927 | n/a | Good | None | n/a | Mirror FR fix |

---

## 13. Severity-Tagged Findings

### Critical

None identified. No factual errors, no broken canonical chains, no missing legal pages.

### High

**H-01 — Thin content on /participer/ and /equipement/ (FR + EN mirrors)**
Both pages fall below 800-word service-page minimum for body content. /participer/ (~560 words) is the primary conversion page — it needs content depth to rank for "rejoindre pickleball Genève" type queries and to demonstrate E-E-A-T. /equipement/ (~480 words) is a guide page presented as a buying resource but lacks the substance expected by Google for that intent.
Pages affected: /participer/, /equipement/, /en/participate/, /en/gear/

**H-02 — No named author on any page**
All `author` schema fields reference the Organisation. No individual human is credited anywhere. Under Sept 2025 QRG, Experience is harder to demonstrate without a named practitioner. For a sports club, even a brief "Organised by [First name], head coach / session coordinator" would meaningfully lift the E-E-A-T score.
Pages affected: All

**H-03 — /apprendre/ and /equipement/ have no in-content internal links or CTAs**
Users who read the rules guide or equipment page hit a dead end. No contextual link directs them to /participer/ or /contact/. This wastes conversion intent and reduces crawl signal depth for these pages.
Pages affected: /apprendre/, /equipement/, /en/learn/, /en/gear/

### Medium

**M-01 — FAQ question count inconsistency (title says 15, content has 16)**
The `<title>` tags for /faq/ (FR and EN) say "15 questions" but both pages and llms-full.txt list 16 questions. A Quality Rater checking this will notice. AI citation tools may output the wrong number.
Pages affected: /faq/, /en/faq/

**M-02 — /equipement/ titles missing geo-modifier**
"Équipement Pickleball — Guide Raquettes & Balles 2026" and "Pickleball Gear — Paddle & Ball Buying Guide 2026" omit "Genève / Geneva". Local intent searches ("raquette pickleball Genève") will not match this title.
Pages affected: /equipement/, /en/gear/

**M-03 — Mentions légales missing association registration number**
The Swiss Cantonal Civil Code requires voluntary associations with commercial activity to disclose their legal registration. Absence of an RC number (or confirmation that none is required) is a trust signal gap visible to both Quality Raters and Swiss visitors.
Pages affected: /mentions-legales/, /en/legal-notice/

**M-04 — Contact page has no map embed**
"La Jonction, 1205 Genève" is precise but a Google Maps iframe would improve trust, local richness signals, and conversion for first-time visitors — particularly relevant for a physical-location sports service.
Pages affected: /contact/, /en/contact/

**M-05 — Health benefit claim links to Men's Health, not a study**
"scientifiquement prouvé" on the homepage links to a consumer magazine article. A QRG rater assessing YMYL-adjacent health claims expects sourcing to peer-reviewed literature or authoritative health organisations (e.g., WHO, Swiss sport medicine body).
Pages affected: /

**M-06 — `areaServed` includes Lausanne but no content covers Lausanne sessions**
Schema claims Lausanne as an area served but the site has no Lausanne-specific content. If an AI cites this for "pickleball Lausanne" it will mislead users.
Pages affected: All (global schema)

### Low

**L-01 — /apprendre/ and /equipement/ lack a factbox (location, schedule, price)**
These pages have no quick reference to session logistics. For AI citation readiness, adding a small "Pratiquez ce sport avec nous" box with key facts would make them independently citable.

**L-02 — FAQ Q12 mentions the equipment guide but does not hyperlink it**
A natural internal link opportunity is missed: "Voir notre guide d'équipement" in Q12 should link to /equipement/.

**L-03 — Politique de confidentialité does not name the Swiss supervisory authority (PFPDT)**
The Swiss nFADP (new Federal Act on Data Protection, in force 1 September 2023) expects privacy notices to identify the Federal Data Protection and Information Commissioner (PFPDT / FDPIC) as the supervisory authority. Its absence is minor for a small association but is a legal completeness gap.

**L-04 — EN contact page title omits "Pickleball" keyword**
"Contact — Geneva Sports Club Pickleball" (EN, 39 chars) is weaker than the FR equivalent which leads with "Contact Pickleball Genève". Minor keyword placement issue.

**L-05 — No /about/ or organisation history page**
There is no page explaining the Geneva Sports Club's history, activities beyond pickleball, or the team behind the club. This is not a ranking necessity but is a notable E-E-A-T gap for an organisation claiming 8,000 members.

---

## 14. Top 10 Quick Wins (Low Effort, High Impact)

| # | Action | Effort | Impact | Severity addressed |
|---|---|---|---|---|
| 1 | Fix FAQ title tag: change "15 questions" to "16 questions fréquentes" on /faq/ and /en/faq/ | 5 min | Medium | M-01 |
| 2 | Add "Genève" to /equipement/ and /en/gear/ title tags | 5 min | Medium | M-02 |
| 3 | Add contextual CTA link from /apprendre/ body to /participer/ ("Prêt à jouer ? Rejoignez une session →") | 15 min | High | H-03 |
| 4 | Add contextual CTA link from /equipement/ body to /participer/ and one back to /apprendre/ | 15 min | High | H-03 |
| 5 | Hyperlink "notre guide d'équipement" in FAQ Q12 to /equipement/ | 5 min | Low-Medium | L-02 |
| 6 | Upgrade the health claim link on the homepage from Men's Health to a peer-reviewed source (e.g. BMJ Open Sport & Exercise Medicine racquet sports longevity study) | 20 min | Medium | M-05 |
| 7 | Add a "Dernière mise à jour" date to llms.txt (currently only in llms-full.txt) | 5 min | Low | AI citation |
| 8 | Add a mini factbox (location, days, price, link to /contact/) at the bottom of /apprendre/ and /equipement/ | 30 min | Medium | L-01 |
| 9 | Remove Lausanne from `areaServed` in global schema, or add a paragraph about Lausanne players being welcome | 10 min | Low-Medium | M-06 |
| 10 | Add association registration information (or explicit statement of unregistered status) to /mentions-legales/ | 20 min | Medium | M-03 |

---

## 15. Top 5 High-Impact Rewrites

| # | Page | Current state | Target | Rationale |
|---|---|---|---|---|
| 1 | **/participer/ (+ EN mirror)** | ~560 body words, 5-step process only | 900–1,100 words — add: "What to expect at your first session" section (arrival, warm-up, game format, who you will meet), a social proof quote from a real review, and a short FAQ inline (do I need to pre-book each session? what if I'm running late?). | Primary conversion page. Thin content undercuts ranking potential for the highest-intent queries ("rejoindre pickleball Genève", "session pickleball débutant Genève"). |
| 2 | **/equipement/ (+ EN mirror)** | ~480 body words, generic weight/material summary | 900–1,200 words — add: price ranges in CHF, 2–3 specific model recommendations at beginner/intermediate level with brief hands-on notes, care instructions, where to buy in Geneva (rue du Rhône sport shops + online), and a "what the club provides" note so readers know they don't need to buy to start. | Targets "raquette pickleball Genève" and "acheter raquette pickleball" queries. Current thin content is unlikely to rank against specialist tennis/racket equipment blogs. |
| 3 | **/apprendre/ (+ EN mirror)** | ~840 body words, rules only | 1,500–1,800 words — add: expanded beginner mistakes section with 5–6 common errors and how to correct them, a short strategy primer (positioning, third-shot drop rationale), a "first 3 sessions" progression guide, and a "drills to try at home" section. | The learn/rules page is the site's best opportunity to rank for informational queries ("règles pickleball", "apprendre pickleball"). More depth = more topical authority = better chances against Wikipedia and USA Pickleball. |
| 4 | **/ (Homepage — "Qu'est-ce que le pickleball?" section)** | 1 paragraph (~80 words) generic history | 250–300 words — expand with: why pickleball is growing specifically in Switzerland/Suisse romande (since 2023), comparison numbers (court size vs tennis), first-timer experience narrative framed from a Genevan community perspective, and a specific line about how GSC sessions differ from self-organised court time. | Strengthens the homepage's Experience and Expertise signals. Replaces generic "created in the US in 1965" boilerplate with local, original framing. |
| 5 | **A new /a-propos/ (About) page** | Does not exist | 400–600 words — name the organiser(s) or at minimum the association's founding year for pickleball, describe the growth story ("we started with 2 courts in 2023, now running 3"), list other sports offered by GSC (anchoring the 8,000-member claim), include one named photo of a session coordinator. | Single highest-leverage E-E-A-T improvement available. Gives Google and AI systems a named entity to associate with the content. Directly addresses the Experience gap (no first-person signals anywhere on the site). |

---

*Report generated 2026-04-29. Based on static HTML at /Users/mikael/Documents/GitHub/pickleball/dist/ — last content revision per site footer: 28 avril 2026.*
