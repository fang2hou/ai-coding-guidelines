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

Requires [mise](https://mise.jdx.dev/).

```bash
mise install
mise run dev
```

- Run the application: `mise run dev`
- List every task: `mise run`
- {{Other main workflows, e.g. `mise run build`}}

## What to read next

| Goal                  | Read                                 |
| --------------------- | ------------------------------------ |
| Understand the system | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Develop and validate  | [DEVELOPMENT.md](./DEVELOPMENT.md)   |
| Contribute a change   | [CONTRIBUTING.md](./CONTRIBUTING.md) |

## Environment Requirements

- Runtime versions: managed by mise (see `mise.toml`)
- Required environment variables: `<list or link to setup guide>`
- External services: `<list, with local alternatives if any>`

## Language Policy

| Item                 | Value                               |
| -------------------- | ----------------------------------- |
| Primary UI language  | `<e.g. Japanese>`                   |
| Additional languages | `<e.g. none / English>`             |
| Tone / formality     | `<e.g. polite (です/ます), casual>` |

Code identifiers, comments, and commit messages are always English.
Do not infer UI language from conversation language.

## License

{{SPDX identifier, e.g. MIT}} — see [LICENSE](./LICENSE).
