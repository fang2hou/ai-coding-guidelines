---
id: toolchain/github-actions
lang: zh
version: 5
source-lang: en
status: active
digest: 3797ab64
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

未核查迁移要求前，不要盲目更新 action 版本号。主版本 tag 会自行获取补丁和次版本更新；这份清单约束的是它无法替你完成的迁移——跨越主版本边界。

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

## 事件作用域

- 每个工作流文件只面向一种触发受众。项目校验工作流在 `push`（默认分支）和 `pull_request` 上运行；只对 pull request 成立的规则——例如 pull request 标题规则——放在仅由 `pull_request` 触发的独立工作流中。
- 绝不要在多触发工作流里给某个 job 加 `if: github.event_name == 'pull_request'` 来模拟这种拆分：在 `push` 触发的运行中，该 job 显示为 skipped，整个运行看起来像部分失败。工具无关的规则见 [流水线](../practices/pipeline.md)。
- `pull_request` 默认由 `opened`、`synchronize`、`reopened` 触发——这正是校验代码所需的集合。只有在超出默认范围时才列出 `types:`：校验可能因编辑而改变的 pull request 元数据（标题）的工作流必须加上 `edited`，让改过标题的 pull request 重新接受校验。绝不要列出无法改变结果的 activity type；每多列一个 type，就多一个触发入口。
- 必需状态检查即使被 skipped 的 job 也能满足——合并门禁不会强制这条规则。遵守它是为了得到可读的运行列表；真正要防的是：工作流不在 `pull_request` 上运行，或 job 被过滤器整个排除的必需检查，从不报告、一直 pending。每个要求某项检查的上下文，都必须为它产出报告。

## 检出深度

- `actions/checkout` 默认只获取一个 commit。保持这一默认值：大多数 job 只需获取用于校验的代码树。
- 只有读取历史记录的 job 才设置 `fetch-depth: 0`，例如 `cog check`、生成变更日志、`git describe`、与基线比较 diff 的逻辑。
- 当一项职责需要完整历史而其他职责不需要时，应将它拆分为独立 job，而不是加深共享 checkout。按[流水线](../practices/pipeline.md)的原则，读取历史本身就是一项职责；拆分后还能保持校验 job 使用浅层 checkout。

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
- 将 action 引用为受信任发布者发布的当前主版本 tag（`actions/checkout@v7`、`jdx/mise-action@v4`）。该 tag 会持续接收此主版本内的修复、运行时更新和新功能，升级时只需改动一个 token，评审者一眼即可看懂。
- 优先使用 tag，而不是完整 commit SHA。SHA 会将 action 冻结在某个 revision：修复永远不会自动到达，工作流也不再声明它运行的版本，每次升级都变成手动查找 SHA。只有在已有明确的不可变构建或供应链策略时，才固定 SHA，并在行末注释中记录实际对应的版本。绝不要让 action 停留在裸分支名或未带版本的 tag。
- 浮动的主版本 tag 信任发布者：应与上面的最小权限默认值配套，绝不要向运行 pull request 代码的工作流暴露敏感凭据。
- 绝不要用 `pull_request_target` 检出并运行 pull request 的代码；它会以仓库敏感凭据执行基础分支上的工作流定义。应使用 `pull_request`。

## 相关文档

- [流水线](../practices/pipeline.md)——适用于任何 CI 系统的流水线结构与命名规则。
- [质量门禁](../toolchain/quality-gates.md)——用同一套项目配置运行等价的本地检查。
- [Git 工作流](../toolchain/git.md)——CI 中的 Conventional Commits 校验，含 squash merge 的 pull request 标题规则。
