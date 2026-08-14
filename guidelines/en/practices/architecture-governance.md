---
id: practices/architecture-governance
lang: en
version: 1
source-lang: en
status: active
digest: 02a04159
---

# Architecture Governance

## Architecture invariants

Projects should explicitly record architectural constraints that AI agents must not accidentally violate.

Use `ARCHITECTURE.md` for current architectural boundaries and invariants.

Examples include:

- Which layer owns domain logic
- Which modules may call external APIs
- Authentication boundaries
- State-management boundaries
- Databricks access boundaries
- Frontend/backend responsibilities
- Dependency direction
- Integration boundaries

Keep this document concise.

It should answer:

> **What must remain true about the current architecture?**

When this document is required is defined in [Required Project Documentation](project-documentation.md).

## Architectural decision records

Use ADRs for significant architectural decisions.

Each important architectural decision should be stored separately using a consistent ADR structure.

An ADR should explain:

- Context
- Decision
- Alternatives considered
- Reasoning
- Consequences

Use the shared [ADR template](../../../templates/adr.template.md) for this structure.

ADRs are not immutable laws.

They act as architectural guardrails that help prevent accidental changes, especially when AI agents modify the codebase.

When a user's request conflicts with an ADR:

1. Understand the user's actual intent.
2. Understand why the ADR exists.
3. Evaluate the impact of changing the decision.
4. Prefer a solution compatible with the existing architecture when reasonable.
5. If the architecture genuinely needs to change, explain the impact.
6. Update or supersede the ADR explicitly.

Do not silently violate an ADR.

If the user is uncertain whether the architecture should change, help analyze the consequences before making the change.
