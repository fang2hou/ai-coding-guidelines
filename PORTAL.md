# PORTAL — AI Coding Guideline

Single source of truth for cross-project engineering standards:
toolchains, libraries, practices, and the agent operating protocol.

**How to use this repository:**

1. Find your task in the reading recipes below and read the listed documents in order.
2. Follow the documents. Standardized tools are mandatory unless the user explicitly approves an exception.
3. To maintain this repository itself, read [AGENTS.md](./AGENTS.md) first.

> The repository documents always take precedence over any remembered summary.

Parallel trees: [English](./docs/en/) · [中文](./docs/zh/) · [日本語](./docs/ja/)

## Reading recipes

Ordered reading lists per task. Links point to the English tree; `zh`/`ja` trees mirror the same paths.

| Task | Read in order |
| --- | --- |
| Baseline (any task) | [core-principles](./docs/en/principles/core-principles.md) → [agent-protocol](./docs/en/practices/agent-protocol.md) |
| Start a TypeScript / frontend project | + [mise](./docs/en/toolchain/mise.md) → [typescript](./docs/en/toolchain/typescript.md) → [frontend-framework](./docs/en/libraries/frontend-framework.md) → [tailwindcss](./docs/en/libraries/tailwindcss.md) → [shadcn-ui](./docs/en/libraries/shadcn-ui.md) → [language-policy](./docs/en/practices/language-policy.md) → [project-documentation](./docs/en/practices/project-documentation.md) → [quality-gates](./docs/en/toolchain/quality-gates.md) → [git](./docs/en/toolchain/git.md) |
| Start or join a Python service | + [mise](./docs/en/toolchain/mise.md) → [python](./docs/en/toolchain/python.md) → [python-api-stack](./docs/en/libraries/python-api-stack.md) → [project-documentation](./docs/en/practices/project-documentation.md) → [quality-gates](./docs/en/toolchain/quality-gates.md) → [git](./docs/en/toolchain/git.md) |
| Add a dependency | [dependencies](./docs/en/practices/dependencies.md) + the matching [libraries](./docs/en/libraries/) entry |
| UI implementation work | [tailwindcss](./docs/en/libraries/tailwindcss.md) → [shadcn-ui](./docs/en/libraries/shadcn-ui.md) → [coding-standards](./docs/en/practices/coding-standards.md) → [language-policy](./docs/en/practices/language-policy.md) |
| Build an AI / LLM feature | [vercel-ai-sdk](./docs/en/libraries/vercel-ai-sdk.md) → [frontend-framework](./docs/en/libraries/frontend-framework.md) |
| Write tests | [testing](./docs/en/practices/testing.md) |
| Commit / open a PR | [git](./docs/en/toolchain/git.md) → [change-discipline](./docs/en/practices/change-discipline.md) |
| CI/CD work | [github-actions](./docs/en/toolchain/github-actions.md) → [quality-gates](./docs/en/toolchain/quality-gates.md) |
| Databricks work | [databricks](./docs/en/toolchain/databricks.md) |
| Architecture change | [architecture-governance](./docs/en/practices/architecture-governance.md) + the project's own ADRs |
| Security-sensitive change | [security](./docs/en/practices/security.md) |
| Maintain this repository | [AGENTS.md](./AGENTS.md) |

## Inventory

| id | Scope | Read when |
| --- | --- | --- |
| [principles/core-principles](./docs/en/principles/core-principles.md) | Purpose, validation speed, choice reduction, root cause, final maxims | Starting any work |
| [toolchain/mise](./docs/en/toolchain/mise.md) | Mandatory runtime/tool/task manager; local–CI consistency | Setting up or changing project tooling |
| [toolchain/typescript](./docs/en/toolchain/typescript.md) | pnpm, oxlint, oxfmt mandates and configuration | Any TypeScript/JavaScript project |
| [toolchain/python](./docs/en/toolchain/python.md) | When a Python backend is justified; uv, ruff mandates | Introducing or working on Python services |
| [toolchain/quality-gates](./docs/en/toolchain/quality-gates.md) | prek pre-commit framework, check sets, `mise run check` | Defining or changing local validation |
| [toolchain/git](./docs/en/toolchain/git.md) | Conventional Commits, Cocogitto, Git safety | Committing, PRs, history operations |
| [toolchain/github-actions](./docs/en/toolchain/github-actions.md) | Action upgrade policy, CI layering via mise | Writing or updating CI workflows |
| [toolchain/databricks](./docs/en/toolchain/databricks.md) | Apps vs Jobs, deploy config, working window, permissions | Data/AI platform work |
| [libraries/frontend-framework](./docs/en/libraries/frontend-framework.md) | Vite vs Next.js selection rule | Starting a frontend project or choosing a framework |
| [libraries/tailwindcss](./docs/en/libraries/tailwindcss.md) | Preferred CSS framework, version conventions | Styling work |
| [libraries/shadcn-ui](./docs/en/libraries/shadcn-ui.md) | Preferred component system, reuse and override policy | Building or modifying UI components |
| [libraries/vercel-ai-sdk](./docs/en/libraries/vercel-ai-sdk.md) | Situational LLM SDK for Next.js | Adding AI features |
| [libraries/python-api-stack](./docs/en/libraries/python-api-stack.md) | FastAPI + Pydantic + Uvicorn as one stack | Building Python APIs |
| [practices/language-policy](./docs/en/practices/language-policy.md) | Conversation / code / UI language boundaries | Any user-facing or cross-language work |
| [practices/coding-standards](./docs/en/practices/coding-standards.md) | Best practices, anti-over-engineering, naming, responsiveness | Writing code |
| [practices/testing](./docs/en/practices/testing.md) | Behavior-first testing, E2E, unit tests | Writing tests |
| [practices/dependencies](./docs/en/practices/dependencies.md) | The five questions before adding a dependency | Adding or replacing dependencies |
| [practices/change-discipline](./docs/en/practices/change-discipline.md) | Before-you-call-it-done checklist | Completing any change |
| [practices/security](./docs/en/practices/security.md) | Secrets handling, secret scanning | Handling credentials or sensitive data |
| [practices/architecture-governance](./docs/en/practices/architecture-governance.md) | ARCHITECTURE.md invariants, ADR workflow | Architecture-relevant changes |
| [practices/project-documentation](./docs/en/practices/project-documentation.md) | README / DEVELOPMENT / CONTRIBUTING / ARCHITECTURE requirements | Creating or updating project docs |
| [practices/agent-protocol](./docs/en/practices/agent-protocol.md) | 12-step operating protocol, memory behavior, hard rules | Before any non-trivial agent change |
| [decisions/0001-guideline-repo-structure](./docs/en/decisions/0001-guideline-repo-structure.md) | ADR for this repository's structure and i18n model | Changing repository structure |
