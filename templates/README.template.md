<div align="center">

# {{Project Name}}

{{One-sentence tagline: what the project is and who it is for.}}

[![CI](https://github.com/<org>/<repo>/actions/workflows/check.yml/badge.svg)](https://github.com/<org>/<repo>/actions/workflows/check.yml)
[![License: <SPDX>](https://img.shields.io/badge/License-<SPDX>-green.svg)](./LICENSE)

</div>

{{Optional — only when the project has a visual surface (UI, CLI output, generated artifacts): put a screenshot or short GIF here. Three seconds of proof beats three paragraphs of prose.}}

## Why

{{The problem this project solves — one to three sentences.}}

- In scope: {{what the project does}}
- Out of scope: {{what this project intentionally does not do}}
- Alternatives: {{nearest existing option and what differs — one line; omit when there is none}}
- Status: {{POC / actively developed / stable / no longer maintained}}

## Quick start

Requires [mise](https://mise.jdx.dev/) on {{supported platforms, e.g. macOS and Linux}}.
Runtime versions are pinned in `mise.toml`; {{required environment variables and external services, with local alternatives if any}}.

```bash
mise install
mise run dev
```

{{Expected result, e.g. the dev server on http://localhost:5173.}}

## Usage

`mise run` lists every task. Common ones:

```bash
mise run build # {{what it produces}}
mise run test  # {{what it covers}}
```

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

## Support

{{Where to get help: the issue tracker, team channel, or contact — one line.}}

## License

{{SPDX identifier, e.g. MIT}} — see [LICENSE](./LICENSE).
