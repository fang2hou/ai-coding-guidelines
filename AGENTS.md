# AGENTS.md

Trilingual AI coding guidelines corpus, maintained for AI agents and the humans who review their work. Read this before making changes.

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

This repository _is_ the shared engineering standard. Before editing a document, re-read its own tree entry and apply the rules it states to the change at hand — the corpus must obey what it mandates. Start from [PORTAL.md](./PORTAL.md); repository documentation always takes precedence over remembered summaries.

## Layout

- `guidelines/{en,zh,ja}/` — the product: isomorphic trilingual guideline trees
- `tools/` — the validator and its tests
- `PORTAL.md` / `GLOSSARY.md` — task routing; canonical terminology
- `templates/` — copyable templates for consuming projects
- `skills/apply-guidelines/` — installable thin-loader skill
- `docs/adr/` — repository decision records

## Boundaries

Always:

- Land the trilingual trio in the same change, with `version` bumped and `source-lang` set on meaningful edits (translation-only polish keeps both)
- Run `mise run check` before every commit

Never:

- Hand-edit `digest`, or weaken the validator, CI, or hooks to make a check pass
- Merge a partially translated trio, or commit machine-translation-style text
- Push directly to `main`, or translate files under `docs/`

Ask first:

- Adding a new content category; changing the front-matter schema or validator behavior; anything ADR-0001 lists as a review trigger
- Reversing a standing recommendation — requires a superseding ADR and a sync of the quick reference in `practices/agent-protocol`

## Confirmed Language Policy

| Item                      | Value                                                            |
| ------------------------- | ---------------------------------------------------------------- |
| Conversation              | follows the user                                                 |
| Code / comments / commits | English                                                          |
| Guideline content         | trilingual en/zh/ja, no canonical language, native rewrites only |
| Repository documentation  | English only                                                     |

Do not infer the language of one artifact from another; see `guidelines/en/practices/language-policy.md`.

## Project Conventions

- Document model: one concern per document, body capped at 300 lines, conclusions-only tone; `libraries/*` and `toolchain/*` keep their fixed section order
- Cross-links stay within the same language tree (plus root files such as `templates/`); never link across language trees
- The PORTAL inventory and recipes are updated in the same change that adds, removes, or renames a document
- The skill ships no guideline content; only mechanism changes touch `skills/`

Depth: [DEVELOPMENT.md](./DEVELOPMENT.md) for the edit workflow and translation rules, [CONTRIBUTING.md](./CONTRIBUTING.md) for pull request rules, [ARCHITECTURE.md](./ARCHITECTURE.md) for invariants.
