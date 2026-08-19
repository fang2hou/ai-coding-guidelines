---
id: practices/project-documentation
lang: en
version: 6
source-lang: en
status: active
digest: 903d2161
---

# Required Project Documentation

Every project must maintain `AGENTS.md`, `README.md`, `DEVELOPMENT.md`, and `CONTRIBUTING.md`. `ARCHITECTURE.md` becomes required once the project has meaningful architectural boundaries. Use the templates under `templates/` as the starting point.

## AGENTS.md

Every project must include `AGENTS.md` at the repository root.

It is the agent-facing entry point: commands, engineering standards, repository layout, boundaries, the confirmed language policy, and project conventions.

Authoring rules — surface selection, section order, size, nested files — are defined in [Authoring AGENTS.md](agents-file.md).

Template: [project-agents.template.md](../../../templates/project-agents.template.md)

## README.md

Every project must include `README.md`.

The README is the project's front door, written for human readers: within the
first screen it must answer what the project is, why it exists, and how to
start using it. Agent-facing rules — engineering standards, the confirmed
language policy, project conventions — live in `AGENTS.md` (see
`templates/project-agents.template.md`), and the README hands the repository
to agents with a copyable instruction.

It must open with an identity block: the project name, a one-sentence
tagline stating what the project is and for whom, and status badges. When
the project has a visual surface — a UI, CLI output, generated artifacts —
place a screenshot or a short GIF immediately after the identity block.

The body is organized around reader tasks, not around the repository
directory structure. It should contain:

- Why the project exists, what it intentionally does not do, and the project status; when alternatives are obvious, one line on how it differs
- A quick start: prerequisites (toolchain, supported platforms, pinned versions), copy-paste commands for the first run, and the expected result
- Basic usage and the main workflows, shown as examples with their expected output
- A copyable instruction that hands the repository to an AI coding agent via `AGENTS.md`
- A Goal → Read table linking the detail documents below
- Where to get help: the issue tracker, team channel, or contact
- The license, stated explicitly

Keep it scannable: paragraphs of one to three sentences, one idea per
bullet, copyable commands in code blocks. Present enumerations as lists
or tables, never as running prose. Route to the detail documents instead
of duplicating their content — but never shrink the README to a bare
"see the docs" pointer: it must stand alone as the entry point. Add a
table of contents once it grows beyond a few screens.

An outdated README is worse than none, because it actively misleads.
Update it in the same change that alters setup, usage, or scope, and
state at the top when development has slowed or stopped.

The confirmed product/UI language policy (see [Language Policy](language-policy.md)) is agent-facing: record it in `AGENTS.md`, not in the README.

Template: [README.template.md](../../../templates/README.template.md)

## DEVELOPMENT.md

Every project must include `DEVELOPMENT.md`.

It should describe:

- Development workflow
- Toolchain
- Common mise tasks
- Coding standards
- Testing workflow
- Local setup
- Validation workflow
- Deployment workflow when relevant

It should make it possible for both humans and AI agents to understand how development should be performed.

Template: [DEVELOPMENT.template.md](../../../templates/DEVELOPMENT.template.md)

## CONTRIBUTING.md

Every project must include `CONTRIBUTING.md`.

It should document:

- Contribution expectations
- Issue workflow when relevant
- Pull request workflow
- Review expectations
- Required validation
- Commit conventions

For AI-generated or AI-assisted pull requests, the pull request description should clearly include:

- Purpose of the change
- Impact of the change
- Relevant context or background
- Potential risks or concerns
- Testing or validation performed

The GitHub pull request template must stay synchronized with these requirements.

Template: [CONTRIBUTING.template.md](../../../templates/CONTRIBUTING.template.md)

## ARCHITECTURE.md

Projects with meaningful architectural boundaries should maintain `ARCHITECTURE.md`.

Keep it short and operational.

It should contain a brief overview, a coarse codebase map (name modules, do not link files), and the architectural invariants.

Avoid turning it into a comprehensive theoretical architecture document.

Its primary purpose is to prevent accidental architecture drift.

Invariants and ADR practice are defined in [Architecture Governance](architecture-governance.md).

Template: [ARCHITECTURE.template.md](../../../templates/ARCHITECTURE.template.md)
