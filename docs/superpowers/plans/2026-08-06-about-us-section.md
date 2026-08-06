# About Us Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual “關於我們 / About Us” navigation item and responsive company-profile section covering the confirmed 2013 background, services, and values.

**Architecture:** Keep the existing single-file static-site architecture. Replace the current `story-section` with a semantic `#about` section, extend the current i18n dictionary, and reuse the navigation/language-switch mechanisms without adding dependencies or backend state.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js assertion test, in-app Browser QA.

## Global Constraints

- Company name is LUXE MONTRE／尊時匯; founded in Hong Kong in 2013.
- Positioning is new and unworn luxury timepieces only.
- Primary brands are Patek Philippe, Rolex, and Richard Mille.
- Do not add second-hand acquisition, consignment, WeChat, a brand catalogue, pricing logic, or backend features.
- Use a warm-white full-width section, no cards, no new photos, and no extra CTA button.
- Desktop detailed content is an open two-column layout; mobile is one column with left-aligned body copy.
- Preserve and ship the already approved storefront-background work in `index.html`, `vercel.json`, `test-o2o-page.mjs`, and `assets/luxe-montre-storefront.jpg` with the About Us implementation.

---

### Task 1: Add the About Us Regression Contract

**Files:**
- Modify: `test-o2o-page.mjs`
- Test: `test-o2o-page.mjs`

**Interfaces:**
- Consumes: rendered-source contracts already asserted from `index.html`.
- Produces: assertions for `#about`, bilingual navigation keys, confirmed company copy, service/value headings, and removal of the old philosophy heading.

- [ ] **Step 1: Write the failing test**

Add these required snippets to `requiredSnippets`:

```js
"id=\"about\"",
"href=\"#about\"",
"nav_about",
"關於我們",
"成立於 2013 年",
"核心業務與服務",
"核心價值與信念",
"Let Time Tell the Story"
```

Add structural assertions:

```js
assert.equal((html.match(/id="about"/g) || []).length, 1, "About Us section must have one unique #about anchor.");
assert.equal((html.match(/href="#about"/g) || []).length, 2, "Desktop and mobile menus must both link to #about.");
assert(!html.includes("時間藝術的守護者"), "Old philosophy section must be replaced by About Us.");
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
/Users/starryjie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node test-o2o-page.mjs
```

Expected: FAIL on the first missing About Us marker.

### Task 2: Implement Navigation, Company Profile, Services, and Values

**Files:**
- Modify: `index.html`
- Modify: `test-o2o-page.mjs`

**Interfaces:**
- Consumes: existing `.nav`, `.mobile-panel`, `data-i18n`, `applyLanguage()`, fixed header, and mobile ordering rules.
- Produces: one semantic `<section id="about">`, two `href="#about"` links, and bilingual `about_*` translation keys.

- [ ] **Step 1: Add desktop and mobile menu links**

Insert before the collection link in both menus:

```html
<a href="#about" data-i18n="nav_about">關於我們</a>
```

- [ ] **Step 2: Replace the old story section markup**

Use this structure, expanding the two lists into four service items and three value items:

```html
<section class="about-section" id="about">
  <div class="container about-inner">
    <div class="about-head">
      <h2 data-i18n="about_title">關於我們</h2>
      <span class="about-rule" aria-hidden="true"></span>
    </div>
    <div class="about-intro">
      <p data-i18n="about_intro_1"></p>
      <p data-i18n="about_intro_2"></p>
    </div>
    <div class="about-columns">
      <section class="about-group">
        <h3 data-i18n="about_services_title">核心業務與服務</h3>
        <div class="about-list" data-about-list="services"></div>
      </section>
      <section class="about-group">
        <h3 data-i18n="about_values_title">核心價值與信念</h3>
        <div class="about-list" data-about-list="values"></div>
      </section>
    </div>
    <div class="about-divider"><span data-i18n="about_divider">讓時間，說故事</span></div>
  </div>
</section>
```

Each item must be code-native HTML containing a translated `<strong>` title and translated `<span>` body. Use the exact approved Chinese and English copy from `docs/superpowers/specs/2026-08-06-about-us-section-design.md`.

- [ ] **Step 3: Add About Us styles**

Implement focused styles with these exact layout rules:

```css
.about-section { background: #f4f0e8; color: var(--ink); scroll-margin-top: 116px; }
.about-inner { text-align: center; }
.about-head h2 { font-family: Cinzel, "Noto Serif TC", serif; }
.about-rule { display: block; width: 56px; height: 1px; margin: 24px auto 0; background: var(--gold-dark); }
.about-intro { width: min(960px, 100%); margin: 42px auto 0; }
.about-columns { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr); gap: 72px; margin-top: 64px; text-align: left; }
.about-list { display: grid; gap: 22px; }
.about-item { line-height: 1.9; }
.about-item strong { display: block; color: var(--gold-dark); }
.about-divider { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 28px; margin-top: 72px; color: var(--gold-dark); }
.about-divider::before, .about-divider::after { content: ""; height: 1px; background: rgba(153, 125, 77, .55); }
```

At `max-width: 680px`, use `scroll-margin-top: 72px`, one column, left-aligned copy, smaller gaps, and a centered divider. Update mobile main ordering from `.story-section` to `.about-section`.

- [ ] **Step 4: Add bilingual translation keys**

Add `nav_about`, `about_title`, `about_intro_1`, `about_intro_2`, `about_services_title`, four service title/body pairs, `about_values_title`, three value title/body pairs, and `about_divider` to both `i18n.zh` and `i18n.en`.

Use the exact approved copy in the design specification, including Patek Philippe（百達翡麗）、Rolex（勞力士）and Richard Mille in Chinese.

- [ ] **Step 5: Run the regression and integrity checks**

Run:

```bash
/Users/starryjie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node test-o2o-page.mjs
git diff --check
```

Expected: `New-watch retail page checks passed.` followed by exit 0 and no whitespace errors.

- [ ] **Step 6: Commit implementation**

```bash
git add index.html test-o2o-page.mjs vercel.json assets/luxe-montre-storefront.jpg
git commit -m "feat: add about us and storefront hero"
```

Do not stage `PROJECT_BRIEF.md`.

### Task 3: Browser Verification

**Files:**
- Verify: `index.html`
- Verify: `assets/luxe-montre-storefront.jpg`

**Interfaces:**
- Consumes: the rendered local site at `http://localhost:8080/index.html`.
- Produces: desktop/mobile evidence for navigation, anchor positioning, bilingual copy, responsive layout, and console health.

- [ ] **Step 1: Verify desktop rendering at 1440×900**

Use the in-app Browser to reload the local site, set a 1440×900 viewport, click the unique desktop `href="#about"` link, and evaluate:

```js
({
  aboutCount: document.querySelectorAll("#about").length,
  heading: document.querySelector("#about h2")?.textContent,
  serviceItems: document.querySelectorAll('[data-about-list="services"] .about-item').length,
  valueItems: document.querySelectorAll('[data-about-list="values"] .about-item').length,
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth
})
```

Expected: one section, heading `關於我們`, four service items, three value items, and no horizontal overflow.

- [ ] **Step 2: Verify bilingual switching**

Click `#langBtn`, verify the heading becomes `About Us`, the divider becomes `Let Time Tell the Story`, and both content groups remain populated; then restore Chinese.

- [ ] **Step 3: Verify mobile rendering at 390×844**

Set a 390×844 viewport, open the mobile menu, click its unique `href="#about"` link, and verify the menu closes, the heading is not hidden by the fixed header, columns collapse to one, and there is no horizontal overflow.

- [ ] **Step 4: Verify console and screenshots**

Require zero relevant `error` or `warn` logs and capture desktop and mobile screenshots showing the About Us section.

- [ ] **Step 5: Reset viewport and keep the local page open**

Reset the browser viewport override and preserve the local site tab as the deliverable.
