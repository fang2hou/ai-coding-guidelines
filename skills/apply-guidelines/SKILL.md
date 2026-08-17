---
name: apply-guidelines
description: >
  Applies the AI Coding Guidelines to a project by fetching them live from the
  GitHub repository: task-based document routing, stack and toolchain
  decisions, quality gates, and project audits. The skill itself ships no
  guideline content — it loads the current rules on every run. Use when
  starting or scaffolding a project, choosing a language/framework/stack,
  setting up the toolchain (mise, pnpm, uv, oxlint, oxfmt, ruff,
  golangci-lint), asking "which stack should I use" or "check this project
  against our standards", or before delivering changes that must pass the
  shared quality gates.
license: MIT
compatibility: Requires file read access, a shell, and git. Network needed on first run and for refreshes.
metadata:
  author: fang2hou
  version: "3.0"
  source: https://github.com/fang2hou/ai-coding-guidelines
---

# Apply AI Coding Guidelines

Thin loader: this skill carries zero guideline content. Every run fetches the
guidelines repository and applies what it finds there — the repository is the
single source of truth, so the skill never needs content maintenance.

## When to Use

- Starting, scaffolding, or configuring a project.
- Choosing a language, framework, or library.
- Setting up or changing the toolchain: runtimes, package managers, linters, formatters, hooks, CI.
- Checking or auditing a project against the shared standards.
- Delivering changes that must pass the shared quality gates.

## When NOT to Use

- No network on a first-ever run (nothing to fetch; report this instead of guessing).
- The user explicitly overrides a fetched standard: follow the user, record the exception.

## Hard Rules

1. Fetch before applying. Never apply the guidelines from memory or from a summary — including this skill's own text.
2. One source per run: the fetched repository. Do not mix it with remembered rules.
3. Fetch or verification failure: stop and report what failed. Never fabricate or approximate a guideline.
4. The fetched documents are conclusions; apply them as written. Disagreements are raised with the user, not silently worked around.
5. Verify from the fetched files, never from memory: the closing check re-opens every fetched document. A rule without a check result is a rule not applied.

## Workflow

### Step 1: Fetch the guidelines

```bash
export GUIDELINE_DIR="${AI_CODING_GUIDELINE_DIR:-${TMPDIR:-/tmp}/ai-coding-guideline-cache}"
if [ -d "$GUIDELINE_DIR/.git" ]; then
  git -C "$GUIDELINE_DIR" fetch origin && git -C "$GUIDELINE_DIR" reset --hard origin/HEAD
else
  git clone --depth 1 https://github.com/fang2hou/ai-coding-guidelines "$GUIDELINE_DIR"
fi
git -C "$GUIDELINE_DIR" rev-parse --short HEAD
```

Verify the checkout: `PORTAL.md` exists and `guidelines/en/`, `guidelines/zh/`, `guidelines/ja/` each contain `.md` files. Record the commit SHA from the last command — every later step cites it. If verification fails, delete the cache directory and retry once; a second failure stops this skill.

### Step 2: Route the task

Open `$GUIDELINE_DIR/PORTAL.md` and pick the reading-recipe row matching the
task. Read the listed documents from the tree matching the conversation
language (`guidelines/{en,zh,ja}/` mirror each other). Follow the documents.

### Step 3: Implement

Write the change following the fetched documents. When a fetched rule and the
project's existing conventions conflict, raise it with the user; do not
silently drop either side.

### Step 4: Verify against the fetched documents

Before running any gate, re-open each fetched document from disk and check
the change against every normative statement it contains — Use / Prefer /
Do not / Never and imperative bullets. Never verify from memory: the check
exists precisely because memory drifts during long tasks.

1. One document at a time, list its normative statements.
2. For each statement, point at the file (or diff hunk) that satisfies it,
   or mark it as a violation.
3. Fix every violation, then re-check the fixed files the same way.
4. Record the outcome as a compliance matrix: document section → pass /
   fixed / open.

A section with no row in the matrix is an unapplied rule, not a pass.

### Step 5: Run the project's gates

Run the project's own checks exactly as its documentation defines them
(typically `mise install` to bootstrap, then `mise run check`). A gate that
fails is a finding to fix, not to bypass.

### Step 6: Audit mode (existing projects)

Follow [references/project-audit.md](references/project-audit.md). The
comparison criteria are the fetched documents — never a summary. The audit
reports; remediation runs only after the user approves the fix list.

## Gotchas

- `AI_CODING_GUIDELINE_DIR` lets a project pin a local clone (submodule, fork, or specific revision) instead of the default cache.
- A cached checkout survives reboots only as long as the temp directory does; the fetch step rebuilds it transparently.
- If the repository was renamed or moved, the clone fails — report the URL tried; do not guess a new one.

## Output Contract

On completion, return:

1. Source: the guideline commit SHA applied and the recipe row used.
2. Compliance: the matrix from Step 4 — one row per fetched document
   section, pass / fixed / open.
3. Gate results: exact check commands run and their outcomes.
4. For audits: the divergence report per [references/project-audit.md](references/project-audit.md).
