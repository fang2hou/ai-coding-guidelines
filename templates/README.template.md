<div align="center">

<!-- Optional: project logo or banner -->
<!-- <img src="{{assets/logo.png}}" alt="{{Project Name}}" width="120" /> -->
<!-- if the logo includes Project name, then remove the h1 -->

# {{Project Name}}

{{One-sentence tagline: what the project is and who it is for.}}

[Installation](#-installation) | [Usage](#-usage) | [Features](#-features) | [Development](#-development)

[![CI](https://img.shields.io/github/actions/workflow/status/<org>/<repo>/check.yml?branch=main&label=CI&style=flat-square)](https://github.com/<org>/<repo>/actions/workflows/check.yml)
[![License: <SPDX>](https://img.shields.io/badge/License-<SPDX>-green.svg?style=flat-square)](./LICENSE)

</div>

{{What the project does and the problem it solves in one to three plain sentences. Mention scope limits or project status only when that saves the reader time.}}

<!-- Optional: add a screenshot or short GIF when the project has a visual surface (UI, CLI output, or generated artifacts). -->
<!-- ![{{Project Name}} preview]({{assets/preview.png}}) -->

## 📦 Installation

<!-- For installable programs, CLIs, packages, or downloadable assets (e.g., fonts), use Installation or Download & Install to show how end users obtain the project. Delete this section for developer-only repositories that are not distributed to end users. -->

```bash
{{package manager install command or download instructions}}
```

## 🚀 Usage

<!-- Show the two or three most common end-user commands or workflows with their expected output. For developer-only repositories with no separate end-user install, rename this section to Quick Start. -->

```bash
{{common command}}
```

{{Expected output or result.}}

<!-- Include only the sections this project needs from ✨ Features, 💡 Concepts, ⚡ Performance, and 🧪 Experiments, ordered by what helps readers most. Delete unused sections. -->

## ✨ Features

<!-- For richer projects, use ### `order` subsections with one or two plain sentences each. For compact projects, replace these subsections with a two-column table or plain-sentence bullets. -->

### `1` {{Feature One}}

{{Describe what this feature does in one or two plain sentences, without marketing language.}}

### `2` {{Feature Two}}

{{Describe a second core capability directly, including essential behavior readers need to know.}}

## 💡 Concepts

<!-- Only needed for projects built with a distinct design concept or angle that differs from alternatives. -->

| Concept       | Summary                                                   |
| ------------- | --------------------------------------------------------- |
| {{Concept A}} | {{The core idea a reader needs to use the project well.}} |
| {{Concept B}} | {{A second key concept, stated in one plain sentence.}}   |

## ⚡ Performance

<!-- Only needed for projects focused on performance optimization or performance-sensitive workloads. -->

{{State the claim in one sentence, then show the evidence that backs it up.}}

![{{Benchmark: project vs. alternatives}}]({{static/benchmark.png}})

Environment: {{hardware, runtime versions, date}}. Methodology: [reproduction steps]({{link-to-reproduction-steps}}).

## 🛠️ Development

<!-- Local setup for developers working on this repository. Keep contributor tooling separate from end-user Installation and Usage. -->

Requires [mise](https://mise.jdx.dev/) on {{supported platforms, e.g. macOS and Linux}}. Runtime versions are pinned in `mise.toml`. {{List required environment variables and external services, with local alternatives if any.}}

```bash
mise install
mise run dev
```

{{Expected result, e.g. the dev server starts on http://localhost:5173.}} Run `mise run` to list all tasks ({{e.g. `build`, `test`}}).

<details>
<summary>Advanced setup</summary>

{{Optional: platform-specific setup, environment variable tables, extended examples, and troubleshooting. Delete this block when unused.}}

</details>

## 🤝 Contributing

<!-- Only needed for non-personal projects, if you don't know, ask user to decide. -->

See [DEVELOPMENT.md](./DEVELOPMENT.md) for local setup and workflow, and [CONTRIBUTING.md](./CONTRIBUTING.md) for pull request and review rules.

## 📄 License

[{{SPDX identifier, e.g. MIT}}](./LICENSE)
