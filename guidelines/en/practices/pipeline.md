---
id: practices/pipeline
lang: en
version: 2
source-lang: en
status: active
digest: 3e5460c7
---

# Pipeline

## Scope

These rules apply to CI/CD pipelines in any system — GitHub Actions, GitLab
CI, CircleCI, Jenkins, or any other. Tool-specific rules live in the toolchain
documents for the chosen system.

## Default Choice

When the user has not specified a pipeline system, default to GitHub Actions.
See [GitHub Actions](../toolchain/github-actions.md) for the platform-specific
rules.

## Structure as Complexity Grows

A flat list of commands becomes hard to read as a pipeline grows. Break it into stages, jobs, and separate files instead of piling up unnamed steps.

- One concern per pipeline unit: one pipeline file per trigger or audience, one
  job per responsibility, one step per command.
- Prefer several small pipeline files over one growing file.
- Invoke the project's own tasks instead of duplicating project logic in
  pipeline YAML (see [mise](../toolchain/mise.md)).

## Complete check reporting

- Never put a job that runs for only one trigger inside a multi-trigger
  pipeline behind a condition. Give it its own pipeline file scoped to that
  trigger.
- A skipped job still appears in the run list as skipped, so readers must
  distinguish expected skips from failures and infer which trigger fired.
- Anyone looking at the run list should be able to tell pass from fail at a
  glance: every job in a pipeline must run whenever that pipeline triggers.
- Merge gates treat a skipped required check as passing, so this rule is for
  human readability. The real merge hazard is a required check that never
  reports at all — because its workflow did not trigger or a filter excluded
  its job — leaving the pull request stuck in `pending`. Structure workflows so
  every required check always reports a result.

## Naming and Readability

The run log must make each pipeline, job, and step understandable on its own.

- Name the pipeline, every job, and every step.
- Names state responsibilities, not tool invocations: `Validate`, not `cog`.
- Use short imperative phrases for step names that say what the step checks or
  does. A step that displays its raw shell command is effectively unnamed —
  commands are not documentation.

## Related

- [GitHub Actions](../toolchain/github-actions.md) — default platform; workflow naming and hardening rules.
- [Quality Gates](../toolchain/quality-gates.md) — run the same checks locally and in CI.
