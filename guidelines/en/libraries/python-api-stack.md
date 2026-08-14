---
id: libraries/python-api-stack
lang: en
version: 1
source-lang: en
status: active
digest: 1064db61
---

# Python API Stack

## Verdict

Preferred — FastAPI + Pydantic + Uvicorn is the preferred Python API baseline; adopt the three as one stack, not as independent picks.

## Use when

- A Python backend has been justified under the criteria in [Python Toolchain](../toolchain/python.md).
- Building a Python API that needs data validation and structured models.
- Serving a FastAPI application whose deployment platform provides no managed ASGI server.

## Avoid when

- A TypeScript-only architecture is sufficient — do not introduce a Python backend automatically (see [Python Toolchain](../toolchain/python.md)).
- The deployment platform provides an appropriate managed alternative to Uvicorn.

## Strengths

- FastAPI: high-performance ASGI framework with automatic OpenAPI documentation.
- Pydantic: typed data validation and structured models that integrate with FastAPI request and response handling.
- Uvicorn: lightweight, standard ASGI server for serving FastAPI applications.

## Tradeoffs

- Introducing the stack adds a Python service with its own dependency and deployment surface.
- Pydantic models must be kept in sync with the data they validate.

## Version policy

- Prefer the latest stable versions of FastAPI, Pydantic, and Uvicorn for new projects.
- Do not hold the stack on obsolete versions without a concrete compatibility reason.

## Usage rules

- Use FastAPI as the Python API framework.
- Use Pydantic for Python data validation and structured models where appropriate.
- Use Uvicorn as the standard ASGI server for FastAPI applications unless the deployment platform provides an appropriate managed alternative.

## Works with

### Internal interplay

- FastAPI + Pydantic — Pydantic models are FastAPI's validation layer; define request and response schemas as Pydantic models rather than hand-rolled validation.
- FastAPI + Uvicorn — Uvicorn is the standard ASGI server for FastAPI applications unless the platform provides a managed alternative.

### Related guidelines

- [Python Toolchain](../toolchain/python.md) — pairs-with: manage environments, dependencies, and linting for this stack with uv and ruff.
