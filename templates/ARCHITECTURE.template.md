# Architecture

This document orients new contributors and guards the design against
accidental drift — especially by AI agents making broad changes. Keep it short
and stable: a map of the country, not an atlas of its states. Revisit it
occasionally; do not try to keep it synchronized with the code.

## Overview

{{Two or three sentences: what the system does and its overall shape.}}

## Codebase Map

{{One line per coarse module — enough to answer "where is the thing that does X?". Name modules and types; do not link files (links go stale).}}

- {{module}} — {{what it owns}}
- {{module}} — {{what it owns}}

## Invariants

What must remain true about the architecture:

- **Layer responsibilities**: {{which layer owns domain logic}}
- **External API access**: {{which modules may call external APIs}}
- **Authentication boundary**: {{where auth is enforced}}
- **State management boundary**: {{who owns state, how it flows}}
- **Dependency direction**: {{e.g. UI -> services -> data; never upward}}
- **Integration boundaries**: {{e.g. frontend talks to backend only via /api}}

## Cross-Cutting Concerns

{{Only when relevant: error handling, logging, code generation — rules that span modules.}}

## Decisions

Significant decisions are recorded as ADRs in {{docs/adr/}}, using
[adr.template.md](./adr.template.md) from the guideline repository.
When a request conflicts with an ADR, do not silently violate it —
follow the ADR conflict workflow in the guideline's architecture governance.
