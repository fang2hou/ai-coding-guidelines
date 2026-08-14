---
id: practices/project-documentation
lang: en
version: 1
source-lang: en
status: active
digest: b2e95167
---

# Required Project Documentation

Every project must maintain the four documents below. Use the templates under `templates/` as the starting point.

## README.md

Every project must include `README.md`.

The README is written for both human developers and AI agents.

It should contain the information necessary to understand and use the project, including:

- Project overview
- Purpose
- Setup instructions
- Basic usage
- Important architecture or workflow references
- Relevant environment requirements

Keep it current as the project evolves.

The project's confirmed product/UI language policy (see [Language Policy](language-policy.md)) should also be recorded in an appropriate clearly visible project document, preferably the README or DEVELOPMENT document.

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

Avoid turning it into a comprehensive theoretical architecture document.

Its primary purpose is to prevent accidental architecture drift.

Invariants and ADR practice are defined in [Architecture Governance](architecture-governance.md).

Template: [ARCHITECTURE.template.md](../../../templates/ARCHITECTURE.template.md)
