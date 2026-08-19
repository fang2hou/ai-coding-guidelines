<div align="center">

# AI Coding Guidelines

Engineering standards for AI-assisted development — maintained once, applied to every project.

[![check](https://github.com/fang2hou/ai-coding-guidelines/actions/workflows/check.yml/badge.svg)](https://github.com/fang2hou/ai-coding-guidelines/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[English](./guidelines/en/) · [中文](./guidelines/zh/) · [日本語](./guidelines/ja/)

</div>

Every project re-answers the same questions: which package manager, which linter, how to write commits, how to structure CI — and AI agents re-answer them again, per session, inconsistently. This repository standardizes everything that does not need to be a project-specific decision, so humans and agents stop re-choosing tools and product decisions stay free.

## 🚀 Usage / Quick Start

**With an AI coding agent** — install the skill once per project:

```bash
pnpm dlx skills add fang2hou/ai-coding-guidelines@apply-guidelines
```

The skill ships no guideline content: every run fetches the current guidelines from GitHub, routes the task through PORTAL, and audits existing projects against the fetched revision.

Or hand the repository over directly:

```text
Apply the guidelines from https://github.com/fang2hou/ai-coding-guidelines for this task.
Start at PORTAL.md and follow its reading recipes.
```

**As a human** — pick a recipe in [PORTAL.md](./PORTAL.md) ("Start a TypeScript project", "Write tests", "Add a dependency"), or browse [guidelines/en/](./guidelines/en/) and follow links from there.

**To develop this repository** — requires [mise](https://mise.jdx.dev/); runtime versions are pinned in `mise.toml`:

```bash
git clone https://github.com/fang2hou/ai-coding-guidelines && cd ai-coding-guidelines
mise install && pnpm install --frozen-lockfile
mise run check
```

Expected result: `OK: 93 documents, 31 ids x 3 languages`. The full workflow lives in [DEVELOPMENT.md](./DEVELOPMENT.md).

## 💡 Concepts

- **Single source of truth** — one corpus fetched at run time; agents apply the fetched documents, never remembered summaries
- **Trilingual isomorphism** — 31 documents × 3 languages (27 active, 4 draft), identical structure, natively rewritten per language
- **Machine-enforced consistency** — sha256 digests catch silent edits; terminology and zh/ja punctuation are validated; bodies are capped at 300 lines
- **Task-routed reading** — PORTAL recipes load only what the task needs

## ✨ Features

What the corpus standardizes today:

| Area               | Standard                                    |
| ------------------ | ------------------------------------------- |
| Node.js            | pnpm + oxlint + oxfmt on the LTS            |
| Python             | uv + ruff on 3.12                           |
| Go / Rust          | Only with recorded justification            |
| TypeScript backend | Hono (Express rejected)                     |
| Go backend         | Echo with a framework-agnostic core         |
| Frontend           | Vite or Next.js + Tailwind CSS + shadcn/ui  |
| Validation         | Identical locally, in pre-commit, and in CI |

## 📚 Learn More

| Goal                          | Read                                 |
| ----------------------------- | ------------------------------------ |
| Pick what to read for a task  | [PORTAL.md](./PORTAL.md)             |
| Develop and validate the repo | [DEVELOPMENT.md](./DEVELOPMENT.md)   |
| Contribute a change           | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Understand the design         | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Give the repo to an agent     | [AGENTS.md](./AGENTS.md)             |
| Repository decisions          | [docs/adr/](./docs/adr/)             |

## 📄 License

MIT — see [LICENSE](./LICENSE). The guideline texts may be reused and adapted in your own projects.
