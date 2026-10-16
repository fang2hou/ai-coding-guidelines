---
id: libraries/vercel-ai-sdk
lang: en
version: 1
source-lang: en
status: active
digest: 05cff22e
---

# Vercel AI SDK

## Verdict

Situational — use the Vercel AI SDK only when a Next.js project directly uses its streaming or UI integration features.

## Use when

- A Next.js project uses the SDK's capabilities directly, such as streaming AI responses into React UI.

## Avoid when

- The app only calls an LLM API — that alone never justifies adding the SDK.
- Do not add the SDK automatically to every AI-related project.
- The project does not use Next.js.

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

- Use the Vercel AI SDK only when it adds clear value to a Next.js project; do not add it automatically to every project that calls an LLM.

## Works with

- [Frontend Framework: Vite vs Next.js](frontend-framework.md) — pairs-with: Next.js only; the SDK is justified solely by real value to a Next.js implementation.
