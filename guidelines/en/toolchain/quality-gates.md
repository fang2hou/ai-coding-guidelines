---
id: toolchain/quality-gates
lang: en
version: 5
source-lang: en
status: active
digest: 87171829
---

# Quality Gates

## prek

Use `prek` as the standard pre-commit framework.

Do not introduce another pre-commit framework unless the user explicitly approves an exception.

Configure hooks in `prek.toml`, prek's native format. Use `.pre-commit-config.yaml` only when pre-commit compatibility is required.

Point the hook at the same entry point everything else uses:

```toml
# prek.toml - the hook runs the shared entry point
[[repos]]
repo = "local"
hooks = [
  { id = "check", entry = "mise run check", language = "system", pass_filenames = false }
]
```

### Rejected Alternatives

- pre-commit
- Lefthook

## Default Check Set

Include the project's fast checks in `prek.toml`:

- Linting
- Formatting checks
- Language-specific static checks
- Security-related checks
- Dependency checks where appropriate
- Secret scanning

Concretely, with this toolchain that maps to:

```text
lint         -> oxlint / ruff check
format check -> oxfmt --check / ruff format --check
typecheck    -> oxlint with typeCheck enabled (tsgolint) / tsc --noEmit
```

oxlint's `options.typeCheck` (via `oxlint-tsgolint`) surfaces TypeScript
diagnostics and fails the run, so it carries the typecheck gate on its own;
use `tsc --noEmit` as the stand-alone form when type-aware linting is not
configured.

## Keep Checks Fast

Keep pre-commit checks fast enough for humans and AI agents to run on every commit. Do not add slow checks just to make the hook file look thorough.

```text
# good - fast enough for every commit
lint, format check, typecheck, secret scanning

# bad - too slow for a commit hook; belong in CI
full E2E suite, dependency audit against live registries
```

## Local / CI Consistency

In GitHub repositories, run the exact same check commands in GitHub Actions as locally so the two environments never drift:

```bash
# local
mise run check && mise run test
```

```yaml
# .github/workflows/ci.yml - steps section
- uses: jdx/mise-action@v4 # installs the mise-managed toolchain
- run: mise run check
- run: mise run test
```

If these commands pass locally but fail in CI, the two environments have diverged. Align them instead of accumulating CI-only fixes.

See [GitHub Actions](../toolchain/github-actions.md) for the CI layering model and [mise](../toolchain/mise.md) for task-based access to the same tooling.

## Validation Entry Point

Where practical, expose the main validation workflow as `mise run check`:

```bash
mise run check
```

Chain `test` after `check` so tests never run on unvalidated code:

```toml
# mise.toml - the check -> test chain
[tasks.check]
depends = ["lint", "format", "typecheck"]

[tasks.test]
depends = ["check"] # test never runs on unvalidated code
run = "pnpm test"
```
