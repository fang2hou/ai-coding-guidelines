---
id: toolchain/rust
lang: en
version: 1
source-lang: en
status: draft
digest: 154c8f5a
---

# Rust Toolchain

## Mandate

TypeScript and Python are the default languages for AI-assisted development because their library and agent ecosystem support is strongest.

Rust is not a default choice.

Choose Rust only when the project genuinely needs:

- Maximum performance with memory safety
- Systems components
- Native extensions for other languages
- WebAssembly targets

Adopting Rust requires explicit justification and user approval, recorded in a project ADR.

Familiarity with Rust is not a justification on its own.

## Scope

This document is a baseline standard for Rust projects.

It does not replace project-level evaluation.

Before adopting Rust, confirm both points: the requirement matches one of the scenarios above, and TypeScript, Python, or Go cannot satisfy it at acceptable cost.

## Version Policy

Use the stable toolchain, installed through mise or rustup.

Use edition 2024 in `Cargo.toml`.

Do not enable nightly features by default; a nightly requirement is an explicit, recorded decision.

## Usage Rules

### Build and Packaging

Use `cargo` as the only build and package tool.

Do not hide standard cargo commands behind custom build scripts.

### Formatting

Use `rustfmt` for formatting.

Expose `cargo fmt` through mise tasks.

### Linting

Use `cargo clippy` for linting.

CI must treat warnings as errors:

```bash
cargo clippy --all-targets -- -D warnings
```

### unsafe Blocks

Every `unsafe` block requires a `// SAFETY:` comment stating the invariant that makes the block sound.

Do not use `unsafe` to work around the borrow checker.

### Error Handling

Use `thiserror` for library error types.

Use `anyhow` only at binary boundaries; do not leak it through public library APIs.

### Workspace Layout

Use a cargo workspace for multi-crate projects.

Keep dependency versions synchronized at the workspace level.

### Testing

Run `cargo test` in CI.

## Works with

- [mise](../toolchain/mise.md) — versioning: the Rust toolchain and related tools are managed and exposed through mise tasks.
- [Quality Gates](../toolchain/quality-gates.md) — same checks: prek and CI run the same lint and format configuration.
- [Git Workflow](../toolchain/git.md) — commit discipline: Rust changes follow the standard commit and PR rules.
- [Testing Strategy](../practices/testing.md) — test focus: what to verify, and at which level.
