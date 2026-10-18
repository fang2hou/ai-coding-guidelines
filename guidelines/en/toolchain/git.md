---
id: toolchain/git
lang: en
version: 4
source-lang: en
status: active
digest: 096bc0a4
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

For commits that will become part of the shared repository history, avoid meaningless messages such as:

```text
update
changes
fix stuff
wip
```

Breaking changes must be represented according to the Conventional Commits convention.

## Cocogitto

Use Cocogitto across all projects to validate Conventional Commits, wired into the local workflow via project tooling. Do not pick a different commit validator per repo or write a custom parser.

## Validation in GitHub Actions

Validate Conventional Commits in GitHub Actions with Cocogitto.

`cog verify` resolves a Git author signature even though it creates no commit, and fails with `config value 'user.name' was not found` when no identity is configured. GitHub Actions runners have no Git identity by default — configure `user.name` and `user.email` in the job before invoking it. `cog check` only reads existing commits and needs no identity.

Fail the validation pipeline when a pull request has invalid commits.

When a repository uses squash merges and takes the final commit message from the pull request title, validate the pull request title with the same Conventional Commits rules so pull request checks and final history stay consistent.

See [GitHub Actions](../toolchain/github-actions.md) for CI workflow standards.

## Repository Attributes

Commit a `.gitattributes` file in GitHub-hosted repositories so lockfiles, config files, and test fixtures do not skew GitHub's language statistics.

Use a whitelist: exclude all files by default and re-include only the project's actual source or content.

```gitattributes
* -linguist-detectable
src/** linguist-detectable
*.json -linguist-detectable
*.yaml -linguist-detectable
pnpm-lock.yaml linguist-generated
```

Prose languages such as Markdown are not counted by default; they need an explicit `linguist-detectable` rule. Files added later stay out of the statistics until they are opted in.

Including a directory in the statistics also includes every file beneath it, including data and toolchain files. Attribute rules resolve by last match, so place re-exclusion patterns after the opt-in rules: data files by extension (`*.json`, `*.yaml`, `*.toml`), lockfiles and other generated files with `linguist-generated`.

Keep the file itself comment-free; record the rationale in the pull request or the project documentation.

## Git Safety

Never force push or rewrite shared history without review and approval. AI agents must not run destructive Git commands casually.
