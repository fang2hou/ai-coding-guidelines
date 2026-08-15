---
id: toolchain/mise
lang: zh
version: 2
source-lang: en
status: active
digest: 3b29d65d
---

# mise

## 强制要求

每个项目必须使用 `mise`。

在项目层面，它是以下内容的单一事实来源：

- 运行时版本
- CLI 工具版本
- 开发工具
- 环境配置
- 常用项目任务
- CI 使用的工具链设置

由 mise 管理的工具示例：

- Node.js
- pnpm
- Python
- uv
- Databricks CLI
- Cocogitto
- prek
- 其他项目 CLI 工具

凡是 mise 能满足的需求，不要再引入单独的通用工具管理器。

这是[核心工程原则](../principles/core-principles.md)那条核心原则在工具链层面的应用。

## 分工

mise 只管理运行时与工具二进制，例如 Node.js、pnpm、uv 和各类 linter。

语言包与环境完全归该语言自身的包管理器所有：Node 用 pnpm，Python 用 uv。

禁止用 mise 安装语言包。

这一分工是刻意的：一条 `mise install` 即可引导整套工具链，无需额外的全局安装，同时各生态保留自己原生的最佳实践包管理器。

## 版本策略

优先使用最新版 mise。

维护项目时让 mise 自身保持最新，不要无故锁定旧版本。

## 工具生命周期

项目不再使用的工具，从 mise 配置中移除。

不要把废弃工具留在项目环境里。

## 任务

把 `mise tasks` 用作统一的项目级任务接口。

项目的典型命令应能通过如下形式调用：

```bash
mise run dev
mise run lint
mise run format
mise run typecheck
mise run test
mise run e2e
mise run check
mise run build
mise run deploy
```

在合适的情况下，语言专属的任务定义可以留在该语言自身的生态中。

例如，前端脚本可以放在 `package.json` 中，通过 pnpm 执行。

此时应通过 mise task 暴露相关工作流，而不是另建一套独立的项目任务系统。

例如：

```text
mise task
    -> pnpm script
        -> underlying frontend tool
```

## 本地 / CI 一致性

在可行的情况下，CI/CD 应使用 mise。

项目不应为本地开发维护一套工具链定义，再为 CI 维护一套完全独立的定义。

两个环境应使用同一套由项目统一管理的工具。

## mise MCP

当 AI 环境支持 MCP，且项目工作流能从 mise MCP 集成中获益时，优先配置它。

若用户所在环境支持 MCP 但尚未配置 mise MCP,agent 应帮助用户完成配置，而不是自建替代的项目管理机制。
