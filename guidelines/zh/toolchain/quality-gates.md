---
id: toolchain/quality-gates
lang: zh
version: 1
source-lang: en
status: active
digest: e153c2da
---

# 质量门禁

## prek

使用 `prek` 作为标准预提交框架。

除非用户明确批准例外,否则不要引入其他预提交框架。

### 不采用的替代方案

* pre-commit
* Lefthook

## 默认检查集

仓库的 prek 配置应包含与项目相关的快速检查。

默认应包括:

* Lint 检查
* 格式化检查
* 语言专属的静态检查
* 安全相关检查
* 视情况加入的依赖检查
* 敏感凭据扫描

## 保持检查快速

预提交检查要有意义。

不要为了让钩子配置显得大而全而加入高开销检查。

需要每次提交都运行的检查,必须足够快,让人和 AI Agent 都能高频使用。

## 本地 / CI 一致性

对托管在 GitHub 上的仓库,GitHub Actions 应使用同一套项目配置运行等价检查,让本地与 CI 的校验不分叉。

CI 分层模型见 [GitHub Actions](../toolchain/github-actions.md),通过任务使用同一套工具的方式见 [mise](../toolchain/mise.md)。

## 校验入口

在可行的情况下,把相关质量工作流通过 mise task 暴露出来。

例如:

```bash
mise run check
```

上面的任务就是项目主校验工作流的稳定入口。
