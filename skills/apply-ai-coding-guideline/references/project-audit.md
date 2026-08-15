# Project Audit Procedure

Quick check of an existing project against the AI Coding Guideline. Produces a
structured divergence report and ranked optimization directions.

## Step 1: Inventory (read-only, no edits)

Collect, without modifying anything:

1. Runtimes and tools: `mise.toml` / `.mise.toml` (or absence), `.tool-versions`, CI workflow files.
2. Package managers: `pnpm-lock.yaml`, `uv.lock`, `package-lock.json`, `yarn.lock`, `requirements.txt`, `Pipfile`, `poetry.lock`.
3. Lint/format configs: `.oxlintrc.json`, `oxfmt` config, `pyproject.toml` `[tool.ruff]`, `.golangci.yml`, `rustfmt.toml`, `.eslintrc*`, `biome.json` (banned tools show up here).
4. Stack markers: framework imports in manifests (`package.json` dependencies, `pyproject.toml`), `components/ui` presence, `app.yaml` (Databricks), `wrangler.toml` (Workers).
5. Gates: `.pre-commit-config.yaml`, CI jobs, `mise` tasks.
6. Frontend structure: where shadcn components and custom components live.

## Step 2: Compare against the defaults matrix

Use [stack-defaults.md](stack-defaults.md). For every inventory item decide:

- **compliant** — matches the standard;
- **justified divergence** — differs AND a project ADR (or explicit user decision) records why;
- **violation** — differs with no recorded reason.

Banned-tool presence (eslint, prettier, biome, npm/yarn lockfiles, pip/conda usage, Express in a new backend, Bun-bound stacks) is a violation by default.

## Step 3: Classify risk

Rank violations by what they break:

1. Gate integrity (checks that can pass while broken: missing type-aware lint, hook ≠ CI).
2. Reproducibility (unpinned runtimes, missing lockfiles, global installs).
3. Model-knowledge risk (niche or bleeding-edge picks without approval).
4. Consistency (naming, structure, doc drift) — lowest.

## Step 4: Report format

Return exactly this structure:

```
## Compliance summary
<one line: X compliant, Y justified, Z violations>

## Violations
- <area>: <found> → <expected> (risk: <1-4>)
  fix: <concrete action>

## Justified divergences
- <area>: <found> (ADR: <path or "missing — record one">)

## Optimization directions
1. <highest risk-reduction action first, with the command or edit that starts it>
```

Rules for the report:

- Every violation names the concrete fix, not a principle.
- Optimization directions are ranked by risk reduction; never propose rewrites that churn working code for consistency alone.
- Do not apply fixes during the audit; the report is the deliverable.
