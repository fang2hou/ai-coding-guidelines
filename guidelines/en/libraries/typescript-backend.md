---
id: libraries/typescript-backend
lang: en
version: 1
source-lang: en
status: active
digest: 97c1039c
---

# TypeScript Backend

## Verdict

Preferred — Elysia is the preferred TypeScript backend framework; run it on Bun, managed through mise. Hono is the standard alternative when the runtime must be Node.js, an edge platform such as Cloudflare Workers, or several runtimes at once. Express is rejected.

## Use when

- Building a TypeScript API or backend service.

## Avoid when

- The service meets the Python justification bar — use [Python API Stack](../libraries/python-api-stack.md).
- The deliverable is a pure frontend — framework choice there is covered by [Frontend Framework: Vite vs Next.js](../libraries/frontend-framework.md).

## Strengths

- Elysia: end-to-end type inference — route schemas flow to clients through Eden.
- Elysia: first-class performance on Bun's HTTP stack.
- Elysia: schema validation built in (TypeBox); no separate validation layer to wire.
- Hono: built on Web-standard `Request`/`Response`; tiny core with a good middleware set.
- Hono: multi-runtime — the same code runs on Cloudflare Workers, Bun, Node.js, and Deno.

## Tradeoffs

- Elysia is Bun-first. The Node adapter (`@elysiajs/node`) exists but is younger than running on Bun; treat Node as a constrained deployment target, not the default.
- Hono ships thinner batteries than legacy frameworks; full applications need more assembly.
- Splitting Elysia-on-Bun and Hono-elsewhere forks service patterns by runtime — pick one framework per service, not per route.

## Version policy

- Use the latest stable majors of Elysia, Hono, and Bun; do not hold services on old majors without a concrete compatibility reason.
- Manage Bun through mise like every other tool, pinned in the project's mise configuration.
- Follow each framework's current documented idioms; do not import Express-era middleware patterns into either.

## Usage rules

### Validation at the boundary

- Validate at the transport boundary: declare schemas on Elysia routes, or attach Hono's validator middleware. Handlers receive already-valid, typed values.
- The core layer does not re-check transport concerns.

### Thin handlers, framework-free core

- Handlers are thin adapters: convert the framework request into plain typed values at the boundary, then call the core layer. Core modules import neither Elysia nor Hono.
- This mirrors the Go layering rule in [Go API Stack](../libraries/go-api-stack.md): the core depends on plain typed inputs and Web-standard APIs, never on the web framework.

### Web-standard APIs

- Prefer Web-standard APIs (`Request`/`Response`, `fetch`, `URL`, streams) over runtime-specific equivalents; they keep the core portable across Bun, Node.js, and Workers.

### Typed routes end to end

- Keep routes typed end to end: Elysia with Eden for client inference, Hono with its RPC client (`hono/client`). Do not degrade route contracts into untyped fetch wrappers.

### Middleware

- Middleware lives only in the transport layer; the core layer does not know middleware exists.

## Works with

### Internal interplay

- Elysia + Bun — Elysia is Bun-first, built on Bun's HTTP, file-system, and hot-reload APIs; Bun is the default runtime for Elysia services.
- Elysia ↔ Hono — the runtime decides: Elysia on Bun by default; Hono when the service must run on Node.js, Cloudflare Workers, or multiple runtimes.

### Related guidelines

- [TypeScript Toolchain](../toolchain/typescript.md) — pairs-with: pnpm, oxlint, oxfmt, and the strict tsconfig baseline apply to backend services unchanged.
- [Testing Strategy](../practices/testing.md) — the framework-free core gets plain unit tests; HTTP concerns get thin-adapter coverage.
- [Quality Gates](../toolchain/quality-gates.md) — same checks: prek and CI run the same lint and format configuration.

## Rejected alternatives

- Express: callback-era API, weak TypeScript inference, stagnant middleware model. Do not scaffold new services on it, even when a template defaults to it.
