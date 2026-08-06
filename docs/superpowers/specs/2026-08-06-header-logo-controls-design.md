# Header Logo and Controls Design

## Goal

Refine the LUXE MONTRE header so the supplied `icon.jpg` becomes a usable brand mark and the language/menu controls feel consistent with the site's dark luxury visual system.

## Approved Direction

Use the gold emblem from the upper portion of `icon.jpg`, remove the white background and accompanying wordmark, and export it as a transparent web asset. Replace only the current circular `L` mark; retain the existing `LUXE MONTRE` text and desktop subtitle so the brand remains legible at every viewport.

Replace the heavy grey language and menu blocks with two independent dark, lightly translucent controls. Each control uses a subtle gold border, cream/gold content, and a restrained gold hover/focus treatment. Do not merge the controls into one capsule because the language toggle and navigation menu are separate actions.

## Visual Details

- Logo emblem: transparent background, exact supplied emblem silhouette and gold character retained, square canvas, no English or Chinese text from the source image.
- Desktop brand mark: approximately 56–64 px with breathing room; no redundant outer `L` glyph.
- Mobile brand mark: approximately 38–42 px, large enough for the emblem to remain recognizable.
- Language control: compact text label (`EN` / `中`), transparent dark surface, thin muted-gold border, at least 44 px touch target.
- Menu control: matching dimensions and surface, three thin cream/gold lines, at least 44 px touch target.
- Hover/focus: border and foreground become brighter gold; visible keyboard focus remains present.
- The mobile menu panel behavior and language-switching logic remain unchanged.

## Responsive Behaviour

Desktop keeps the existing full brand lockup and primary navigation. The menu button remains hidden above the existing breakpoint. Mobile keeps the compact wordmark and shows both language and menu controls without clipping at 390 px wide or larger.

## Asset and Delivery

- Source: `/Users/starryjie/Documents/code/wedsite/icon.jpg` (kept as the user-supplied original).
- Web asset: a new transparent emblem image under `assets/` with an ASCII filename.
- Update `vercel.json` only if the current static asset rules require an explicit route.
- Do not include `PROJECT_BRIEF.md` in any commit.

## Validation

- Automated contract verifies the new logo asset reference and accessible control labels.
- Desktop and 390 × 844 mobile browser checks verify logo clarity, header spacing, menu open/close, language switching, horizontal overflow and console health.
- Production is deployed only after the user approves the rendered result or explicitly asks for deployment.
