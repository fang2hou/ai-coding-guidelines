# Architecture

This document answers one question:

> **What must remain true about the current architecture?**

Keep it short and operational. It is a guardrail against accidental drift —
especially by AI agents making broad changes — not a comprehensive architecture
description.

## Invariants

- **Layer responsibilities**: `<which layer owns domain logic>`
- **External API access**: `<which modules may call external APIs>`
- **Authentication boundary**: `<where auth is enforced>`
- **State management boundary**: `<who owns state, how it flows>`
- **Dependency direction**: `<e.g. UI -> services -> data; never upward>`
- **Integration boundaries**: `<e.g. frontend talks to backend only via /api>`

## Decisions

Significant decisions are recorded as ADRs in `<docs/adr/>`, using
[adr.template.md](./adr.template.md) from the guideline repository.
When a request conflicts with an ADR, do not silently violate it —
follow the ADR conflict workflow in the guideline's architecture governance.
