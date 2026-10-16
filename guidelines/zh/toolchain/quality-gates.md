---
id: toolchain/quality-gates
lang: zh
version: 5
source-lang: en
status: active
digest: c6886b66
---

# 质量门禁

## prek

使用 `prek` 作为标准的预提交框架。

除非用户明确批准例外，否则不要引入其他预提交框架。

钩子配置使用 prek 的原生格式 `prek.toml`。仅在需要兼容 pre-commit 时才使用 `.pre-commit-config.yaml`。

将钩子指向所有环节共用的入口：

```toml
# prek.toml - the hook runs the shared entry point
[[repos]]
repo = "local"
hooks = [
  { id = "check", entry = "mise run check", language = "system", pass_filenames = false }
]
```

### 不采用的替代方案

- pre-commit
- Lefthook

## 默认检查集

在 `prek.toml` 中配置项目所需的快速检查项，默认包括：

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
typecheck    -> 开启 typeCheck 的 oxlint（tsgolint）/ tsc --noEmit
```

oxlint 的 `options.typeCheck`（通过 `oxlint-tsgolint`）会报出 TypeScript 诊断并以非零退出码失败，因此可以独立承担 typecheck 检查；未配置类型感知 lint 时，改用独立命令 `tsc --noEmit`。

## 检查应保持快速

预提交检查将在每次提交时运行，必须保持足够快，方便人和 AI Agent 频繁执行。不要为了让钩子配置显得全面就塞入耗时很长的检查。

```text
# good - fast enough for every commit
lint, format check, typecheck, secret scanning

# bad - too slow for a commit hook; belong in CI
full E2E suite, dependency audit against live registries
```

## 本地 / CI 一致性

在托管于 GitHub 的仓库中，GitHub Actions 应使用同一套项目配置运行完全一致的检查命令，避免本地与 CI 的校验脱节：

```bash
# local
mise run check && mise run test
```

```yaml
# .github/workflows/ci.yml - steps section
- uses: jdx/mise-action@v4 # installs the mise-managed toolchain
- run: mise run check
- run: mise run test
```

如果这些命令在本地通过、却在 CI 中失败，说明两个环境已经不一致；应将它们对齐，不要不断增加仅用于 CI 的修复。

CI 分层模型见 [GitHub Actions](../toolchain/github-actions.md)；有关通过任务调用同一套工具的说明，见 [mise](../toolchain/mise.md)。

## 校验入口

在可行的情况下，通过 `mise run check` 暴露项目的主校验入口：

```bash
mise run check
```

让 `test` 依赖 `check`，确保测试不会在未经校验的代码上运行：

```toml
# mise.toml - the check -> test chain
[tasks.check]
depends = ["lint", "format", "typecheck"]

[tasks.test]
depends = ["check"] # test never runs on unvalidated code
run = "pnpm test"
```
