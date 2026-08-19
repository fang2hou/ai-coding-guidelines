# Architecture

This document orients new contributors and guards the design against
accidental drift — especially by AI agents making broad changes. Keep it short
and stable: a map of the country, not an atlas of its states.

## Overview

The repository is a trilingual guidelines corpus with machine-enforced
consistency: documents maintained as isomorphic en/zh/ja trees, a
zero-dependency validator that keeps the trees from diverging, and a thin
loader skill that fetches the corpus at run time. The product is the text;
everything else exists to keep the three trees identical and current.

## Codebase Map

- guidelines trees (en/zh/ja) — the product: three isomorphic trees of single-concern documents
- validator (tools/check-docs.ts and its tests) — front-matter schema, digests, isomorphism, punctuation, terminology, portal coverage
- PORTAL.md — task-routed reading recipes and the document inventory
- GLOSSARY.md — canonical terminology and the machine-enforced forbidden-renderings table
- templates/ — copyable project templates for consuming projects
- apply-guidelines skill (skills/) — installable thin loader; ships no guideline content
- docs/adr/ — repository decision records

## Invariants

- **Product vs repository documentation**: guideline content lives only in `guidelines/{en,zh,ja}`; repository documentation is English-only at the root and under `docs/` (ADR-0001)
- **Trilingual isomorphism**: every id exists in all three trees; heading level sequences, `version`, `source-lang`, and `status` are identical across the trio; a change to one language lands in all three in the same change
- **No canonical language**: any tree may be edited first; `source-lang` records which language authored the current version
- **Digest integrity**: `digest` is the sha256 of the normalized body, written only by `mise run fix` — never hand-edited
- **Document shape**: one concern per document, `#`/`##` headings, body capped at 300 lines, conclusions-only tone
- **Portal coverage**: every en-tree document is linked from PORTAL.md
- **Validator constraints**: `tools/check-docs.ts` stays zero-dependency and fast (ADR-0001); it is never weakened to make a check pass
- **Landing discipline**: every change lands through a pull request; local, pre-commit, and CI validation run the same `mise run check`
- **Thin-loader skill**: `skills/` carries mechanism only; guideline content changes never touch it

## Decisions

Significant decisions are recorded as ADRs in [docs/adr/](./docs/adr/).
When a request conflicts with an ADR, do not silently violate it — follow the
conflict workflow in `guidelines/en/practices/architecture-governance.md`.
