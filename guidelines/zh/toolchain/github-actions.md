---
id: toolchain/github-actions
lang: zh
version: 1
source-lang: en
status: active
digest: 540c3f66
---

# GitHub Actions

## 标准平台

GitHub Actions 是标准 CI/CD 平台。

## Action 升级清单

创建或修改 GitHub Actions 工作流时:

1. 检查所用 action 是否存在更新的稳定版本。
2. 升级前查阅官方 README 或文档。
3. 检查是否存在破坏性变更。
4. 检查所需的输入、权限、运行时版本或行为是否发生变化。
5. 确认迁移安全后,优先升级到当前受支持版本。

未核查迁移要求前,不要盲目更新 action 版本号。

## CI 分层

在可行的情况下,CI 应使用与本地开发相同的标准化项目工具。

优先采用:

```text
GitHub Actions
    -> mise
        -> project task
            -> pnpm / uv / prek / cocogitto / test tooling
```

而不是把项目逻辑直接复制进工作流 YAML。

mise 是 CI 的调用入口,工具安装不在工作流 YAML 里重复;见 [mise](../toolchain/mise.md)。

## 相关文档

* [质量门禁](../toolchain/quality-gates.md)——用同一套项目配置运行等价的本地检查。
* [Git 工作流](../toolchain/git.md)——CI 中的 Conventional Commits 校验,含 squash merge 的 pull request 标题规则。
