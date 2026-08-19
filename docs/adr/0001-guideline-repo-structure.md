# ADR-0001: Guideline Repository Structure and i18n Model

- **Status**: accepted (revised 2026-08-15: guideline content moved from `docs/` to `guidelines/`; ADRs de-trilingualized into `docs/adr/`; revised 2026-08-20: the repository maintains the standard root documentation set — `DEVELOPMENT.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md` — per `practices/project-documentation`, with `AGENTS.md` slimmed to agent-facing rules per `practices/agents-file`)
- **Date**: 2026-08-15

## Context

The engineering guideline lived as a single ~1300-line Markdown file. It was
too long for humans to edit reliably and impossible for AI agents to load
selectively. The team works across Chinese, English, and Japanese; every
member must be able to improve the guideline in their strongest language
without forking the content. The repository also produces two different kinds
of Markdown: the guideline product itself, and ordinary project documentation
— conflating them under `docs/` misled agents into treating the product as
project documentation.

## Decision

- **Guideline content (the product) lives in `guidelines/{en,zh,ja}/**`\*\* —
  three isomorphic language trees. Each document is a small, single-concern
  file (body limited to 300 lines).
- **This repository's own documentation is English-only** — the standard
  root set (`AGENTS.md`, `README.md`, `DEVELOPMENT.md`, `CONTRIBUTING.md`,
  `ARCHITECTURE.md`) plus `docs/adr/` for architecture decision records. ADRs
  are never trilingual; they record repository decisions, not product
  content.
- Machine-facing root files (`AGENTS.md`, `PORTAL.md`, `GLOSSARY.md`,
  `README.md`, `templates/**`, `tools/**`) are English-only.
- There is **no canonical language** for guideline content. Any language may
  be edited first; the front matter records `version`, `source-lang`, and
  `status`, which must be identical across the trio, plus a per-file
  `digest` of the normalized body. The other two languages are native-quality
  rewrites landed in the same change.
- A zero-dependency validator (`tools/check-docs.ts`) enforces tree
  isomorphism, front matter schema, trio consistency, digests, heading-level
  parity, the size cap, and portal coverage. CI and the pre-commit hook run
  the same check.

## Alternatives Considered

### Suffix-sorted files in one tree (`mise.en.md`, `mise.zh.md`, ...)

- Pros: translations physically adjacent; easy review diffing.
- Cons: every directory carries 3x files; noisy browsing; contradicts the
  goal of a clean repository layout.

### One folder per document (`guidelines/toolchain/mise/{en,zh,ja}.md`)

- Pros: trio co-located; directory count unchanged.
- Cons: deeper nesting; file names lose semantics; no single-language
  immersive reading path.

### Canonical language with a translation pipeline

- Pros: version model is trivial; tooling decides staleness.
- Cons: edits in non-canonical languages become second-class; conflicts with
  the requirement that any team member improves the content in their own
  language.

### Trilingual ADRs under the language trees

- Pros: single reading path for all content.
- Cons: decisions are repository documentation, not product; translating
  them triples the cost of every structural decision without serving any
  consumer.

## Consequences

- Every content edit touches at least three files; agents handle this as a
  routine protocol (see `AGENTS.md`).
- The validator must stay zero-dependency and fast, or it will be bypassed.
- Heading-level parity is enforced, not full structural identity, so each
  language can phrase headings idiomatically.
- `guidelines/` and `docs/` have disjoint concerns; adding project
  documentation goes to `docs/` (English), adding guideline content goes to
  `guidelines/` (trilingual).

## Review Triggers

- Document count grows beyond ~60 ids.
- Team composition or working languages change.
- The validator becomes a routine obstacle to editing.
