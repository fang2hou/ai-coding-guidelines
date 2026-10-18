<div align="center">

# AI Coding Guidelines

Engineering standards for AI-assisted development, maintained centrally and applied across projects.

[![check](https://github.com/fang2hou/ai-coding-guidelines/actions/workflows/check.yml/badge.svg)](https://github.com/fang2hou/ai-coding-guidelines/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[English](https://fang2hou.github.io/ai-coding-guidelines/en/) · [中文](https://fang2hou.github.io/ai-coding-guidelines/zh/) · [日本語](https://fang2hou.github.io/ai-coding-guidelines/ja/)

Read the guidelines online. The website updates after every merge to `main`.

</div>

Projects repeatedly make the same decisions about package managers, linters, commit conventions, and CI. AI agents can make different choices from one session to the next. This repository defines shared tools and conventions so humans and agents can apply them consistently, while product and architecture decisions remain specific to each project.

## 🚀 Getting Started

**For AI coding agents**, install the skill once per project:

```bash
pnpm dlx skills add fang2hou/ai-coding-guidelines@apply-guidelines
```

The skill contains no guideline text. On each run, it fetches the latest guidelines from GitHub, selects the relevant documents using [PORTAL.md](./PORTAL.md), and checks the project against them.

You can also ask your agent to use the repository directly:

```text
Apply the guidelines from https://github.com/fang2hou/ai-coding-guidelines for this task.
Start at PORTAL.md and follow its reading recipes.
```

**For human readers**, choose a reading recipe in [PORTAL.md](./PORTAL.md), such as starting a frontend project, writing tests, or adding a dependency. You can also browse [guidelines/en/](./guidelines/en/) ([中文](./guidelines/zh/) · [日本語](./guidelines/ja/)).

**To contribute to this repository**, install [mise](https://mise.jdx.dev/) and use the runtime versions pinned in `mise.toml`:

```bash
git clone https://github.com/fang2hou/ai-coding-guidelines && cd ai-coding-guidelines
mise install && pnpm install --frozen-lockfile
mise run check
```

Expected result: `OK: 99 documents, 33 ids x 3 languages`. See the full workflow in [DEVELOPMENT.md](./DEVELOPMENT.md).

## 💡 Concepts

- **Single source of truth** — agents fetch the live guidelines at run time instead of relying on memory or summaries
- **Three languages, one structure** — 33 documents in English, Chinese, and Japanese, with matching headings and natural wording in each language
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

| Goal                             | Read                                 |
| -------------------------------- | ------------------------------------ |
| Find guidelines for a task       | [PORTAL.md](./PORTAL.md)             |
| Develop and validate the repo    | [DEVELOPMENT.md](./DEVELOPMENT.md)   |
| Contribute a change              | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Understand the design            | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Configure an agent for this repo | [AGENTS.md](./AGENTS.md)             |
| Repository decisions             | [docs/adr/](./docs/adr/)             |

## 📄 License

Licensed under MIT. See [LICENSE](./LICENSE). You may reuse and adapt the guidelines in your own projects.
