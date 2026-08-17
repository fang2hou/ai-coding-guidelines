---
id: practices/pipeline
lang: en
version: 2
source-lang: en
status: active
digest: 3c65b370
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

A pipeline that starts as a flat list of commands stops being readable once it
grows. Structure it with the primitives the chosen tool recommends — stages,
jobs, separate files — instead of accreting anonymous steps.

- One concern per pipeline unit: one pipeline file per trigger or audience, one
  job per responsibility, one step per command.
- Prefer several small pipeline files over one growing file.
- Invoke the project's own tasks instead of duplicating project logic in
  pipeline YAML (see [mise](../toolchain/mise.md)).

## Complete check reporting

- Never put a unit that only runs for one trigger inside a pipeline that runs
  for several, gated by a condition. Give it its own pipeline file scoped to
  that trigger.
- A conditionally skipped unit still appears in the run as skipped, so the run
  reads as a partial pass that looks like a failure and forces the reader to
  reconstruct which trigger fired.
- Judge pass or fail from the run list alone: every unit listed for a pipeline
  must execute whenever that pipeline runs.
- A skipped result satisfies a required check, so the merge gate never forces
  this rule — apply it for readability, and guard the real hazard: a required
  check that never reports at all, because the workflow did not trigger or its
  filters excluded the job, stays pending and blocks the context expecting it.
  Restructure until every context that requires a check produces a report for
  it.

## Naming and Readability

Every level of the pipeline must stay explainable from the run log alone.

- Name the pipeline, every job, and every step.
- Names state responsibilities, not tool invocations: `Validate`, not `cog`.
- Step names are short imperative phrases saying what the step does or
  verifies. A step that renders as its raw command is unnamed in practice, and
  commands are not documentation.

## Related

- [GitHub Actions](../toolchain/github-actions.md) — default platform; workflow naming and hardening rules.
- [Quality Gates](../toolchain/quality-gates.md) — run the same checks locally and in CI.
