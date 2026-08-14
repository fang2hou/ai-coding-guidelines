# Development

How development is performed in this repository, for both humans and AI agents.

## Toolchain

All tools are managed by mise. Run `mise install` after checkout.

| Tool | Purpose | Managed via |
| --- | --- | --- |
| `<node>` | Runtime | `mise.toml` |
| `<pnpm>` | Package manager | `mise.toml` |
| `<oxlint>` | Linter | `mise.toml` |

Do not substitute tools without explicit approval (see the guideline repository's toolchain standards).

## Common Tasks

```bash
mise run dev      # start development server
mise run lint     # lint
mise run format   # format
mise run typecheck
mise run test
mise run check    # full validation workflow
mise run build
```

## Development Workflow

1. `<step: branch / issue>`
2. Implement the smallest coherent change
3. `mise run check` must pass
4. Commit with Conventional Commits (validated by Cocogitto)
5. Open a PR following [CONTRIBUTING.md](./CONTRIBUTING.md)

## Coding Standards

Follow the guideline repository's coding standards. Project-specific rules:

- `<project-specific rule>`

## Testing Workflow

- Unit tests: `mise run test`
- E2E tests: `mise run e2e` (`<how to run, fixtures needed>`)
- Prioritize meaningful behavior over coverage numbers

## Validation Workflow

`mise run check` is the entry point for the project's main validation.
It runs the same checks locally that CI runs — do not maintain separate logic.

## Deployment

`<Only when relevant: how and where the project deploys, e.g. /deploy for Databricks Apps>`
