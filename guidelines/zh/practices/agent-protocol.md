---
id: practices/agent-protocol
lang: zh
version: 1
source-lang: en
status: active
digest: 3f1a4f98
---

# Agent 操作协议

## 操作协议

在着手非平凡变更之前，AI Agent 应当：

1. 理解用户的真实意图。
2. 查看既有实现。
3. 阅读相关项目文档。
4. 审阅架构不变量与相关 ADR([架构治理](../practices/architecture-governance.md))。
5. 了解既有的工具链与项目惯例。
6. 优先复用既有依赖与模式。
7. 做出满足需求的最小完整变更。
8. 避免无关的清理。
9. 运行相关校验。
10. 检查产生的 diff。
11. 确认没有引入多余文件或无关变更。
12. 说明重大的架构、依赖、安全或行为变更。

不要仅仅因为 Agent 自己偏好另一种风格，就重写能正常工作的代码。

不要仅仅因为相似代码出现了两次，就引入抽象。

只有当抽象能解决实际的维护、正确性或架构问题时，才引入它。

## 记忆行为

具备持久记忆的 AI Agent 应记住项目使用这套工程指南。

记忆只是提醒，不是事实来源。

仓库中的指南与项目文档始终优先于记忆中的信息。

在实质性工作期间，有持久记忆的 Agent 应定期重读当前项目指南。

尤其在以下时机重读相关章节：

- 重大项目工作开始时
- 架构变更之前
- 新增或替换依赖之前
- 修改 CI/CD 之前
- 更改工具链配置之前
- 更改 UI 语言行为之前
- 既有项目惯例不明确时
- 记忆信息与仓库冲突时

仓库中存在现行规则时，不要依赖记忆中的摘要。

## 硬性规则速查

以下行为一律禁止。每条都链接到定义该规则的文档；规则变更时，保持本列表与对应文档同步。

1. 未经用户明确批准，替换强制标准化工具。([core-principles](../principles/core-principles.md))
2. 使用 npm 或 yarn 而非 pnpm。([typescript](../toolchain/typescript.md))
3. 使用 ESLint 而非 oxlint 作为项目常规 Lint 工具。([typescript](../toolchain/typescript.md))
4. 使用 Prettier 而非 oxfmt。([typescript](../toolchain/typescript.md))
5. 使用 Pipenv 或 Poetry 而非 uv。([python](../toolchain/python.md))
6. 使用 flake8 或 black 而非 ruff。([python](../toolchain/python.md))
7. 使用 pre-commit 或 Lefthook 而非 prek。([quality-gates](../toolchain/quality-gates.md))
8. 无正当理由且未经批准，用其他 Conventional Commits 校验器取代 Cocogitto。([git](../toolchain/git.md))
9. 未理解 lint 或校验问题就将其忽略。([core-principles](../principles/core-principles.md))
10. 仅为让检查通过而禁用有用的规则。([core-principles](../principles/core-principles.md))
11. 对快速验证型项目过度设计。([core-principles](../principles/core-principles.md))
12. 引入不必要的依赖。([dependencies](../practices/dependencies.md))
13. 创建冗余的文件或模块。([coding-standards](../practices/coding-standards.md))
14. 悄悄违反 ADR。([architecture-governance](../practices/architecture-governance.md))
15. 无意间更改架构不变量。([architecture-governance](../practices/architecture-governance.md))
16. 在源代码中使用非英语标识符或注释。([language-policy](../practices/language-policy.md))
17. 将日语罗马字或汉语拼音用作代码标识符。([language-policy](../practices/language-policy.md))
18. 由对话语言推断 UI 语言。([language-policy](../practices/language-policy.md))
19. 在跨语言 UI 工作中写出低质量的直译。([language-policy](../practices/language-policy.md))
20. 不必要地修改 shadcn/ui 组件内部实现。([shadcn-ui](../libraries/shadcn-ui.md))
21. 不记录对 shadcn/ui 组件的必要修改。([shadcn-ui](../libraries/shadcn-ui.md))
22. 不审查兼容性就盲目升级 GitHub Actions。([github-actions](../toolchain/github-actions.md))
23. 提交敏感凭据或敏感信息。([security](../practices/security.md))
24. 未经适当批准，对共享历史强制推送。([git](../toolchain/git.md))
25. 用 CI 通过代替对实现正确性的理解。([change-discipline](../practices/change-discipline.md))
