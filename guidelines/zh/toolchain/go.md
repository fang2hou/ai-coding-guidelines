---
id: toolchain/go
lang: zh
version: 1
source-lang: en
status: draft
digest: 5320c659
---

# Go 工具链

## 强制要求

TypeScript 与 Python 是 AI 辅助开发的默认语言,它们的库生态和 agent 生态支持最完善。

Go 不是默认选项。

仅当项目确实需要以下能力时才选择 Go:

* 性能敏感的网络服务
* 以独立二进制分发的命令行工具
* 静态单二进制部署目标
* 高并发工作负载

采用 Go 必须有明确理由,经用户批准,并记录在项目 ADR 中。

熟悉 Go 本身不构成采用理由。

## 适用范围

本文档是基线规范,采用前需结合具体项目分析。

采用前确认两点:需求确实命中上述场景之一;TypeScript 或 Python 无法以可接受的成本满足该需求。

## 版本策略

通过 mise 管理并使用最新的 Go 稳定版本。

`go.mod` 中的 `toolchain` 指令必须与 mise 管理的 Go 版本一致。

没有记录在案的理由,不要锁定旧版本。

## 使用规则

### Lint

Lint 工具使用 `golangci-lint`。

通过 mise task 暴露,保证本地与 CI 使用同一份配置。

### 格式化

格式化工具使用 `gofumpt`。

格式检查纳入 pre-commit 配置和 CI。

### 错误处理

附加上下文时用 `%w` 包装错误:

```go
return fmt.Errorf("loading config: %w", err)
```

用 `errors.Is` 和 `errors.As` 判断包装后的错误。

不要用错误消息的字符串比较判断错误。

### Context

阻塞型或请求作用域的函数,第一个参数固定传 `context.Context`。

传递调用方的 context,不要在库代码内部新建 `context.Background`。

### 并发

goroutine 的归属保持显式:每个 goroutine 都有一个对其生命周期负责的拥有者。

取消必须通过 context 显式传递。

不要泄漏 goroutine。

### 测试

多组输入的行为用表驱动测试覆盖。

CI 中运行 `go test -race`。

### panic

库代码中不要 `panic`,改为返回错误。

`panic` 仅保留给 `cmd/` 入口中不可恢复的启动错误。

### 目录结构

入口程序放在 `cmd/` 下。

不对外公开的包放在 `internal/` 下。

## 联动

* [mise](../toolchain/mise.md) —— 版本管理:Go 与 golangci-lint 由 mise 管理并经 mise task 暴露。
* [质量门禁](../toolchain/quality-gates.md) —— 同一套检查:prek 与 CI 运行相同的 Lint 与格式化配置。
* [Git 工作流](../toolchain/git.md) —— 提交纪律:Go 变更同样遵循标准提交与 PR 规则。
* [测试策略](../practices/testing.md) —— 测试重点:测什么,在哪一层测。

## 不采用的替代方案

不把单独的 `gofmt` 或 `goimports` 作为项目的格式化工具。

`gofumpt` 是 `gofmt` 的严格超集;import 排序由 gofumpt 配合 golangci-lint 的 `gci` 或 `goimports` 规则完成。
