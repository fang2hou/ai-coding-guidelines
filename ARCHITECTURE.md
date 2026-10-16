# Architecture

This document orients contributors and keeps the design from drifting — especially when AI agents make broad changes. Keep it short and stable: name the main parts and rules without listing every file.

## Overview

This repository is a three-language guidelines collection (`en`, `zh`, `ja`) checked automatically for consistency. A zero-dependency validator keeps the three trees aligned, and a lightweight skill fetches the guidelines at run time. The text in `guidelines/` is the product; everything else exists to keep the three language trees accurate and in sync.

## Codebase Map

- `guidelines/{en,zh,ja}/` — the product: three matching trees of single-topic documents
- `tools/check-docs.ts` (and `check-docs.test.ts`) — checks front matter, digests, heading parity, punctuation, terminology, and portal links
- `PORTAL.md` — task-based reading recipes and the full document list
- `GLOSSARY.md` — shared terminology and the machine-checked list of forbidden translations
- `templates/` — copyable documentation templates for projects using these guidelines
- `skills/apply-guidelines/` — installable loader skill; carries no guideline text of its own
- docs/adr/ — repository decision records

## Invariants

- **Product vs repository documentation**: guideline content lives only in `guidelines/{en,zh,ja}`; repository documentation at the root and under `docs/` is English-only (ADR-0001)
- **Three-language parity**: every document `id` exists in all three trees; heading levels, `version`, `source-lang`, and `status` match across `en`, `zh`, and `ja`; changes to one language land in all three in the same pull request
- **No primary language**: you may edit any language tree first; `source-lang` records which language authored the current version
- **Digest integrity**: `digest` is the first 8 hex characters of the normalized body's sha256 hash, updated only by `mise run fix` — never edited by hand
- **Document shape**: one topic per document, `#`/`##` headings, body capped at 300 lines, conclusions only
- **Portal coverage**: every document in `guidelines/en/` is linked from `PORTAL.md`
- **Validator constraints**: `tools/check-docs.ts` stays zero-dependency and fast (ADR-0001); never weaken it to make a check pass
- **Landing discipline**: every change lands through a pull request; local development, pre-commit hooks, and CI all run `mise run check`
- **Loader-only skill**: `skills/` contains only the fetching and audit workflow; editing guidelines never requires changing `skills/`

## Decisions

Significant decisions are recorded as ADRs in [docs/adr/](./docs/adr/).
When a request conflicts with an ADR, do not silently violate it — follow the
conflict workflow in `guidelines/en/practices/architecture-governance.md`.
