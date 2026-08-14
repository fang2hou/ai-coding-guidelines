---
id: toolchain/python
lang: en
version: 1
source-lang: en
status: active
digest: 9dd338fc
---

# Python Toolchain

## When to Introduce a Python Backend

A Python backend should not be introduced automatically.

Prefer a TypeScript-only architecture when it is sufficient.

Introduce a Python backend when the project has requirements that genuinely benefit from Python, especially when:

* Backend logic is sufficiently complex
* Python-specific libraries provide meaningful value
* Part of the implementation is owned by another team
* Data science engineers need to modify part of the workflow
* Agent or data-processing logic needs to be delegated independently

For example, a Python service can be appropriate when part of an agent workflow is expected to be maintained by a data science team.

For the standard API framework, validation, and server stack, see [Python API Stack](../libraries/python-api-stack.md).

## uv

Use `uv` for Python environment and dependency management.

Avoid introducing a second Python environment-management system.

### Rejected Alternatives

Do not use:

* Pipenv
* Poetry

## ruff

Use `ruff` for Python linting and formatting.

Avoid maintaining separate tools when ruff covers the required workflow.

### Rejected Alternatives

Do not use:

* flake8
* black
