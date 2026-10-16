---
id: toolchain/git
lang: zh
version: 4
source-lang: en
status: active
digest: 5fb5b4bc
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

在有助于明确含义时使用 scope。

示例：

```text
feat(chat): add streaming response rendering
fix(auth): handle expired sessions
refactor(api): simplify request validation
test(search): cover empty-result behavior
ci(commit): validate conventional commits
```

对于将纳入共享仓库历史的提交，避免使用以下无意义的提交信息：

```text
update
changes
fix stuff
wip
```

破坏性变更必须按 Conventional Commits 的约定表示。

## Cocogitto

所有项目统一使用 Cocogitto 校验 Conventional Commits，并通过标准工具接入本地提交流程。不要每个仓库换一个提交校验器，也不要自己写解析器。

## 在 GitHub Actions 中校验

在 GitHub Actions 中使用 Cocogitto 校验 Conventional Commits。

`cog verify` 虽不创建提交，仍会解析 Git 作者身份；未配置身份时会因 `config value 'user.name' was not found` 失败。GitHub Actions runner 默认没有 Git 身份，因此必须在任务中调用它之前配置 `user.name` 和 `user.email`。`cog check` 只读取已有提交，不需要身份。

包含不合规提交信息的 pull request 应使校验流水线失败。

如果仓库采用 squash merge 且最终提交信息取自 pull request 标题，则 pull request 标题也必须遵循相同的 Conventional Commits 规则，以保证 PR 检查与最终提交历史一致。

CI 工作流标准见 [GitHub Actions](../toolchain/github-actions.md)。

## 仓库属性

GitHub 托管的项目应提交 `.gitattributes` 文件，防止 lockfile、配置文件和测试数据干扰 GitHub 的语言统计。

采用白名单方式：默认排除所有文件，只把项目真正的核心代码或文档重新纳入统计。

```gitattributes
* -linguist-detectable
src/** linguist-detectable
*.json -linguist-detectable
*.yaml -linguist-detectable
pnpm-lock.yaml linguist-generated
```

Markdown 等文档语言默认不计入统计，必须显式添加 `linguist-detectable` 规则。之后新增的文件在显式放行前也不会计入统计。

按目录放行时，目录下的数据文件和工具链文件也会一并计入统计。属性规则以最后一条匹配为准，因此要在放行规则之后补上排除模式：数据文件按扩展名（`*.json`、`*.yaml`、`*.toml`），lockfile 等生成文件用 `linguist-generated`。

文件本身不要包含注释；将理由记录在 pull request 或项目文档中。

## Git 安全

未经评审和批准，切勿对共享分支执行 force push 或改写历史。AI Agent 不得擅自执行破坏性的 Git 操作。
