---
id: libraries/coss
lang: en
version: 3
source-lang: en
status: active
digest: 0b9bcb31
---

# coss ui

## Verdict

Situational — coss ui is the copy-in component system for projects that explicitly choose it. The default is hand-written components styled with native CSS.

## Use when

- The user explicitly chooses coss ui as the project's component system.
- The project already uses coss ui.

## Avoid when

- Starting a new project with no explicit coss ui requirement — build the UI with native CSS.

## Strengths

- Components are copied into the repository as source and installed from the `@coss` registry through the shadcn CLI; the shadcn MCP tools operate on them directly.
- Built natively on Base UI and styled with Tailwind CSS v4.
- Curated particle catalog: production-realistic composition examples for every primitive.
- Official migration guide covering the per-component API differences for Radix-based code.

## Tradeoffs

- Smaller ecosystem and adoption than mainstream React component libraries.
- Not 1:1 with Radix APIs (trigger composition, Select items, Slider values); existing Radix-based code must be migrated, not re-imported.
- This guideline forbids editing installed components outright, so every customization must be planned as composition, wrapping, or theming from the start.

## Version policy

- Requires Tailwind CSS v4 and Base UI; track the latest registry state.
- Components update through the shadcn CLI (`pnpm dlx shadcn@latest add`), not through npm package versions.

## Usage rules

### Installation and tooling

- Install components with the shadcn CLI: `pnpm dlx shadcn@latest add @coss/<component>`; bootstrap a project with `pnpm dlx shadcn@latest init @coss/style`.
- Install the agent skill for coss ui work: `pnpm dlx skills add cosscom/coss`. Project-scoped install is the default; install globally only when the user asks for it.
- Prefer the shadcn MCP tools or the shadcn CLI over copying files by hand; preview with `--dry-run` or `--diff` when a component might already exist locally.
- Follow the official coss ui documentation when setting up the project.

### Never modify installed components

- Never edit installed coss ui component files. There is no documented-override exception: `components/ui` stays exactly as the registry installed it.
- Implement customization through composition, wrapper components, theme variables and design tokens, or the official `*Primitive` exports for custom composition.
- Do not port Radix patterns blindly; follow the official migration guide (`asChild` becomes `render`, `onSelect` becomes `onClick`, Select is items-first, ToggleGroup uses `multiple`, Slider takes scalar values).

### Component paths and structure

- coss ui components install to `components/ui` and stay there; that path is upstream-owned.
- Application components live alongside under `components/`, organized into subdirectories by Atomic Design Methodology: `atoms/`, `molecules/`, `organisms/`, plus `templates/` and `pages/` when the app warrants them.
- Exclude `components/ui/**` from `oxlint` and `oxfmt` via `ignorePatterns` in `.oxlintrc.json` and `.oxfmtrc.json`.

### Component reuse

- Check the component catalog and particle examples before writing custom markup.
- Use coss ui components wherever reasonable; build app-specific UI as compositions of them.

## Works with

- [Tailwind CSS](tailwindcss.md) — requires: coss ui is styled with Tailwind CSS v4.
- [Frontend Framework: Vite vs Next.js](frontend-framework.md) — works-with: coss ui applies whether the project uses Vite or Next.js.
