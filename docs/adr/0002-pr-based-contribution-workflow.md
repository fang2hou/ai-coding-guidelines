# ADR-0002: PR-Based Contribution Workflow

- **Status**: accepted
- **Date**: 2026-08-15

## Context

The repository landed changes as direct commits to `main`. CI ran on every
push, so errors were caught — but nothing enforced review, and the resulting
history depended on individual discipline. The team now runs PR-based
development: every functional change (addition or removal) goes through a
pull request so cloud CI reviews it before it lands. This repository also
practices what its own guideline mandates: `toolchain/git` requires that,
under squash merging, the PR title follow Conventional Commits — because the
title becomes the final commit message.

## Decision

All changes to this repository land through pull requests. Nobody — humans
or AI agents — pushes directly to `main`.

CI enforces two Conventional Commits checks on every pull request:

- `cog check` validates the commits in the PR.
- A dedicated `pr-title` job runs `cog verify` on the PR title, so the
  squash-merge commit message is valid by construction.

Merging requires CI to pass. Both checks use Cocogitto — no second commit
validator is introduced.

## Alternatives Considered

### Keep direct pushes with CI on `main`

- Pros: fastest for single-maintainer edits.
- Cons: no review gate; CI failure means broken `main` history to rewrite;
  contradicts the PR-based policy the team now follows.
- Why not chosen: no review before landing, and failure surfaces after the
  history is already public.

### A dedicated PR-title action (e.g. semantic-pull-request)

- Pros: rich configuration, familiar output.
- Cons: duplicates Cocogitto's validation with a second Conventional Commits
  parser, which `toolchain/git` rejects.
- Why not chosen: introduces a second commit-message validator, which the
  repository's own `toolchain/git` standard forbids.

### GitHub branch protection alone

- Pros: enforcement lives next to the merge button.
- Cons: repository settings are invisible to agents and not versioned; CI
  checks keep the policy in-repo and reviewable.
- Why not chosen: policy held only in settings is invisible to AI agents and
  unreviewed; kept as the backstop, not the source of truth.

## Consequences

- Every change carries PR overhead; trivial fixes pay it too.
- The required-check list grows (`check`, `pr-title`) — branch protection
  must select both.
- AI agents operating on this repository must open pull requests instead of
  pushing to `main` (encoded in `AGENTS.md`).
- History stays clean without manual rewriting: valid commits in, valid
  squash-merge messages out.

## Review Triggers

- The team returns to direct-commit development.
- Squash merging is replaced by a merge strategy where the PR title is not
  the final commit message.
- Cocogitto becomes unmaintained or is replaced (per `toolchain/git`).
