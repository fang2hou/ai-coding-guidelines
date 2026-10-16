---
id: principles/core-principles
lang: en
version: 2
source-lang: en
status: active
digest: 8ddbd9c9
---

# Core Engineering Principles

## Purpose

This guideline sets the engineering standard for AI-assisted idea validation and POC development.

The goal is to move fast while keeping projects:

- Simple
- Consistent
- Reproducible
- Easy to understand
- Easy for humans and AI agents to maintain
- Resistant to accidental architectural drift
- Consistent across repositories

The central principle:

> **Standardize everything that does not need to be a project-specific decision.**

Stop re-deciding package managers, formatters, linters, task runners, commit conventions, and pre-commit hooks in every project.

Product decisions and architecture vary from project to project; the engineering toolchain does not.

## Optimize for Validation Speed

These projects exist to validate ideas quickly.

Do not add any of these unless the problem demands them:

- Abstractions
- Layers
- Frameworks
- Services
- Infrastructure
- Documentation
- Processes
- Generic extensibility

Choose the simplest implementation that solves the current problem.

Fast development is not careless development: avoid shortcuts that confuse future readers or make AI agents unreliable.

## Reduce Unnecessary Choices

Do not re-open decisions that these guidelines have already settled.

Where these guidelines name a tool, that tool is mandatory unless the user explicitly approves an exception.

Do not replace a standardized tool merely because:

- Another tool is more popular
- A framework recommends another tool
- A generated template uses another tool
- An AI agent is more familiar with another tool
- Some project on the internet does it differently

If a tool is genuinely incompatible, explain the problem to the user before changing the standardized toolchain.

Never swap tools silently.

## Prefer Mainstream, Proven Choices

AI agents generate code from training data, not from live documentation.

New or niche versions and stacks appear less often in that data, which leads to more hallucinations: crashes, invented APIs, and inconsistent behavior.

Default to mainstream, proven choices:

- Use LTS or mature runtime versions: Node.js Active LTS by default, Python 3.12 for ML work.
- Pick mainstream, well-documented libraries over new or obscure ones.
- Brand-new major versions, niche frameworks, and niche runtimes (such as Bun-based stacks) require explicit user approval and a recorded reason.
- Favor compatibility and stability over small performance gains.

Treat how well models know a tool as a selection criterion, alongside benchmarks and features.

## Fix Causes, Not Symptoms

When a warning, lint error, test failure, type error, or other validation problem appears:

1. Understand what the rule or check protects.
2. Find the actual root cause.
3. Fix the underlying problem whenever reasonable.
4. Consider configuration changes only after understanding the impact.

Do not:

- Blindly edit code until the warning goes away
- Disable rules just to make CI green
- Add ignore comments without understanding the issue
- Weaken tests to make them pass
- Hide failures instead of resolving them

If a rule genuinely does not fit the project, changing its configuration is allowed — but it must be deliberate and technically justified.

## Final Principles

This guideline does not exist to add process. It exists to keep the engineering environment predictable, so humans and AI agents can move fast without re-making the same tooling and workflow decisions.

When a choice does not depend on the product:

> **Standardize it.**

When versions or stacks differ in maturity:

> **Pick the proven one.**

When a change affects architecture:

> **State it explicitly.**

When a validation check fails:

> **Understand the cause.**

When languages differ:

> **Keep their boundaries clear.**

When an AI agent works on the project:

> **Shrink its unnecessary decision space and make the right action the default.**
