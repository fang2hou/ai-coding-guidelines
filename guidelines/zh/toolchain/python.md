---
id: toolchain/python
lang: zh
version: 4
source-lang: en
status: active
digest: 9ca06fa5
---

# Python 工具链

## 强制要求

Python 与 TypeScript 是 AI 辅助开发的默认语言，因为它们的库生态和 AI Agent 生态最成熟。

语言优先级：

- 纯 TypeScript 架构足够时，优先只用 TypeScript；详见 [TypeScript 工具链](../toolchain/typescript.md)。
- 仅当项目确实能从 Python 获益时，才引入 Python 后端（判断标准见下）。
- Go 与 Rust 仅用于性能关键或系统级场景；采用前必须说明理由、征得用户批准，并记录在项目 ADR 中。详见 [Go](../toolchain/go.md) 与 [Rust](../toolchain/rust.md)。

以下情况尤其适合引入 Python 后端：

- 后端逻辑足够复杂
- Python 特有的库能带来实质价值
- 部分实现由其他团队负责
- 数据科学工程师需要修改部分工作流
- AI Agent 或数据处理逻辑需要单独委派

例如，AI Agent 工作流的一部分预计由数据科学团队维护时，采用 Python 服务是合理的。

标准的 API 框架、校验和服务器技术栈见 [Python API 技术栈](../libraries/python-api-stack.md)。

## 版本策略

默认使用 Python 3.12。mise 提供解释器和 uv 工具；环境与依赖（`uv.lock` 等）由 uv 管理。在 ML 生态和模型训练数据跟上之前，不要采用更新的 CPython 版本线；等生态的默认版本发生变化后再重新评估。

模型根据训练数据生成代码，因此训练数据中示例较多的成熟版本，在 AI 辅助开发中出错更少。该原则见 [核心工程原则](../principles/core-principles.md)。

在项目 mise 配置中固定 Python 的确切版本。

提交 `uv.lock`，保证各环境解析出相同的依赖版本。

## uv

使用 `uv` 管理 Python 环境与依赖，不要引入第二套环境或包管理工具。

标准工作流：

- `uv init`——初始化项目。
- `uv add <package>`——添加运行时依赖并更新 lockfile。
- `uv add --dev <package>`——添加仅用于开发的依赖，例如 Lint 或测试工具。
- `uv remove <package>`——移除依赖。
- `uv lock --upgrade`——升级 lockfile 中的依赖版本。
- `uv sync`——按 lockfile 安装环境。
- `uv run <command>`——在项目环境中执行命令。

禁止直接运行 `python` 或 `pip`：二者都会绕过项目环境和 lockfile。改用 `uv run python` 和 `uv add` / `uv sync`。

依赖声明写在 `pyproject.toml` 中；`uv.lock` 是生成文件，禁止手工编辑。

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

使用 `ruff` 完成代码检查（`ruff check`）和格式化（`ruff format`），接入项目质量门禁并在 `pyproject.toml` 中统一配置。基线规则：

```toml
[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "SIM"]
```

E 和 F 检查语法与正确性问题；I 负责导入排序；B 检查常见 bug 模式；UP 更新语法；SIM 标记可简化的代码。项目需要时在此基础上扩展，不要悄悄缩减这套规则。

### 不采用的替代方案

禁止使用：

- flake8
- black

## 语言使用规则

- 所有公开函数必须加类型注解，参数与返回值都要标注。
- 文件系统路径用 `pathlib`，不用 `os.path`。
- 构建字符串使用 f-string；新代码不要使用 `%` 格式化或 `str.format`。
- 禁止使用可变默认参数（`def f(items=[])`）。默认值设为 `None`，并在函数内创建集合。
- 文件、socket、session、client 等资源使用上下文管理器（`with`）管理。
- 重新抛出异常时保留原因：`raise NewError(...) from err`。
- 内部数据结构使用 `dataclasses`；Pydantic 只用于校验边界，详见 [Python API 技术栈](../libraries/python-api-stack.md)。

## 项目布局

- 将包放在 `src/` 下（`src/<package>/`），并将 `tests/` 放在项目根目录，与 `src/` 并列。
- 这种布局可防止未安装包时直接导入该包。

## 联动

- [Python API 技术栈](../libraries/python-api-stack.md)
- [质量门禁](../toolchain/quality-gates.md)
- [测试策略](../practices/testing.md)
