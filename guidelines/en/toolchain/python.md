---
id: toolchain/python
lang: en
version: 4
source-lang: en
status: active
digest: b272342e
---

# Python Toolchain

## Mandate

Python and TypeScript are the default languages for AI-assisted development because they have the strongest library and agent ecosystem support.

Language priority:

- Prefer a TypeScript-only stack when it is enough; see [TypeScript Toolchain](../toolchain/typescript.md).
- Add a Python backend only when the project genuinely benefits from Python (criteria below).
- Reserve Go and Rust for performance-critical or systems work; both require a clear reason, user approval, and a project ADR. See [Go](../toolchain/go.md) and [Rust](../toolchain/rust.md).

A Python backend is justified especially when:

- Backend logic is sufficiently complex
- Python-specific libraries provide meaningful value
- Part of the implementation is owned by another team
- Data science engineers need to modify part of the workflow
- Agent or data-processing logic needs to be delegated independently

For example, a Python service can be appropriate when part of an agent workflow is expected to be maintained by a data science team.

For the standard API framework, validation, and server stack, see [Python API Stack](../libraries/python-api-stack.md).

## Version Policy

Default to Python 3.12. mise provides the interpreter and uv itself; environments and dependencies (`uv.lock` etc.) belong to uv. Do not adopt newer CPython lines until the ML ecosystem and model training data have caught up; revisit when the ecosystem's default shifts.

Models generate code from training data, so a mature version well represented in training data causes fewer errors in AI-assisted development. The principle lives in [Core Engineering Principles](../principles/core-principles.md).

Pin the exact Python version in the project's mise configuration.

Commit `uv.lock` so every environment resolves the same dependency versions.

## uv

Use `uv` for Python environments and dependencies; do not add a second environment or package manager.

Standard workflow:

- `uv init` — start a project.
- `uv add <package>` — add a runtime dependency and update the lockfile.
- `uv add --dev <package>` — add a development-only dependency such as a lint or test tool.
- `uv remove <package>` — remove a dependency.
- `uv lock --upgrade` — upgrade the locked dependency versions.
- `uv sync` — install the locked environment.
- `uv run <command>` — run a command inside the project environment.

Never invoke bare `python` or `pip`: both bypass the project environment and the lockfile. Use `uv run python` and `uv add` / `uv sync` instead.

Declare dependencies in `pyproject.toml`. `uv.lock` is generated; never edit it by hand.

For standalone scripts, declare dependencies with PEP 723 inline script metadata and run them with `uv run script.py`:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx"]
# ///
```

### Rejected Alternatives

Do not use:

- Pipenv
- Poetry

## ruff

Use `ruff` for both linting (`ruff check`) and formatting (`ruff format`), wired into the project's quality gates and configured in `pyproject.toml`. Baseline rules:

```toml
[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "SIM"]
```

E and F catch syntax-level and correctness problems, I keeps imports sorted, B catches common bug patterns, UP modernizes syntax, and SIM flags simplifiable code. Extend this baseline per project when needed; do not shrink it silently.

### Rejected Alternatives

Do not use:

- flake8
- black

## Language Usage Rules

- Add type hints to every public function, covering both parameters and return types.
- Use `pathlib` instead of `os.path` for filesystem paths.
- Build strings with f-strings; do not use `%` formatting or `str.format` in new code.
- Never use mutable default arguments (`def f(items=[])`). Default to `None` and create the collection inside the function.
- Manage resources such as files, sockets, sessions, and clients with context managers (`with`).
- When re-raising, preserve the cause: `raise NewError(...) from err`.
- Use `dataclasses` for internal data structures. Use Pydantic only at validation boundaries; see [Python API Stack](../libraries/python-api-stack.md).

## Project Layout

- Put the package under `src/` (`src/<package>/`) and keep `tests/` beside it at the project root.
- This layout prevents importing the package without installing it.

## Works with

- [Python API Stack](../libraries/python-api-stack.md)
- [Quality Gates](../toolchain/quality-gates.md)
- [Testing Strategy](../practices/testing.md)
