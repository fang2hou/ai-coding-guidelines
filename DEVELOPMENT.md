# Development

How to edit and validate this repository, for humans and AI agents.
For an overview of the guidelines and how to use them, see [README.md](./README.md).

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

Do not substitute tools without explicit approval — this repository must follow the toolchain standard it publishes.

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
4. When changing meaning, bump `version` in all three language files and set `source-lang` to the language you edited first. Wording-only polish (no change in meaning) keeps `version` and `source-lang` unchanged.
5. Express the change naturally in the other two languages (see Translation rules below), keeping the exact same heading levels.
6. Run `mise run fix`, then `mise run check` — it must pass before you commit.
7. Commit using Conventional Commits and open a pull request (see [CONTRIBUTING.md](./CONTRIBUTING.md)).

Structural changes — adding, removing, or renaming a document, reversing a recommendation, or changing the repository model — have extra rules in [AGENTS.md](./AGENTS.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).

## Translation rules

- Write naturally in each language — never translate word-for-word. `zh` uses Simplified Chinese in a direct technical style without honorifics (`您`/`请`). `ja` uses plain technical style (常体 / である調).
- Terminology must match [GLOSSARY.md](./GLOSSARY.md); add new recurring terms there in the same change. The glossary's "Forbidden renderings" table is checked automatically — when fixing a repeated mistranslation, add it there.
- Punctuation: `zh` prose uses full-width `，；：`; `ja` prose uses `、。：`. Half-width `,;:` stays only inside code spans, paths, and pure-Latin text. `mise run fix` corrects punctuation automatically.
- Keep code blocks, commands, and identifiers verbatim. In front matter, change only `lang`; `mise run fix` recomputes `digest`.
- Follow the cross-language rules in `guidelines/en/practices/language-policy.md`.

## Layout

- `guidelines/{en,zh,ja}/` — the product: matching guideline trees in three languages
- `tools/` — the validator (`check-docs.ts`) and its tests
- `PORTAL.md` / `GLOSSARY.md` — task routing and shared terminology
- `templates/` — copyable templates for projects using these guidelines
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

- Validator errors name the file and the rule; `mise run fix` repairs punctuation, digests, and formatting.
- A digest mismatch after editing means the body changed without `mise run fix`. Never edit `digest` by hand.

## Validation

`mise run check` is the entry point for the project's main validation.
It runs the same checks locally that CI runs — do not maintain separate logic.
