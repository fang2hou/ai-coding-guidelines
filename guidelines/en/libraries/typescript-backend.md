---
id: libraries/typescript-backend
lang: en
version: 3
source-lang: en
status: active
digest: e8c3809c
---

# TypeScript Backend

## Verdict

Preferred — Hono is the preferred TypeScript backend framework. The default runtime is Node.js on the Active LTS line; Web-standard APIs keep services portable to Cloudflare Workers and other runtimes. Models generate code from training data, so mainstream, thoroughly validated stacks break less in AI-assisted development — that bias shapes this verdict.

## Use when

- Building a TypeScript API or backend service.

## Avoid when

- The service meets the Python justification bar — use [Python API Stack](../libraries/python-api-stack.md).
- The deliverable is a pure frontend — framework choice there is covered by [Frontend Framework: Vite vs Next.js](../libraries/frontend-framework.md).

## Strengths

- Hono: multi-runtime — the same code runs on Node.js, Cloudflare Workers, and Deno. This is the decisive strength: one framework covers the Node LTS default and edge deployment with the same codebase.
- Hono: built on Web-standard `Request`/`Response`; tiny core with a good middleware set.
- Hono: typed RPC client (`hono/client`) keeps route contracts typed end to end.

## Tradeoffs

- Hono ships thinner batteries than legacy frameworks; full applications need more assembly.
- Keep one framework per service: do not fork backend patterns by runtime, and do not mix a second backend framework into a Hono service.

## Version policy

- Use the latest stable major of Hono; do not hold services on old majors without a concrete compatibility reason.
- Pin the runtime to the Node.js Active LTS line through mise — Node.js 24 as of 2026-08 (EOL 2028-04). Never run services on the Current line.

## Usage rules

### Validation at the boundary

- Validate at the transport boundary: attach Hono's validator middleware so handlers receive already-valid, typed values.
- The core layer does not re-check transport concerns.

### Thin handlers, framework-agnostic core

- Handlers are thin adapters: convert the framework request into plain typed values at the boundary, then call the core layer. Core modules do not import Hono.
- This mirrors the Go layering rule in [Go API Stack](../libraries/go-api-stack.md): the core depends on plain typed inputs and Web-standard APIs, never on the web framework.

### Web-standard APIs

- Prefer Web-standard APIs (`Request`/`Response`, `fetch`, `URL`, streams) over runtime-specific equivalents; they keep the core portable across Node.js and Workers.

### Typed routes end to end

- Keep routes typed end to end with Hono's RPC client (`hono/client`) for client-side inference. Do not degrade route contracts into untyped fetch wrappers.

### Middleware

- Middleware lives only in the transport layer; the core layer does not know middleware exists.

### Deployment defaults

- Personal projects target Cloudflare Workers: Hono has first-class Workers support, and a core kept on Web-standard APIs runs the same service locally on Node.js.
- Work projects target Databricks Apps; follow [Databricks](../toolchain/databricks.md). Verified as of 2026-08: Databricks Apps hosts apps built with Python, Node.js, or both; Node dependencies install from `package.json` (a `pnpm-lock.yaml` triggers `pnpm install --frozen-lockfile`), and the command declared in `app.yaml` runs the app. The managed Node runtime is platform-pinned — Node 22 as of mid-2026, older than the current Active LTS line — and the platform-documented Node frameworks are React, Angular, Svelte, and Express.
- On Databricks the platform, not the project, decides the Node version: keep the service compatible with the platform's runtime instead of assuming the local LTS. Hono deploys there as an ordinary Node.js app via `@hono/node-server`, and the Express rejection stands even though the platform documents it.
- Data- and AI-heavy Databricks workloads remain Python territory per [Python API Stack](../libraries/python-api-stack.md); add a Node service there only when it clearly earns its place.

## Works with

### Internal interplay

- Hono + Node.js LTS — the default pairing for TypeScript services; the same Hono code also deploys to Cloudflare Workers for personal projects.

### Related guidelines

- [TypeScript Toolchain](../toolchain/typescript.md) — pairs-with: pnpm, oxlint, oxfmt, and the strict tsconfig baseline apply to backend services unchanged.
- [Databricks](../toolchain/databricks.md) — deployment target for work projects: Apps vs Jobs, the working window, and deployment files.
- [Testing Strategy](../practices/testing.md) — the framework-agnostic core gets plain unit tests; HTTP concerns get thin-adapter coverage.
- [Quality Gates](../toolchain/quality-gates.md) — same checks: prek and CI run the same lint and format configuration.

## Rejected alternatives

- Express: callback-era API, weak TypeScript inference, stagnant middleware model. Do not scaffold new services on it, even when a template or the hosting platform defaults to it.
