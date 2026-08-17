---
id: practices/dependencies
lang: zh
version: 2
source-lang: en
status: active
digest: 388e55f7
---

# 依赖管理规范

## 五个问题

添加依赖之前，按顺序回答以下五个问题：

1. 项目是否已具备合适的功能？
2. 框架、平台或标准工具链是否已有现成方案？
3. 该依赖是否解决实际需求？
4. 维护成本可以接受吗？
5. 它是否与标准化工具链兼容？

示例：TypeScript 项目考虑使用 `zod` 进行运行时校验：

1. 项目：没有现成的运行时校验功能。
2. 平台：TypeScript 类型仅在编译期生效；请求体和环境变量在运行时没有类型信息。
3. 需求：外部输入会跨越运行时边界，使用前必须校验。
4. 维护：这是一个用途单一、API 范围较小的库，只需跟踪一个依赖。
5. 工具链：`zod` 是纯运行时库；用 pnpm 安装，与 oxlint、oxfmt 不冲突。

决定：添加 `zod`。

同样的问题也会排除较弱的候选项：`truncate` 之类的字符串工具库过不了第 3 问——用三行清晰代码即可实现，无需添加依赖；平台的 `fetch` 已经满足需求时，`axios` 过不了第 2 问。

若功能简单且无需库即可清晰实现，不要为此引入库。

未经用户明确批准，不要用其他依赖替换标准化工具。

## 兼容性参考

根据强制工具链评估兼容性：

- [TypeScript 工具链](../toolchain/typescript.md) — pnpm、oxlint、oxfmt
- [Python 工具链](../toolchain/python.md) — uv、ruff
- [质量门禁](../toolchain/quality-gates.md) — prek
- [Git 工作流](../toolchain/git.md) — 用 Cocogitto 校验 Conventional Commits

推荐的库选型见[前端框架](../libraries/frontend-framework.md)和[Python API 技术栈](../libraries/python-api-stack.md)。

这些规则所依据的标准化原则见[核心工程原则](../principles/core-principles.md)。
