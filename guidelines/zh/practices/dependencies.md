---
id: practices/dependencies
lang: zh
version: 2
source-lang: en
status: active
digest: 161fb8a7
---

# 依赖纪律

## 五个问题

添加依赖之前，按顺序回答以下五个问题：

1. 项目是否已具备合适的功能？
2. 框架、平台或标准工具链是否已有现成方案？
3. 该依赖解决的是真实需求吗？
4. 维护成本可以接受吗？
5. 与标准化工具链兼容吗？

示例：在 TypeScript 项目中为运行时校验引入 `zod`。

1. 项目：当前没有任何运行时校验。
2. 平台：TypeScript 的类型只存在于编译期；请求体和环境变量在运行时是无类型的。
3. 需求：外部输入跨越运行时边界，使用前必须校验。
4. 维护：单一用途的库，公开 API 少，只需跟踪一个依赖。
5. 工具链：纯运行时库；用 pnpm 安装，与 oxlint、oxfmt 无冲突。

决定：引入 `zod`。

同样的问题会否决更弱的候选：`truncate` 之类的字符串工具库过不了第 3 问——三行清晰的代码就能实现，不需要依赖；平台 `fetch` 已能满足需求时，`axios` 过不了第 2 问。

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
