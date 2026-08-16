# Project Audit Procedure

Check an existing project against the AI Coding Guideline, then — on request —
remediate what was found. The comparison criteria are ALWAYS the fetched
guideline repository (Step 1 of the skill) — PORTAL.md inventory plus the
toolchain/, libraries/, and practices/ documents — never a summary or memory.

Two phases, strictly ordered: **audit** (Steps 1–4, read-only, report) and
**remediation** (Step 5, edits, requires user approval of the fix list).

## Step 1: Inventory (read-only, no edits)

Collect, without modifying anything:

1. Runtimes and tools: `mise.toml` / `.mise.toml` (or absence), `.tool-versions`.
2. Package managers: `pnpm-lock.yaml`, `uv.lock`, `package-lock.json`, `yarn.lock`, `requirements.txt`, `Pipfile`, `poetry.lock`.
3. Lint/format configs: `.oxlintrc.json`, oxfmt config, `pyproject.toml` `[tool.ruff]`, `.golangci.yml`, `rustfmt.toml`, and any banned-tool configs (`.eslintrc*`, `biome.json`, `.prettierrc*`).
4. Stack markers: framework dependencies in `package.json` / `pyproject.toml`, `components/ui` presence, `app.yaml` (Databricks), `wrangler.toml` (Workers).
5. Gates: `.pre-commit-config.yaml`, CI jobs, mise tasks.
6. CI/CD: every workflow file under `.github/workflows/` (or the project's CI config): triggers, action pins (`uses:` lines), workflow/job/step names, `permissions`, `timeout-minutes`, `concurrency`, and any `${{ }}` interpolation of untrusted input into `run:` scripts.
7. Frontend structure: where shadcn components and custom components live.
8. Code quality sample: naming, comments, and module structure across a bounded sample — the most recently changed files, not the whole repository.

## Step 2: Compare against the fetched guidelines

Every inventory area maps to governing documents. Read every mapped document
before classifying that area; an area classified without its documents read is
an unrun audit.

| Inventory area                                    | Governing documents                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Runtimes and tools                                | toolchain/mise + the toolchain document per language                                 |
| Package managers                                  | toolchain/typescript, toolchain/python                                               |
| Lint/format configs                               | toolchain document per language, toolchain/quality-gates                             |
| Gates (hooks, CI jobs, mise tasks)                | toolchain/quality-gates                                                              |
| CI/CD                                             | practices/pipeline, toolchain/github-actions, toolchain/quality-gates, toolchain/git |
| Stack markers                                     | the libraries/ document for each detected stack                                      |
| Frontend structure                                | libraries/shadcn-ui, libraries/coss (when present)                                   |
| Code quality sample                               | practices/coding-standards, practices/language-policy                                |
| Project docs (README, CONTRIBUTING, ARCHITECTURE) | practices/project-documentation                                                      |

For each mapped document, decide per finding:

- **compliant** — matches the fetched standard;
- **justified divergence** — differs AND a project ADR (or explicit user decision) records why;
- **violation** — differs with no recorded reason.

A CI/CD comparison must exercise every rule in the mapped documents: workflow
and job `name` fields, `name:` on every `run:` step, action pins against the
Action Upgrade Checklist (report outdated major versions; check migration
notes before proposing a bump), the hardening defaults (`permissions`,
`timeout-minutes`, `concurrency`), and mise-layered invocation instead of
duplicated YAML.

## Step 3: Classify risk

Rank violations by what they break:

1. Gate integrity (checks that can pass while broken: missing type-aware lint, hook ≠ CI).
2. Security exposure (over-privileged workflow `permissions`, untrusted-input interpolation, secrets in code or config).
3. Reproducibility (unpinned runtimes, missing lockfiles, global installs).
4. Model-knowledge risk (niche or bleeding-edge picks without approval).
5. Consistency (naming, structure, doc drift) — lowest.

## Step 4: Report format

Return exactly this structure:

```
## Compliance summary
<one line: X compliant, Y justified, Z violations — guideline @ <commit SHA>>

## Violations
- <area>: <found> → <expected per <document>> (risk: <1-5>)
  fix: <concrete action>

## Justified divergences
- <area>: <found> (ADR: <path or "missing — record one">)

## Optimization directions
1. <highest risk-reduction action first, with the command or edit that starts it>
```

Rules for the report:

- Every violation names the governing document and the concrete fix, not a principle.
- Optimization directions are ranked by risk reduction; never propose rewrites that churn working code for consistency alone.
- Prefer codifying a recurring violation into a gate (a lint rule, actionlint, a prek hook) so compliance stops depending on review.
- Do not apply fixes during the audit phase; the report is that phase's deliverable.

## Step 5: Remediation (on request)

After the user approves the fix list:

1. Work in risk order (Step 3), one violation at a time.
2. Re-open the governing document from disk before each edit; every fix cites
   the section it implements.
3. Workflow edits follow the Action Upgrade Checklist per action: read the
   newer version's migration notes before bumping a pin, and add missing
   `name:` fields, hardening defaults, and step names in the same pass.
4. After each fix, re-run the Step 2 comparison for that area; after all
   fixes, run the project's gates.
5. Report the result with the Step 4 structure: fixed items (each citing its
   document), remaining open items, and gate output.
