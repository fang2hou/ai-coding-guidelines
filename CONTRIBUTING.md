# Contributing

This document explains how to propose, review, and merge changes.
For development setup, see [DEVELOPMENT.md](./DEVELOPMENT.md); for AI agent instructions, see [AGENTS.md](./AGENTS.md).

## Ground Rules

- Make the smallest complete change that meets the requirement
- Include all three language versions of a document in the same change
- No unrelated cleanup mixed into content changes
- Conclusions only — no discussion process, open questions, or notes in guideline bodies

## Reporting a Bug

Open an issue with the document id and the passage that misleads or conflicts with another rule. Typos and clear wording fixes can go straight to a pull request.

## Proposing a Feature

Before adding a document, adding a category, or reversing an existing recommendation, open an issue to discuss the change and sketch the three-language structure. If it alters the repository model, record the decision in an ADR (see [ARCHITECTURE.md](./ARCHITECTURE.md)).

## Pull Request Workflow

1. Branch from `main`
2. Implement; keep `mise run check` green
3. Commit messages follow Conventional Commits, English, scope = top-level id segment (validated by Cocogitto locally and in CI)
4. Open a PR; the title follows the same convention (it becomes the squash-merge commit)
5. CI must pass; review, then squash merge

## Review Expectations

Reviewers check:

- Matching structure across all three languages, with natural phrasing in `zh` and `ja` (no stiff literal translations)
- Terminology matches [GLOSSARY.md](./GLOSSARY.md)
- One topic per document; body within 300 lines
- PORTAL inventory and cross-links updated when documents are added, removed, or renamed
- No sensitive information

## Commit Conventions

Conventional Commits, enforced by Cocogitto locally and in CI:

```text
docs(toolchain): tighten oxlint type-aware rules
ci(github-actions): split PR-title workflow
```

With squash merging, the PR title must follow the same convention.

## Pull Request Descriptions

Every pull request description must include:

- **Purpose**: what the change is for
- **Impact**: what is affected
- **Context**: relevant background
- **Risks**: potential concerns
- **Testing**: validation performed and its results

The GitHub pull request template stays synchronized with these five requirements.
