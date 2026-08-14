---
id: libraries/vercel-ai-sdk
lang: en
version: 1
source-lang: en
status: active
digest: e210ea2c
---

# Vercel AI SDK

## Verdict

Situational — use the Vercel AI SDK only when it provides real value to a Next.js implementation.

## Use when

- A Next.js implementation actually uses the SDK's capabilities.
- The feature maps directly onto what the SDK concretely provides, such as streaming AI response handling.

## Avoid when

- The application merely contains an LLM feature — that alone never justifies the dependency.
- Adding the SDK automatically to every AI-related project.
- The project has no Next.js implementation for the SDK to serve.

## Strengths

- Provides streaming AI response handling for React and Next.js user interfaces.
- Standardizes provider access and tool-calling patterns across LLM integrations.

## Tradeoffs

- An extra dependency whose value depends on the implementation actually using its capabilities.
- Scoped in this guideline to Next.js projects only.

## Version policy

- Prefer the latest stable version when the SDK is used.
- Do not hold the project on obsolete versions without a concrete compatibility reason.

## Usage rules

- Use the Vercel AI SDK only when it provides real value to a Next.js project.
- Do not add it automatically to every AI-related project.
- Do not introduce it merely because the application contains an LLM feature.

## Works with

- [Frontend Framework: Vite vs Next.js](frontend-framework.md) — pairs-with: Next.js only; the SDK is justified solely by real value to a Next.js implementation.
