---
id: practices/project-documentation
lang: en
version: 6
source-lang: en
status: active
digest: ffcf7cf9
---

# Required Project Documentation

Every project must maintain `AGENTS.md`, `README.md`, `DEVELOPMENT.md`, and `CONTRIBUTING.md`. `ARCHITECTURE.md` becomes required once the project has meaningful architectural boundaries. Use the templates under `templates/` as the starting point.

Documentation modes follow [Diátaxis](https://diataxis.fr/): the README orients and routes; `DEVELOPMENT.md` and `CONTRIBUTING.md` carry how-to guidance and reference; `ARCHITECTURE.md` is explanation; `AGENTS.md` is reference for agents. Keep one mode per document — when a document needs another mode, link to the document that owns it instead of mixing it in.

## AGENTS.md

Every project must include `AGENTS.md` at the repository root.

It is the agent-facing entry point: commands, engineering standards, repository layout, boundaries, the confirmed language policy, and project conventions.

Authoring rules — surface selection, section order, size, nested files — are defined in [Authoring AGENTS.md](agents-file.md).

Template: [project-agents.template.md](../../../templates/project-agents.template.md)

## README.md

Every project must include `README.md`.

The README is the project's front door, written for readers who skim:
the first screen states what the project is, what need it solves, and
how to get it running. It orients and routes; it does not teach,
document the machinery, or explain the background — those belong to the
detail documents and their modes. Agent-facing rules — engineering
standards, the confirmed language policy, project conventions — live in
`AGENTS.md` (see `templates/project-agents.template.md`), and the README
hands the repository to agents with a copyable instruction.

The body is organized around reader tasks, not around the repository
directory structure. Do not write a separate Why section; follow this
order:

- An identity block: the project name, a one-sentence tagline stating what the project is and for whom, and status badges — followed by one to three plain sentences on the need the project solves. Mention what the project intentionally is not, and its status, only when that saves the reader time.
- When the project has a visual surface — a UI, CLI output, generated artifacts — a screenshot or a short GIF immediately after the opening.
- One get-it-running section: `Quick Start` for projects that need a developer, `Usage` for end-user products, `Usage / Quick Start` when both apply. The AI path comes first — the copyable instruction that hands the repository to an AI coding agent via `AGENTS.md` — and the manual steps follow: prerequisites (toolchain, supported platforms, pinned versions), copy-paste commands, and the expected result. For end-user products, show the two or three most common uses as examples with their expected output.
- Concepts and features: the few ideas a reader needs, and how the project differs from the alternatives — one line per item, placed after the get-it-running section.
- A Goal → Read table linking the detail documents below.
- The license, stated explicitly.

Keep section titles standard, short, and instantly recognizable — `Quick Start`, `Usage`, `Concepts & Features`, `Learn More`, `License` — and prefix each with one semantically stable emoji: 🚀 for the get-it-running section, ✨ for concepts and features, 📚 for further reading, 📄 for the license. The project title may carry at most one identifying emoji. Keep the emoji set small and consistent, and never decorate body text with emoji.

Fold long auxiliary content — platform-specific setup, environment variable tables, extended examples, troubleshooting — into `<details>` blocks whose `<summary>` names the content in a few words. Keep one blank line after `<summary>` so Markdown renders, and never collapse the primary path: the opening, the get-it-running commands, and the license stay expanded.

Keep it scannable: paragraphs of one to three sentences, one idea per
bullet, copyable commands in code blocks. Present enumerations as lists
or tables, never as running prose. Route to the detail documents
instead of duplicating their content — teaching, reference, and
explanation are their modes, not the README's — but never shrink the
README to a bare "see the docs" pointer: it must stand alone as the
entry point. Add a table of contents once it grows beyond a few
screens.

An outdated README is worse than none, because it actively misleads.
Update it in the same change that alters setup, usage, or scope, and
state at the top when development has slowed or stopped.

The confirmed product/UI language policy (see [Language Policy](language-policy.md)) is agent-facing: record it in `AGENTS.md`, not in the README.

Template: [README.template.md](../../../templates/README.template.md)

## DEVELOPMENT.md

Every project must include `DEVELOPMENT.md`.

It is the project's how-to and reference layer: step-by-step workflow first, command and configuration reference after.

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

It is a how-to guide: ordered steps for landing a change, not background essays.

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

Its mode is explanation — the reasons behind the boundaries — not exhaustive reference.

Avoid turning it into a comprehensive theoretical architecture document.

Its primary purpose is to prevent accidental architecture drift.

Invariants and ADR practice are defined in [Architecture Governance](architecture-governance.md).

Template: [ARCHITECTURE.template.md](../../../templates/ARCHITECTURE.template.md)
