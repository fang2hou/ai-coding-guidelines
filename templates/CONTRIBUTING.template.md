# Contributing

## Contribution Expectations

- Smallest coherent change that solves the requirement
- No unrelated cleanup mixed into feature changes
- No new dependencies without justification (see the guideline's dependency discipline)

## Issue Workflow

`<When relevant: how issues are triaged and linked to changes>`

## Pull Request Workflow

1. Branch from `main`
2. Implement; keep `mise run check` green
3. Commit messages follow Conventional Commits (validated by Cocogitto)
4. Open a PR; CI must pass
5. Review, then merge (squash merge unless otherwise stated)

## Review Expectations

Reviewers check:

- Correctness of the requested behavior
- No accidental scope creep, files, or dependencies
- Compatibility with architecture invariants and ADRs
- No sensitive information

## Required Validation

```bash
mise run check
```

## Commit Conventions

Conventional Commits, enforced by Cocogitto locally and in CI:

```text
feat(chat): add streaming response rendering
fix(auth): handle expired sessions
```

With squash merging, the PR title must follow the same convention (it becomes the commit message).

## AI-Assisted Pull Requests

For AI-generated or AI-assisted PRs, the description must clearly include:

- **Purpose**: what the change is for
- **Impact**: what is affected
- **Context**: relevant background
- **Risks**: potential concerns
- **Testing**: validation performed and its results

Keep the GitHub pull request template synchronized with these five requirements.
