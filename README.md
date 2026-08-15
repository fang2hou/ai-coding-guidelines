# AI Coding Guideline

Single source of truth for cross-project engineering standards:
mandatory toolchains, library selection, practices, and the agent
operating protocol.

- English: [guidelines/en/](./guidelines/en/)
- 中文: [guidelines/zh/](./guidelines/zh/)
- 日本語: [guidelines/ja/](./guidelines/ja/)

Consumers (AI agents in other projects): start at [PORTAL.md](./PORTAL.md).
Maintainers: read [AGENTS.md](./AGENTS.md). Repository decisions:
[docs/adr/](./docs/adr/) (English).

## Agent skill

Give your coding agent this guideline as an installable skill:

```bash
npx skills add fang2hou/ai-coding-guideline@ai-coding-guideline
```

The skill routes tasks to the right documents, applies the stack and
toolchain defaults, and audits an existing project against them
([skills/ai-coding-guideline/](./skills/ai-coding-guideline/)).

```bash
mise install && mise run check
```
