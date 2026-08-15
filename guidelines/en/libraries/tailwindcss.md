---
id: libraries/tailwindcss
lang: en
version: 2
source-lang: en
status: active
digest: 049bf683
---

# Tailwind CSS

## Verdict

Preferred — Tailwind CSS is the preferred CSS framework for frontend projects.

## Use when

- Styling any frontend project, by default.
- Building a Tailwind-based application that will use [shadcn/ui](shadcn-ui.md) as its component system.

## Avoid when

- The user explicitly requests another CSS framework — follow the user's requirement.
- The user explicitly requests a project-specific styling architecture — follow the user's requirement.

## Strengths

- Utility-first classes keep styling colocated with markup and avoid growing bespoke stylesheets.
- Broad adoption across the React ecosystem; it is the styling foundation of shadcn/ui.
- Theming and design tokens configurable in one place per major version.

## Tradeoffs

- Utility-class markup is verbose and can be noisy inside components.
- Major versions have incompatible conventions and configuration models; mixing them causes drift.

## Version policy

- Prefer the latest stable Tailwind CSS version for new projects.
- Do not automatically downgrade Tailwind because an old tutorial, template, or code snippet uses an earlier version.
- If the user explicitly requests another Tailwind version, follow the user's requirement.

## Usage rules

- Use Tailwind CSS as the default CSS framework for frontend projects.
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

- [shadcn/ui](shadcn-ui.md) — pairs-with: shadcn/ui is the preferred component system for Tailwind-based applications and requires Tailwind.
