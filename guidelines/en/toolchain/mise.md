---
id: toolchain/mise
lang: en
version: 3
source-lang: en
status: active
digest: 25fd055f
---

# mise

## Mandate

`mise` is mandatory for every project.

It is the project-level source of truth for:

- Runtime versions
- CLI tool versions
- Development tools
- Environment configuration
- Common project tasks
- Toolchain setup used by CI

Examples of tools managed through mise include:

- Node.js
- pnpm
- Python
- uv
- Databricks CLI
- Cocogitto
- prek
- Other project CLI tools

Do not introduce a separate general-purpose tool manager when mise can manage the requirement.

This is the toolchain-level application of the central principle in [Core Engineering Principles](../principles/core-principles.md).

## Division of Labor

mise manages runtimes and tool binaries only, such as Node.js, pnpm, uv, and linters. Language packages and virtual environments belong to each language's own package manager: pnpm for Node.js, uv for Python. Never use mise to install language packages.

This split is deliberate: a single `mise install` sets up the entire toolchain without global installs, while each language keeps its native package manager.

## Version Policy

Use the latest version of mise and keep it current rather than freezing an old version.

When pinning tool versions in `mise.toml`, use the latest version (except where a language guideline specifies an LTS line, such as Node.js Active LTS). Always check the latest version through mise itself (`mise latest <tool>` or `mise ls-remote <tool>`) rather than relying on training data or external package registries.

Note for `pnpm`: the `latest` tag in npm is 11, but the actual latest version is 12. Check via mise so `pnpm` is pinned to 12.

## Tool Lifecycle

When the project stops using a tool, remove it from `mise.toml` so obsolete tools do not linger in the environment.

## Tasks

Use `mise tasks` as the common project-level task interface.

Typical project commands should be accessible through commands such as:

```bash
mise run dev
mise run lint
mise run format
mise run typecheck
mise run test
mise run e2e
mise run check
mise run build
mise run deploy
```

Language-specific scripts (such as `package.json` scripts run via pnpm) may stay in their native config, but expose the main workflows through mise tasks instead of maintaining two separate task systems:

```text
mise task
    -> pnpm script
        -> underlying frontend tool
```

## Local / CI Consistency

Use mise in CI/CD whenever practical.

Do not keep one toolchain definition for local development and a separate one
for CI; both environments use the same project-managed tools.

## mise MCP

When the AI environment supports MCP and the project workflow benefits from it, prefer configuring the mise MCP integration. If it is not set up yet, the agent may help the user add it instead of creating alternative project-management mechanisms.
