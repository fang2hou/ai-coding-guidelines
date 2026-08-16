---
id: toolchain/git
lang: en
version: 3
source-lang: en
status: active
digest: 9927aac1
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

`cog verify` resolves a Git author signature even though it creates no commit, and fails with `config value 'user.name' was not found` when no identity is configured. GitHub Actions runners have no Git identity by default — configure `user.name` and `user.email` in the job before invoking it. `cog check` only reads existing commits and needs no identity.

A pull request containing invalid commit messages should fail the relevant validation pipeline.

If the repository uses squash merging and the resulting commit message is based on the pull request title, the pull request title must follow the same Conventional Commits convention.

The goal is to keep both:

- Pull request validation
- Final repository history

consistent.

See [GitHub Actions](../toolchain/github-actions.md) for CI workflow standards.

## Repository Attributes

GitHub-hosted projects should commit a `.gitattributes` file.

Use it to keep GitHub's language statistics honest: generated and incidental files (lockfiles, configs, CI definitions) must not drown out the project's core content.

Prefer a whitelist over a blacklist: exclude everything from the statistics by default and re-include only what the project is.

```gitattributes
* -linguist-detectable
src/** linguist-detectable
pnpm-lock.yaml linguist-generated
```

Prose languages such as Markdown are not counted by default; they need an explicit `linguist-detectable` rule. Files added later stay out of the statistics until they are opted in.

Keep the file itself comment-free; record the rationale in the pull request or the project documentation.

## Git Safety

Do not force push shared repository history without appropriate review and approval.

Follow the established review workflow.

Do not rewrite shared history merely for convenience.

AI agents must not perform destructive Git operations casually.
