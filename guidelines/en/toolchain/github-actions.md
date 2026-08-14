---
id: toolchain/github-actions
lang: en
version: 1
source-lang: en
status: active
digest: 72fbdfe4
---

# GitHub Actions

## Standard Platform

GitHub Actions is the standard CI/CD platform.

## Action Upgrade Checklist

When creating or modifying a GitHub Actions workflow:

1. Check whether the actions being used have newer stable versions.
2. Review the official README or documentation before upgrading.
3. Check for breaking changes.
4. Check whether required inputs, permissions, runtime versions, or behavior have changed.
5. Prefer moving to the current supported version when migration is safe.

Do not blindly update an action version number without checking migration requirements.

## CI Layering

CI should use the same standardized project tooling as local development wherever practical.

Prefer:

```text
GitHub Actions
    -> mise
        -> project task
            -> pnpm / uv / prek / cocogitto / test tooling
```

rather than duplicating project logic directly inside workflow YAML.

mise is the entry point CI invokes; do not duplicate tool setup in workflow YAML. See [mise](../toolchain/mise.md).

## Related

- [Quality Gates](../toolchain/quality-gates.md) — run equivalent local checks with the same project configuration.
- [Git Workflow](../toolchain/git.md) — Conventional Commits validation in CI, including the squash-merge pull-request-title rule.
