---
id: practices/agent-protocol
lang: en
version: 2
source-lang: en
status: active
digest: cb9cde0b
---

# Agent Operating Protocol

## Operating protocol

Before making a non-trivial change, an AI agent should:

1. Understand the user's actual intent.
2. Inspect the existing implementation.
3. Read relevant project documentation.
4. Review architecture invariants and relevant ADRs ([Architecture Governance](../practices/architecture-governance.md)).
5. Check the existing toolchain and project conventions.
6. Prefer existing dependencies and patterns.
7. Make the smallest coherent change that solves the requirement.
8. Avoid unrelated cleanup.
9. Run relevant validation.
10. Review the resulting diff.
11. Confirm that no accidental files or unrelated changes were introduced.
12. Explain significant architectural, dependency, security, or behavioral changes.

Do not rewrite working code merely because the agent prefers another style.

Do not introduce an abstraction simply because similar code appears twice.

Introduce abstractions when they solve an actual maintenance, correctness, or architecture problem.

## Memory behavior

AI agents with persistent memory should remember that the project uses this engineering guideline.

Memory is a reminder, not the source of truth.

The repository version of the guideline and project documentation always take precedence over remembered information.

Persistent agents should periodically return to the current project guideline during substantial work.

In particular, re-read relevant sections:

- At the beginning of substantial project work
- Before architectural changes
- Before adding or replacing dependencies
- Before modifying CI/CD
- Before changing toolchain configuration
- Before changing UI language behavior
- When existing project conventions are unclear
- When remembered information conflicts with the repository

Do not rely on a remembered summary when the repository contains the current rule.

## Hard rules quick reference

The following behaviors are prohibited. Each item links to the document that defines the rule; keep this list synchronized with those documents whenever a rule changes.

1. Replace mandatory standardized tools without explicit user approval. ([core-principles](../principles/core-principles.md))
2. Use npm or yarn instead of pnpm. ([typescript](../toolchain/typescript.md))
3. Use ESLint as the normal project linter instead of oxlint. ([typescript](../toolchain/typescript.md))
4. Use Prettier instead of oxfmt. ([typescript](../toolchain/typescript.md))
5. Use Pipenv or Poetry instead of uv. ([python](../toolchain/python.md))
6. Use flake8 or black instead of ruff. ([python](../toolchain/python.md))
7. Use pre-commit or Lefthook instead of prek. ([quality-gates](../toolchain/quality-gates.md))
8. Replace Cocogitto with an unrelated Conventional Commits validator without reason and approval. ([git](../toolchain/git.md))
9. Ignore lint or validation problems without understanding them. ([core-principles](../principles/core-principles.md))
10. Disable useful rules simply to make checks pass. ([core-principles](../principles/core-principles.md))
11. Over-engineer rapid validation projects. ([core-principles](../principles/core-principles.md))
12. Introduce unnecessary dependencies. ([dependencies](../practices/dependencies.md))
13. Create redundant files or modules. ([coding-standards](../practices/coding-standards.md))
14. Silently violate an ADR. ([architecture-governance](../practices/architecture-governance.md))
15. Accidentally change architectural invariants. ([architecture-governance](../practices/architecture-governance.md))
16. Use non-English identifiers or comments in source code. ([language-policy](../practices/language-policy.md))
17. Use Japanese romaji or Chinese pinyin as code identifiers. ([language-policy](../practices/language-policy.md))
18. Infer UI language from conversation language. ([language-policy](../practices/language-policy.md))
19. Produce low-quality literal translations in cross-language UI work. ([language-policy](../practices/language-policy.md))
20. Modify shadcn/ui component internals unnecessarily. ([shadcn-ui](../libraries/shadcn-ui.md))
21. Leave undocumented required shadcn/ui component modifications. ([shadcn-ui](../libraries/shadcn-ui.md))
22. Edit installed coss ui component files instead of composing, wrapping, or theming. ([coss](../libraries/coss.md))
23. Blindly upgrade GitHub Actions without reviewing compatibility. ([github-actions](../toolchain/github-actions.md))
24. Commit secrets or sensitive information. ([security](../practices/security.md))
25. Force push shared history without appropriate approval. ([git](../toolchain/git.md))
26. Treat passing CI as a substitute for understanding whether the implementation is correct. ([change-discipline](../practices/change-discipline.md))
