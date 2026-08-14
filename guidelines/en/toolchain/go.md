---
id: toolchain/go
lang: en
version: 2
source-lang: en
status: draft
digest: 138c749f
---

# Go Toolchain

## Mandate

TypeScript and Python are the default languages for AI-assisted development because their library and agent ecosystem support is strongest.

Go is not a default choice.

Choose Go only when the project genuinely needs:

- Performance-sensitive network services
- Command-line tools distributed as standalone binaries
- Static single-binary deployment targets
- High-concurrency workloads

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

Commit the configuration as `.golangci.yml` and tailor it to the project's emphasis. Do not use `enable-all`: it enables slow, opinionated checks and buries the signal.

Always-on baseline:

- `govet` — suspicious constructs, roughly the `go vet` passes
- `staticcheck` — correctness, simplification, and style checks; includes error-string style (ST1005): error messages start lowercase and carry no trailing punctuation
- `unused` — unused constants, variables, functions, and types
- `ineffassign` — ineffective assignments
- `misspell` — commonly misspelled English words

Add emphasis groups on top of the baseline:

- Context-heavy services: `contextcheck`, `containedctx`, `fatcontext`, `noctx`
- Error-handling-focused projects: `errcheck` plus `errorlint` and `wrapcheck`

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

Give `_test.go` files relaxed lint rules through per-path exclusions in `.golangci.yml`. Tests optimize for readability and intent, not production lint strictness; error-wrapping and duplication style checks stay off in tests:

```yaml
version: "2"
linters:
  exclusions:
    rules:
      - path: _test\.go
        linters:
          - wrapcheck
          - errorlint
          - dupl
```

### Panics

Do not `panic` in library code; return errors instead.

Reserve `panic` for unrecoverable startup errors in `cmd/` entrypoints.

### Project Layout

Go has no official standard project layout. The `golang-standards/project-layout` repository is a community reference, not an official standard; the official "Organizing a Go module" guide starts from keeping a basic package in the module root.

- Small libraries may keep a flat root: `go.mod` plus the package files.
- Complex services design a structure that fits their business layering instead of copying a template.

`cmd/` (one entrypoint per binary) and `internal/` (import restriction enforced by the compiler) remain useful conventions. Apply them when they serve the design, not as template obligations.

## Works with

- [mise](../toolchain/mise.md) — versioning: Go and golangci-lint are managed and exposed through mise tasks.
- [Go API Stack](../libraries/go-api-stack.md) — web framework and validation stack for HTTP services.
- [Quality Gates](../toolchain/quality-gates.md) — same checks: prek and CI run the same lint and format configuration.
- [Git Workflow](../toolchain/git.md) — commit discipline: Go changes follow the standard commit and PR rules.
- [Testing Strategy](../practices/testing.md) — test focus: what to verify, and at which level.

## Rejected Alternatives

Standalone `gofmt` or `goimports` as the project formatter.

`gofumpt` is a strict superset of `gofmt`; import ordering is handled by gofumpt together with the golangci-lint `gci` or `goimports` rules.
