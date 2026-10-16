---
id: practices/dependencies
lang: en
version: 2
source-lang: en
status: active
digest: dcd0cd61
---

# Dependency Discipline

## The five questions

Before adding a dependency, answer these five questions in order:

1. Does the project already have what you need?
2. Does the framework, platform, or standard toolchain already provide it?
3. Does the dependency solve a real requirement?
4. Is the maintenance cost worth it?
5. Does it work with the standardized toolchain?

Worked example — candidate `zod` for runtime validation in a TypeScript project:

1. Project: no existing runtime validation.
2. Platform: TypeScript types are compile-time only; request bodies and environment variables are untyped at runtime.
3. Requirement: external input crosses the runtime boundary and must be validated before use.
4. Maintenance: single-purpose library with a small API — only one dependency to track.
5. Toolchain: a pure runtime library; installed with pnpm, no conflict with oxlint or oxfmt.

Decision: add `zod`.

The same questions reject weaker candidates: a `truncate` string-helper library fails question 3 — three clear lines implement it without a dependency; `axios` fails question 2 when the platform `fetch` already covers the requirement.

Do not add a library for simple logic you can write clearly in a few lines.

Do not replace a standardized tool with another dependency without explicit user approval.

## Compatibility reference

Evaluate compatibility against the mandatory toolchain:

- [TypeScript toolchain](../toolchain/typescript.md) — pnpm, oxlint, oxfmt
- [Python toolchain](../toolchain/python.md) — uv, ruff
- [Quality gates](../toolchain/quality-gates.md) — prek
- [Git workflow](../toolchain/git.md) — Cocogitto for Conventional Commits

For endorsed library choices, see [Frontend framework](../libraries/frontend-framework.md) and [Python API stack](../libraries/python-api-stack.md).

The standardization principle behind these rules is defined in [Core Engineering Principles](../principles/core-principles.md).
