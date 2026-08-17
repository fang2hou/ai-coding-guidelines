---
id: toolchain/go
lang: zh
version: 2
source-lang: en
status: draft
digest: e7ceba43
---

# Go 工具链

## 强制要求

TypeScript 与 Python 是 AI 辅助开发的默认语言，因为它们在库生态和 AI Agent 生态方面获得的支持最强。

Go 不是默认选项。

仅当项目确实需要以下能力时才选择 Go：

- 对性能敏感的网络服务
- 以独立二进制文件分发的命令行工具
- 单个静态二进制文件的部署目标
- 高并发工作负载

采用 Go 必须给出明确理由、征得用户同意，并在项目 ADR 中记录这些内容。

熟悉 Go 本身不构成采用理由。

## 适用范围

本文档是 Go 项目的基线规范。

它不能替代项目级评估。

采用 Go 前确认两点：需求确实属于上述场景之一；TypeScript 或 Python 无法以可接受的成本满足该需求。

## 版本策略

使用 mise 管理最新稳定版 Go。

`go.mod` 中的 `toolchain` 指令必须与 mise 管理的 Go 版本一致。

除非记录了理由，否则不要锁定旧版 Go。

## 使用规则

### Lint 工具

使用 `golangci-lint` 作为 Lint 工具。

通过 mise task 提供该工具，确保本地开发和 CI 使用同一份配置。

将配置作为 `.golangci.yml` 提交到仓库，并根据项目重点进行调整。不要使用 `enable-all`：它会启用缓慢且主观的检查，反而掩盖真正有价值的信号。

始终启用的基线规则：

- `govet`——可疑构造检查，大致对应 `go vet` 的检查项
- `staticcheck`——正确性、简化与风格检查，包括错误消息风格检查（ST1005）：错误消息以小写开头，结尾不带标点
- `unused`——未使用的常量、变量、函数与类型
- `ineffassign`——无效赋值
- `misspell`——常见英文拼写错误

在基线之上，根据项目特点增加重点检查组：

- 大量使用 context 的服务：`contextcheck`、`containedctx`、`fatcontext`、`noctx`
- 以错误处理为重点的项目：在 `errcheck` 基础上增加 `errorlint` 与 `wrapcheck`

### 格式化

使用 `gofumpt` 作为格式化工具。

将格式检查加入 pre-commit 配置和 CI。

### 错误处理

添加上下文时，用 `%w` 包装错误：

```go
return fmt.Errorf("loading config: %w", err)
```

用 `errors.Is` 和 `errors.As` 判断包装后的错误。

不要通过比较错误消息字符串来检查错误。

### Context

对于会阻塞或具有请求作用域的函数，必须将 `context.Context` 作为第一个参数传入。

传递调用方的 context；不要在库代码中创建新的 `context.Background` 值。

### 并发

明确每个 goroutine 的归属：每个 goroutine 只能有一个生命周期负责人。

通过 context 显式传递取消信号。

不要泄漏 goroutine。

### 测试

使用表驱动测试覆盖多组输入下的行为。

CI 中运行 `go test -race`。

通过 `.golangci.yml` 中的按路径排除规则，为 `_test.go` 文件放宽 Lint 要求。测试优先保证可读性和意图清晰，不必遵循生产代码的 Lint 严格度；测试中关闭错误包装和重复代码风格检查：

```yaml
version: "2"
linters:
  exclusions:
    rules:
      - path: _test\.go
        linters:
          - wrapcheck
          - errorlint
          - dupl
```

### panic

库代码中不要使用 `panic`，改为返回错误。

仅在 `cmd/` 入口的启动错误不可恢复时使用 `panic`。

### 目录结构

Go 没有官方标准的项目布局。`golang-standards/project-layout` 仓库是社区参考而非官方标准；官方的 "Organizing a Go module" 指南从将基础包放在模块根目录开始。

- 小型库可以保持根目录扁平：只需 `go.mod` 和包文件。
- 复杂服务应按业务分层设计自己的结构，而不是照搬模板。

`cmd/`（每个二进制一个入口）与 `internal/`（由编译器强制限制导入）仍是有用的惯例。只有在它们符合项目设计时才采用，不要把它们当成模板要求。

## 联动

- [mise](../toolchain/mise.md) —— 版本管理：Go 和 golangci-lint 由 mise 管理，并通过 mise task 提供。
- [Go API 技术栈](../libraries/go-api-stack.md) —— HTTP 服务使用的 Web 框架和校验技术栈。
- [质量门禁](../toolchain/quality-gates.md) —— 同一套检查：prek 与 CI 运行相同的 Lint 与格式化配置。
- [Git 工作流](../toolchain/git.md) —— 提交纪律：Go 变更遵循标准的提交和 pull request 规则。
- [测试策略](../practices/testing.md) —— 测试重点：测什么，在哪一层测。

## 不采用的替代方案

不要将单独的 `gofmt` 或 `goimports` 作为项目的格式化工具。

`gofumpt` 是 `gofmt` 的严格超集；导入排序由 gofumpt 配合 golangci-lint 的 `gci` 或 `goimports` 规则完成。
