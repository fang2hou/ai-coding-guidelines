---
id: practices/testing
lang: en
version: 2
source-lang: en
status: active
digest: 29798268
---

# Testing Strategy

Write tests to verify real behavior, not to pad coverage numbers.

Before adding a test, know what failure it is meant to catch.

Prioritize:

- Core business logic
- Important user behavior
- Known failure-prone paths
- Boundary conditions
- Error handling
- Exceptional conditions
- Integration boundaries

Coverage numbers are a useful signal, not the goal; the goal is confidence that important behavior works.

## Frontend E2E tests

Frontend projects should include E2E tests where practical.

E2E tests should focus on:

- Main user flows
- Critical product behavior
- Important integration behavior

Use realistic test data. When production-like data helps, anonymize or sanitize it first — never put real production secrets or personal data in test fixtures.

Keep E2E suites fast. Add tests only when the confidence they provide justifies the extra time spent running [Quality Gates](../toolchain/quality-gates.md).

For projects using Playwright, load `eslint-plugin-playwright` into oxlint via the `jsPlugins` array. The plugin is officially conformance-tested with oxlint; oxlint's JS plugin support is currently in alpha.

Scope the rules to Playwright test files with an `overrides` entry so they do not fire on application code.

```jsonc
// .oxlintrc.json
{
  "jsPlugins": ["eslint-plugin-playwright"],
  "overrides": [
    {
      "files": ["e2e/**/*.ts"],
      "rules": {
        "playwright/no-networkidle": "error",
        "playwright/no-wait-for-timeout": "warn",
      },
    },
  ],
}
```

## Frontend unit tests

Frontend projects should include unit tests for important components and logic where practical, using realistic sanitized data when it improves the test.

Prioritize:

- Important component behavior
- Business logic
- State transitions
- Data transformations
- Edge cases
- Error conditions

Keep unit tests fast.

Avoid tests that merely duplicate implementation details.
