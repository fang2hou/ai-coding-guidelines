---
id: libraries/vercel-ai-sdk
lang: zh
version: 1
source-lang: en
status: active
digest: 789f04e6
---

# Vercel AI SDK

## 结论

视情况采用——仅在 Vercel AI SDK 能为 Next.js 实现带来实际价值时使用。

## 适用场景

- Next.js 实现确实用到该 SDK 的能力。
- 功能与 SDK 具体提供的能力直接对应，例如流式 AI 响应处理。

## 不适用场景

- 应用仅包含 LLM 功能——仅凭这一点，永远不足以引入该依赖。
- 不要向所有 AI 相关项目自动添加该 SDK。
- 项目没有可供该 SDK 使用的 Next.js 实现。

## 优势

- 为 React 与 Next.js 界面提供流式 AI 响应处理。
- 统一不同 LLM 集成中访问 provider 的方式和工具调用模式。

## 代价

- 增加一个依赖，其价值取决于实现是否实际使用 SDK 的能力。
- 本指南仅将该 SDK 用于 Next.js 项目。

## 版本策略

- 使用该 SDK 时优先选择最新稳定版。
- 没有具体的兼容性理由，不要让项目停留在过时版本上。

## 使用规则

- 仅在 Vercel AI SDK 能为 Next.js 项目带来实际价值时使用。
- 不要对所有 AI 相关项目自动添加该 SDK。
- 不要仅因应用包含 LLM 功能就引入该 SDK。

## 联动

- [前端框架：Vite 与 Next.js](frontend-framework.md)——仅与 Next.js 搭配；只有当该 SDK 对 Next.js 实现确有实际价值时才应引入。
