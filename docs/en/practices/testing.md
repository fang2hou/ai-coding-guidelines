---
id: practices/testing
lang: en
version: 1
source-lang: en
status: active
digest: 45fc8001
---

# Testing Strategy

Testing should validate meaningful behavior.

Do not write tests merely to increase coverage.

Before adding a test, understand which failure mode the test is intended to detect.

Prioritize:

* Core business logic
* Important user behavior
* Known failure-prone paths
* Boundary conditions
* Error handling
* Exceptional conditions
* Integration boundaries

Coverage metrics may provide information, but coverage percentage is not the objective.

The objective is confidence that important behavior works correctly.

## Frontend E2E tests

Frontend projects should include E2E tests whenever reasonably practical.

E2E tests should focus on:

* Main user flows
* Critical product behavior
* Important integration behavior

Prefer realistic test data.

When real production-like data is useful, use properly anonymized or sanitized data.

Never expose sensitive production information in test fixtures.

Keep E2E execution time under control.

Do not build a huge E2E suite that significantly slows the rapid validation workflow (see [Quality Gates](../toolchain/quality-gates.md)) without providing corresponding confidence.

## Frontend unit tests

Frontend projects should include unit tests for important components and logic whenever reasonably practical.

Use realistic sanitized data where it improves test quality.

Prioritize:

* Important component behavior
* Business logic
* State transitions
* Data transformations
* Edge cases
* Error conditions

Keep unit tests fast.

Avoid tests that merely duplicate implementation details.
