<div align="center">

# {{Project Name}} {{emoji}}

{{One-sentence tagline: what the project is and who it is for.}}

[![CI](https://github.com/<org>/<repo>/actions/workflows/check.yml/badge.svg)](https://github.com/<org>/<repo>/actions/workflows/check.yml)
[![License: <SPDX>](https://img.shields.io/badge/License-<SPDX>-green.svg)](./LICENSE)

</div>

{{What the project does and the need it solves — one to three plain sentences. Mention what it intentionally is not, or its status, only when that saves the reader time.}}

{{Optional — a screenshot or short GIF when the project has a visual surface (UI, CLI output, artifacts).}}

## 🚀 Quick Start

{{End-user products: name this section Usage and show install/run examples with their expected output; both audiences: Usage / Quick Start.}}

**With an AI coding agent** — paste this into the agent to hand it the repository:

```text
Work in this repository. Read AGENTS.md at the repository root first and follow it.
```

**As a human** — requires [mise](https://mise.jdx.dev/) on {{supported platforms, e.g. macOS and Linux}}.
Runtime versions are pinned in `mise.toml`; {{required environment variables and external services, with local alternatives if any}}.

```bash
mise install
mise run dev
```

{{Expected result, e.g. the dev server on http://localhost:5173.}} `mise run` lists every other task ({{e.g. `build`, `test`}}).

<details>
<summary>Advanced setup</summary>

{{Optional — platform-specific setup, environment variables, extended examples, troubleshooting. Delete the block when unused.}}

</details>

## ✨ Concepts & Features

- **{{Concept}}** — {{the one idea a reader needs in order to use the project well}}
- **{{Feature}}** — {{what it does and why it matters}}
- {{Optional: nearest alternative and what differs — one line}}

## 📚 Learn More

| Goal                  | Read                                 |
| --------------------- | ------------------------------------ |
| Understand the system | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Develop and validate  | [DEVELOPMENT.md](./DEVELOPMENT.md)   |
| Contribute a change   | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Give it to an agent   | [AGENTS.md](./AGENTS.md)             |

## 📄 License

{{SPDX identifier, e.g. MIT}} — see [LICENSE](./LICENSE).
