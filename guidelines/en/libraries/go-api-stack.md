---
id: libraries/go-api-stack
lang: en
version: 1
source-lang: en
status: draft
digest: 5a64b0e1
---

# Go API Stack

## Verdict

Preferred — Echo is the preferred Go web framework, with `github.com/go-playground/validator/v10` for request validation. This stack applies only after Go itself has been justified under [Go Toolchain](../toolchain/go.md).

## Use when

- A Go service needs HTTP APIs, and the adoption of Go already satisfies the justification bar in [Go Toolchain](../toolchain/go.md).

## Avoid when

- Go is not justified — default to the [TypeScript Backend](../libraries/typescript-backend.md) or [Python API Stack](../libraries/python-api-stack.md) instead of forcing this one.

## Strengths

- Echo: mature routing and middleware with a small API surface; batteries included without hiding `net/http`.
- Echo: performance and low allocation overhead, matching the performance-sensitive services that justify Go.
- Echo: active maintenance — the v5 line is current, and v4 keeps receiving security and bug fixes until 2026-12-31.
- validator: the de facto Go struct validation library; integrates with Echo's request binding.

## Tradeoffs

- Framework contexts invite coupling: `echo.Context` is convenient, and business logic written against it stays trapped in the framework. The layering rule below exists to contain this.
- The service inherits Echo's upgrade cadence: major-line migrations (v4 to v5) arrive on the framework's schedule, not the project's.

## Version policy

- Start new services on Echo's current stable major line and track its latest stable minor. As of 2026-08 that line is v5 (`github.com/labstack/echo/v5`); confirm against the Echo releases before starting — do not treat this document as a version snapshot.
- Keep existing services on the latest minor of the major they use. Services still on v4 migrate to v5 before v4 support ends (2026-12-31), following the upgrade notes in the current Echo documentation.
- Follow the framework's current documented idioms; never copy GOPATH-era or pre-modules blog patterns — imports, project layout, and middleware registration have all changed over the years.
- Keep supporting libraries on recent stable majors and their current best practices. Validator's current import path is `github.com/go-playground/validator/v10`.

## Usage rules

### Layering: handlers are thin adapters

- HTTP handlers are thin adapters at the transport boundary. Convert the framework context (`echo.Context`) to a standard `context.Context` plus validated, typed request values before calling the core layer.
- The core/business layer depends only on the standard library context and domain types. It imports neither `echo` nor any other web framework.
- The core layer stays testable with plain Go tests and portable across transports.

```go
// Transport layer — the only place Echo appears.
func (h *Handler) CreateUser(c echo.Context) error {
	var in CreateUserInput // transport type with `validate:"..."` tags
	if err := c.Bind(&in); err != nil {
		return err
	}
	if err := c.Validate(&in); err != nil {
		return err
	}
	return h.Service.Do(c.Request().Context(), in.ToDomain())
}
```

`core.Service.Do(ctx context.Context, req CreateUser)` takes the standard context and a domain type; it never sees `echo.Context`.

### Request validation

- Validate requests with `github.com/go-playground/validator/v10` at the transport boundary: bind → validate → convert to a domain type.
- The core layer receives already-valid values and does not re-check transport concerns.

### Middleware

- Middleware (auth, logging, recovery, CORS) lives only in the transport layer. The core layer does not know middleware exists.

## Works with

### Internal interplay

- Echo + validator — register a validator once at startup; Echo's bind → validate pipeline is the standard place to enforce request shape before domain conversion.

### Related guidelines

- [Go Toolchain](../toolchain/go.md) — pairs-with: linting, formatting, context, and error-handling rules for this stack.
- [Testing Strategy](../practices/testing.md) — the framework-agnostic core gets table-driven Go tests; HTTP concerns get thin-adapter coverage.
- [Quality Gates](../toolchain/quality-gates.md) — same checks: prek and CI run the same lint and format configuration.

## Rejected alternatives

- Writing business logic against `echo.Context` throughout — untestable outside the framework, and locked to Echo internals.
- Adopting a second web framework in the same service — one framework per service.
