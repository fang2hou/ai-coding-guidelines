---
id: practices/architecture-governance
lang: en
version: 1
source-lang: en
status: active
digest: 8a4315ec
---

# Architecture Governance

## Architecture invariants

Record architectural boundaries and invariants in `ARCHITECTURE.md` so AI agents do not break them by accident.

Typical invariants include:

- Which layer owns domain logic
- Which modules may call external APIs
- Authentication boundaries
- State-management boundaries
- Databricks access boundaries
- Frontend/backend responsibilities
- Dependency direction
- Integration boundaries

Keep `ARCHITECTURE.md` short. It should answer one question:

> **What must remain true about the current architecture?**

See [Required Project Documentation](project-documentation.md) for when `ARCHITECTURE.md` is required.

## Architectural decision records

Record each major architectural decision in its own ADR using the shared [ADR template](../../../templates/adr.template.md).

An ADR covers:

- Context
- Decision
- Alternatives considered
- Reasoning
- Consequences

ADRs are guardrails, not permanent laws: they stop contributors and AI agents from changing the architecture by accident.

When a user's request conflicts with an ADR:

1. Understand the user's actual intent.
2. Understand why the ADR exists.
3. Evaluate the impact of changing the decision.
4. Prefer a solution compatible with the existing architecture when reasonable.
5. If the architecture genuinely needs to change, explain the impact.
6. Update or supersede the ADR explicitly.

Do not silently violate an ADR.

If the user is uncertain whether the architecture should change, help analyze the consequences before making the change.
