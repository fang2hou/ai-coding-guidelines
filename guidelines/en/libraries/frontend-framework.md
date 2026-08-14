---
id: libraries/frontend-framework
lang: en
version: 1
source-lang: en
status: active
digest: 7c2bc70b
---

# Frontend Framework: Vite vs Next.js

## Verdict

Preferred — Vite is the default frontend framework; choose Next.js only when its full-stack capabilities are genuinely required.

Decision rule:

- Default to Vite.
- Use Next.js only when the project requires a full-stack React application or capabilities that justify Next.js.
- Never choose Next.js merely because it is more capable than Vite.
- Choose Vite whenever the additional complexity of Next.js does not provide value.

## Use when

### Vite

- The application is a simple, fast frontend where a full-stack framework is unnecessary.
- Server-side rendering and full-stack capabilities are not required.

### Next.js

- The project requires a full-stack React application.
- The project requires capabilities that genuinely justify Next.js.

## Avoid when

### Vite

- The project requires full-stack capabilities that justify Next.js.

### Next.js

- The only argument is that Next.js is more capable than Vite.
- The additional complexity of Next.js does not provide value — use Vite instead.

## Strengths

### Vite

- Minimal configuration and a fast development server.
- A small conceptual surface with few framework-imposed constraints.

### Next.js

- Integrated full-stack React capabilities: server-side rendering, routing, and data fetching.
- A single framework answer when those capabilities are genuinely required.

## Tradeoffs

### Vite

- Not a full-stack framework; server-side capabilities must be added separately.
- Plugin compatibility must be checked when upgrading Vite.

### Next.js

- Additional complexity over Vite in architecture, conventions, and operational surface.
- Major-version upgrades require compatibility review of related plugins and integrations.

## Version policy

### Vite

- Prefer the latest stable Vite version for new projects.
- Prefer the latest compatible versions of Vite plugins.
- Check plugin compatibility when upgrading Vite.
- Do not hold the project on obsolete versions without a concrete compatibility reason.

### Next.js

- Prefer the latest stable Next.js version for new projects.
- Prefer the latest compatible versions of related plugins and integrations.
- Review compatibility when upgrading major versions.

## Usage rules

- Use Vite for simple, fast frontend applications where a full-stack framework is unnecessary.
- Use Next.js when the project requires a full-stack React application or capabilities that justify Next.js.
- Do not use Next.js merely because it is more capable than Vite.
- Choose Vite when the additional complexity of Next.js does not provide value.

## Works with

- [TypeScript Toolchain](../toolchain/typescript.md) — pairs-with: the pnpm, oxlint, and oxfmt toolchain applies to projects built with either framework.
