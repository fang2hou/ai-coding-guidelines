---
id: libraries/vercel-ai-sdk
lang: zh
version: 1
source-lang: en
status: active
digest: 3309b440
---

# Vercel AI SDK

## 结论

视情况采用——仅当 Vercel AI SDK 能为 Next.js 实现带来实际价值时才使用。

## 适用场景

- Next.js 实现确实用到该 SDK 的能力。
- 功能与 SDK 具体提供的能力直接对应，例如流式 AI 响应处理。

## 不适用场景

- 应用只是包含某个 LLM 功能——这本身永远不构成引入该依赖的正当理由。
- 向所有 AI 相关项目自动添加该 SDK。
- 项目中没有可供该 SDK 服务的 Next.js 实现。

## 优势

- 为 React 与 Next.js 界面提供流式 AI 响应处理。
- 统一各 LLM 集成中的 provider 访问与工具调用模式。

## 代价

- 多出一个依赖，其价值取决于实现是否真正用到了它的能力。
- 在本指南中仅限 Next.js 项目使用。

## 版本策略

- 使用该 SDK 时优先选择最新稳定版。
- 没有具体的兼容性理由，不要让项目停留在过时版本上。

## 使用规则

- 仅当 Vercel AI SDK 能为 Next.js 项目带来实际价值时才使用。
- 不要向所有 AI 相关项目自动添加。
- 不要仅因应用包含 LLM 功能就引入。

## 联动

- [前端框架：Vite 与 Next.js](frontend-framework.md)——搭配：仅限 Next.js；是否引入该 SDK，只取决于它对 Next.js 实现是否有实际价值。
