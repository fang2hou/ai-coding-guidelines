---
id: toolchain/github-actions
lang: en
version: 4
source-lang: en
status: active
digest: 6df0a361
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

## Event scoping

- Scope each workflow file to one trigger audience. A project-validation
  workflow runs on `push` (default branch) and `pull_request`; rules that
  exist only for pull requests — for example, PR title rules — live in their
  own workflow triggered by `pull_request` alone.
- Never emulate that split with `if: github.event_name == 'pull_request'` on a
  job inside a multi-trigger workflow: on `push` runs the job reports skipped
  and the run reads as a partial failure. See
  [Pipeline](../practices/pipeline.md) for the tool-agnostic rule.
- `pull_request` defaults to `opened`, `synchronize`, and `reopened` — the
  right set for validating code. List `types:` only to go beyond the default:
  a workflow that validates PR metadata an edit can change (the title) must
  add `edited`, so retitled pull requests re-verify. Never list activity types
  that cannot change the outcome; every listed type is another trigger.
- A required status check is satisfied even by a skipped job — the merge gate
  will not enforce this rule. Apply it for readable run lists, and guard the
  real hazard: a required check whose workflow does not run on `pull_request`,
  or whose job is filtered out entirely, never reports and stays pending.
  Every context that requires a check must produce a report for it.

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
- Never use `pull_request_target` to check out and run pull-request code; it
  executes the base workflow definition with repository secrets. Use
  `pull_request`.

## Related

- [Pipeline](../practices/pipeline.md) — tool-agnostic pipeline structure and naming rules.
- [Quality Gates](../toolchain/quality-gates.md) — run equivalent local checks with the same project configuration.
- [Git Workflow](../toolchain/git.md) — Conventional Commits validation in CI, including the squash-merge pull-request-title rule.
