---
id: practices/dependencies
lang: zh
version: 1
source-lang: en
status: active
digest: ff1398d1
---

# 依赖纪律

## 五个问题

添加依赖之前：

1. 检查项目是否已具备所需功能。
2. 检查框架或标准工具链是否已有现成方案。
3. 确认该依赖解决的是真实需求。
4. 权衡维护成本。
5. 考虑与标准化工具链的兼容性。

功能简单、不用库也能写得清晰时，不要为此引入库。

未经用户明确批准，不要用其他依赖替换标准化工具。

## 兼容性参考

对照强制工具链评估兼容性：

- [TypeScript 工具链](../toolchain/typescript.md) — pnpm、oxlint、oxfmt
- [Python 工具链](../toolchain/python.md) — uv、ruff
- [质量门禁](../toolchain/quality-gates.md) — prek
- [Git 工作流](../toolchain/git.md) — 用 Cocogitto 校验 Conventional Commits

认可的库选型见[前端框架](../libraries/frontend-framework.md)与 [Python API 技术栈](../libraries/python-api-stack.md)。

这些规则背后的标准化原则在[核心工程原则](../principles/core-principles.md)中定义。
