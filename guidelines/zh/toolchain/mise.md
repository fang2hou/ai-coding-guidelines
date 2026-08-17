---
id: toolchain/mise
lang: zh
version: 2
source-lang: en
status: active
digest: 8568a6e0
---

# mise

## 强制要求

每个项目必须使用 `mise`。

`mise` 在项目层面是以下内容的单一事实来源：

- 运行时版本
- CLI 工具版本
- 开发工具
- 环境配置
- 常用项目任务
- CI 使用的工具链设置

mise 管理的工具包括：

- Node.js
- pnpm
- Python
- uv
- Databricks CLI
- Cocogitto
- prek
- 其他项目 CLI 工具

只要 mise 能满足需求，就不要另行引入通用工具管理器。

这是[核心工程原则](../principles/core-principles.md)在工具链层面的具体应用。

## 分工

mise 只管理运行时和工具二进制文件，例如 Node.js、pnpm、uv 以及 Lint 工具。

语言包和语言环境只能由相应语言的包管理器管理：Node 使用 pnpm，Python 使用 uv。

禁止用 mise 安装语言包。

这种划分是有意为之：执行一次 `mise install` 即可初始化整套工具链，不需要额外进行全局安装；同时，各生态仍保留原生的最佳实践包管理器。

## 版本策略

优先使用最新版 mise。

维护项目时让 mise 本身保持最新，不要无必要地固定旧版本。

## 工具生命周期

项目不再使用某个工具时，应将其从 mise 配置中移除。

不要把废弃工具留在项目环境里。

## 任务

把 `mise tasks` 用作统一的项目级任务接口。

项目常用命令应可通过以下形式调用：

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

在适当情况下，语言专属的任务定义可以保留在相应语言的生态中。

例如，前端脚本可以放在 `package.json` 中，通过 pnpm 执行。

此时应通过 mise task 提供相关工作流的入口，而不是另建一套独立的项目任务系统。

例如：

```text
mise task
    -> pnpm script
        -> underlying frontend tool
```

## 本地 / CI 一致性

在可行的情况下，CI/CD 应使用 mise。

项目不应为本地开发和 CI 分别维护两套完全独立的工具链定义。

两个环境都应使用项目统一管理的同一套工具。

## mise MCP

当 AI 环境支持 MCP，且项目工作流能从 mise MCP 集成中受益时，优先配置该集成。

若用户使用的是支持 MCP 的环境，但尚未配置 mise MCP，agent 可以帮助用户添加该集成，而不是创建替代性的项目管理机制。
