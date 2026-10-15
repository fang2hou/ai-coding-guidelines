---
id: libraries/tailwindcss
lang: en
version: 3
source-lang: en
status: active
digest: bb5412b4
---

# Tailwind CSS

## Verdict

Situational — Tailwind CSS is used when the project already runs Tailwind or its component kit requires it. Native CSS is the default for new styling work.

## Use when

- The project already uses Tailwind CSS.
- The chosen component kit requires it (coss ui, DaisyUI), or the user explicitly requests it.

## Avoid when

- New UI work with no Tailwind requirement — style with native CSS: custom properties, nesting, `:has()`, container queries, `light-dark()`.
- The user explicitly requests another CSS framework or a project-specific styling architecture — follow the user's requirement.

## Strengths

- Utility-first classes keep styling colocated with markup and avoid growing bespoke stylesheets.
- Broad adoption across the React ecosystem.
- Theming and design tokens configurable in one place per major version.

## Tradeoffs

- Utility-class markup is verbose and can be noisy inside components.
- Major versions have incompatible conventions and configuration models; mixing them causes drift.

## Version policy

- Prefer the latest stable Tailwind CSS version for new projects.
- Do not automatically downgrade Tailwind because an old tutorial, template, or code snippet uses an earlier version.
- If the user explicitly requests another Tailwind version, follow the user's requirement.

## Usage rules

- Do not introduce Tailwind into a project that does not already use it without an explicit requirement; the default is native CSS.
- If the user explicitly requests another Tailwind version, another CSS framework, or a project-specific styling architecture, follow the user's requirement.
- Follow the conventions and configuration model of the selected Tailwind version.
- Do not mix patterns from incompatible major Tailwind versions.

### Class linting and sort interop

- Install `oxlint-tailwindcss` as a dev dependency and load it through the `jsPlugins` array in `.oxlintrc.json`.
- Set `settings.tailwindcss.entryPoint` to the project's Tailwind v4 CSS entry — the file that imports `tailwindcss` and declares `@theme` design tokens. The setting is required and explicit; the plugin performs no filesystem auto-detect.
- Enable `oxlint-tailwindcss/enforce-sort-order`, which produces the official Tailwind class sort order.
- Keep the linter and oxfmt on the same design system: point oxfmt's `sortTailwindcss.stylesheet` in `.oxfmtrc.json` at the same CSS file. Otherwise oxfmt reads the `theme.css` bundled inside the `tailwindcss` package and disagrees with the linter on custom `@theme` tokens.

```jsonc
// .oxlintrc.json
{
  "jsPlugins": ["oxlint-tailwindcss"],
  "rules": {
    "tailwindcss/enforce-sort-order": "warn"
  },
  "settings": {
    "tailwindcss": {
      "entryPoint": "src/styles.css"
    }
  }
}

// .oxfmtrc.json
{
  "sortTailwindcss": {
    "stylesheet": "./src/styles.css"
  }
}
```

## Works with

- [coss ui](coss.md) — requires: coss ui is styled with Tailwind CSS v4.
- [Corner Radius](../practices/corner-radius.md) — applies regardless: express the radius token scale as Tailwind theme tokens when Tailwind is in use.
