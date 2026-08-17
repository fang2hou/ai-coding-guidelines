# AGENTS.md

Guidance for AI agents working in this repository. Read this before making changes.

{{One sentence: what this project is, and for whom.}}

## Commands

```bash
mise install                 # set up the toolchain
mise run dev                 # start the dev server
mise run test                # test suite
mise run test -- {{filter}}  # run a single test file or case
mise run lint                # lint only
mise run typecheck           # type checking only — delete when not applicable
mise run build               # production build — delete when not applicable
mise run codegen             # regenerate generated files — delete when not applicable
mise run check               # full validation — run before every commit
```

{{Non-obvious tooling, e.g. use pnpm, never npm; use uv run, never bare python.}}

## Engineering Standards

This project follows the shared engineering guideline:

> {{link to the guideline repository's PORTAL.md}}

Read the portal's reading recipes for your task type before starting.
Repository documentation always takes precedence over remembered summaries.

Project-specific overrides:

- {{e.g. this project uses X instead of the standardized Y, reason: ...}}
- {{none if the project fully follows the standards}}

## Layout

{{One line per top-level directory — name key modules, no exhaustive listing.}}

## Boundaries

Always:

- Run `mise run check` before every commit
- Keep each change minimal and scoped to the request

Never:

- {{e.g. force push shared branches; commit secrets; hand-edit generated files — name the path and the regeneration command}}

Ask first:

- {{e.g. new dependencies; changes to invariants in ARCHITECTURE.md; deleting public API}}

## Confirmed Language Policy

| Item                      | Value                  |
| ------------------------- | ---------------------- |
| Conversation              | `{{follows the user}}` |
| Code / comments / commits | English                |
| UI language               | `{{confirmed value}}`  |
| Tone                      | `{{confirmed value}}`  |

Do not infer UI language from conversation language.

## Project Conventions

- {{e.g. state management approach, error handling pattern, test conventions}}
- {{gotchas an agent would not guess}}

Depth: [DEVELOPMENT.md](./DEVELOPMENT.md) for workflow and toolchain, [CONTRIBUTING.md](./CONTRIBUTING.md) for PR rules, [ARCHITECTURE.md](./ARCHITECTURE.md) for invariants.
