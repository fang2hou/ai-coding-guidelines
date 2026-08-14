---
id: toolchain/mise
lang: en
version: 1
source-lang: en
status: active
digest: 5f26ccc0
---

# mise

## Mandate

`mise` is mandatory for every project.

It is the project-level source of truth for:

* Runtime versions
* CLI tool versions
* Development tools
* Environment configuration
* Common project tasks
* Toolchain setup used by CI

Examples of tools managed through mise include:

* Node.js
* pnpm
* Python
* uv
* Databricks CLI
* Cocogitto
* prek
* Other project CLI tools

Do not introduce a separate general-purpose tool manager when mise can manage the requirement.

This is the toolchain-level application of the central principle in [Core Engineering Principles](../principles/core-principles.md).

## Version Policy

Prefer the latest version of mise.

When maintaining projects, keep mise itself current rather than unnecessarily freezing an old version.

## Tool Lifecycle

If a tool is no longer used by the project, remove it from the mise configuration.

Do not leave obsolete tools in the project environment.

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

Language-specific task definitions may remain in their native ecosystem when appropriate.

For example, frontend scripts may live in `package.json` and be executed through pnpm.

In that case, expose the relevant workflow through mise tasks rather than creating a second independent project task system.

For example:

```text
mise task
    -> pnpm script
        -> underlying frontend tool
```

## Local / CI Consistency

CI/CD should use mise whenever practical.

The project should not have one toolchain definition for local development and a completely separate one for CI.

The same project-managed tooling should be used in both environments.

## mise MCP

When the AI environment supports MCP and the project workflow can benefit from the mise MCP integration, prefer configuring it.

If the user is using an MCP-capable environment but mise MCP is not configured, the agent may help the user add it rather than creating alternative project-management mechanisms.
