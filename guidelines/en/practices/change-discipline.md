---
id: practices/change-discipline
lang: en
version: 2
source-lang: en
status: active
digest: 5c75c63d
---

# Change Discipline

Apply this checklist to every non-trivial change before handing it over for review, in addition to the [operating protocol](agent-protocol.md).

## Completion Checklist

Before considering a change complete:

- Confirm that the requested behavior is actually implemented.
- Run relevant formatting checks.
- Run linting.
- Run type checking where applicable.
- Run relevant tests.
- Run the appropriate [prek checks](../toolchain/quality-gates.md).
- Validate [Conventional Commits](../toolchain/git.md) when working with commits.
- Review the diff.
- Check for unintended changes.
- Check for unnecessary new dependencies.
- Check for unnecessary new files.
- Check architecture compatibility.
- Check code-language compliance ([Language Policy](language-policy.md)).
- Check product-language compliance ([Language Policy](language-policy.md)).
- Check for sensitive information ([Security](security.md)).

## Worked Example: Fixed a Flaky Login Test

The change under review: `tests/e2e/login.spec.ts` fails intermittently in CI, and the fix replaces a fixed three-second sleep with a wait for the session cookie.

Confirm the behavior first. A flaky test must pass repeatedly, not once:

```bash
mise run test e2e/login.spec.ts   # 20 consecutive runs, 20/20 green
```

Run the static gates and let them fire:

```text
$ mise run check
oxfmt   ok
oxlint  ERROR tests/e2e/login.spec.ts:4:3  no-unused-vars  `expect` is never used
tsc     not reached
```

Remove the leftover import and re-run. Passing looks like this:

```text
$ mise run check
oxfmt   ok
oxlint  ok
tsc     ok
```

Review the diff:

```text
$ git diff --stat
 tests/e2e/login.spec.ts | 8 +++++---
 1 file changed
```

One file touched: no new dependencies, no new files, no architecture impact. The new comment in the test is English per the [Language Policy](language-policy.md); no user-facing string changed, so product-language compliance is unaffected; the credentials stay in the test fixture, never in the diff ([Security](security.md)).

Commit. prek runs the same checks over the staged tree, and the message follows [Conventional Commits](../toolchain/git.md):

```text
$ git commit -m "test(e2e): wait for session cookie instead of fixed sleep"
prek  ok  format check, lint, secret scanning
```

That is what passing looks like: every check green, the diff read line by line, and nothing in the change you cannot explain.

## Green CI Is Not Proof

Passing CI is necessary but does not by itself prove that the implementation is correct.

Do not treat a green pipeline as a substitute for reviewing the diff and understanding whether the change is correct.
