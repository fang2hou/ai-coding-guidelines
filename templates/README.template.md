<div align="center">

# {{Project Name}}

{{One-sentence tagline: what the project is and who it is for.}}

[![CI](https://github.com/<org>/<repo>/actions/workflows/check.yml/badge.svg)](https://github.com/<org>/<repo>/actions/workflows/check.yml)
[![License: <SPDX>](https://img.shields.io/badge/License-<SPDX>-green.svg)](./LICENSE)

</div>

## Why

{{The problem this project solves — one to three sentences.}}

- In scope: {{what the project does}}
- Out of scope: {{what this project intentionally does not do}}
- Status: {{POC / actively developed / stable}}

## Use it

**As a human** — requires [mise](https://mise.jdx.dev/):

```bash
mise install
mise run dev
```

`mise run` lists every task. {{Other main workflows, e.g. `mise run build`.}}

**With an AI coding agent** — paste this into the agent to hand it the repository:

```text
Work in this repository. Read AGENTS.md at the repository root first and follow it.
```

## What to read next

| Goal                  | Read                                 |
| --------------------- | ------------------------------------ |
| Understand the system | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Develop and validate  | [DEVELOPMENT.md](./DEVELOPMENT.md)   |
| Contribute a change   | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Give it to an agent   | [AGENTS.md](./AGENTS.md)             |

## Environment Requirements

- Runtime versions: managed by mise (see `mise.toml`)
- Required environment variables: {{list or link to setup guide}}
- External services: {{list, with local alternatives if any}}

## License

{{SPDX identifier, e.g. MIT}} — see [LICENSE](./LICENSE).
