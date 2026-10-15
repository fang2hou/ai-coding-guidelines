---
id: practices/corner-radius
lang: en
version: 1
source-lang: en
status: active
digest: 841255f4
---

# Corner Radius

## Principles

- Corner radius is a system, not a per-element value: define a small token scale once per project and take every radius from it.
- Two rules cover all cases: continuous curvature on single surfaces, concentric curvature on nested surfaces.
- Enforce both rules mechanically. A single corner rarely looks wrong in isolation; wrong combinations are what read as cheap or disjointed.

## Token scale

```css
:root {
  --radius-s: 6px;       /* dense rows, chips */
  --radius-m: 8px;       /* buttons, inputs — the default control radius */
  --radius-l: 12px;      /* popovers, menus */
  --radius-xl: 20px;     /* cards, sheets, dialogs */
  --radius-full: 9999px; /* circles, pills */
}
```

- Every radius in the project comes from this scale. One-off values (`13px`) cannot participate in nesting arithmetic and drift immediately.
- Adjacent steps must stay distinguishable (≥ 2px apart at these sizes).

## Single surfaces: continuous corners

- `border-radius` alone joins straight edges to a circular arc; the sudden curvature change is what makes plain web corners read harder than Apple's continuous corners.
- Pair `corner-shape` with the existing `border-radius`: `border-radius` keeps setting the corner size, `corner-shape` only changes the curve. Backgrounds, borders, outlines, shadows, `overflow: hidden`, and `backdrop-filter` all follow the resulting shape — no `clip-path`, no SVG masks.
- Use `squircle` (= `superellipse(2)`) as the single project-wide value. The corner shape is part of the token system; do not vary it per element.
- Apply where the corner is a visible design decision: cards, sheets, dialogs, tiles, media, app-level surfaces (≥ `--radius-l`). Below ~6px the difference from `round` is invisible — do not set it there.
- Progressive enhancement only: as of late 2026, only Chromium-based browsers (139+) render `corner-shape`; Safari and Firefox ignore it and fall back to ordinary round corners. That fallback is acceptable. Never ship a JS or SVG polyfill for it.
- `corner-shape` has no effect when `border-radius` resolves to `0`.

```css
.card {
  border-radius: var(--radius-xl);
  corner-shape: squircle;
}
```

## Buttons and controls: medium radius

- Buttons, inputs, and selects default to the medium token (`--radius-m`, about 8px on a 36–40px control). Shallow (`--radius-s`) is the acceptable lower bound for dense layouts.
- A medium radius keeps straight edge segments that align text and neighboring controls, and leaves room for hover and pressed states inside the control to stay concentric.
- Reserve fully round (`--radius-full`) buttons for chips, tags, and identity elements (avatars, toggles). Do not use them for action buttons.

## Nested surfaces: the concentric rule

- When a layer sits `p` px inside a surface with outer radius `R`, its radius must be `r = R − p` (clamped at 0). Both corners then share one center of curvature, so the inner layer reads as the same surface lifted — not as a sticker on top.
- The rule applies to hover and pressed overlays (`::before` / `::after`), focus rings, badges on cards, media and controls inside padded surfaces, segmented controls, and tooltips.
- Mismatched nesting — equal inner and outer radii, or arbitrary inner values — is what makes hover states and badges look like disjoint foreign layers.

### Standard instantiations

- Overlay at `inset: 0`: `border-radius: inherit`.
- Layer inset by the surface padding: compute with `calc()` from the same tokens.
- Focus ring outside the control: use `outline` or `box-shadow` — both track the outer radius automatically.
- Border of width `w` on a rounded box: the inner edge is already drawn at `R − w`; never re-round it.

```css
.button {
  border-radius: var(--radius-m);
}
.button::before {
  /* hover fill */
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit; /* concentric by construction */
}

.card {
  border-radius: var(--radius-xl);
  padding: 12px;
}
.card .media {
  /* 20 - 12 = 8: same center of curvature as the card */
  border-radius: calc(var(--radius-xl) - 12px);
}
```

- When an exact match is impossible (arbitrary artwork, raster edges), err tighter: keep `r ≤ R − p`. A slightly tight inner corner reads deliberate; a loose one reads broken.

## Checks

- Every radius in the diff comes from the token scale.
- Controls use the medium token; pill radii appear only on chips, tags, and identity elements.
- Every nested layer satisfies `r = R − p`, inherits its radius, or uses `outline` / `box-shadow`.
- `corner-shape: squircle` is set on ≥ `--radius-l` surfaces; no polyfills shipped for it.

## Works with

- [Coding Standards](coding-standards.md) — context: the token scale is an instance of the no-magic-values rule.
- [Tailwind CSS](../libraries/tailwindcss.md) — pairs-with (situational): when Tailwind is in use, express the scale as theme tokens; the concentric rule is unchanged.
- [Liquid Glass Design](../platforms/liquid-glass-design.md) — context: on Apple platforms, use the system's continuous-corner APIs instead of web approximations.
