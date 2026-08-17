# Development

How development is performed in this repository, for both humans and AI agents.
User-facing setup lives in the README; this document is for people changing the code.

## Setup

All tools are managed by mise.

```bash
mise install
```

| Tool       | Purpose         | Managed via |
| ---------- | --------------- | ----------- |
| {{node}}   | Runtime         | `mise.toml` |
| {{pnpm}}   | Package manager | `mise.toml` |
| {{oxlint}} | Linter          | `mise.toml` |

Do not substitute tools without explicit approval (see the guidelines repository's toolchain standards).

## Commands

```bash
mise run dev                # start the dev server
mise run check              # full validation — what CI runs
mise run test               # test suite
mise run test -- {{filter}} # run a single test file or case
```

`mise run` lists every task.

## Workflow

1. Branch from `main` ({{issue reference, when relevant}})
2. Implement the smallest coherent change
3. `mise run check` must pass
4. Commit with Conventional Commits (validated by Cocogitto)
5. Open a PR following [CONTRIBUTING.md](./CONTRIBUTING.md)

## Layout

{{One line per top-level directory — a map, not an atlas. Name key modules; do not link files.}}

## Coding Standards

Follow the guidelines repository's coding standards. Project-specific rules:

- {{project-specific rule}}

## Testing

- Unit tests: `mise run test`
- E2E tests: `mise run e2e` ({{how to run, fixtures needed}})
- Prioritize meaningful behavior over coverage numbers

## Debugging

{{How to run with debug flags, where logs go, common failure modes and fixes.}}

## Validation

`mise run check` is the entry point for the project's main validation.
It runs the same checks locally that CI runs — do not maintain separate logic.

## Deployment

{{Only when relevant: how and where the project deploys}}
