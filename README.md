<div align="center">

# AI Coding Guidelines

Shared engineering standards for AI-assisted software development, maintained in one repository and applied across projects.

[English](https://fang2hou.github.io/ai-coding-guidelines/en/) | [中文](https://fang2hou.github.io/ai-coding-guidelines/zh/) | [日本語](https://fang2hou.github.io/ai-coding-guidelines/ja/)

[![check](https://img.shields.io/github/actions/workflow/status/fang2hou/ai-coding-guidelines/check.yml?branch=main&label=check&style=flat-square)](https://github.com/fang2hou/ai-coding-guidelines/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)

</div>

Software projects repeatedly revisit the same tooling decisions: package managers, linters, formatters, commit conventions, and CI pipelines. AI coding agents also drift between sessions when those defaults are not written down. This repository defines a shared set of toolchains, libraries, and practices so humans and agents follow the same baseline across projects, while product and architecture choices stay in each project.

## 🚀 Usage

### Use with an AI Agent

Install the `apply-guidelines` skill in your target project:

```bash
pnpm dlx skills add fang2hou/ai-coding-guidelines@apply-guidelines
```

The skill carries no bundled guideline text. On each run, it fetches the current files from GitHub, selects the relevant documents through [PORTAL.md](./PORTAL.md), and checks your project against them.

After installing, ask your agent to apply these guidelines to your task. If you prefer not to install the skill, point your agent to the repository directly:

```text
Apply the guidelines from https://github.com/fang2hou/ai-coding-guidelines for this task.
Start at PORTAL.md and follow its reading recipes.
```

### Browse as a Human

Pick a task in [PORTAL.md](./PORTAL.md) (such as starting a frontend project, writing tests, or adding a dependency) and read the listed documents in order. You can also browse the full trees directly: [English](./guidelines/en/) | [中文](./guidelines/zh/) | [日本語](./guidelines/ja/).

## ✨ Features

### `1` Task-Based Routing

[PORTAL.md](./PORTAL.md) maps common engineering tasks to ordered reading lists, so humans and agents read only the documents relevant to the work at hand.

### `2` Parallel Language Trees

Each guideline is maintained across parallel language trees (English, Chinese, and Japanese) with matching heading structures and natural technical prose in each language.

### `3` Automated Validation

CI checks SHA-256 body digests, shared glossary terminology, punctuation rules, relative links, and document length limits for every file.

### `4` Standardized Stack

| Area               | Standard                                                          |
| ------------------ | ----------------------------------------------------------------- |
| Node.js            | pnpm + oxlint + oxfmt on Active LTS                               |
| Python             | uv + ruff on Python 3.12                                          |
| Go / Rust          | Only with a recorded reason; golangci-lint + gofumpt, clippy      |
| TypeScript backend | Hono (never Express)                                              |
| Go backend         | Echo with a framework-independent core                            |
| Frontend           | Vite or Next.js; native CSS by default (Tailwind CSS when needed) |
| Validation         | Same checks locally, in pre-commit hooks, and in CI               |

## 🛠️ Development

Install [mise](https://mise.jdx.dev/) and use the runtime versions pinned in `mise.toml`:

```bash
git clone https://github.com/fang2hou/ai-coding-guidelines && cd ai-coding-guidelines
mise install && pnpm install --frozen-lockfile
mise run check
```

All validation steps (document checks, linting, secret scanning, and formatting) pass with exit code 0.

Read [DEVELOPMENT.md](./DEVELOPMENT.md) for the editing and translation workflow, and [ARCHITECTURE.md](./ARCHITECTURE.md) for repository invariants.

## 🤝 Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for pull request and review rules.

## 📄 License

[MIT](./LICENSE)
