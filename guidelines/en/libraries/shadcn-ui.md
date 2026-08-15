---
id: libraries/shadcn-ui
lang: en
version: 3
source-lang: en
status: active
digest: 05213a0d
---

# shadcn/ui

## Verdict

Preferred — shadcn/ui is the preferred component system for Tailwind-based applications.

## Use when

- Building a Tailwind-based application that needs UI components.
- Starting a new project where the user has not explicitly requested another component library or version.

## Avoid when

- The user explicitly requests another component library or version — follow the user's requirement.
- The project does not use Tailwind CSS; shadcn/ui is the component system for Tailwind-based applications.

## Strengths

- Components are copied into the repository as source, keeping them fully inspectable and adjustable.
- Reduces development and maintenance cost; avoids visual inconsistency, upgrade conflicts, and AI-generated component duplication.
- Official variants and configuration mechanisms cover most customization without editing component internals.

## Tradeoffs

- Copied components can drift from upstream; internal modifications create upgrade risk.
- Requires discipline to keep components close to their official implementation.

## Version policy

- Prefer the latest applicable shadcn/ui setup for new projects.
- If the user explicitly requests another component library or version, follow the user's requirement.

## Usage rules

- Follow the official shadcn/ui documentation when setting up the project.

### Primitives layer (Radix / Base UI / React Aria)

- shadcn/ui ships every component on several primitive layers. Base UI is the upstream default since July 2026 and this guideline's preference; Radix and React Aria remain available.
- New projects: keep the default Base UI layer; do not opt into Radix or React Aria without an explicit user requirement.
- Existing Radix projects: stay on Radix; migrating is optional and never required. Migrate only on explicit user request, with the official migration skill, one component at a time.

### Component paths and structure

- shadcn/ui components install to `components/ui` and stay there; that path is upstream-owned.
- Application components live alongside it under `components/`, organized into subdirectories by Atomic Design Methodology: `atoms/`, `molecules/`, `organisms/`, plus `templates/` and `pages/` when the app warrants them.
- Never place custom components inside `components/ui`; keep the vendored upstream tree and first-party code separate.

Example:

```text
components/
  ui/            # shadcn/ui — upstream-owned
    button.tsx
    dialog.tsx
  atoms/
    price-tag.tsx
  molecules/
    search-field.tsx
  organisms/
    product-table.tsx
```

### Component reuse

- Use shadcn/ui components as much as reasonably possible.
- Before creating a custom component, check whether shadcn/ui already provides an appropriate primitive or component.
- Prefer existing components, composition of existing components, official variants, and official configuration mechanisms over unnecessary custom implementations.
- The purpose is to reduce development cost, maintenance cost, visual inconsistency, upgrade conflicts, and AI-generated component duplication.

### Avoid unnecessary modification

- Keep downloaded components close to their official implementation.
- Do not modify component internals to achieve changes that can be implemented through theme variables, Tailwind configuration, composition, existing component APIs, standard variants, wrapper components, or supported design tokens.
- For changes such as primary color, theme configuration, typography, markdown rendering, font sizes, or component variants, consult the official shadcn/ui and relevant Tailwind documentation before directly editing component internals.

### Document required overrides

- If a downloaded component genuinely requires a custom internal modification, document which component was modified, what was changed, why the change was necessary, and what upgrade risk the modification creates.
- Keep this information in a Markdown document in the repository so future developers and AI agents can understand the divergence when upgrading shadcn/ui.

### Exclude downloaded components from lint and format scope

- `components/ui` is vendored upstream source, not first-party code: exclude the path from `oxlint` and `oxfmt` processing so tool output stays focused on code the project owns.
- Add `components/ui/**` to `ignorePatterns` in `.oxlintrc.json` and `.oxfmtrc.json`. Both tools recommend `ignorePatterns` in the config file over separate ignore files, and the exclusion keeps lint and format churn out of upgrade diffs.

```json
{ "ignorePatterns": ["components/ui/**"] }
```

### Tooling: MCP or CLI

- Add and update components through the shadcn CLI or the shadcn MCP tools; do not copy component files by hand when the tooling is available.
- When the development environment supports MCP, prefer the official shadcn MCP integration; the same tools operate on any shadcn-compatible registry configured in `components.json`.
- If an MCP-capable user is working with shadcn/ui but the MCP integration has not been configured, the agent may help the user configure it.
- Preview with `--dry-run` or `--diff` when a component might already exist locally.

## Works with

- [Tailwind CSS](tailwindcss.md) — requires: shadcn/ui is the component system for Tailwind-based applications.
- [Frontend Framework: Vite vs Next.js](frontend-framework.md) — works-with: shadcn/ui is applicable whether the project uses Vite or Next.js.
- [coss ui](coss.md) — alternative: same registry model and toolchain, interchangeable; shadcn/ui stays the preferred default.
