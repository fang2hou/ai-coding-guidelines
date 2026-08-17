---
id: practices/agents-file
lang: en
version: 1
source-lang: en
status: active
digest: bc3d0715
---

# Authoring AGENTS.md

`AGENTS.md` is the agent entry point of a repository: the operating context an agent loads before it writes any code. Agent harnesses load it up front and cap how much instruction context they carry, so each line must earn its space.

Template: [project-agents.template.md](../../../templates/project-agents.template.md)

## Mandate

Every project must keep one `AGENTS.md` at the repository root.

`AGENTS.md` is the canonical filename. Do not copy the same rules into compatible filenames such as `CLAUDE.md`: duplicated instruction files drift apart and consume the context budget twice.

## Choose the right surface

Put each kind of guidance where it belongs:

| Content                                                | Where it belongs                           |
| ------------------------------------------------------ | ------------------------------------------ |
| Always-on commands, conventions, boundaries            | `AGENTS.md`                                |
| Product background, onboarding, screenshots            | `README.md`                                |
| Full development workflow and toolchain detail         | `DEVELOPMENT.md`                           |
| Pull request, review, and validation requirements      | `CONTRIBUTING.md`                          |
| Architectural invariants                               | `ARCHITECTURE.md`                          |
| A procedure needed only for one specific workflow      | A separate document or agent skill, linked |
| Agent tool preferences, model defaults, autonomy level | That tool's own configuration file         |

Do not paste run books, long reference documents, or task-specific notes into `AGENTS.md`. Link to the source of truth instead.

## Structure

Open with one sentence naming what the project is and for whom, then order the sections by what an agent needs first, following the template:

1. Commands — exact setup, run, single-test, test, lint, type check, build, regeneration, and full-validation commands; drop the lines the project does not have.
2. Engineering standards — the shared guideline, plus project-specific overrides.
3. Layout — one line per top-level directory, naming key modules.
4. Boundaries — Always / Never / Ask first.
5. Confirmed language policy — see [Language Policy](language-policy.md).
6. Project conventions — the decisions an agent would not guess from the code.
7. Depth links to `DEVELOPMENT.md`, `CONTRIBUTING.md`, and `ARCHITECTURE.md`.

Commands come first because they are what an agent needs in its first minute. Give both the narrow form and the full gate — a focused test command for a one-line change, `mise run check` before a commit — so the agent does not reach for the expensive command by default.

## Write verifiable rules

Every rule must state a behavior an agent can perform and a reviewer can check. Name the command, the path, or the condition.

Verifiable:

```markdown
- Run `mise run test -- src/auth/token.test.ts` for changes under `src/auth/`.
- Never edit files under `src/generated/`; regenerate with `mise run codegen`.
- Ask before adding a dependency or changing an invariant in `ARCHITECTURE.md`.
```

Not verifiable, therefore useless:

```markdown
- Be careful with the auth code.
- Make sure everything works.
- Follow best practices.
```

## Nested files

Start with one root file. Add a nested `AGENTS.md` to a subdirectory only when that subtree genuinely differs:

- It uses a different package manager, test runner, or runtime.
- It contains generated code that must be regenerated rather than edited.
- It carries extra approval requirements, such as migrations or deployments.
- It has UI or design-system rules that do not apply elsewhere.

A nested file records only its own deltas and defers to the root for everything else. Never restate root rules in a nested file.

## Keep it small

The file is loaded at the start of every task, so its size is a cost paid over and over.

- Put the highest-signal rules at the top.
- Route to detail documents instead of duplicating them.
- Prefer a machine-enforced check over a paragraph: a rule that lint, prek, or CI already enforces does not need restating.
- Move subsystem-specific guidance into a nested file rather than growing the root file.

Keep the root file scannable in a single pass. If it no longer is, the fix is routing and deletion, not smaller type.

## Never include

- Secrets, credentials, tokens, or private host names.
- Copies of documents that already exist elsewhere in the repository.
- Exhaustive directory inventories, which go stale on the next refactor.
- Temporary task notes that belong in an issue or pull request.
- Blanket instructions to skip validation.

## Keep it current

Update `AGENTS.md` in the same change that alters its commands, layout, boundaries, or conventions.

A stale instruction is worse than a missing one: an agent follows it confidently and produces a change nobody asked for.
