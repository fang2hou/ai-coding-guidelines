# AI Coding Guideline

![check](https://github.com/fang2hou/ai-coding-guideline/actions/workflows/check.yml/badge.svg)

One repository of engineering standards for AI-assisted development:
mandatory toolchains, library selection, cross-cutting practices, and the
agent operating protocol — maintained once, applied to every project.

The premise is a single sentence: **standardize everything that does not need
to be a project-specific decision.** Humans and AI agents stop re-choosing
package managers, linters, and commit conventions per project; product and
architecture decisions stay free.

## What's inside

| Piece                                                                    | What it is                                                                                                                                                   |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [guidelines/](./guidelines/en/)                                          | 27 documents × 3 languages (English · [中文](./guidelines/zh/) · [日本語](./guidelines/ja/)) in four categories: principles, toolchain, libraries, practices |
| [PORTAL.md](./PORTAL.md)                                                 | Task-based reading routes: pick what you're doing, get the exact documents to read, in order                                                                 |
| [skills/apply-ai-coding-guideline/](./skills/apply-ai-coding-guideline/) | Installable agent skill (thin loader — fetches the latest guidelines from GitHub at run time)                                                                |
| [templates/](./templates/)                                               | Copyable README / DEVELOPMENT / CONTRIBUTING / ARCHITECTURE / ADR templates for consuming projects                                                           |
| [tools/check-docs.ts](./tools/check-docs.ts)                             | Validator keeping the trilingual corpus consistent                                                                                                           |

The standards at a glance: pnpm + oxlint + oxfmt on Node.js LTS for
TypeScript, uv + ruff on Python 3.12; Go and Rust only with recorded
justification; Hono for TypeScript backends (Express rejected), Echo with a
framework-agnostic core for Go; Vite or Next.js + Tailwind CSS + shadcn/ui for
frontends; identical checks locally, in pre-commit, and in CI. See
[PORTAL.md](./PORTAL.md) for everything else.

## Use it

**As a human**: browse [guidelines/en/](./guidelines/en/) (or the zh/ja
mirrors), or start from a recipe in [PORTAL.md](./PORTAL.md) — "Start a
TypeScript project", "Add a dependency", "Write tests", and so on.

**Give it to your coding agent** — either point your agent configuration at
this repository's [PORTAL.md](./PORTAL.md), or install the skill:

```bash
npx skills add fang2hou/ai-coding-guideline@apply-ai-coding-guideline
```

The skill ships no guideline content; on every run it fetches the current
guidelines from GitHub, routes the task through PORTAL, and audits existing
projects against the fetched revision. Nothing to maintain on your side.

## Consistency is machine-enforced

Every document exists in all three languages with identical structure; sha256
digests catch silent edits; terminology (GLOSSARY) and zh/ja punctuation are
validated; bodies are capped at 300 lines. `mise run check` runs the same
validation as the pre-commit hook and CI, so local, commit-time, and CI
results can never drift apart.

## Develop this repository

```bash
git clone https://github.com/fang2hou/ai-coding-guideline && cd ai-coding-guideline
mise install && pnpm install --frozen-lockfile
mise run check
```

| Command          | Effect                                             |
| ---------------- | -------------------------------------------------- |
| `mise run check` | Full validation (what CI runs)                     |
| `mise run fix`   | Fix zh/ja punctuation + digests; format everything |
| `mise run test`  | Validator test suite                               |

All changes — including agent-made ones — land through pull requests. CI
validates the trilingual corpus and the PR title (Conventional Commits via
Cocogitto); merge only after it passes. See
[ADR-0002](./docs/adr/0002-pr-based-contribution-workflow.md).

Editing rules, the trilingual model, and the commit protocol live in
[AGENTS.md](./AGENTS.md). Repository decisions are recorded as ADRs in
[docs/adr/](./docs/adr/).
