---
id: libraries/tailwindcss
lang: en
version: 1
source-lang: en
status: active
digest: 6a02910c
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

## Works with

- [shadcn/ui](shadcn-ui.md) — pairs-with: shadcn/ui is the preferred component system for Tailwind-based applications and requires Tailwind.
