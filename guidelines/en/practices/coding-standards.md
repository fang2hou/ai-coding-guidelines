---
id: practices/coding-standards
lang: en
version: 2
source-lang: en
status: active
digest: fc51bca2
---

# Coding Standards

## Follow ecosystem best practices

Follow the established conventions of the selected language and framework; do not substitute a private variant of them.

This covers:

- Clear structure
- Appropriate data structures
- Established framework conventions
- Appropriate design patterns
- Type safety where appropriate
- Idiomatic APIs

Handle edge cases with early returns so the main path stays flat:

```ts
// bad
if (order !== null) {
  if (order.isPaid) {
    ship(order);
  }
}
// good
if (order === null || !order.isPaid) return;
ship(order);
```

Adopt a design pattern only when it names a problem that actually exists in the codebase, not because a catalog lists it.

## Avoid over-engineering

Do not make the codebase more complex without a concrete need.

Prefer code that is:

- Simple
- Readable
- Explicit
- Maintainable
- Easy to modify

Avoid premature generalization: wait for the second use case before introducing an abstraction.

```ts
// bad
const users = UserRepositoryFactory.create();
const cache = CacheFactory.createCache();
// good
const users = new UserRepository();
const cache = new Cache();
```

Do not hide a second behavior behind a boolean parameter; split the function so call sites read without flags.

```ts
// bad
function saveReport(report: Report, silent: boolean) {
  /* ... */
}
saveReport(report, true);
// good
function saveReport(report: Report) {
  /* ... */
}
function saveReportSilently(report: Report) {
  /* ... */
}
```

## Naming

Use meaningful English names that accurately describe purpose and behavior.

Avoid:

- Ambiguous abbreviations
- Generic names such as `data`, `thing`, or `value` when a better name exists
- Transliteration
- Project-specific slang when a standard English term exists

```ts
// bad
const usr = findUsrById(uid);
let flag = false;
// good
const user = findUserById(userId);
let hasUnsavedChanges = false;
```

Follow the code-language rules in [Language Policy](language-policy.md).

## Modularity

Write modular code where modularity improves:

- Testing
- Readability
- Ownership
- Reuse
- Change isolation

Do not create artificial modules merely to satisfy an abstract idea of modularity.

Decision test: a helper used by exactly one screen stays in that screen's file; it moves to a shared module when a second consumer imports it.

## New files and modules

Before creating a new file or module, state its responsibility in one sentence. If the sentence needs "and" to stay accurate, the file is doing two jobs — split it or reconsider it.

Do not create:

- Redundant modules
- Duplicate helpers
- Empty abstractions
- Parallel implementations of existing functionality

`src/utils/date.ts` has a responsibility; `src/utils/misc.ts` does not.

New code must remain consistent with the existing architecture.

## Responsive frontend

Frontend applications must provide complete responsive behavior: usable across desktop, tablet, and mobile sizes, built with modern responsive layout techniques.

```tsx
// bad
<div className="w-[960px] px-8">
// good
<div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
```

Decide breakpoints while implementing the first screen. Do not treat responsive behavior as a final cosmetic step after the application has been built for one fixed viewport.
