---
id: practices/coding-standards
lang: en
version: 3
source-lang: en
status: active
digest: 99a5a9ee
---

# Coding Standards

## Follow ecosystem best practices

Follow the standard conventions of the language and framework you are using; do not invent custom variants.

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

Use a design pattern only when it solves a problem that already exists in the code, not because a catalog lists it.

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

Do not use a boolean parameter to switch between two behaviors. Split the function so its name makes the intended behavior clear at each call site.

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

## Comments

Write code that needs few comments. Let clear names and small functions show what the code does; use comments only for what the code itself cannot express.

- Comment the why, never restate the what.
- Do not narrate logic step by step; if a passage needs a running commentary, restructure it first.
- Do not keep comments that describe removed behavior or past intentions.
- Keep configuration files comment-free; put the rationale in the pull request or the project documentation.

```ts
// bad
// renew the subscription if it is still active
if (user.subscription && user.subscription.endsAt > now) {
  renew(user.subscription);
}
// good
if (user.hasActiveSubscription(now)) {
  renew(user.subscription);
}
```

## Modularity

Write modular code where modularity improves:

- Testing
- Readability
- Ownership
- Reuse
- Change isolation

Do not create artificial modules merely to satisfy an abstract idea of modularity.

Rule of thumb: keep a helper used by one screen in that screen's file, and move it to a shared module only when a second caller imports it.
Order each file for the next reader: group related functions, separate levels of detail, and put the main flow above its helpers.

## New files and modules

Before creating a new file or module, state its responsibility in one sentence. If the sentence needs "and" to stay accurate, the file is doing two jobs — split it or reconsider it.

Do not create:

- Redundant modules
- Duplicate helpers
- Empty abstractions
- Parallel implementations of existing functionality

`src/utils/date.ts` has a responsibility; `src/utils/misc.ts` does not.

New code must remain consistent with the existing architecture.

## Performance

Correctness and readability come first; do not trade structure for speed you have not measured.

- Avoid unnecessary allocations, copies, and recomputation.
- Keep O(n) work out of loops that run O(n) times.
- Fix the algorithm or the data structure before scattering micro-optimizations.
- Optimize only measured hot paths, and only with evidence.

## Responsive frontend

Frontend applications must be fully responsive: usable at desktop, tablet, and mobile sizes, built with modern responsive layout techniques.

```tsx
// bad
<div className="w-[960px] px-8">
// good
<div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
```

Decide breakpoints while implementing the first screen. Do not treat responsive behavior as a final cosmetic step after the application has been built for one fixed viewport.
