# ADR-0003: GitHub Actions Version Pinning

- **Status**: accepted
- **Date**: 2026-08-18
- **Supersedes**: the SHA-pinning preference in `toolchain/github-actions`
  (version 4)

## Context

`toolchain/github-actions` required major version tags as a floor and told
authors to "prefer full commit SHAs for third-party actions". This repository
followed its own rule in
[PR #15](https://github.com/fang2hou/ai-coding-guidelines/pull/15), pinning
`jdx/mise-action` to `3c2e0cf82a5b2e5249f0d3635a4d83d0ae861518 # v4.2.5` while
`actions/checkout` stayed on `@v7`.

The pin bought supply-chain immutability at the cost of staying current. A SHA
never picks
up a fix, a runner-image adaptation, or a feature; the workflow no longer
states which version it runs; and every upgrade becomes a manual lookup that a
reviewer cannot read in the diff. CI is exactly the place that must keep
finding problems, so an action that silently stops improving is the wrong
default. Nothing in this repository requires reproducible pipeline builds: the
workflows hold no secrets beyond the default read-only token, and pull-request
runs never execute privileged code.

## Decision

Reference actions by the current major version tag from a trusted publisher
(`actions/checkout@v7`, `jdx/mise-action@v4`). Patch and minor releases arrive
automatically; the Action Upgrade Checklist governs the one move the tag cannot
make — crossing a major boundary.

Pin a full commit SHA only under a stated immutable-build or supply-chain
policy, and record the resolved version in a trailing comment. A bare branch
name or an unversioned tag is never acceptable.

The residual risk — a floating tag trusts the publisher — is mitigated by the
hardening defaults already mandated: least-privilege `permissions`, no secrets
in workflows that run pull-request code, and no `pull_request_target` checkout
of untrusted code.

## Alternatives Considered

### Keep SHA pins for third-party actions

- Pros: immutable; a compromised or retagged release cannot reach CI.
- Cons: freezes fixes and features; hides the running version; upgrades become
  manual SHA lookups or bot noise that gets rubber-stamped.
- Why not chosen: the threat it blocks is remote for this repository, and the
  cost — a CI that stops improving — is paid on every run.

### SHA pins plus an automated update bot

- Pros: keeps immutability while restoring currency.
- Cons: adds a bot, its configuration, and a stream of unreadable
  SHA-bump pull requests to a repository whose CI is three jobs.
- Why not chosen: tooling weight out of proportion to the risk; the bumps are
  reviewed no more carefully than a floating tag would be.

## Consequences

- Workflow diffs state versions in a readable form; upgrades are one token.
- Actions receive upstream fixes without a pull request.
- A publisher compromise inside a major tag reaches CI; the read-only token and
  the no-secrets rule bound the blast radius.
- Major upgrades stay a deliberate, checklist-driven review.

## Review Triggers

- The repository starts handling secrets or publishing artifacts from CI.
- An action this repository depends on suffers a tag-based supply-chain
  incident.
- GitHub ships immutable releases or an equivalent mechanism that removes the
  tradeoff.
