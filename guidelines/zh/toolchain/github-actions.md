---
id: toolchain/github-actions
lang: zh
version: 2
source-lang: en
status: active
digest: bde3b8da
---

# GitHub Actions

## 标准平台

GitHub Actions 是标准 CI/CD 平台。

## Action 升级清单

创建或修改 GitHub Actions 工作流时：

1. 检查所用 action 是否存在更新的稳定版本。
2. 升级前查阅官方 README 或文档。
3. 检查是否存在破坏性变更。
4. 检查所需的输入、权限、运行时版本或行为是否发生变化。
5. 确认迁移安全后，优先升级到当前受支持版本。

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

mise 是 CI 的调用入口，工具安装不在工作流 YAML 里重复；见 [mise](../toolchain/mise.md)。

## 命名与可读性

这一原则适用于任何 CI 系统，不限于 GitHub Actions：一旦流水线超出寥寥几个 step 的规模，就用所用工具推荐的原语去规整它——stage、job、独立文件——而不是不断堆叠匿名 step。流水线的每一层都必须能仅凭运行记录说清自己在做什么。

对 GitHub Actions 而言：

- 给工作流一个说明其用途的 `name`（如 `CI`、`Release`）。不要依赖文件名，也不要把 job 名原样重复为工作流名。
- 给每个 job 一个可读的 `name`。job 名会作为状态检查出现在分支保护里，读者必须能把一个失败的检查对应到一项职责（`Validate`、`Validate PR title`），而不是对应到一次工具调用。
- 每个 step 都用简短的祈使短语命名，说明它做什么或验证什么（`Install dependencies (pnpm)`、`Check commit history (cog)`）。没有 `name` 的 `run:` step 在记录里显示为原始命令，而命令不是文档。
- 一个工作流文件只承载一个关注点。当触发条件或受众分道扬镳时就拆分；宁可用多个小工作流，也不要养出一个不断膨胀的文件。

## 加固默认值

除非有明确理由，每个工作流都应满足以下各条：

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
- 每个 job 都设置 `timeout-minutes`，避免挂起的 job 一直烧到平台默认的超时上限。
- 使用带 `cancel-in-progress` 的 `concurrency`，让同一 ref 上被取代的运行直接取消，而不是排队。
- 不可信输入（PR 标题、分支名、issue 文本）传入 `run:` 脚本时必须经由环境变量，绝不通过 `${{ }}` 直接插值——直接插值会导致脚本注入。
- action 至少固定为来自已验证创建者的主版本 tag；第三方 action 优先固定完整 commit SHA。

## 相关文档

- [质量门禁](../toolchain/quality-gates.md)——用同一套项目配置运行等价的本地检查。
- [Git 工作流](../toolchain/git.md)——CI 中的 Conventional Commits 校验，含 squash merge 的 pull request 标题规则。
