---
id: decisions/0001-guideline-repo-structure
lang: en
version: 1
source-lang: en
status: active
digest: a2eb49ba
---

# ADR-0001: Guideline Repository Structure and i18n Model

- **Status**: accepted
- **Date**: 2026-08-15

## Context

The engineering guideline lived as a single ~1300-line Markdown file. It was
too long for humans to edit reliably and impossible for AI agents to load
selectively. The team works across Chinese, English, and Japanese; every
member must be able to improve the guideline in their strongest language
without forking the content.

## Decision

- Content lives in three isomorphic language trees: `docs/en/**`,
  `docs/zh/**`, `docs/ja/**`. Each document is a small, single-concern file
  (body limited to 300 lines).
- There is **no canonical language**. Any language may be edited first; the
  front matter records `version`, `source-lang`, and `status`, which must be
  identical across the trio, plus a per-file `digest` of the normalized body.
  The other two languages are native-quality rewrites landed in the same
  change.
- Machine-facing root files (`AGENTS.md`, `PORTAL.md`, `GLOSSARY.md`,
  `README.md`, `templates/**`, `tools/**`) are English-only.
- A zero-dependency validator (`tools/check-docs.ts`) enforces tree
  isomorphism, front matter schema, trio consistency, digests, heading-level
  parity, the size cap, and portal coverage. CI and the pre-commit hook run
  the same check.

## Alternatives Considered

### Suffix-sorted files in one tree (`mise.en.md`, `mise.zh.md`, ...)

- Pros: translations physically adjacent; easy review diffing.
- Cons: every directory carries 3x files; noisy browsing; contradicts the
  goal of a clean repository layout.

### One folder per document (`docs/toolchain/mise/{en,zh,ja}.md`)

- Pros: trio co-located; directory count unchanged.
- Cons: deeper nesting; file names lose semantics; no single-language
  immersive reading path.

### Canonical language with a translation pipeline

- Pros: version model is trivial; tooling decides staleness.
- Cons: edits in non-canonical languages become second-class; conflicts with
  the requirement that any team member improves the content in their own
  language.

## Consequences

- Every content edit touches at least three files; agents handle this as a
  routine protocol (see `AGENTS.md`).
- The validator must stay zero-dependency and fast, or it will be bypassed.
- Heading-level parity is enforced, not full structural identity, so each
  language can phrase headings idiomatically.

## Review Triggers

- Document count grows beyond ~60 ids.
- Team composition or working languages change.
- The validator becomes a routine obstacle to editing.
