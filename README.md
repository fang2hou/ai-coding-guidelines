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
npx skills add fang2hou/ai-coding-guideline@apply-ai-coding-guideline
```

The skill is a thin loader: it ships no guideline content and instead fetches
this repository live on every run — routing via PORTAL, applying the current
standards, and auditing projects against the fetched revision — so it never
needs content maintenance ([skills/apply-ai-coding-guideline/](./skills/apply-ai-coding-guideline/)).

```bash
mise install && mise run check
```
