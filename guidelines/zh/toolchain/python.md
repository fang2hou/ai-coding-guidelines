---
id: toolchain/python
lang: zh
version: 2
source-lang: en
status: active
digest: 2a0dc5a3
---

# Python 工具链

## 强制要求

Python 与 TypeScript 并列，是 AI 辅助开发的默认语言：二者的库生态与 agent 生态支持在现有语言中最强。

语言优先级：

- TypeScript 和 Python 是 AI 辅助开发的默认语言，因为二者的库生态与 agent 生态支持最强。
- Go 与 Rust 只留给性能关键或系统级场景；引入前必须给出明确理由并征得用户同意，记录在项目 ADR 中。见 [Go](../toolchain/go.md) 与 [Rust](../toolchain/rust.md)。

不要默认引入 Python 后端。纯 TypeScript 架构够用时优先采用，见 [TypeScript 工具链](../toolchain/typescript.md)。

仅当项目存在真正受益于 Python 的需求时才引入 Python 后端，尤其是：

- 后端逻辑足够复杂
- Python 特有的库能带来实质价值
- 部分实现由其他团队负责
- 数据科学工程师需要修改部分工作流
- Agent 或数据处理逻辑需要独立委派

例如，当 agent 工作流中有一部分预期由数据科学团队维护时，采用 Python 服务就是合理的。

标准 API 框架、数据校验与服务器技术栈见 [Python API 技术栈](../libraries/python-api-stack.md)。

## 版本策略

通过 mise 使用 Python 3.12 及以上版本。

在项目 mise 配置中固定 Python 的确切版本。

提交 `uv.lock`，保证各环境解析出相同的依赖版本。

## uv

使用 `uv` 管理 Python 环境与依赖。

避免引入第二套 Python 环境管理系统。

标准工作流：

- `uv init`——初始化项目。
- `uv add <package>`——添加运行时依赖并更新 lockfile。
- `uv add --dev <package>`——添加仅开发用的依赖，如 Lint 或测试工具。
- `uv remove <package>`——移除依赖。
- `uv lock --upgrade`——升级 lockfile 中的依赖版本。
- `uv sync`——按 lockfile 安装环境。
- `uv run <command>`——在项目环境中执行命令。

禁止直接运行裸的 `python` 或 `pip`：二者都会绕过项目环境与 lockfile。改用 `uv run python` 与 `uv add` / `uv sync`。

依赖定义写在 `pyproject.toml`;`uv.lock` 是生成物，不要手工编辑。

独立脚本用 PEP 723 内联脚本元数据声明依赖，并以 `uv run script.py` 运行：

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx"]
# ///
```

### 不采用的替代方案

禁止使用：

- Pipenv
- Poetry

## ruff

使用 `ruff` 完成 Python 的 Lint 与格式化。

ruff 已覆盖所需工作流时，不要另行维护独立工具。

Lint 用 `ruff check`，格式化用 `ruff format`，二者接入项目的质量门禁执行。ruff 在 `pyproject.toml` 中配置。基线规则集：

```toml
[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "SIM"]
```

E 与 F 检查语法与正确性问题，I 保持导入有序，B 捕捉常见 bug 模式，UP 推动语法现代化，SIM 标记可简化的代码。项目需要时在此基础上扩展；不要悄悄缩减。

### 不采用的替代方案

禁止使用：

- flake8
- black

## 语言使用规则

- 所有公开函数必须加类型注解，参数与返回值都要标注。
- 文件系统路径用 `pathlib`，不用 `os.path`。
- 字符串拼接用 f-string；新代码不再使用 `%` 格式化与 `str.format`。
- 禁止可变默认参数(`def f(items=[])`)。默认值用 `None`，集合在函数内创建。
- 文件、socket、session、client 等资源用上下文管理器(`with`)管理。
- 重新抛出异常时保留原因：。
- 内部数据结构用 `dataclasses`;Pydantic 只用于校验边界，见 [Python API 技术栈](../libraries/python-api-stack.md)。

## 项目布局

- 包放在 `src/` 下(`src/<package>/`),`tests/` 与其在项目根目录并列。
- 这一布局可防止在未安装包的情况下误导入。

## 联动

- [Python API 技术栈](../libraries/python-api-stack.md)
- [质量门禁](../toolchain/quality-gates.md)
- [测试策略](../practices/testing.md)
