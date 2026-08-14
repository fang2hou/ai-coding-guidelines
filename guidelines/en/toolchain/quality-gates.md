---
id: toolchain/quality-gates
lang: en
version: 1
source-lang: en
status: active
digest: 0f724aa2
---

# Quality Gates

## prek

Use `prek` as the standard pre-commit framework.

Do not introduce another pre-commit framework unless the user explicitly approves an exception.

### Rejected Alternatives

* pre-commit
* Lefthook

## Default Check Set

The repository's prek configuration should include the relevant fast checks for the project.

By default, this should include:

* Linting
* Formatting checks
* Language-specific static checks
* Security-related checks
* Dependency checks where appropriate
* Secret scanning

## Keep Checks Fast

Keep pre-commit checks meaningful.

Do not add expensive checks merely to make the hook configuration appear comprehensive.

Checks intended to run on every commit should remain fast enough for frequent use by both humans and AI agents.

## Local / CI Consistency

For repositories hosted on GitHub, GitHub Actions should run equivalent checks using the same project configuration so local and CI validation do not diverge.

See [GitHub Actions](../toolchain/github-actions.md) for the CI layering model and [mise](../toolchain/mise.md) for task-based access to the same tooling.

## Validation Entry Point

Whenever practical, expose the relevant quality workflow through a mise task.

For example:

```bash
mise run check
```

should provide a predictable entry point for the project's main validation workflow.
