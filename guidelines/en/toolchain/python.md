---
id: toolchain/python
lang: en
version: 2
source-lang: en
status: active
digest: aeb909bd
---

# Python Toolchain

## Mandate

Python is a default language for AI-assisted development, alongside TypeScript. Both are defaults because their library and agent ecosystem support is the strongest of the available languages.

Language priority:

- TypeScript and Python are the default languages for AI-assisted development because their library and agent ecosystem support is strongest.
- Go or Rust are reserved for performance-critical or systems scenarios; they require explicit justification plus user approval, recorded in a project ADR. See [Go](../toolchain/go.md) and [Rust](../toolchain/rust.md).

A Python backend should not be introduced automatically. Prefer a TypeScript-only architecture when it is sufficient; see [TypeScript Toolchain](../toolchain/typescript.md).

Introduce a Python backend when the project has requirements that genuinely benefit from Python, especially when:

- Backend logic is sufficiently complex
- Python-specific libraries provide meaningful value
- Part of the implementation is owned by another team
- Data science engineers need to modify part of the workflow
- Agent or data-processing logic needs to be delegated independently

For example, a Python service can be appropriate when part of an agent workflow is expected to be maintained by a data science team.

For the standard API framework, validation, and server stack, see [Python API Stack](../libraries/python-api-stack.md).

## Version Policy

Use Python 3.12 or newer, managed by mise.

Pin the exact Python version in the project's mise configuration.

Commit `uv.lock` so every environment resolves the same dependency versions.

## uv

Use `uv` for Python environment and dependency management.

Avoid introducing a second Python environment-management system.

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

Use `ruff` for Python linting and formatting.

Avoid maintaining separate tools when ruff covers the required workflow.

Run `ruff check` to lint and `ruff format` to format; wire both into the project's quality gates. Configure ruff in `pyproject.toml`. Baseline rule selection:

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
