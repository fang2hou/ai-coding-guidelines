---
id: practices/dependencies
lang: en
version: 1
source-lang: en
status: active
digest: 0c51bca7
---

# Dependency Discipline

## The five questions

Before adding a dependency:

1. Check whether the project already contains suitable functionality.
2. Check whether the framework or standard toolchain already provides a solution.
3. Confirm that the dependency solves a real requirement.
4. Consider maintenance cost.
5. Consider compatibility with the standardized toolchain.

Do not add a library for trivial functionality that can be implemented clearly without it.

Do not replace a standardized tool with another dependency without explicit user approval.

## Compatibility reference

Evaluate compatibility against the mandatory toolchain:

- [TypeScript toolchain](../toolchain/typescript.md) — pnpm, oxlint, oxfmt
- [Python toolchain](../toolchain/python.md) — uv, ruff
- [Quality gates](../toolchain/quality-gates.md) — prek
- [Git workflow](../toolchain/git.md) — Cocogitto for Conventional Commits

For endorsed library choices, see [Frontend framework](../libraries/frontend-framework.md) and [Python API stack](../libraries/python-api-stack.md).

The standardization principle behind these rules is defined in [Core Engineering Principles](../principles/core-principles.md).
