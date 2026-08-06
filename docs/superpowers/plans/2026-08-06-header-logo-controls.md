# Header Logo and Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder `L` badge with a transparent emblem derived from `icon.jpg` and restyle the language/menu controls as refined black-gold header buttons.

**Architecture:** Keep the existing single-page HTML architecture and header interaction logic. Add one optimized raster asset under `assets/`, reference it from the existing brand link, and confine behavior-preserving visual changes to the existing header CSS and static contract test.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js assertion test, Vercel static hosting, browser-based responsive QA.

## Global Constraints

- Preserve the supplied emblem silhouette and gold character; remove the white background and source wordmark.
- Retain the existing `LUXE MONTRE` text and desktop subtitle.
- Keep language switching and mobile menu behavior unchanged.
- Both controls must retain at least a 44 px touch target and visible keyboard focus.
- Do not stage or modify `PROJECT_BRIEF.md`.
- Deploy only after explicit user approval or request.

---

### Task 1: Add the Header Contract

**Files:**
- Modify: `test-o2o-page.mjs`

**Interfaces:**
- Consumes: static `index.html` markup and CSS.
- Produces: assertions protecting the new emblem reference, image alternative text, accessible button labels, and removal of the placeholder `L` glyph.

- [ ] **Step 1: Write the failing test**

Add these markers to `requiredSnippets`:

```js
'src="/assets/luxe-montre-emblem.png"',
'alt="LUXE MONTRE 尊時匯徽章"',
'aria-label="Switch language"',
'aria-label="Open menu"',
'class="brand-mark-image"'
```

Add the structural assertion:

```js
assert(!html.includes('<span class="brand-mark">L</span>'), "The placeholder L badge must be replaced by the supplied emblem.");
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
/Users/starryjie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node test-o2o-page.mjs
```

Expected: FAIL with the missing emblem asset marker.

- [ ] **Step 3: Commit is deferred until the asset and implementation make the contract pass**

Keep the failing test unstaged while completing Task 2 so the following implementation commit remains atomic.

### Task 2: Create the Transparent Emblem and Restyle the Header

**Files:**
- Create: `assets/luxe-montre-emblem.png`
- Modify: `index.html`
- Modify: `vercel.json`
- Test: `test-o2o-page.mjs`

**Interfaces:**
- Consumes: user-supplied `icon.jpg` and existing `#langBtn` / `#menuBtn` JavaScript listeners.
- Produces: `/assets/luxe-montre-emblem.png`, `.brand-mark-image`, visually matched `.lang-btn` and `.menu-btn` controls.

- [ ] **Step 1: Produce the emblem asset**

Use the supplied image as the visual source. Preserve the upper gold emblem, remove the English and Chinese wordmark, remove the white background, center the emblem on a transparent square canvas, and save the result as `assets/luxe-montre-emblem.png`.

- [ ] **Step 2: Replace the header badge markup**

Replace:

```html
<span class="brand-mark">L</span>
```

with:

```html
<span class="brand-mark">
  <img class="brand-mark-image" src="/assets/luxe-montre-emblem.png" alt="LUXE MONTRE 尊時匯徽章">
</span>
```

- [ ] **Step 3: Implement the refined control styling**

Update the shared control system so `.lang-btn` and `.menu-btn` use dark translucent backgrounds, muted-gold borders, cream content, 48–52 px desktop dimensions, and 44–46 px mobile dimensions. Add matching hover and `:focus-visible` rules with brighter gold borders and a visible outline. Keep the menu icon from Lucide and do not change the existing click handlers.

Use the emblem rules:

```css
.brand-mark {
  overflow: hidden;
  border: 0;
  background: transparent;
}

.brand-mark-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

- [ ] **Step 4: Add the asset to Vercel routing**

Add `assets/luxe-montre-emblem.png` to both the `builds` and `routes` arrays using the same static mapping pattern as `assets/luxe-montre-storefront.jpg`.

- [ ] **Step 5: Run the contract and diff checks**

Run:

```bash
/Users/starryjie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node test-o2o-page.mjs
git diff --check
```

Expected: `New-watch retail page checks passed.` and no whitespace errors.

- [ ] **Step 6: Commit the implementation**

```bash
git add index.html test-o2o-page.mjs vercel.json assets/luxe-montre-emblem.png
git commit -m "feat: refine header branding"
```

### Task 3: Responsive Browser QA

**Files:**
- Verify: `index.html`
- Verify: `assets/luxe-montre-emblem.png`

**Interfaces:**
- Consumes: local page at `http://localhost:8080/index.html#top`.
- Produces: verified desktop/mobile rendered state with no code changes unless a regression is found.

- [ ] **Step 1: Verify desktop rendering at 1440 × 900**

Confirm the emblem is crisp, the full wordmark remains readable, the language button toggles to English and back, the primary menu remains visible, no horizontal overflow exists, and the browser console has no relevant errors or warnings.

- [ ] **Step 2: Verify mobile rendering at 390 × 844**

Confirm the emblem, `LUXE MONTRE` text, language control and menu control fit in one row. Open and close the mobile panel, switch language, and verify no clipping or horizontal overflow.

- [ ] **Step 3: Run final verification**

```bash
/Users/starryjie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node test-o2o-page.mjs
git status -sb
```

Expected: the test passes; only the user-owned `PROJECT_BRIEF.md` and `icon.jpg` may remain untracked.
