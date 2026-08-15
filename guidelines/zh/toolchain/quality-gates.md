---
id: toolchain/quality-gates
lang: zh
version: 2
source-lang: en
status: active
digest: 2109dea0
---

# 质量门禁

## prek

使用 `prek` 作为标准预提交框架。

除非用户明确批准例外，否则不要引入其他预提交框架。

钩子指向与其他环节共用的同一个入口：

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

仓库的 prek 配置应包含与项目相关的快速检查。

默认应包括：

- Lint 检查
- 格式化检查
- 语言专属的静态检查
- 安全相关检查
- 视情况加入的依赖检查
- 敏感凭据扫描

落到具体工具上，对应关系是：

```text
lint         -> oxlint / ruff check
format check -> oxfmt --check / ruff format --check
typecheck    -> tsc --noEmit
```

## 保持检查快速

预提交检查要有意义，并且要快。

不要为了让钩子配置显得大而全而加入高开销检查。

需要每次提交都运行的检查，必须足够快，让人和 AI Agent 都能高频使用。

```text
# good - fast enough for every commit
lint, format check, typecheck, secret scanning

# bad - too slow for a commit hook; belong in CI
full E2E suite, dependency audit against live registries
```

## 本地 / CI 一致性

对托管在 GitHub 上的仓库，GitHub Actions 应使用同一套项目配置运行等价检查，让本地与 CI 的校验不分叉。

不变量是：本地用来把关变更的命令，就是 CI 里运行的命令，一字不差。

```bash
# local
mise run check && mise run test
```

```yaml
# .github/workflows/ci.yml - steps section
    - uses: jdx/mise-action@v2   # installs the mise-managed toolchain
    - run: mise run check
    - run: mise run test
```

如果这些命令本地通过、CI 失败，说明两个环境已经分叉；对齐它们，不要攒 CI 专用的补丁。

CI 分层模型见 [GitHub Actions](../toolchain/github-actions.md)，通过任务使用同一套工具的方式见 [mise](../toolchain/mise.md)。

## 校验入口

在可行的情况下，把相关质量工作流通过 mise task 暴露出来。

例如：

```bash
mise run check
```

这个任务是项目主校验工作流的稳定入口。

把 `test` 挂在 `check` 后面，让测试永远不跑在未校验的代码上：

```toml
# mise.toml - the check -> test chain
[tasks.check]
depends = ["lint", "format", "typecheck"]

[tasks.test]
depends = ["check"] # test never runs on unvalidated code
run = "pnpm test"
```
