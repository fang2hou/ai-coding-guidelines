---
id: libraries/frontend-framework
lang: en
version: 1
source-lang: en
status: active
digest: 7bed6bb2
---

# Frontend Framework: Vite vs Next.js

## Verdict

Preferred — Vite is the default frontend framework; choose Next.js only when the project genuinely needs full-stack React capabilities.

Decision rule:

- Default to Vite.
- Use Next.js only when the project needs a full-stack React application.
- Never choose Next.js just because it has more features than Vite.
- Choose Vite whenever Next.js's extra complexity adds no value.

## Use when

### Vite

- Building a client-side or single-page frontend where a full-stack framework is unnecessary.
- Server-side rendering and framework-managed server routes are not needed.

### Next.js

- The project needs a full-stack React application with server-side rendering, server routes, or integrated data fetching.

## Avoid when

### Vite

- The project needs server-side rendering or integrated full-stack React features.

### Next.js

- The only reason is that Next.js has more features than Vite.
- Next.js's extra complexity adds no value to the project — use Vite instead.

## Strengths

### Vite

- Minimal configuration and a fast development server.
- Few concepts to learn and minimal framework lock-in.

### Next.js

- Integrated full-stack React capabilities: server-side rendering, routing, and data fetching.
- A single framework answer when those capabilities are genuinely required.

## Tradeoffs

### Vite

- Not a full-stack framework; server-side capabilities must be added separately.
- Plugin compatibility must be checked when upgrading Vite.

### Next.js

- More complex architecture, conventions, and deployment than Vite.
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

- Default to Vite for frontend applications.
- Use Next.js only when the project needs its full-stack React features; never pick it just because it is larger or more capable.

## Works with

- [TypeScript Toolchain](../toolchain/typescript.md) — pairs-with: the pnpm, oxlint, and oxfmt toolchain applies to projects built with either framework.
