# AGENTS.md

You maintain the AI Coding Guideline repository: trilingual engineering
standards consumed by AI agents in other projects. Consumers start at
[PORTAL.md](./PORTAL.md); this file is the maintainer protocol.

## Critical rules

- All three language versions of a document land in the same change.
- All changes land through a pull request; never push directly to `main`.
- `digest` is tool-written only; never edit it by hand.
- Body limit is 300 lines; split the document instead of exceeding it.
- Conclusions only — no discussion process, open questions, or notes.
- Never weaken or bypass the validator, CI, or hooks to make a check pass.

## Commands

| Command          | Run it                  | Effect                                                               |
| ---------------- | ----------------------- | -------------------------------------------------------------------- |
| `mise run fix`   | After any content edit  | Fixes zh/ja punctuation + digests; formats all Markdown and `tools/` |
| `mise run check` | Before every commit     | Full validation (CI runs the same)                                   |
| `mise run test`  | After changing `tools/` | Validator test suite                                                 |

CI (GitHub Actions) and the pre-commit hook (prek) run `mise run check` on
every commit and pull request.

Tooling dependencies (`oxlint`, `oxfmt`, `oxlint-tsgolint`, `@types/node`,
`typescript`) are managed by pnpm (`package.json` / `pnpm-lock.yaml`); mise
provides only `node` and `pnpm` themselves.

## Repository map

| Path                                | Content                                                                                                     | Language     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------ |
| `guidelines/{en,zh,ja}/`            | Guideline content — isomorphic trilingual trees                                                             | en / zh / ja |
| `guidelines/en/principles/`         | Core engineering principles                                                                                 | trilingual   |
| `guidelines/en/toolchain/`          | Mandatory tools and platform standards                                                                      | trilingual   |
| `guidelines/en/libraries/`          | Library/framework selection catalog                                                                         | trilingual   |
| `guidelines/en/practices/`          | Cross-cutting engineering practices                                                                         | trilingual   |
| `docs/adr/`                         | ADRs — decisions about this repository                                                                      | English only |
| `templates/`                        | Copyable templates for consuming projects                                                                   | English only |
| `skills/apply-ai-coding-guideline/` | Installable agent skill (pnpm dlx skills add) — thin loader that fetches guidelines from GitHub at run time | English only |
| `tools/check-docs.ts`               | Trilingual consistency validator                                                                            | code         |
| `PORTAL.md`                         | Task-based reading routes for consumers                                                                     | English only |
| `GLOSSARY.md`                       | Canonical trilingual terminology                                                                            | English only |

Rule of thumb: guideline content (the product) goes to `guidelines/`;
repository documentation goes to `docs/` in English. See

[ADR-0001](./docs/adr/0001-guideline-repo-structure.md).

All Markdown — including `templates/` — stays oxfmt-formatted; `mise run check`
enforces it. The skill is a thin loader and ships no guideline content:
guideline changes require no skill updates. Only mechanism changes (fetch,
verification, audit procedure) touch `skills/`.

## Content model

- Four content categories: `principles` (why), `toolchain` (mandatory
  tools), `libraries` (selection catalog), `practices` (process standards).
- One concern per document. `#` title, `##` sections, normative imperative
  tone: Use / Prefer / Do not / Never.
- `libraries/*` follows the fixed section order: Verdict, Use when, Avoid
  when, Strengths, Tradeoffs, Version policy, Usage rules, Works with,
  Rejected alternatives (omit the last when nothing is rejected).
- `toolchain/*` must contain at least Mandate, Version policy, Usage rules —
  plus Rejected alternatives when the tool bans replacements.
- Cross-links are relative, within the same language tree only (plus root
  files such as `templates/`). Never link across language trees.

## Trilingual model

- Every document id exists in all three trees with identical structure.
- No canonical language: edit any language first; front matter
  `source-lang` records which one authored the current version.
- Heading level sequences match 1:1 across the trio; heading text is
  idiomatic per language.

## Front matter

| Key           | Rule                                                                            |
| ------------- | ------------------------------------------------------------------------------- |
| `id`          | Path-derived (`guidelines/<lang>/` prefix and `.md` suffix removed)             |
| `lang`        | Matches the tree: `en` / `zh` / `ja`                                            |
| `version`     | Positive integer, identical across the trio; increment on any meaningful change |
| `source-lang` | Language the current version was authored in; identical across the trio         |
| `status`      | `draft` / `active` / `deprecated`; identical across the trio                    |
| `digest`      | sha256 of the normalized body (first 8 hex) — tool-maintained                   |

## Edit protocol

1. Locate the document via the PORTAL inventory.
2. Edit the file in your working language; if it would exceed 300 lines,
   split it first.
3. Bump `version` in all three language files; set `source-lang` to the
   language you edited. Exception: a translation-quality-only polish (no
   semantic change) keeps `version` and `source-lang` as they are.
4. Rewrite the other two languages natively (Translation rules below),
   keeping heading structure isomorphic.
5. Run `mise run fix`, then `mise run check` — it must pass before commit.
6. Commit with Conventional Commits, English, scope = top-level id segment,
   e.g. `docs(toolchain): tighten oxlint type-aware rules`.
7. Push the branch and open a pull request. The PR title follows the same
   Conventional Commits convention — CI validates it with `cog verify` and
   validates the commits with `cog check`. Merge only after CI passes.
   See [ADR-0002](./docs/adr/0002-pr-based-contribution-workflow.md).

Worked example — tighten a rule in `toolchain/typescript`:

```text
1. Edit guidelines/en/toolchain/typescript.md (add the rule).
2. Set version: 2 / source-lang: en in en, zh, ja files.
3. Rewrite guidelines/{zh,ja}/toolchain/typescript.md natively.
4. mise run fix   → punctuation + digests fixed, Markdown formatted
5. mise run check → OK: N documents, N/3 ids x 3 languages
6. git commit -m "docs(toolchain): require type-aware oxlint rules"
7. git push + open PR "docs(toolchain): require type-aware oxlint rules"
8. CI green (check + pr-title) → merge
```

### Structural changes

- Add/remove/rename a document: apply to all three trees; update the PORTAL
  inventory and any affected recipe.
- Reverse a standing recommendation (e.g. replace a mandated tool): add a
  superseding ADR in `docs/adr/`, update every affected document, and sync
  the Hard rules quick reference in `practices/agent-protocol`.
- Change the repository's structure or model: write a new ADR
  (English, `templates/adr.template.md`) and update this file.

## Translation rules

- Native rewrite, zero translationese. zh: Simplified Chinese, direct
  technical register, no honorifics. ja: technical-document register
  (常体 / である調).
- Terminology must match `GLOSSARY.md`; add missing recurring terms to the
  glossary in the same change. Product names and industry terms stay in
  English. The glossary's "Forbidden renderings" table is machine-enforced
  by the validator; when you fix a recurring mistranslation, add it there.
- Punctuation: zh prose uses full-width ，；：; ja prose uses 、。：.
  Half-width `,;:` stays only inside code spans, paths, and pure-latin
  clusters (e.g. `E, F, I`). Machine-enforced; `mise run fix` auto-corrects
  CJK-adjacent violations.
- Code blocks, commands, identifiers: verbatim. Translate only `lang` in
  front matter; `digest` is recomputed by `mise run fix`.
- Follow the cross-language quality clauses in
  `guidelines/en/practices/language-policy.md`.

## Boundaries

- **Always**: sync the trio in one change; run `mise run check` before
  committing; keep one concern per document; land every change through a
  pull request.
- **Ask first**: adding a new content category; changing the front matter
  schema or validator behavior; anything ADR-0001 lists as a review trigger.
- **Never**: merge a partially translated trio; hand-edit `digest`;
  translate files under `docs/`; record discussion process; commit
  machine-translation-style text; bypass validation; push directly to
  `main`.
