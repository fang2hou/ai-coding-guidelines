---
id: practices/coding-standards
lang: en
version: 1
source-lang: en
status: active
digest: dafd28da
---

# Coding Standards

## Follow ecosystem best practices

Use appropriate modern best practices for the selected language and framework.

This includes:

* Clear structure
* Appropriate data structures
* Established framework conventions
* Appropriate design patterns
* Type safety where appropriate
* Idiomatic APIs

Do not apply a design pattern merely because it exists.

## Avoid over-engineering

Do not make the codebase more complex without a concrete need.

Prefer code that is:

* Simple
* Readable
* Explicit
* Maintainable
* Easy to modify

Avoid premature generalization.

## Naming

Use meaningful English names that accurately describe purpose and behavior.

Avoid:

* Ambiguous abbreviations
* Generic names such as `data`, `thing`, or `value` when a better name exists
* Transliteration
* Project-specific slang when a standard English term exists

Follow the code-language rules in [Language Policy](language-policy.md).

## Modularity

Write modular code where modularity improves:

* Testing
* Readability
* Ownership
* Reuse
* Change isolation

Do not create artificial modules merely to satisfy an abstract idea of modularity.

## New files and modules

Before creating a new file or module, confirm that it has a clear responsibility.

Do not create:

* Redundant modules
* Duplicate helpers
* Empty abstractions
* Parallel implementations of existing functionality

New code must remain consistent with the existing architecture.

## Responsive frontend

Frontend applications should provide complete responsive behavior.

The application should remain usable across relevant:

* Desktop sizes
* Tablet sizes
* Mobile sizes

Use modern responsive layout techniques.

Do not treat responsive behavior as a final cosmetic step after the application has already been implemented for one fixed viewport.
