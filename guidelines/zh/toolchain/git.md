---
id: toolchain/git
lang: zh
version: 4
source-lang: en
status: active
digest: f8f4d6bb
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

Cocogitto 是标准的 Conventional Commits 校验工具。

在各项目中统一使用 Cocogitto，不要为每个仓库另选提交校验器。

在适当情况下，通过标准化项目工具将 Cocogitto 接入本地提交流程。

Cocogitto 已提供所需校验时，不要实现自定义的 Conventional Commits 解析器。

## 在 GitHub Actions 中校验

GitHub Actions 必须包含用于校验 Conventional Commits 的检查。

该校验使用 Cocogitto。

`cog verify` 虽不创建提交，仍会解析 Git 作者身份；未配置身份时会因 `config value 'user.name' was not found` 失败。GitHub Actions runner 默认没有 Git 身份，因此必须在任务中调用它之前配置 `user.name` 和 `user.email`。`cog check` 只读取已有提交，不需要身份。

包含非法提交信息的 pull request 应导致相应的校验流水线失败。

若仓库采用 squash merge，且最终提交信息以 pull request 标题为准，则 pull request 标题必须遵循同样的 Conventional Commits 约定。

目标是保持以下两者一致：

- pull request 校验
- 最终仓库历史

CI 工作流标准见 [GitHub Actions](../toolchain/github-actions.md)。

## 仓库属性

GitHub 托管的项目应提交 `.gitattributes` 文件。

用它确保 GitHub 的语言统计准确：工具链文件（lockfile、配置、CI 定义）和数据文件（测试数据、快照）不得淹没项目的核心内容。

优先采用白名单而非黑名单：默认把一切排除在统计之外，再仅放行项目本体。

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

未经适当的评审与批准，不要对共享仓库历史执行 force push。

遵循既有的评审流程。

不要仅为图省事而改写共享历史。

AI Agent 不得随意执行破坏性 Git 操作。
