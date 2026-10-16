# AGENTS.md

Trilingual engineering guidelines for AI coding agents and human reviewers. Read this before editing the repository.

## Commands

```bash
mise install                 # set up the toolchain
pnpm install --frozen-lockfile
mise run fix                 # after any content edit: punctuation, digests, formatting
mise run check               # full validation — run before every commit
mise run test                # after changing tools/
mise run test -- --test-name-pattern=digest # run matching test cases only
```

Use pnpm, never npm or yarn.

## Engineering Standards

This repository defines the engineering standard it follows. Before editing a document, read the matching guidelines from [PORTAL.md](./PORTAL.md) and apply them to your change. Always trust the files in this repository over remembered summaries.

## Layout

- `guidelines/{en,zh,ja}/` — the product: matching guideline trees in English, Chinese, and Japanese
- `tools/` — the validator and its tests
- `PORTAL.md` / `GLOSSARY.md` — task routing and shared terminology
- `templates/` — copyable templates for projects using these guidelines
- `skills/apply-guidelines/` — installable loader skill
- `docs/adr/` — repository decision records

## Boundaries

Always:

- Update all three languages (`en`, `zh`, `ja`) in the same change. Bump `version` and set `source-lang` when meaning changes; keep both unchanged for wording-only polish
- Run `mise run check` before every commit

Never:

- Hand-edit `digest`, or weaken the validator, CI, or hooks to make a check pass
- Merge an incomplete translation, or commit stiff, literal translations
- Push directly to `main`, or translate files under `docs/`

Ask first:

- Adding a new content category, changing the front-matter schema or validator behavior, or anything ADR-0001 lists as a review trigger
- Reversing an existing recommendation — requires a superseding ADR and an update to the quick reference in `practices/agent-protocol`

## Confirmed Language Policy

| Item                      | Value                                                               |
| ------------------------- | ------------------------------------------------------------------- |
| Conversation              | follows the user                                                    |
| Code / comments / commits | English                                                             |
| Guideline content         | trilingual en/zh/ja, no primary language, written naturally in each |
| Repository documentation  | English only                                                        |

Do not infer the language of one artifact from another; see `guidelines/en/practices/language-policy.md`.

## Project Conventions

- Document model: one topic per document, body under 300 lines, conclusions only; `libraries/*` and `toolchain/*` follow a fixed section order
- Cross-links stay within the same language tree (plus root files such as `templates/`); never link across language trees
- Update the PORTAL inventory and recipes in the same change that adds, removes, or renames a document
- The skill carries no guideline text; only mechanism changes touch `skills/`

Depth: [DEVELOPMENT.md](./DEVELOPMENT.md) for the edit workflow and translation rules, [CONTRIBUTING.md](./CONTRIBUTING.md) for pull request rules, [ARCHITECTURE.md](./ARCHITECTURE.md) for invariants.
