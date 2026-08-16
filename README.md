<div align="center">

# AI Coding Guideline

Engineering standards for AI-assisted development — maintained once, applied to every project.

[![check](https://github.com/fang2hou/ai-coding-guideline/actions/workflows/check.yml/badge.svg)](https://github.com/fang2hou/ai-coding-guideline/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[English](./guidelines/en/) · [中文](./guidelines/zh/) · [日本語](./guidelines/ja/)

</div>

## Why

Every project re-answers the same questions: which package manager, which linter, how to write commits, how to structure CI. AI agents re-answer them again — per project, per session, inconsistently.

This repository standardizes everything that does not need to be a project-specific decision. Humans and agents stop re-choosing tools and conventions; product and architecture decisions stay free.

## Use it

**As a human** — pick a recipe in [PORTAL.md](./PORTAL.md) ("Start a TypeScript project", "Write tests", "Add a dependency"), or browse [guidelines/en/](./guidelines/en/) and follow links from there.

**As a coding agent** — install the skill:

```bash
pnpm dlx skills add fang2hou/ai-coding-guideline@apply-ai-coding-guideline
```

The skill ships no guideline content: on every run it fetches the current guidelines from GitHub, routes the task through PORTAL, and audits existing projects against the fetched revision. Alternatively, point your agent configuration directly at [PORTAL.md](./PORTAL.md).

## Find what to read

[PORTAL.md](./PORTAL.md) maps tasks to reading recipes. The most common:

| Goal                                  | Read in order                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| Baseline for any task                 | core-principles → agent-protocol                                                |
| Start a TypeScript / frontend project | Baseline + mise → typescript → frontend-framework → tailwindcss → shadcn-ui → … |
| Build a backend service               | Baseline + mise → typescript → typescript-backend, or python → python-api-stack |
| Add a dependency                      | dependencies + the matching libraries entry                                     |
| Write tests                           | testing → coding-standards                                                      |
| Commit / open a PR                    | git → change-discipline                                                         |

## What's inside

29 documents × 3 languages (identical structure) in four categories:

- **[principles](./guidelines/en/principles/)** — why: validation speed, choice reduction, root cause
- **[toolchain](./guidelines/en/toolchain/)** — the mandatory toolchain: mise, TypeScript, Python, quality gates, git, CI; Go and Rust baselines
- **[libraries](./guidelines/en/libraries/)** — selection catalog with verdicts: frameworks, styling, API stacks, AI SDK
- **[practices](./guidelines/en/practices/)** — process standards: coding, testing, dependencies, security, change discipline

Consistency is machine-enforced: sha256 digests catch silent edits, terminology and zh/ja punctuation are validated, bodies are capped at 300 lines, and `mise run check` runs the same validation locally, at commit time, and in CI.

## Standards at a glance

| Area               | Standard                                    |
| ------------------ | ------------------------------------------- |
| Node.js            | pnpm + oxlint + oxfmt on the LTS            |
| Python             | uv + ruff on 3.12                           |
| Go / Rust          | Only with recorded justification            |
| TypeScript backend | Hono (Express rejected)                     |
| Go backend         | Echo with a framework-agnostic core         |
| Frontend           | Vite or Next.js + Tailwind CSS + shadcn/ui  |
| Validation         | Identical locally, in pre-commit, and in CI |

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

All changes — including agent-made ones — land through pull requests. Editing rules, the trilingual model, and the commit protocol live in [AGENTS.md](./AGENTS.md); repository decisions are recorded as ADRs in [docs/adr/](./docs/adr/).

## License

MIT — see [LICENSE](./LICENSE). The guideline texts may be reused and adapted in your own projects.
