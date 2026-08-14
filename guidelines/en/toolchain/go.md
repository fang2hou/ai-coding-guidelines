---
id: toolchain/go
lang: en
version: 1
source-lang: en
status: draft
digest: 7f52fdc5
---

# Go Toolchain

## Mandate

TypeScript and Python are the default languages for AI-assisted development because their library and agent ecosystem support is strongest.

Go is not a default choice.

Choose Go only when the project genuinely needs:

* Performance-sensitive network services
* Command-line tools distributed as standalone binaries
* Static single-binary deployment targets
* High-concurrency workloads

Adopting Go requires explicit justification and user approval, recorded in a project ADR.

Familiarity with Go is not a justification on its own.

## Scope

This document is a baseline standard for Go projects.

It does not replace project-level evaluation.

Before adopting Go, confirm both points: the requirement matches one of the scenarios above, and TypeScript or Python cannot satisfy it at acceptable cost.

## Version Policy

Use the latest stable Go release, managed through mise.

The `toolchain` directive in `go.mod` must match the mise-managed Go version.

Do not pin an older Go release without a recorded reason.

## Usage Rules

### Linting

Use `golangci-lint` as the linter.

Expose it through mise tasks so local development and CI use the same configuration.

### Formatting

Use `gofumpt` as the formatter.

Include the format check in the pre-commit configuration and in CI.

### Error Handling

Wrap errors with `%w` when adding context:

```go
return fmt.Errorf("loading config: %w", err)
```

Inspect wrapped errors with `errors.Is` and `errors.As`.

Do not inspect errors by comparing message strings.

### Context

Pass `context.Context` as the first parameter of functions that block or are scoped to a request.

Propagate the caller's context; do not create fresh `context.Background` values inside library code.

### Concurrency

Keep goroutine ownership explicit: every goroutine has exactly one owner responsible for its lifecycle.

Make cancellation explicit through context propagation.

Do not leak goroutines.

### Testing

Cover behavior with multiple inputs using table-driven tests.

Run `go test -race` in CI.

### Panics

Do not `panic` in library code; return errors instead.

Reserve `panic` for unrecoverable startup errors in `cmd/` entrypoints.

### Project Layout

Place entrypoints under `cmd/`.

Place packages that are not part of the public API under `internal/`.

## Works with

* [mise](../toolchain/mise.md) — versioning: Go and golangci-lint are managed and exposed through mise tasks.
* [Quality Gates](../toolchain/quality-gates.md) — same checks: prek and CI run the same lint and format configuration.
* [Git Workflow](../toolchain/git.md) — commit discipline: Go changes follow the standard commit and PR rules.
* [Testing Strategy](../practices/testing.md) — test focus: what to verify, and at which level.

## Rejected Alternatives

Standalone `gofmt` or `goimports` as the project formatter.

`gofumpt` is a strict superset of `gofmt`; import ordering is handled by gofumpt together with the golangci-lint `gci` or `goimports` rules.
