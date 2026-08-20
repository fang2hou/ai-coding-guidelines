# Contributing

Thanks for wanting to contribute. This document covers how changes land.
Development setup lives in [DEVELOPMENT.md](./DEVELOPMENT.md); rules for AI agents live in [AGENTS.md](./AGENTS.md).

## Ground Rules

- Smallest coherent change that solves the requirement
- No unrelated cleanup mixed into feature changes
- No new dependencies without justification (see the guideline's dependency discipline)

## Reporting a Bug

{{Issue-first / PR-first policy, e.g. open an issue with a reproduction before opening a PR.}}

- Search existing issues first
- Include a minimal reproduction and what you expected instead

## Proposing a Feature

{{Discuss before implementing, e.g. open an issue and collect feedback before writing code.}}

## Pull Request Workflow

1. Branch from `main`
2. Implement; keep `mise run check` green
3. Commit messages follow Conventional Commits (validated by Cocogitto)
4. Open a PR; CI must pass
5. Review, then merge (squash merge unless otherwise stated)

Expect review within {{e.g. two business days}}.

## Review Expectations

Reviewers check:

- Correctness of the requested behavior
- No accidental scope creep, files, or dependencies
- Compatibility with architecture invariants and ADRs
- No sensitive information

## Commit Conventions

Conventional Commits, enforced by Cocogitto locally and in CI:

```text
feat(chat): add streaming response rendering
fix(auth): handle expired sessions
```

With squash merging, the PR title must follow the same convention (it becomes the commit message).

## Pull Request Descriptions

Every pull request description must clearly include:

- **Purpose**: what the change is for
- **Impact**: what is affected
- **Context**: relevant background
- **Risks**: potential concerns
- **Testing**: validation performed and its results

Keep the GitHub pull request template synchronized with these five requirements.
