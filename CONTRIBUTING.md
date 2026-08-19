# Contributing

Thanks for wanting to contribute. This document covers how changes land.
Development setup lives in [DEVELOPMENT.md](./DEVELOPMENT.md); rules for AI agents live in [AGENTS.md](./AGENTS.md).

## Ground Rules

- Smallest coherent change that solves the requirement
- All three language versions of a document land in the same change
- No unrelated cleanup mixed into content changes
- Conclusions only — no discussion process, open questions, or notes in guideline bodies

## Reporting a Bug

Open an issue with the document id and a short reproduction (the text that misleads, the rule that conflicts). Typos and straightforward wording fixes can go straight to a pull request.

## Proposing a Feature

New documents, new categories, and changes to a standing recommendation reverse prior decisions — open an issue first, sketch the trilingual structure, and record the decision as an ADR when it changes the repository model (see [ARCHITECTURE.md](./ARCHITECTURE.md)).

## Pull Request Workflow

1. Branch from `main`
2. Implement; keep `mise run check` green
3. Commit messages follow Conventional Commits, English, scope = top-level id segment (validated by Cocogitto locally and in CI)
4. Open a PR; the title follows the same convention (it becomes the squash-merge commit)
5. CI must pass; review, then squash merge

## Review Expectations

Reviewers check:

- Trio isomorphism: identical structure, native quality in zh and ja (not machine-translation tone)
- Terminology matches [GLOSSARY.md](./GLOSSARY.md)
- One concern per document; body within 300 lines
- PORTAL inventory and cross-links updated for structural changes
- No sensitive information

## Commit Conventions

Conventional Commits, enforced by Cocogitto locally and in CI:

```text
docs(toolchain): tighten oxlint type-aware rules
ci(github-actions): split PR-title workflow
```

With squash merging, the PR title must follow the same convention.

## AI-Assisted Pull Requests

AI-generated or AI-assisted PRs are welcome under the same standard.
The description must clearly include:

- **Purpose**: what the change is for
- **Impact**: what is affected
- **Context**: relevant background
- **Risks**: potential concerns
- **Testing**: validation performed and its results

The GitHub pull request template stays synchronized with these five requirements.
