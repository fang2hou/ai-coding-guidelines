# ADR-0004: Native-CSS-first UI styling

- **Status**: accepted
- **Date**: 2026-10-16

## Context

The corpus recommended Tailwind CSS as the preferred CSS framework and
shadcn/ui as the preferred copy-in component system (with coss ui as the
secondary option). In practice the copy-in model has not paid off for this
repository's consuming projects: a large generated component surface, upgrade
churn against registry updates, and an abstraction layer that gets in the way
of direct CSS work. The user decided on 2026-10-16 to drop shadcn/ui entirely
and to style UI with native CSS first.

## Decision

Native CSS is the default styling approach: custom properties and design
tokens, nesting, `:has()`, container queries, `light-dark()`. Tailwind CSS is
demoted to situational — existing projects and kits that require it (coss ui,
DaisyUI). The shadcn/ui guideline is removed; coss ui remains a situational
copy-in option for projects that explicitly choose it. Corner-radius design
rules (continuous corners, medium control radii, concentric nesting) are
codified in `practices/corner-radius`.

## Alternatives Considered

### Keep shadcn/ui as the preferred component system

- Pros: large ecosystem, familiar registry workflow.
- Cons: the copy-in model is exactly what failed in practice; the user
  explicitly removed it.

### Promote coss ui to the default component system

- Pros: same registry toolchain, Base UI primitives, never-edit rule.
- Cons: same copy-in model with the same churn; swaps one vendor for another.

### Standardize on an unstyled primitives library (Base UI, React Aria)

- Pros: accessibility for complex widgets without owning their styling.
- Cons: premature until a project actually needs complex widgets; revisit via
  the review triggers below.

## Consequences

- New frontend work writes more CSS by hand; radius and token discipline move
  from a library theme into `practices/corner-radius`.
- Consuming projects that still run shadcn/ui are legacy-neutral in audits:
  not flagged as violations, no longer covered by a guideline.
- The agent-protocol quick-reference rules about shadcn/ui internals are
  removed in the same change.

## Review Triggers

- A consuming project needs complex accessible widgets (dialog focus
  management, combobox): re-evaluate an unstyled primitives library.
- `corner-shape` support lands in Safari or Firefox: revisit the
  progressive-enhancement note in `practices/corner-radius`.
