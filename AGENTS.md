# AGENTS.md

Protocol for AI agents maintaining this repository. Consumers reading the
guideline should start from [PORTAL.md](./PORTAL.md) instead.

## Purpose & Audiences

This repository is the single source of truth for cross-project engineering
standards. Two agent roles:

- **Consumers** (read-only): project agents applying the guideline in other
  repositories. Enter via [PORTAL.md](./PORTAL.md).
- **Maintainers** (read-write): agents and humans evolving the guideline.
  Follow this document.

Repository documents always take precedence over remembered summaries.

## Repository Map

| Path | Purpose |
| --- | --- |
| `docs/{en,zh,ja}/` | Trilingual content trees (isomorphic) |
| `docs/en/principles/` | Core engineering principles |
| `docs/en/toolchain/` | Mandatory tools and platform standards |
| `docs/en/libraries/` | Library/framework selection catalog |
| `docs/en/practices/` | Cross-cutting engineering practices |
| `docs/en/decisions/` | ADRs about this repository itself |
| `templates/` | Copyable templates for consuming projects (English only) |
| `tools/check-docs.ts` | Trilingual consistency validator |
| `PORTAL.md` | Task-based reading routes for consumers (English only) |
| `GLOSSARY.md` | Canonical trilingual terminology (English only) |

## Content Model

- Five categories: `principles` (why), `toolchain` (mandatory tools),
  `libraries` (selection catalog), `practices` (process standards),
  `decisions` (ADRs about this repository).
- One concern per document. Body (excluding front matter) must stay within
  300 lines — split the document when it grows past that.
- Write conclusions only. Never record discussion process, open questions,
  or meeting notes.
- Normative imperative tone: Use / Prefer / Do not / Never.
- `libraries/*` documents follow the fixed section order: Verdict, Use when,
  Avoid when, Strengths, Tradeoffs, Version policy, Usage rules, Works with,
  Rejected alternatives (omit the last when nothing is rejected).
- `toolchain/*` documents must contain at least: Mandate, Version policy,
  Usage rules — plus Rejected alternatives when the tool bans replacements.
- `decisions/*` follow `templates/adr.template.md` and are numbered
  `NNNN-slug`.
- Cross-links are relative, within the same language tree only (plus root
  files like `templates/`). Never link across language trees.

## Trilingual Model

- Content exists in three isomorphic trees: `docs/en/`, `docs/zh/`, `docs/ja/`.
  Every document id exists in all three, or the build fails.
- There is no canonical language. Any language may be edited first; the
  front matter `source-lang` records which language authored the current
  version.
- All three languages must land in the same change. Never merge a partially
  translated trio.
- Machine-facing root files — `AGENTS.md`, `PORTAL.md`, `GLOSSARY.md`,
  `README.md`, `templates/**`, `tools/**` — are English only (ADR-0001).
- Heading level sequences must match 1:1 across the trio; heading text is
  idiomatic per language.

## Front Matter

| Key | Rule |
| --- | --- |
| `id` | Path-derived (`docs/<lang>/` prefix and `.md` suffix removed) |
| `lang` | Must match the tree (`en` / `zh` / `ja`) |
| `version` | Positive integer, identical across the trio; increment on any meaningful change |
| `source-lang` | Language the current version was authored in; identical across the trio |
| `status` | `draft` / `active` / `deprecated`; identical across the trio |
| `digest` | sha256 of the normalized body (first 8 hex). Tool-maintained — never edit by hand |

Run `mise run fix` after content edits; it recomputes digests.

## Edit Protocol

1. Locate the document via the PORTAL inventory.
2. Edit the version in your working language. One concern per document; if
   it would exceed 300 lines, split first.
3. Bump `version` in all three language files; set `source-lang` to the
   language you edited.
4. Rewrite the other two languages natively per Translation rules, keeping
   heading structure isomorphic.
5. Run `mise run fix` (digests, formatting).
6. `mise run check` must pass before committing.
7. Adding/removing/renaming a document: apply to all three trees, update the
   PORTAL inventory and any affected recipe. Category-level structure
   changes additionally require a new ADR and an AGENTS.md update.
8. Reversing a standing recommendation (e.g. replacing a mandated tool):
   add a superseding ADR, update every affected document, and keep the Hard
   rules quick reference in `practices/agent-protocol` in sync.
9. Commit with Conventional Commits, English, scope = top-level id segment:
   `docs(toolchain): tighten oxlint type-aware rules`.

## Translation Rules

- Produce native text, never literal translation. No translationese.
- zh: Simplified Chinese, direct technical register, no honorifics.
- ja: technical-document register (常体 / である調).
- Follow `practices/language-policy` cross-language quality clauses.
- Terminology must match `GLOSSARY.md`; add missing recurring terms to the
  glossary in the same change.
- Product names and industry-standard terms stay in English in all
  languages (see GLOSSARY.md).
- Code blocks, commands, identifiers: verbatim. Translate only `lang` in the
  front matter; `digest` is recomputed by `mise run fix`.

## Validation

| Command | Effect |
| --- | --- |
| `mise run check` | Full validation: tree isomorphism, front matter, trio consistency, digests, heading parity, size cap, portal coverage + lint/format of `tools/` |
| `mise run fix` | Recompute digests; format `tools/` |
| `mise run test` | Validator test suite |

CI (GitHub Actions) and the pre-commit hook (prek) run the same checks.
Never bypass or weaken a check to make it pass.

## Hard Rules

- Never merge a change with an out-of-sync language trio.
- Never hand-edit `digest`.
- Never exceed 300 body lines — split instead.
- Never record discussion process; conclusions only.
- Never commit machine-translation-style text.
- Never bypass the validator, CI, or hooks.
