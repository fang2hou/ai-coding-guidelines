---
id: toolchain/quality-gates
lang: en
version: 2
source-lang: en
status: active
digest: 0d36d39a
---

# Quality Gates

## prek

Use `prek` as the standard pre-commit framework.

Do not introduce another pre-commit framework unless the user explicitly approves an exception.

Point the hook at the same entry point everything else uses:

```yaml
# .pre-commit-config.yaml - the hook runs the shared entry point
repos:
  - repo: local
    hooks:
      - id: check
        entry: mise run check
        language: system
        pass_filenames: false
```

### Rejected Alternatives

- pre-commit
- Lefthook

## Default Check Set

The repository's prek configuration should include the relevant fast checks for the project.

By default, this should include:

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
typecheck    -> tsc --noEmit
```

## Keep Checks Fast

Keep pre-commit checks meaningful and fast.

Do not add expensive checks merely to make the hook configuration appear comprehensive.

Checks intended to run on every commit should remain fast enough for frequent use by both humans and AI agents.

```text
# good - fast enough for every commit
lint, format check, typecheck, secret scanning

# bad - too slow for a commit hook; belong in CI
full E2E suite, dependency audit against live registries
```

## Local / CI Consistency

For repositories hosted on GitHub, GitHub Actions should run equivalent checks using the same project configuration so local and CI validation do not diverge.

The invariant: the exact commands that gate a change locally are the exact commands CI runs.

```bash
# local
mise run check && mise run test
```

```yaml
# .github/workflows/ci.yml - steps section
    - uses: jdx/mise-action@v2   # installs the mise-managed toolchain
    - run: mise run check
    - run: mise run test
```

If these commands pass locally but fail in CI, the two environments have diverged. Align them instead of accumulating CI-only fixes.

See [GitHub Actions](../toolchain/github-actions.md) for the CI layering model and [mise](../toolchain/mise.md) for task-based access to the same tooling.

## Validation Entry Point

Whenever practical, expose the relevant quality workflow through a mise task.

For example:

```bash
mise run check
```

The task above is the predictable entry point for the project's main validation workflow.

Chain `test` after `check` so tests never run on unvalidated code:

```toml
# mise.toml - the check -> test chain
[tasks.check]
depends = ["lint", "format", "typecheck"]

[tasks.test]
depends = ["check"] # test never runs on unvalidated code
run = "pnpm test"
```
