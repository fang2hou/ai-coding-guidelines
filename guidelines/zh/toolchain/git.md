---
id: toolchain/git
lang: zh
version: 1
source-lang: en
status: active
digest: 8b850fa5
---

# Git 工作流

## Conventional Commits

所有项目提交必须遵循 Conventional Commits 规范。

使用有意义的类型，例如：

```text
feat
fix
refactor
test
docs
build
ci
chore
```

当 scope 有助于提升清晰度时，使用 scope。

示例：

```text
feat(chat): add streaming response rendering
fix(auth): handle expired sessions
refactor(api): simplify request validation
test(search): cover empty-result behavior
ci(commit): validate conventional commits
```

对于会进入共享仓库历史的提交，避免如下无意义的提交信息：

```text
update
changes
fix stuff
wip
```

破坏性变更必须按 Conventional Commits 的约定表示。

## Cocogitto

Cocogitto 是标准的 Conventional Commits 校验工具。

在各项目间统一使用 Cocogitto，不要每个仓库另选一个提交校验器。

在合适的情况下，通过标准化项目工具把 Cocogitto 接入本地提交流程。

Cocogitto 已提供所需校验时，不要实现自定义的 Conventional Commits 解析器。

## 在 GitHub Actions 中校验

GitHub Actions 必须包含 Conventional Commits 校验检查。

该校验使用 Cocogitto。

包含非法提交信息的 pull request 应让相应的校验流水线失败。

若仓库采用 squash merge，且最终提交信息以 pull request 标题为准，则 pull request 标题必须遵循同样的 Conventional Commits 约定。

目标是让两者保持一致：

- pull request 校验
- 最终仓库历史

CI 工作流标准见 [GitHub Actions](../toolchain/github-actions.md)。

## Git 安全

未经适当的评审与批准，不要对共享仓库历史执行 force push。

遵循既有的评审流程。

不要仅为图省事而改写共享历史。

AI Agent 不得随意执行破坏性 Git 操作。
