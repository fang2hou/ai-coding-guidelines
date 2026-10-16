---
id: libraries/vercel-ai-sdk
lang: zh
version: 1
source-lang: en
status: active
digest: 64ddb647
---

# Vercel AI SDK

## 结论

视情况采用——仅当 Next.js 项目确实要用到 Vercel AI SDK 的流式响应或 UI 集成功能时才使用。

## 适用场景

- Next.js 项目直接使用该 SDK 的能力，例如在 React 界面中处理流式 AI 响应。

## 不适用场景

- 应用只是调用 LLM 接口——单凭这一点不足以引入该依赖。
- 不要看到是 AI 相关项目就自动添加该 SDK。
- 项目并未使用 Next.js。

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

- 仅当该 SDK 能为 Next.js 项目带来明确价值时才使用；不要一遇到调用 LLM 的项目就自动引入它。

## 联动

- [前端框架：Vite 与 Next.js](frontend-framework.md)——仅与 Next.js 搭配；只有当该 SDK 对 Next.js 实现确有实际价值时才应引入。
