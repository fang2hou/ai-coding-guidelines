---
id: toolchain/github-actions
lang: zh
version: 3
source-lang: en
status: active
digest: 66dd9918
---

# GitHub Actions

## 标准平台

GitHub Actions 是标准 CI/CD 平台；用户未指定流水线系统时，默认选择 GitHub Actions。与工具无关的流水线规则见 [流水线](../practices/pipeline.md)。

## Action 升级清单

创建或修改 GitHub Actions 工作流时：

1. 检查所使用的 action 是否有更新的稳定版本。
2. 升级前查阅官方 README 或文档。
3. 检查是否存在破坏性变更。
4. 检查所需的输入、权限、运行时版本或行为是否发生变化。
5. 确认迁移可以安全进行后，优先升级到当前受支持的版本。

未核查迁移要求前，不要盲目更新 action 版本号。

## CI 分层

在可行的情况下，CI 应使用与本地开发相同的标准化项目工具。

优先采用：

```text
GitHub Actions
    -> mise
        -> project task
            -> pnpm / uv / prek / cocogitto / test tooling
```

而不是把项目逻辑直接复制进工作流 YAML。

mise 是 CI 调用的入口；不要在工作流 YAML 中重复设置工具。见 [mise](../toolchain/mise.md)。

## 命名与可读性

工具无关原则见 [流水线](../practices/pipeline.md)。

对 GitHub Actions 而言：

- 为工作流设置能说明其用途的 `name`（如 `CI`、`Release`）。不要依赖文件名，也不要用 job 名作为工作流名。
- 为每个 job 设置可读的 `name`。分支保护会将 job 名显示为状态检查；读者必须能根据失败的检查找到对应职责（`Validate`、`Validate PR title`），而不是只看到某次工具调用。
- 每个 step 都要用简短的祈使短语命名，说明它执行或验证的内容（`Install dependencies (pnpm)`、`Check commit history (cog)`）。没有 `name` 的 `run:` step 会在记录中显示为原始命令；命令不是文档。
- 每个工作流文件只处理一个关注点。触发条件或受众不同时应拆分；宁可使用多个较小的工作流，也不要让一个文件不断膨胀。

## 加固默认值

除非有明确理由不这样做，否则每个工作流都应采用以下设置：

```yaml
permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    timeout-minutes: 15
```

- 最小权限：`permissions` 默认 `contents: read`；只在实际需要的 job 里放宽。
- 为每个 job 设置 `timeout-minutes`，避免挂起的 job 持续消耗 runner 时间，直至达到平台默认超时上限。
- 使用启用 `cancel-in-progress` 的 `concurrency`，让同一 ref 上已被取代的运行直接取消，而不是继续排队。
- 将不可信输入（pull request 标题、分支名、issue 文本）传给 `run:` 脚本时，必须通过环境变量传递，绝不要直接插入 `${{ }}`——直接插值会导致脚本注入。
- action 至少应固定到已验证创建者发布的主版本 tag；第三方 action 优先固定到完整 commit SHA。

## 相关文档

- [流水线](../practices/pipeline.md)——适用于任何 CI 系统的流水线结构与命名规则。
- [质量门禁](../toolchain/quality-gates.md)——用同一套项目配置运行等价的本地检查。
- [Git 工作流](../toolchain/git.md)——CI 中的 Conventional Commits 校验，含 squash merge 的 pull request 标题规则。
