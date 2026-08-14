---
id: toolchain/git
lang: en
version: 1
source-lang: en
status: active
digest: 3d1e426d
---

# Git Workflow

## Conventional Commits

All project commits must follow the Conventional Commits specification.

Use meaningful types such as:

```text
feat
fix
refactor
test
docs
build
ci
chore
```

Use scopes when they improve clarity.

Examples:

```text
feat(chat): add streaming response rendering
fix(auth): handle expired sessions
refactor(api): simplify request validation
test(search): cover empty-result behavior
ci(commit): validate conventional commits
```

Avoid meaningless commit messages such as:

```text
update
changes
fix stuff
wip
```

for commits that will become part of the shared repository history.

Breaking changes must be represented according to the Conventional Commits convention.

## Cocogitto

Cocogitto is the standard Conventional Commits validation tool.

Use Cocogitto consistently across projects rather than selecting a different commit validator for every repository.

Where appropriate, integrate Cocogitto with the local commit workflow through the standardized project tooling.

Do not implement a custom Conventional Commits parser when Cocogitto already provides the required validation.

## Validation in GitHub Actions

GitHub Actions must include a Conventional Commits validation check.

Use Cocogitto for this validation.

A pull request containing invalid commit messages should fail the relevant validation pipeline.

If the repository uses squash merging and the resulting commit message is based on the pull request title, the pull request title must follow the same Conventional Commits convention.

The goal is to keep both:

- Pull request validation
- Final repository history

consistent.

See [GitHub Actions](../toolchain/github-actions.md) for CI workflow standards.

## Git Safety

Do not force push shared repository history without appropriate review and approval.

Follow the established review workflow.

Do not rewrite shared history merely for convenience.

AI agents must not perform destructive Git operations casually.
