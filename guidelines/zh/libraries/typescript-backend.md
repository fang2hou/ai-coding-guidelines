---
id: libraries/typescript-backend
lang: zh
version: 1
source-lang: en
status: active
digest: 50737803
---

# TypeScript 后端技术栈

## 结论

优先采用——Elysia 是首选的 TypeScript 后端框架，运行在 Bun 上，Bun 由 mise 管理。当运行时必须是 Node.js、Cloudflare Workers 这类边缘平台或多种运行时并存时，Hono 是标准替代。Express 予以弃用。

## 适用场景

- 构建 TypeScript API 或后端服务。

## 不适用场景

- 服务满足 Python 的采用标准——使用 [Python API 技术栈](../libraries/python-api-stack.md)。
- 交付物是纯前端——那里的框架选型见 [前端框架：Vite 与 Next.js](../libraries/frontend-framework.md)。

## 优势

- Elysia：端到端类型推断——路由 schema 经 Eden 流转到客户端。
- Elysia：在 Bun 的 HTTP 栈上有一流的性能。
- Elysia：内置 schema 校验（TypeBox），无需另接一层校验。
- Hono：基于 Web 标准 `Request`/`Response`，核心极小，中间件实用。
- Hono：多运行时——同一份代码可运行在 Cloudflare Workers、Bun、Node.js 与 Deno 上。

## 代价

- Elysia 以 Bun 为先。Node 适配器（`@elysiajs/node`）存在但比直接跑在 Bun 上年轻；把 Node 当作受限的部署目标，而不是默认选项。
- Hono 的自带组件比传统框架少，完整的应用需要更多自行组装。
- Bun 上用 Elysia、其他运行时用 Hono，会让服务模式随运行时分叉——按服务选定一个框架，不要按路由混用。

## 版本策略

- Elysia、Hono、Bun 一律使用最新稳定主线；没有具体的兼容性理由，不要让服务停留在旧主线上。
- Bun 与其他工具一样经 mise 管理，版本锁定在项目的 mise 配置中。
- 遵循两个框架当前文档的惯用法；不要把 Express 时代的中间件模式搬进任何一个。

## 使用规则

### 边界处校验

- 在传输边界完成校验：在 Elysia 路由上声明 schema，或挂 Hono 的 validator 中间件；handler 拿到的值已合法且带类型。
- 核心层不复查传输层关注点。

### handler 保持薄，核心不依赖框架

- handler 是薄适配器：在边界处把框架请求转换成纯类型化取值，再调用核心层；核心模块不 import Elysia，也不 import Hono。
- 这与 [Go API 技术栈](../libraries/go-api-stack.md) 的分层规则同源：核心层只依赖纯类型化输入和 Web 标准 API，绝不依赖 Web 框架。

### Web 标准 API

- 优先使用 Web 标准 API（`Request`/`Response`、、、streams），而不是各运行式的私有等价物；核心层因此在 Bun、Node.js 与 Workers 之间保持可移植。

### 路由类型端到端贯通

- 路由类型贯通到底：Elysia 配合 Eden 做客户端推断，Hono 用其 RPC 客户端（`hono/client`）。不要把路由契约退化成无类型的 fetch 封装。

### 中间件

- 中间件只存在于传输层；核心层不知道中间件的存在。

## 联动

### 内部联动

- Elysia + Bun——Elysia 以 Bun 为先，构建于 Bun 的 HTTP、文件系统与热重载 API 之上；Elysia 服务的默认运行时是 Bun。
- Elysia ↔ Hono——由运行时决定：默认在 Bun 上用 Elysia；服务必须运行在 Node.js、Cloudflare Workers 或多种运行时上时用 Hono。

### 相关指南

- [TypeScript 工具链](../toolchain/typescript.md) —— 搭配：pnpm、oxlint、oxfmt 与严格 tsconfig 基线对后端服务原样适用。
- [测试策略](../practices/testing.md) —— 测试重点：不依赖框架的核心层用普通单元测试覆盖；HTTP 部分按薄适配器覆盖。
- [质量门禁](../toolchain/quality-gates.md) —— 同一套检查：prek 与 CI 运行相同的 Lint 与格式化配置。

## 不采用的替代方案

- Express：回调时代的 API、疲弱的 TypeScript 推断、停滞的中间件模型。不要在它上面搭建新服务，即使模板默认选了它。
