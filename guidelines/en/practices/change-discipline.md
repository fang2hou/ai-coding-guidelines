---
id: practices/change-discipline
lang: en
version: 1
source-lang: en
status: active
digest: d9337347
---

# Change Discipline

Before considering a change complete:

* Confirm that the requested behavior is actually implemented.
* Run relevant formatting checks.
* Run linting.
* Run type checking where applicable.
* Run relevant tests.
* Run the appropriate [prek checks](../toolchain/quality-gates.md).
* Validate [Conventional Commits](../toolchain/git.md) when working with commits.
* Review the diff.
* Check for unintended changes.
* Check for unnecessary new dependencies.
* Check for unnecessary new files.
* Check architecture compatibility.
* Check code-language compliance ([Language Policy](language-policy.md)).
* Check product-language compliance ([Language Policy](language-policy.md)).
* Check for sensitive information ([Security](security.md)).

Passing CI is necessary but does not by itself prove that the implementation is correct.

Do not treat a green pipeline as a substitute for reviewing the diff and understanding whether the change is correct.

Apply this checklist before handing any non-trivial change over for review, in addition to the [operating protocol](agent-protocol.md).
