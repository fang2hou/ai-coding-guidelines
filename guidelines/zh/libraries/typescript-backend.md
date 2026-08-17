---
id: libraries/typescript-backend
lang: zh
version: 3
source-lang: en
status: active
digest: 9a981b05
---

# TypeScript 后端技术栈

## 结论

优先采用——Hono 是 TypeScript 后端的首选框架。默认运行时为 Node.js，使用 Active LTS 版本线；Web 标准 API 使服务可移植到 Cloudflare Workers 等其他运行时。模型根据训练数据生成代码，主流且经过充分验证的技术栈在 AI 辅助开发中更少出错；这一倾向决定了本文的结论。

## 适用场景

- 构建 TypeScript API 或后端服务。

## 不适用场景

- 服务达到采用 Python 的必要性标准——改用 [Python API 技术栈](../libraries/python-api-stack.md)。
- 交付物是纯前端——框架选型见 [前端框架：Vite 与 Next.js](../libraries/frontend-framework.md)。

## 优势

- Hono：支持多运行时——同一份代码可在 Node.js、Cloudflare Workers 和 Deno 上运行。这是关键优势：同一框架用一个代码库同时覆盖 Node LTS 默认部署和边缘部署。
- Hono：基于 Web 标准的 `Request`/`Response`；核心精简，中间件集合实用。
- Hono：类型化 RPC 客户端（`hono/client`）使路由契约端到端保持类型安全。

## 代价

- Hono 的内置能力不如传统框架齐全；完整应用需要自行组装更多功能。
- 一个服务只用一个框架：不要按运行时拆分后端模式，也不要在 Hono 服务中混用第二个后端框架。

## 版本策略

- 使用 Hono 最新的稳定主版本；没有具体的兼容性理由，不要让服务停留在旧主版本。
- 通过 mise 将运行时固定在 Node.js Active LTS 版本线上——截至 2026-08 为 Node.js 24（EOL 2028-04）。绝不要在服务中使用 Current 线。

## 使用规则

### 边界处校验

- 在传输边界完成校验：挂载 Hono 的 validator 中间件，让 handler 接收的值都已通过校验并带有类型。
- 核心层不重复校验传输层关注的问题。

### handler 保持轻量，核心层框架无关

- handler 是轻量适配器：在边界处把框架请求转换为带类型的普通值，再调用核心层；核心模块不 import Hono。
- 这与 [Go API 技术栈](../libraries/go-api-stack.md) 的分层规则一致：核心层只依赖带类型的普通输入和 Web 标准 API，绝不依赖 Web 框架。

### Web 标准 API

- 优先使用 Web 标准 API（`Request`/`Response`、`fetch`、`URL`、streams），而不是各运行时专用的等价 API，这样核心层就能在 Node.js 与 Workers 之间移植。

### 路由端到端类型安全

- 让路由端到端保持类型安全，客户端推断使用 Hono 的 RPC 客户端（`hono/client`）。不要把路由契约降级为无类型的 fetch 封装。

### 中间件

- 中间件只存在于传输层；核心层不感知中间件的存在。

### 部署默认值

- 个人项目部署到 Cloudflare Workers：Hono 对 Workers 提供一流支持，核心层只使用 Web 标准 API，因此同一服务也能在本地 Node.js 上运行。
- 工作项目部署到 Databricks Apps；遵循 [Databricks](../toolchain/databricks.md)。截至 2026-08，已确认 Databricks Apps 可托管由 Python、Node.js 或二者构建的应用；Node 依赖从 `package.json` 安装（存在 `pnpm-lock.yaml` 时会执行 `pnpm install --frozen-lockfile`），并运行 `app.yaml` 中声明的命令。托管 Node 运行时由平台固定——2026 年中为 Node 22，早于当前 Active LTS 线——平台文档列出的 Node 框架为 React、Angular、Svelte 和 Express。
- 在 Databricks 上，Node 版本由平台而不是项目决定：让服务与平台运行时兼容，不要假设本地 LTS。Hono 通过 `@hono/node-server` 部署为普通 Node.js 应用；即使平台文档列出了 Express，也不改变不采用 Express 的结论。
- 数据和 AI 密集型 Databricks 工作负载仍属于 [Python API 技术栈](../libraries/python-api-stack.md) 的适用范围；只有在 Node 服务确实有明确价值时，才在这类工作负载中增加 Node 服务。

## 联动

### 内部联动

- Hono + Node.js LTS——TypeScript 服务的默认组合；同一份 Hono 代码也可部署到个人项目的 Cloudflare Workers。

### 相关指南

- [TypeScript 工具链](../toolchain/typescript.md) ——搭配 pnpm、oxlint 和 oxfmt；严格 tsconfig 基线对后端服务同样适用。
- [Databricks](../toolchain/databricks.md) ——工作项目的部署目标：选择 Apps 还是 Jobs、工作时间窗与部署文件。
- [测试策略](../practices/testing.md) ——框架无关的核心层使用普通单元测试；HTTP 关注点由薄适配器测试覆盖。
- [质量门禁](../toolchain/quality-gates.md) ——同一套检查：prek 与 CI 运行相同的 Lint 和格式化配置。

## 不采用的替代方案

- Express：回调时代的 API、薄弱的 TypeScript 类型推断和停滞的中间件模型。即使模板或托管平台默认使用它，也不要用它搭建新服务。
