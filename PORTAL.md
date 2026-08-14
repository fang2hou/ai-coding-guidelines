# PORTAL — AI Coding Guideline

You are applying this repository's engineering standards: mandatory
toolchains, library selection, practices, and the agent operating protocol.

**How to use:**

1. Find your task in the reading recipes; read the listed documents in order.
2. Follow the documents. Standardized tools are mandatory unless the user
   explicitly approves an exception.
3. Maintaining this repository itself? Read [AGENTS.md](./AGENTS.md) instead.

> These documents take precedence over any remembered summary.

Languages: [English](./guidelines/en/) · [中文](./guidelines/zh/) · [日本語](./guidelines/ja/)

## Reading recipes

Links point to the English tree; `zh`/`ja` trees mirror the same paths.

| Task | Read in order |
| --- | --- |
| Baseline (any task) | [core-principles](./guidelines/en/principles/core-principles.md) → [agent-protocol](./guidelines/en/practices/agent-protocol.md) |
| Start a TypeScript / frontend project | Baseline + [mise](./guidelines/en/toolchain/mise.md) → [typescript](./guidelines/en/toolchain/typescript.md) → [frontend-framework](./guidelines/en/libraries/frontend-framework.md) → [tailwindcss](./guidelines/en/libraries/tailwindcss.md) → [shadcn-ui](./guidelines/en/libraries/shadcn-ui.md) → [language-policy](./guidelines/en/practices/language-policy.md) → [project-documentation](./guidelines/en/practices/project-documentation.md) → [quality-gates](./guidelines/en/toolchain/quality-gates.md) → [git](./guidelines/en/toolchain/git.md) |
| Start or join a Python service | Baseline + [mise](./guidelines/en/toolchain/mise.md) → [python](./guidelines/en/toolchain/python.md) → [python-api-stack](./guidelines/en/libraries/python-api-stack.md) → [project-documentation](./guidelines/en/practices/project-documentation.md) → [quality-gates](./guidelines/en/toolchain/quality-gates.md) → [git](./guidelines/en/toolchain/git.md) |
| Add a dependency | [dependencies](./guidelines/en/practices/dependencies.md) + the matching [libraries](./guidelines/en/libraries/) entry |
| UI implementation work | [tailwindcss](./guidelines/en/libraries/tailwindcss.md) → [shadcn-ui](./guidelines/en/libraries/shadcn-ui.md) → [coding-standards](./guidelines/en/practices/coding-standards.md) → [language-policy](./guidelines/en/practices/language-policy.md) |
| Build an AI / LLM feature | [vercel-ai-sdk](./guidelines/en/libraries/vercel-ai-sdk.md) → [frontend-framework](./guidelines/en/libraries/frontend-framework.md) |
| Write tests | [testing](./guidelines/en/practices/testing.md) |
| Commit / open a PR | [git](./guidelines/en/toolchain/git.md) → [change-discipline](./guidelines/en/practices/change-discipline.md) |
| CI/CD work | [github-actions](./guidelines/en/toolchain/github-actions.md) → [quality-gates](./guidelines/en/toolchain/quality-gates.md) |
| Databricks work | [databricks](./guidelines/en/toolchain/databricks.md) |
| Architecture change | [architecture-governance](./guidelines/en/practices/architecture-governance.md) + the project's own ADRs |
| Security-sensitive change | [security](./guidelines/en/practices/security.md) |
| Maintain this repository | [AGENTS.md](./AGENTS.md) |

## Inventory

| id | Scope | Read when |
| --- | --- | --- |
| [principles/core-principles](./guidelines/en/principles/core-principles.md) | Purpose, validation speed, choice reduction, root cause, final maxims | Starting any work |
| [toolchain/mise](./guidelines/en/toolchain/mise.md) | Mandatory runtime/tool/task manager; local–CI consistency | Setting up or changing project tooling |
| [toolchain/typescript](./guidelines/en/toolchain/typescript.md) | pnpm, oxlint, oxfmt mandates and configuration | Any TypeScript/JavaScript project |
| [toolchain/python](./guidelines/en/toolchain/python.md) | When a Python backend is justified; uv, ruff mandates | Introducing or working on Python services |
| [toolchain/quality-gates](./guidelines/en/toolchain/quality-gates.md) | prek pre-commit framework, check sets, `mise run check` | Defining or changing local validation |
| [toolchain/git](./guidelines/en/toolchain/git.md) | Conventional Commits, Cocogitto, Git safety | Committing, PRs, history operations |
| [toolchain/github-actions](./guidelines/en/toolchain/github-actions.md) | Action upgrade policy, CI layering via mise | Writing or updating CI workflows |
| [toolchain/databricks](./guidelines/en/toolchain/databricks.md) | Apps vs Jobs, deploy config, working window, permissions | Data/AI platform work |
| [libraries/frontend-framework](./guidelines/en/libraries/frontend-framework.md) | Vite vs Next.js selection rule | Starting a frontend project or choosing a framework |
| [libraries/tailwindcss](./guidelines/en/libraries/tailwindcss.md) | Preferred CSS framework, version conventions | Styling work |
| [libraries/shadcn-ui](./guidelines/en/libraries/shadcn-ui.md) | Preferred component system, reuse and override policy | Building or modifying UI components |
| [libraries/vercel-ai-sdk](./guidelines/en/libraries/vercel-ai-sdk.md) | Situational LLM SDK for Next.js | Adding AI features |
| [libraries/python-api-stack](./guidelines/en/libraries/python-api-stack.md) | FastAPI + Pydantic + Uvicorn as one stack | Building Python APIs |
| [practices/language-policy](./guidelines/en/practices/language-policy.md) | Conversation / code / UI language boundaries | Any user-facing or cross-language work |
| [practices/coding-standards](./guidelines/en/practices/coding-standards.md) | Best practices, anti-over-engineering, naming, responsiveness | Writing code |
| [practices/testing](./guidelines/en/practices/testing.md) | Behavior-first testing, E2E, unit tests | Writing tests |
| [practices/dependencies](./guidelines/en/practices/dependencies.md) | The five questions before adding a dependency | Adding or replacing dependencies |
| [practices/change-discipline](./guidelines/en/practices/change-discipline.md) | Before-you-call-it-done checklist | Completing any change |
| [practices/security](./guidelines/en/practices/security.md) | Secrets handling, secret scanning | Handling credentials or sensitive data |
| [practices/architecture-governance](./guidelines/en/practices/architecture-governance.md) | ARCHITECTURE.md invariants, ADR workflow | Architecture-relevant changes |
| [practices/project-documentation](./guidelines/en/practices/project-documentation.md) | README / DEVELOPMENT / CONTRIBUTING / ARCHITECTURE requirements | Creating or updating project docs |
| [practices/agent-protocol](./guidelines/en/practices/agent-protocol.md) | 12-step operating protocol, memory behavior, hard rules | Before any non-trivial agent change |

Repository decisions: [ADR-0001 — repository structure and i18n model](./docs/adr/0001-guideline-repo-structure.md) (English only).
