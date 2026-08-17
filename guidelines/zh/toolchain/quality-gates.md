---
id: toolchain/quality-gates
lang: zh
version: 2
source-lang: en
status: active
digest: c66b565b
---

# 质量门禁

## prek

使用 `prek` 作为标准的预提交框架。

除非用户明确批准例外，否则不要引入其他预提交框架。

将钩子指向所有环节共用的入口：

```yaml
# .pre-commit-config.yaml - the hook runs the shared entry point
repos:
  - repo: local
    hooks:
      - id: check
        entry: mise run check
        language: system
        pass_filenames: false
```

### 不采用的替代方案

- pre-commit
- Lefthook

## 默认检查集

仓库的 prek 配置应包含项目所需的快速检查项。

默认应包括：

- Lint 检查
- 格式化检查
- 针对语言的静态检查
- 安全相关检查
- 视情况执行的依赖检查
- 凭据扫描

在当前工具链中，对应关系如下：

```text
lint         -> oxlint / ruff check
format check -> oxfmt --check / ruff format --check
typecheck    -> tsc --noEmit
```

## 检查应保持快速

预提交检查应有实际意义，并且运行迅速。

不要为了让钩子配置看起来覆盖全面，就加入高开销检查。

每次提交都要运行的检查，必须足够快，以便人类和 AI Agent 频繁执行。

```text
# good - fast enough for every commit
lint, format check, typecheck, secret scanning

# bad - too slow for a commit hook; belong in CI
full E2E suite, dependency audit against live registries
```

## 本地 / CI 一致性

对于托管于 GitHub 的仓库，GitHub Actions 应使用同一套项目配置运行等价检查，避免本地与 CI 的校验分叉。

不变量：本地用于校验变更的命令，必须与 CI 运行的命令完全一致。

```bash
# local
mise run check && mise run test
```

```yaml
# .github/workflows/ci.yml - steps section
- uses: jdx/mise-action@v2 # installs the mise-managed toolchain
- run: mise run check
- run: mise run test
```

如果这些命令在本地通过、却在 CI 中失败，说明两个环境已经不一致；应将它们对齐，不要不断增加仅用于 CI 的修复。

CI 分层模型见 [GitHub Actions](../toolchain/github-actions.md)；有关通过任务调用同一套工具的说明，见 [mise](../toolchain/mise.md)。

## 校验入口

在可行的情况下，用 mise task 提供相关质量工作流的入口。

例如：

```bash
mise run check
```

上述任务是项目主要校验工作流的固定入口。

让 `test` 依赖 `check`，确保测试不会在未经校验的代码上运行：

```toml
# mise.toml - the check -> test chain
[tasks.check]
depends = ["lint", "format", "typecheck"]

[tasks.test]
depends = ["check"] # test never runs on unvalidated code
run = "pnpm test"
```
