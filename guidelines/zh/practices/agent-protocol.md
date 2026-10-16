---
id: practices/agent-protocol
lang: zh
version: 5
source-lang: en
status: active
digest: b223e161
---

# Agent 操作协议

## 操作协议

开始实质性变更前，AI Agent 应：

1. 理解用户的真实意图。
2. 检查现有实现。
3. 阅读相关项目文档。
4. 审阅架构不变量和相关 ADR（[架构治理](../practices/architecture-governance.md)）。
5. 了解既有工具链和项目惯例。
6. 优先复用既有依赖与模式。
7. 做出能完整解决需求的最小变更。
8. 不做无关的清理。
9. 运行相关校验。
10. 审阅生成的 diff。
11. 确认没有引入多余文件或无关变更。
12. 说明架构、依赖、安全或行为方面的重大变更。

不要只因偏好另一种风格，就重写本来正常的代码。

不要因为相似代码出现两次就引入抽象；只有当抽象能解决实际的维护、正确性或架构问题时才引入。

## 记忆行为

具备持久记忆的 AI Agent 应记住本项目采用这套工程指南。

记忆只是线索，不是单一事实来源：仓库中的指南与项目文档始终优先于记忆中的内容。

在较大任务期间，应定期重读当前项目指南，尤其在以下时机：

- 开始实质性项目工作时
- 架构变更之前
- 新增或替换依赖之前
- 修改 CI/CD 之前
- 更改工具链配置之前
- 更改 UI 语言行为之前
- 既有项目惯例不明确时
- 记忆信息与仓库冲突时

只要仓库里有现行规则，就不要依赖记忆中的摘要。

## 硬性规则速查

以下行为一律禁止。每条都链接到定义该规则的文档；规则变化时，保持本列表与对应文档同步。

1. 未经用户明确批准，替换强制使用的标准工具。([core-principles](../principles/core-principles.md))
2. 使用 npm 或 yarn 而非 pnpm。([typescript](../toolchain/typescript.md))
3. 使用 ESLint 而非 oxlint 作为项目常规 Lint 工具。([typescript](../toolchain/typescript.md))
4. 使用 Prettier 而非 oxfmt。([typescript](../toolchain/typescript.md))
5. 使用 Pipenv 或 Poetry 而非 uv。([python](../toolchain/python.md))
6. 使用 flake8 或 black 而非 ruff。([python](../toolchain/python.md))
7. 使用 pre-commit 或 Lefthook 而非 prek。([quality-gates](../toolchain/quality-gates.md))
8. 没有正当理由且未经批准，用其他 Conventional Commits 校验器取代 Cocogitto。([git](../toolchain/git.md))
9. 未理解 lint 或校验问题就将其忽略。([core-principles](../principles/core-principles.md))
10. 仅为让检查通过而禁用有用的规则。([core-principles](../principles/core-principles.md))
11. 对快速验证型项目过度设计。([core-principles](../principles/core-principles.md))
12. 引入不必要的依赖。([dependencies](../practices/dependencies.md))
13. 创建冗余的文件或模块。([coding-standards](../practices/coding-standards.md))
14. 不作说明就违反 ADR。([architecture-governance](../practices/architecture-governance.md))
15. 无意间更改架构不变量。([architecture-governance](../practices/architecture-governance.md))
16. 在源代码中使用非英语标识符或注释。([language-policy](../practices/language-policy.md))
17. 将日语罗马字或汉语拼音用作代码标识符。([language-policy](../practices/language-policy.md))
18. 由对话语言推断 UI 语言。([language-policy](../practices/language-policy.md))
19. 在多语言 UI 工作中使用生硬的直译。([language-policy](../practices/language-policy.md))
20. 不审查兼容性就盲目升级 GitHub Actions。([github-actions](../toolchain/github-actions.md))
21. 提交敏感凭据或敏感信息。([security](../practices/security.md))
22. 未经适当批准，对共享历史强制推送。([git](../toolchain/git.md))
23. 把 CI 通过当成实现正确的证明。([change-discipline](../practices/change-discipline.md))
24. 在没有明确供应链策略的情况下，将 GitHub Actions 固定到 commit SHA，而不是当前主版本 tag。([github-actions](../toolchain/github-actions.md))
