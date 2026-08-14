---
id: toolchain/python
lang: zh
version: 1
source-lang: en
status: active
digest: 587abd85
---

# Python 工具链

## 何时引入 Python 后端

不要默认引入 Python 后端。

纯 TypeScript 架构够用时优先采用。

仅当项目存在真正受益于 Python 的需求时才引入 Python 后端,尤其是:

* 后端逻辑足够复杂
* Python 特有的库能带来实质价值
* 部分实现由其他团队负责
* 数据科学工程师需要修改部分工作流
* Agent 或数据处理逻辑需要独立委派

例如,当 agent 工作流中有一部分预期由数据科学团队维护时,采用 Python 服务就是合理的。

标准 API 框架、数据校验与服务器技术栈见 [Python API Stack](../libraries/python-api-stack.md)。

## uv

使用 `uv` 管理 Python 环境与依赖。

避免引入第二套 Python 环境管理系统。

### 不采用的替代方案

禁止使用:

* Pipenv
* Poetry

## ruff

使用 `ruff` 完成 Python 的 Lint 与格式化。

ruff 已覆盖所需工作流时,不要另行维护独立工具。

### 不采用的替代方案

禁止使用:

* flake8
* black
