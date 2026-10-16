---
id: libraries/svelte
lang: en
version: 2
source-lang: en
status: active
digest: d59ef191
---

# Svelte (Svelte 5 + SvelteKit)

## Verdict

Situational — Svelte 5 with SvelteKit is approved for small personal and
experimental projects where developer enjoyment is a goal. It is not the
default: production frontends stay on the React stacks selected in
[Frontend Framework](frontend-framework.md).

## Use when

- The project is personal, a prototype, or a small experiment where developer enjoyment is a goal.
- The user explicitly requests Svelte.

## Avoid when

- Team or client production work where AI throughput and ecosystem breadth
  matter.
- The project needs the breadth of the React ecosystem.

## Strengths

- Least boilerplate of the mainstream component frameworks; compiled output
  with fine-grained reactivity and small bundles.
- Runes make reactive state explicit and statically analyzable.
- SvelteKit ships the full app layer (routing, SSR, form actions) on Vite.
- First-party AI tooling (MCP server, skills, `sv add ai-tools`) offsets the
  thinner LLM training coverage.

## Tradeoffs

- LLM training coverage is thinner than React's; hallucinated Svelte 4
  patterns are the main risk. Mitigate with the official AI tooling, never
  with memory.
- Smaller component ecosystem; UI work goes through DaisyUI or hand-written components.
- Fast-moving: SvelteKit 3.0 is in pre-release. Stay on the stable line
  unless exploring the new major is the point of the project.

## Version policy

- Svelte 5 latest stable. Component-level `await` expressions require
  `experimental.async` (Svelte ≥ 5.36) — experimental, not a default.
- SvelteKit ≥ 2.70 stable line; do not adopt 3.0 pre-releases by default.
- DaisyUI 5 (Tailwind CSS v4 plugin model) when a class-based kit is wanted,
  or hand-written native CSS components.

## Usage rules

- Scaffold with `npx sv create`, then run `npx sv add ai-tools` — it writes
  the official AGENTS.md instructions for the Svelte MCP tools into the
  project.
- Register the official MCP server (`npx -y @sveltejs/mcp`). When unsure of syntax, call `list-sections` and `get-documentation` instead of guessing from memory. Run `svelte-autofixer` on every component you write or edit until it reports no issues.
- Runes mode only; never emit legacy syntax. In particular:
  - `$derived` (or `$derived.by`) for computed values — never a `$effect`
    that assigns state; effects are an escape hatch for true side effects.
  - `$state` only for values that must be reactive; `$state.raw` for large
    reassigned objects such as API responses.
  - Treat props as changing: derive from them with `$derived` instead of
    copying into a plain `let`.
  - `onclick={...}` event attributes (never `on:click`); callback props
    instead of `createEventDispatcher`.
  - `{#snippet}` + `{@render}` instead of slots; keyed `{#each}` (never the
    index as key); array/object `class` values instead of the `class:`
    directive.
- Prefer `<svelte:window>` / `<svelte:document>` over `onMount` or `$effect`
  listeners; sync external libraries with `{@attach}` rather than `$effect`;
  typed `createContext` over shared-module state.
- Pick one UI approach per project:
  - Hand-written components with native CSS — the default; no kit dependency,
    full control.
  - DaisyUI 5 — Tailwind plugin (`@plugin "daisyui";`), semantic theme
    classes, no copied-in components. Prefer for small apps and speed.
- Style child components through CSS custom properties
  (`<Child --color="red" />`); use `:global` only for third-party components.

## Works with

- [Tailwind CSS](tailwindcss.md) — pairs-with: DaisyUI 5 is Tailwind v4
  based; apply its class-sort interop rules when used.
- [Frontend Framework](frontend-framework.md) — context: default framework
  selection stays React-first; this document governs the Svelte exception.
