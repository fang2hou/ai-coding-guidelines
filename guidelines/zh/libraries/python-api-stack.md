---
id: libraries/python-api-stack
lang: zh
version: 1
source-lang: en
status: active
digest: 7b05bdb6
---

# Python API 技术栈

## 结论

优先采用——FastAPI + Pydantic + Uvicorn 构成首选的 Python API 基线；三者应作为一个整体技术栈采用，而不是分别选择。

## 适用场景

- Python 后端已依据 [Python 工具链](../toolchain/python.md) 中的标准完成必要性论证。
- 构建需要数据校验与结构化模型的 Python API。
- 部署 FastAPI 应用，且部署平台未提供托管 ASGI 服务器。

## 不适用场景

- 纯 TypeScript 架构已经足够——不要自动引入 Python 后端（见 [Python 工具链](../toolchain/python.md)）。
- 部署平台为 Uvicorn 提供了合适的托管替代方案。

## 优势

- FastAPI：高性能 ASGI 框架，自动生成 OpenAPI 文档。
- Pydantic：提供带类型的数据校验和结构化模型，并与 FastAPI 的请求、响应处理集成。
- Uvicorn：轻量、标准的 ASGI 服务器，用于运行 FastAPI 应用。

## 代价

- 引入该技术栈会增加一个 Python 服务，也需要单独管理其依赖和部署。
- Pydantic 模型必须与所校验的数据保持同步。

## 版本策略

- 新项目优先使用 FastAPI、Pydantic 和 Uvicorn 的最新稳定版。
- 没有具体的兼容性理由，不要让该技术栈停留在过时版本上。

## 使用规则

- 使用 FastAPI 作为 Python API 框架。
- 在合适的情况下使用 Pydantic 完成 Python 数据校验与结构化建模。
- FastAPI 应用默认以 Uvicorn 作为 ASGI 服务器，除非部署平台提供了合适的托管替代方案。

## 联动

### 内部联动

- FastAPI + Pydantic——Pydantic 模型是 FastAPI 的校验层；请求和响应 schema 应定义为 Pydantic 模型，而不是手写校验逻辑。
- FastAPI + Uvicorn——除非平台提供托管替代方案，否则 Uvicorn 是 FastAPI 应用的标准 ASGI 服务器。

### 相关指南

- [Python 工具链](../toolchain/python.md)——用 uv 管理该技术栈的环境和依赖，用 ruff 执行 Lint。
