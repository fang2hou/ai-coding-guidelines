---
id: practices/project-documentation
lang: en
version: 8
source-lang: en
status: active
digest: 802084e7
---

# Required Project Documentation

Every project must maintain `AGENTS.md`, `README.md`, `DEVELOPMENT.md`, and `CONTRIBUTING.md`. `ARCHITECTURE.md` becomes required once the project has meaningful architectural boundaries. Use the templates under `templates/` as the starting point.

Documentation modes follow [Diátaxis](https://diataxis.fr/): `README.md` introduces the project to human readers and gets them started; `DEVELOPMENT.md` and `CONTRIBUTING.md` contain how-to guidance and reference material; `ARCHITECTURE.md` is explanation; `AGENTS.md` is reference for agents. Keep one mode per document. When a document needs another mode, link to the document that owns it instead of mixing it in.

## AGENTS.md

Every project must include `AGENTS.md` at the repository root.

It is the agent-facing entry point: commands, engineering standards, repository layout, boundaries, the confirmed language policy, and project conventions.

See [Authoring AGENTS.md](agents-file.md) for what belongs in `AGENTS.md`, section order, length limits, and nested files.

Template: [project-agents.template.md](../../../templates/project-agents.template.md)

## README.md

Every project must include `README.md`.

### Audience and scope

`README.md` is written for human readers who want to know what the project is, what it does, and how to use or run it. It should stand alone as the project's front door without duplicating tutorials, internal reference manuals, or long background essays.

Do not turn `README.md` into a file portal or a `Goal -> Read` index table for repository files. Modern AI coding agents discover `AGENTS.md` and `docs/` automatically, and `AGENTS.md` already holds repository layout and links to internal documentation.

Agent-facing rules (engineering standards, the confirmed product/UI language policy from [Language Policy](language-policy.md), and project conventions) belong in `AGENTS.md`, not in `README.md`.

### Structure and layout

Organize the README around what a human reader needs first, not around the repository directory tree. Do not add a separate Why section. Follow this order:

- **Top hero block**: center the opening inside `<div align="center">` with a clean visual rhythm: an optional logo or banner image, a single `# Project Name` heading (omit the `#` heading when the logo already includes the project name), a one-sentence tagline stating what the project is and who it is for, an optional navigation link bar, and compact status badges using the `flat-square` style (`style=flat-square`).
- **Opening summary**: one to three plain sentences stating what the project does and the problem it solves. Mention scope limits or project status only when that saves the reader time.
- **Visual preview (optional)**: when the project has a visual surface (UI, CLI output, or generated artifacts), place a screenshot or short GIF right after the opening summary.
- **User installation and usage**: keep end-user steps separate from contributor tooling. For installable programs, CLIs, packages, or downloadable assets (such as fonts), include an explicit `## 📦 Installation` (or `## 📦 Download & Install`) section followed by `## 🚀 Usage` showing the two or three most common uses with their expected output. For developer-only repositories that are not distributed to end users, omit `Installation` and use `## 🚀 Quick Start`.
- **Optional showcase sections**: include only the sections the project actually needs, ordered by what matters most to the reader:
  - `Features`: what the project does, stated plainly. For richer projects, use numbered ``### `1` `` / ``### `2` `` subsections with one or two sentences each; for compact projects, use a two-column table or plain-sentence bullets.
  - `Concepts`: include only when the project has a distinct design concept or angle that differs from alternatives.
  - `Performance`: include only for projects focused on performance optimization or performance-sensitive workloads. State the claim in one sentence, backed by a chart or table, the measurement environment (hardware, runtime versions, date), and a link to reproduction steps. Every performance claim needs numbers.
  - `Experiments`: experimental capabilities, if the project has any.
- **Development**: put local contributor setup (`mise install`, `mise run dev`, required environment variables, and external services) in a dedicated `## 🛠️ Development` section rather than mixing contributor commands into end-user `Installation` or `Usage`.
- **Contributing**: include a brief `## 🤝 Contributing` section only for non-personal projects, linking to `DEVELOPMENT.md` and `CONTRIBUTING.md` (and `ARCHITECTURE.md` when present) where helpful to human contributors. If it is unclear whether a project is personal or collaborative, ask the user before adding this section.
- **License**: under `## 📄 License`, state the SPDX identifier directly (for example, `MIT`, optionally linked directly to the `LICENSE` file). Do not write filler such as `MIT — see LICENSE`.

Fold long secondary details (platform-specific setup, environment variable tables, extended examples, troubleshooting) into `<details>` blocks whose `<summary>` names the content in a few words. Leave one blank line after `<summary>` so Markdown renders. Never collapse the opening, the primary user commands, or the license.

### AI agent instructions

Do not add a cookie-cutter AI handoff prompt (such as "paste this into your agent to read `AGENTS.md`") to `README.md`.

Standard projects omit AI agent instructions from `README.md` because coding agents read `AGENTS.md` on their own. Include a concise, project-specific AI setup subsection only when the project provides a dedicated AI entry point or non-obvious agent workflow, such as an installable agent skill, an MCP server, or a custom routing file.

### Headings, formatting, and tone

Keep Markdown heading hierarchy clean: use `#` at most once at the top for the project name (omitting it if the logo already includes the name), `##` for main sections, and `###` for subsections. Do not use multiple H1 headings, share-button rows, or marketing slogans.

Prefix every `##` main section title with one semantically fitting emoji. Use a consistent set for standard `##` sections: 📦 for `Installation` / `Download & Install`, 🚀 for `Usage` / `Quick Start`, ✨ for `Features`, 💡 for `Concepts`, ⚡ for `Performance`, 🧪 for `Experiments`, 🛠️ for `Development`, 🤝 for `Contributing`, and 📄 for `License`. Do not force emojis onto `###` headings when numbered ``### `1` `` / ``### `2` `` or clean plain text fits better. Keep `# Project Name` plain text with no emoji, and keep body prose free of emoji.

Avoid these formatting patterns:

- Never use `·` (middle dot / interpunct) as a separator in link bars. Use `|` or separate badges instead:

```markdown
<!-- Avoid -->
[Docs](...) · [Changelog](...)
[English](...) · [中文](...) · [日本語](...)

<!-- Use instead -->
[Docs](...) | [Changelog](...)
[English](...) | [中文](...) | [日本語](...)
```

- Never use the `- **Term** — description` bullet formula, and minimize em-dashes (`—`) throughout the README. Use commas, colons, parentheses, complete sentences, `###` subsections, or two-column tables instead.

Write pragmatic, direct prose:

- State what the project does factually, including basic and essential capabilities. Do not add "how it differs from alternatives" hype or promotional superlatives (`powerful`, `seamless`, `modern-design`, `revolutionary`, `easy`, `simple`).
- Keep paragraphs to one to three sentences, place copyable commands in fenced code blocks, and present enumerations as lists or tables rather than dense prose.
- Add a table of contents only once the README grows beyond a few screens.

### Maintenance

Keep `README.md` stable across routine updates. Avoid volatile counts or internal identifiers (such as exact document, rule, or file counts, or exact count strings in expected command output) that go stale whenever items or languages are added. `README.md` should only require edits for major changes, setup or usage shifts, or milestone refactors.

An outdated README is worse than none, because it actively misleads readers. Update `README.md` in the same change that alters setup, usage, or scope, and state at the top when development has slowed or stopped.

Template: [README.template.md](../../../templates/README.template.md)

## DEVELOPMENT.md

Every project must include `DEVELOPMENT.md`.

Describe the development workflow step by step, then provide the command and configuration reference.

It should describe:

- Development workflow
- Toolchain
- Common mise tasks
- Coding standards
- Testing workflow
- Local setup
- Validation workflow
- Deployment workflow when relevant

Both humans and AI agents should be able to follow it to develop the project.

Template: [DEVELOPMENT.template.md](../../../templates/DEVELOPMENT.template.md)

## CONTRIBUTING.md

Every project must include `CONTRIBUTING.md`.

It is a how-to guide: ordered steps for landing a change, not background essays.

It should document:

- Contribution expectations
- Issue workflow when relevant
- Pull request workflow
- Review expectations
- Required validation
- Commit conventions

Every pull request description should clearly include:

- Purpose of the change
- Impact of the change
- Relevant context or background
- Potential risks or concerns
- Testing or validation performed

The GitHub pull request template must stay synchronized with these requirements.

Template: [CONTRIBUTING.template.md](../../../templates/CONTRIBUTING.template.md)

## ARCHITECTURE.md

Projects with meaningful architectural boundaries must maintain `ARCHITECTURE.md`.

Keep it short and practical: a brief overview, a high-level codebase map (name modules, do not link files), and the architectural invariants.

Its job is to explain why the boundaries exist and keep the architecture from drifting, not to be a theoretical essay or a complete file list.

Invariants and ADR rules are defined in [Architecture Governance](architecture-governance.md).

Template: [ARCHITECTURE.template.md](../../../templates/ARCHITECTURE.template.md)
