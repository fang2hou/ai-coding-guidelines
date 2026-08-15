---
id: toolchain/github-actions
lang: en
version: 3
source-lang: en
status: active
digest: b60f628b
---

# GitHub Actions

## Standard Platform

GitHub Actions is the standard CI/CD platform and the default choice when the user has not specified a pipeline system. Tool-agnostic pipeline rules live in [Pipeline](../practices/pipeline.md).

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

## Naming and Readability

For the tool-agnostic principle, see [Pipeline](../practices/pipeline.md).

GitHub Actions specifics:

- Give the workflow a `name` that states what it does (`CI`, `Release`). Do
  not rely on the filename, and do not repeat a job name as the workflow name.
- Give every job a readable `name`. Job names surface as status checks in
  branch protection; a reader must be able to map a failed check to a
  responsibility (`Validate`, `Validate PR title`), not to a tool invocation.
- Name every step with a short imperative phrase saying what it does or
  verifies (`Install dependencies (pnpm)`, `Check commit history (cog)`). A
  `run:` step without `name` renders as its raw command, and commands are not
  documentation.
- One concern per workflow file. Split by trigger or audience when they
  diverge; prefer several small workflows over one growing file.

## Hardening Defaults

Apply these to every workflow unless it has a stated reason not to:

```yaml
permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    timeout-minutes: 15
```

- Least privilege: default `permissions` to `contents: read`; widen only in
  the job that needs more.
- Set `timeout-minutes` on every job so a hung job cannot burn runner minutes
  up to the platform default.
- Use `concurrency` with `cancel-in-progress` so superseded runs on the same
  ref are cancelled instead of queuing.
- Pass untrusted input (PR titles, branch names, issue text) into `run:`
  scripts through environment variables, never via direct `${{ }}`
  interpolation — direct interpolation enables script injection.
- Pin actions to major version tags from verified creators at minimum;
  prefer full commit SHAs for third-party actions.

## Related

- [Pipeline](../practices/pipeline.md) — tool-agnostic pipeline structure and naming rules.
- [Quality Gates](../toolchain/quality-gates.md) — run equivalent local checks with the same project configuration.
- [Git Workflow](../toolchain/git.md) — Conventional Commits validation in CI, including the squash-merge pull-request-title rule.
