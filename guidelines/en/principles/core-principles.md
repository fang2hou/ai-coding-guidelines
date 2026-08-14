---
id: principles/core-principles
lang: en
version: 1
source-lang: en
status: active
digest: 2e75e0ac
---

# Core Engineering Principles

## Purpose

This guideline defines the engineering standards for AI-assisted rapid idea validation and POC development.

The goal is to move quickly while keeping projects:

- Simple
- Consistent
- Reproducible
- Easy to understand
- Easy for both humans and AI agents to maintain
- Resistant to accidental architectural drift
- Consistent across repositories

The central principle is:

> **Standardize everything that does not need to be a project-specific decision.**

Do not repeatedly reconsider package managers, formatters, linters, task runners, commit conventions, pre-commit systems, or similar engineering infrastructure for each project.

Product decisions and architecture may vary.

The engineering toolchain should not.

## Optimize for Validation Speed

These projects are primarily intended for rapid idea validation.

Do not introduce unnecessary:

- Abstractions
- Layers
- Frameworks
- Services
- Infrastructure
- Documentation
- Processes
- Generic extensibility

Prefer the simplest coherent implementation that solves the current problem correctly.

Fast development does not mean careless development.

Avoid decisions that create unnecessary future confusion or make AI-assisted development unreliable.

## Reduce Unnecessary Choices

Humans and AI agents should not repeatedly make decisions that have already been standardized.

When this guideline specifies a tool, the tool is mandatory unless the user explicitly approves an exception.

Do not replace a standardized tool merely because:

- Another tool is more popular
- A framework recommends another tool
- A generated template uses another tool
- An AI agent is more familiar with another tool
- Another project on the internet uses something different

If a genuine technical incompatibility exists, explain it to the user before changing the standardized toolchain.

Do not silently substitute tools.

## Root Cause Over Symptom Suppression

When a warning, lint error, test failure, type error, or other validation problem appears:

1. Understand what the rule or check is protecting.
2. Identify the actual root cause.
3. Fix the underlying problem whenever reasonable.
4. Only consider configuration changes after understanding the impact.

Do not:

- Blindly change code until the warning disappears
- Disable rules simply to make CI green
- Add ignore comments without understanding the issue
- Weaken tests to make them pass
- Hide failures instead of resolving them

If a rule is genuinely inappropriate for the project, changing its configuration is allowed, but the change must be intentional and technically justified.

## Final Principles

The purpose of this guideline is not to maximize process.

It is to create a predictable engineering environment in which both humans and AI agents can move quickly without re-making the same tooling and workflow decisions.

When a choice does not materially depend on the product:

> **Standardize it.**

When a change affects architecture:

> **Make it explicit.**

When a validation check fails:

> **Understand the cause.**

When languages differ:

> **Keep their boundaries explicit.**

When an AI agent works on the project:

> **Reduce its unnecessary decision space and make the correct action the default.**
