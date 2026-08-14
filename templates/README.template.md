# <Project Name>

> One-sentence description of what this project is and why it exists.

## Overview

- What the project does
- Who uses it
- Current status (POC / actively developed / stable)

## Purpose

- Problem being solved
- Scope boundaries: what this project intentionally does not do

## Setup

Requires [mise](https://mise.jdx.dev/).

```bash
mise install
mise run dev
```

## Usage

- How to run the application
- How to run the main workflows (`mise run` for the task list)

## Language Policy

| Item                 | Value                               |
| -------------------- | ----------------------------------- |
| Primary UI language  | `<e.g. Japanese>`                   |
| Additional languages | `<e.g. none / English>`             |
| Tone / formality     | `<e.g. polite (です/ます), casual>` |

Code identifiers, comments, and commit messages are always English.
Do not infer UI language from conversation language.

## Architecture & Workflow

- Architecture invariants: see [ARCHITECTURE.md](./ARCHITECTURE.md)
- Development workflow: see [DEVELOPMENT.md](./DEVELOPMENT.md)
- Contribution workflow: see [CONTRIBUTING.md](./CONTRIBUTING.md)

## Environment Requirements

- Runtime versions: managed by mise (see `mise.toml`)
- Required environment variables: `<list or link to setup guide>`
- External services: `<list, with local alternatives if any>`
