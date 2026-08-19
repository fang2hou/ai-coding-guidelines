# Development

How development is performed in this repository, for both humans and AI agents.
User-facing orientation lives in the README; this document is for people changing the corpus or the tooling.

## Setup

All tools are managed by mise.

```bash
mise install
pnpm install --frozen-lockfile
```

| Tool      | Purpose           | Managed via |
| --------- | ----------------- | ----------- |
| node 24   | Runtime           | `mise.toml` |
| pnpm      | Package manager   | `mise.toml` |
| prek      | Pre-commit hooks  | `mise.toml` |
| cocogitto | Commit validation | `mise.toml` |
| gitleaks  | Secret scanning   | `mise.toml` |

Do not substitute tools without explicit approval — this repository defines the toolchain standard it must follow.

## Commands

```bash
mise run check                              # full validation — what CI runs
mise run fix                                # fix zh/ja punctuation + digests, format
mise run test                               # validator test suite
mise run test -- --test-name-pattern=digest # run matching test cases only
```

`mise run` lists every task. Validation runs `tools/check-docs.ts`, oxlint (including type checking via `typeCheck`), gitleaks, and an oxfmt format check.

## Workflow

1. Branch from `main`.
2. Locate the document via the [PORTAL.md](./PORTAL.md) inventory.
3. Edit the file in your working language; if it would exceed 300 body lines, split it first.
4. Bump `version` in all three language files; set `source-lang` to the language you edited. A translation-quality-only polish keeps `version` and `source-lang` unchanged.
5. Rewrite the other two languages natively (Translation rules below), keeping heading structure isomorphic.
6. Run `mise run fix`, then `mise run check` — it must pass before commit.
7. Commit with Conventional Commits and open a pull request (see [CONTRIBUTING.md](./CONTRIBUTING.md)).

Structural changes — add/remove/rename a document, reverse a standing recommendation, change the repository model — have extra requirements in [AGENTS.md](./AGENTS.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).

## Translation rules

- Native rewrite, zero translationese. zh: Simplified Chinese, direct technical register, no honorifics. ja: technical-document register (常体 / である調).
- Terminology must match [GLOSSARY.md](./GLOSSARY.md); add missing recurring terms in the same change. The glossary's "Forbidden renderings" table is machine-enforced; when fixing a recurring mistranslation, add it there.
- Punctuation: zh prose uses full-width ，；：; ja prose uses 、。：. Half-width `,;:` stays only inside code spans, paths, and pure-latin clusters. `mise run fix` auto-corrects violations.
- Code blocks, commands, identifiers: verbatim. Translate only `lang` in front matter; `digest` is recomputed by `mise run fix`.
- Follow the cross-language quality clauses in `guidelines/en/practices/language-policy.md`.

## Layout

- `guidelines/{en,zh,ja}/` — the product: isomorphic trilingual guideline trees
- `tools/` — the validator (`check-docs.ts`) and its tests
- `PORTAL.md` / `GLOSSARY.md` — task routing and canonical terminology
- `templates/` — copyable templates for consuming projects
- `skills/apply-guidelines/` — installable agent skill (thin loader)
- `docs/adr/` — repository decision records

## Coding standards

This repository follows its own published standards (see [PORTAL.md](./PORTAL.md)). Project-specific rules:

- `tools/` is TypeScript under strict tsconfig; keep the validator zero-dependency and fast, or it will be bypassed (ADR-0001).
- All Markdown stays oxfmt-formatted; `mise run check` enforces it.

## Testing

- `mise run test` — behavior tests for the validator, using temporary fixture repositories
- Prioritize meaningful behavior over coverage numbers; every test names the failure mode it detects

## Debugging

- Validator errors name the file and the rule; most content drift is repaired by `mise run fix` (punctuation, digests, formatting).
- A digest mismatch after editing means the body changed without `mise run fix`; never hand-edit `digest`.

## Validation

`mise run check` is the entry point for the project's main validation.
It runs the same checks locally that CI runs — do not maintain separate logic.
