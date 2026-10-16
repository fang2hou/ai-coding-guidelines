<div align="center">

# AI Coding Guidelines

Engineering standards for AI-assisted development — maintained once, applied to every project.

[![check](https://github.com/fang2hou/ai-coding-guidelines/actions/workflows/check.yml/badge.svg)](https://github.com/fang2hou/ai-coding-guidelines/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[English](./guidelines/en/) · [中文](./guidelines/zh/) · [日本語](./guidelines/ja/)

</div>

Every project ends up answering the same questions — which package manager, which linter, how to write commits, how to set up CI — and AI agents answer them differently each session. This repository standardizes every choice that does not depend on the product. Humans and agents stop re-picking tools and conventions, leaving product and architecture decisions open.

## 🚀 Usage / Quick Start

**With an AI coding agent** — install the skill once per project:

```bash
pnpm dlx skills add fang2hou/ai-coding-guidelines@apply-guidelines
```

The skill carries no guideline text of its own. Each run pulls the latest guidelines from GitHub, picks the right documents via [PORTAL.md](./PORTAL.md), and checks the project against them.

Or hand the repository over directly:

```text
Apply the guidelines from https://github.com/fang2hou/ai-coding-guidelines for this task.
Start at PORTAL.md and follow its reading recipes.
```

**As a human** — pick a recipe in [PORTAL.md](./PORTAL.md) ("Start a TypeScript project", "Write tests", "Add a dependency"), or browse [guidelines/en/](./guidelines/en/) ([中文](./guidelines/zh/) · [日本語](./guidelines/ja/)).

**To develop this repository** — requires [mise](https://mise.jdx.dev/); runtime versions are pinned in `mise.toml`:

```bash
git clone https://github.com/fang2hou/ai-coding-guidelines && cd ai-coding-guidelines
mise install && pnpm install --frozen-lockfile
mise run check
```

Expected result: `OK: 99 documents, 33 ids x 3 languages`. The full workflow lives in [DEVELOPMENT.md](./DEVELOPMENT.md).

## 💡 Concepts

- **Single source of truth** — agents fetch the live guidelines at run time instead of relying on memory or summaries
- **Three languages, one structure** — 33 documents in English, Chinese, and Japanese (29 active, 4 draft), with matching headings and natural wording in each language
- **Automated checks** — CI verifies sha256 digests, terminology, Chinese and Japanese punctuation, cross-links, and the 300-line limit per document
- **Task-based reading** — [PORTAL.md](./PORTAL.md) lists only the documents needed for each task

## ✨ Features

What these guidelines standardize:

| Area               | Standard                                                          |
| ------------------ | ----------------------------------------------------------------- |
| Node.js            | pnpm + oxlint + oxfmt on Active LTS                               |
| Python             | uv + ruff on Python 3.12                                          |
| Go / Rust          | Only with a recorded reason; golangci-lint + gofumpt, clippy      |
| TypeScript backend | Hono (never Express)                                              |
| Go backend         | Echo with a framework-independent core                            |
| Frontend           | Vite or Next.js; native CSS by default (Tailwind CSS when needed) |
| Validation         | Same checks locally, in pre-commit hooks, and in CI               |

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
