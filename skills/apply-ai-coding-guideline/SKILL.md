---
name: ai-coding-guideline
description: >
  Guides projects with the AI Coding Guideline: standardized toolchain and stack
  selection, task-based document routing, and a quick audit that checks an
  existing project against the guidelines. Use when starting or scaffolding a
  project, choosing a language/framework/stack, setting up the toolchain
  (mise, pnpm, uv, oxlint, oxfmt, ruff, golangci-lint), asking "which stack
  should I use" or "check this project against our standards", or before
  committing changes that must pass the shared quality gates.
license: MIT
compatibility: Requires file read access and a shell. Works best with mise installed.
metadata:
  author: fang2hou
  version: "1.0"
  source: https://github.com/fang2hou/ai-coding-guideline
---

# AI Coding Guideline

Apply a fixed set of engineering standards so neither humans nor agents re-make
tooling decisions per project: standardized tools are mandatory, product
decisions stay free.

## When to Use

- Starting, scaffolding, or configuring a project (any language in the matrix).
- Choosing a language, framework, or library for a task.
- Setting up or modifying the toolchain: mise, package managers, linters, formatters, hooks, CI.
- Asked to check, audit, or optimize a project against the shared standards.
- Writing code that must pass the shared quality gates before delivery.

## When NOT to Use

- One-off scripts with no repo and no reuse (standards still help, but nothing to audit).
- The user explicitly overrides a standard: follow the user, record the exception.

## Hard Rules

1. Standardized tools are mandatory. Never substitute another tool (npm instead of pnpm, eslint instead of oxlint, pip instead of uv) because it is more popular, recommended by a template, or more familiar. A genuine incompatibility goes to the user first.
2. mise manages runtimes and tool binaries only; language packages belong to the native manager: pnpm for Node, uv for Python. `mise install` must bootstrap everything with no extra global installs.
3. Prefer mainstream, well-validated versions — model knowledge lags, so niche or bleeding-edge picks raise generation-error risk. Node.js rides the Active LTS line (24 as of 2026-08); Python defaults to 3.12.
4. Same checks locally and in CI: the pre-commit hook and CI run the identical `mise run check`.
5. Commit messages follow Conventional Commits; verify with `cog check` when configured.
6. Never weaken a gate (lint rule, test, hook) to make a check pass; fix the cause.

## Workflow

### Step 1: Route the task to the guideline documents

Read [references/recipes.md](references/recipes.md) and pick the row matching
the task. If the guideline repository is available locally (cloned or
submoduled), open the listed documents and follow them; if not, the reference
matrix in this skill carries the same defaults in condensed form.

### Step 2: Apply the stack and toolchain defaults

Read [references/stack-defaults.md](references/stack-defaults.md). For new
projects, scaffold exactly the defaults for the chosen language. For existing
projects, do not rewrite working code to match — note divergences instead
(Step 4).

### Step 3: Implement with the quality gates

- Bootstrap: `mise install`, then the language manager (`pnpm install` / `uv sync`).
- Lint and format on every change: `pnpm exec oxlint --fix` / `pnpm exec oxfmt .` (Node), `uv run ruff check --fix` / `uv run ruff format` (Python).
- Run the project's `mise run check` (or equivalent) before declaring done; it must pass.

If a required tool is unavailable (e.g. no mise on the machine), report which
standards cannot be enforced and stop that step — never silently skip a gate.

### Step 4: Quick-audit mode (existing project)

Follow [references/project-audit.md](references/project-audit.md): inventory the
stack, compare against the defaults matrix, classify every divergence
(compliant / justified-with-ADR / violation), and return the structured report
defined there. Propose optimization directions ranked by risk reduction, not
novelty.

## Gotchas

- oxlint type-aware linting and type checking need the `oxlint-tsgolint` companion package plus a current oxlint — a bare oxlint install silently runs syntax-only rules.
- Bun-based stacks (e.g. Elysia) are out of consideration: Node.js compatibility wins over marginal performance. Express is rejected for new TypeScript backends — use Hono.
- `components/ui` in frontend projects is vendored shadcn/ui source: exclude it from lint/format scopes and never place custom components there.
- Databricks Apps pins its own Node runtime (22 as of mid-2026): target the platform's version there, not the local LTS.
- Editors need `@types/node` and a strict tsconfig to stop false errors in TypeScript tooling scripts; Node runs `.ts` directly with erasable syntax only.

## Output Contract

On completion, return:

1. What was applied: the recipe row and defaults used.
2. Gate results: the exact check commands run and their outcomes.
3. For audits: the divergence report per [references/project-audit.md](references/project-audit.md) — findings classified, with recommended actions and their priority.
