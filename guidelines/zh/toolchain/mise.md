---
id: toolchain/mise
lang: zh
version: 3
source-lang: en
status: active
digest: 6a083a6e
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

mise 只管理运行时和工具二进制文件（如 Node.js、pnpm、uv 和 Lint 工具）。语言包和虚拟环境一律交由各语言自己的包管理器管理：Node.js 用 pnpm，Python 用 uv。禁止用 mise 安装语言包。

这样只需执行一次 `mise install` 就能装齐工具链，无需全局安装，各语言的依赖仍由自己的包管理器管理。

## 版本策略

使用最新版 mise 并保持更新，不要无故锁定旧版本。

在 `mise.toml` 中固定工具版本时，应使用最新版本（语言指南另有 LTS 要求的除外，例如 Node.js Active LTS）。务必通过 mise 自身（`mise latest <tool>` 或 `mise ls-remote <tool>`）查询最新版本，不要依赖训练数据或外部包仓库。

注意 `pnpm` 版本：npm 中的 `latest` 版本是 11，但实际最新版本已是 12。通过 mise 查询并固定到 12。

## 工具生命周期

项目不再使用某个工具时，及时从 `mise.toml` 中移除，不要在环境里残留废弃工具。

## 任务

把 `mise tasks` 用作统一的项目级任务接口。

通过以下形式调用项目常用任务：

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

语言专属的脚本（例如 `package.json` 中由 pnpm 执行的前端脚本）可以留在原生配置里，但应通过 mise task 暴露统一入口，不要维护两套独立的项目任务系统：

```text
mise task
    -> pnpm script
        -> underlying frontend tool
```

## 本地 / CI 一致性

在可行的情况下，CI/CD 应使用 mise。

不要为本地开发和 CI 维护两套完全独立的工具链定义；两个环境使用项目统一管理的同一套工具。

## mise MCP

当 AI 环境支持 MCP 且对项目工作流有益时，优先配置 mise MCP 集成。若用户环境支持 MCP 但尚未配置，Agent 可以协助添加，而不必另建替代性的项目管理机制。
