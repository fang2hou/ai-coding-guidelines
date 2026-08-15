---
id: libraries/typescript-backend
lang: zh
version: 3
source-lang: en
status: active
digest: a61306fc
---

# TypeScript 后端技术栈

## 结论

优先采用——Hono 是首选的 TypeScript 后端框架。默认运行时是处于 Active LTS 线上的 Node.js；Web 标准 API 让服务可以移植到 Cloudflare Workers 等其他运行时。模型基于训练数据生成代码，主流且经过充分验证的技术栈在 AI 辅助开发中出错更少——这一倾向决定了本文的结论。

## 适用场景

- 构建 TypeScript API 或后端服务。

## 不适用场景

- 服务满足 Python 的采用标准——使用 [Python API 技术栈](../libraries/python-api-stack.md)。
- 交付物是纯前端——那里的框架选型见 [前端框架：Vite 与 Next.js](../libraries/frontend-framework.md)。

## 优势

- Hono：多运行时——同一份代码可运行在 Node.js、Cloudflare Workers 与 Deno 上。这是决定性优势：一个框架用同一份代码库同时覆盖 Node LTS 默认部署与边缘部署。
- Hono：基于 Web 标准 `Request`/`Response`，核心极小，中间件实用。
- Hono：类型化 RPC 客户端（`hono/client`）让路由契约端到端保持类型化。

## 代价

- Hono 的自带组件比传统框架少，完整的应用需要更多自行组装。
- 一个服务只用一个框架：不要按运行时分叉后端模式，也不要往 Hono 服务里混入第二个后端框架。

## 版本策略

- Hono 一律使用最新稳定主线；没有具体的兼容性理由，不要让服务停留在旧主线上。
- 运行时通过 mise 锁定在 Node.js Active LTS 线上——截至 2026-08 为 Node.js 24（EOL 2028-04）。绝不把服务跑在 Current 线上。

## 使用规则

### 边界处校验

- 在传输边界完成校验：挂上 Hono 的 validator 中间件，handler 拿到的值已合法且带类型。
- 核心层不复查传输层关注点。

### handler 保持薄，核心层框架无关

- handler 是薄适配器：在边界处把框架请求转换成纯类型化取值，再调用核心层；核心模块不 import Hono。
- 这与 [Go API 技术栈](../libraries/go-api-stack.md) 的分层规则同源：核心层只依赖纯类型化输入和 Web 标准 API，绝不依赖 Web 框架。

### Web 标准 API

- 优先使用 Web 标准 API（`Request`/`Response`、`fetch`、`URL`、streams），而不是各运行时的私有等价物；核心层因此在 Node.js 与 Workers 之间保持可移植。

### 路由类型端到端贯通

- 路由类型贯通到底：客户端推断用 Hono 的 RPC 客户端（`hono/client`）。不要把路由契约退化成无类型的 fetch 封装。

### 中间件

- 中间件只存在于传输层；核心层不知道中间件的存在。

### 部署默认值

- 个人项目以 Cloudflare Workers 为部署目标：Hono 对 Workers 有一流支持，核心层坚持 Web 标准 API，同一服务就能在本地 Node.js 上运行。
- 工作项目以 Databricks Apps 为部署目标，遵循 [Databricks](../toolchain/databricks.md)。截至 2026-08 的事实：Databricks Apps 托管 Python、Node.js 或二者混合的应用；Node 依赖从 `package.json` 安装（存在 `pnpm-lock.yaml` 时执行 `pnpm install --frozen-lockfile`），并运行 `app.yaml` 中声明的命令。托管 Node 运行时由平台锁定——2026 年中为 Node 22，早于当前的 Active LTS 线——平台文档列出的 Node 框架是 React、Angular、Svelte 与 Express。
- 在 Databricks 上，Node 版本由平台而不是项目决定：让服务与平台运行时兼容，不要假设本地 LTS。Hono 经 `@hono/node-server` 以普通 Node.js 应用的方式部署；即使平台文档列出了 Express，对 Express 的弃用结论不变。
- 数据与 AI 密集的 Databricks 工作负载仍以 [Python API 技术栈](../libraries/python-api-stack.md) 的 Python 服务为常态；在那里引入 Node 服务，只在它确实有价值时。

## 联动

### 内部联动

- Hono + Node.js LTS——TypeScript 服务的默认组合；同一份 Hono 代码也可部署到个人项目的 Cloudflare Workers。

### 相关指南

- [TypeScript 工具链](../toolchain/typescript.md) —— 搭配：pnpm、oxlint、oxfmt 与严格 tsconfig 基线对后端服务原样适用。
- [Databricks](../toolchain/databricks.md) —— 工作项目的部署目标：Apps 与 Jobs 的选择、工作时间窗与部署文件。
- [测试策略](../practices/testing.md) —— 测试重点：不依赖框架的核心层用普通单元测试覆盖；HTTP 部分按薄适配器覆盖。
- [质量门禁](../toolchain/quality-gates.md) —— 同一套检查：prek 与 CI 运行相同的 Lint 与格式化配置。

## 不采用的替代方案

- Express：回调时代的 API、疲弱的 TypeScript 推断、停滞的中间件模型。不要在它上面搭建新服务，即使模板或托管平台默认选了它。
