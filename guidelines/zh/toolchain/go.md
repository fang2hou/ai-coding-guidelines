---
id: toolchain/go
lang: zh
version: 2
source-lang: en
status: draft
digest: 79ace68f
---

# Go 工具链

## 强制要求

TypeScript 与 Python 是 AI 辅助开发的默认语言，它们的库生态和 agent 生态支持最完善。

Go 不是默认选项。

仅当项目确实需要以下能力时才选择 Go:

- 性能敏感的网络服务
- 以独立二进制分发的命令行工具
- 静态单二进制部署目标
- 高并发工作负载

采用 Go 必须有明确理由，经用户批准，并记录在项目 ADR 中。

熟悉 Go 本身不构成采用理由。

## 适用范围

本文档是基线规范，采用前需结合具体项目分析。

采用前确认两点：需求确实命中上述场景之一；TypeScript 或 Python 无法以可接受的成本满足该需求。

## 版本策略

通过 mise 管理并使用最新的 Go 稳定版本。

`go.mod` 中的 `toolchain` 指令必须与 mise 管理的 Go 版本一致。

没有记录在案的理由，不要锁定旧版本。

## 使用规则

### Lint

Lint 工具使用 `golangci-lint`。

通过 mise task 暴露，保证本地与 CI 使用同一份配置。

配置以 `.golangci.yml` 提交到仓库，并按项目的侧重点裁剪。不要用 `enable-all`：全量启用会打开一堆又慢又主观的检查项，把真正有价值的告警淹没。

常开基线：

- `govet`——可疑构造检查（与 `go vet` 大致相同的分析）
- `staticcheck`——正确性、简化与风格检查，含错误消息风格(ST1005)：错误消息以小写开头，结尾不带标点
- `unused`——未使用的常量、变量、函数与类型
- `ineffassign`——无效赋值
- `misspell`——常见英文拼写错误

在基线之上按项目性质加侧重组：

- 重度使用 context 的服务：、、、`noctx`
- 以错误处理为重点的项目：之外加 `errorlint` 与 `wrapcheck`

### 格式化

格式化工具使用 `gofumpt`。

格式检查纳入 pre-commit 配置和 CI。

### 错误处理

附加上下文时用 `%w` 包装错误：

```go
return fmt.Errorf("loading config: %w", err)
```

用 `errors.Is` 和 `errors.As` 判断包装后的错误。

不要用错误消息的字符串比较判断错误。

### Context

阻塞型或请求作用域的函数，第一个参数固定传 `context.Context`。

传递调用方的 context，不要在库代码内部新建 `context.Background`。

### 并发

goroutine 的归属保持显式：每个 goroutine 都有一个对其生命周期负责的拥有者。

取消必须通过 context 显式传递。

不要泄漏 goroutine。

### 测试

多组输入的行为用表驱动测试覆盖。

CI 中运行 `go test -race`。

`_test.go` 文件通过 `.golangci.yml` 的按路径豁免获得宽松的 lint 规则。测试优先保证可读性与意图表达，不承担生产代码的 lint 严格度；错误包装与重复代码类检查在测试中关闭：

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

库代码中不要 `panic`，改为返回错误。

`panic` 仅保留给 `cmd/` 入口中不可恢复的启动错误。

### 目录结构

Go 没有官方的标准项目布局。仓库是社区参考而非官方标准；官方指南 Organizing a Go module 的起点也是把基础包直接放在模块根目录。

- 小型库可以保持根目录扁平：加包文件即可。
- 复杂服务应按业务分层设计自己的结构，而不是照搬模板。

`cmd/`（每个二进制一个入口）与 `internal/`（由编译器强制限制导入）仍然是有用的惯例。当它们服务于设计时才采用，而不是当作模板义务。

## 联动

- [mise](../toolchain/mise.md) —— 版本管理：Go 与 golangci-lint 由 mise 管理并经 mise task 暴露。
- [Go API Stack](../libraries/go-api-stack.md) —— Web 框架与校验栈：构建 HTTP 服务时选用的框架与请求校验组合。
- [质量门禁](../toolchain/quality-gates.md) —— 同一套检查：prek 与 CI 运行相同的 Lint 与格式化配置。
- [Git 工作流](../toolchain/git.md) —— 提交纪律：Go 变更同样遵循标准提交与 PR 规则。
- [测试策略](../practices/testing.md) —— 测试重点：测什么，在哪一层测。

## 不采用的替代方案

不把单独的 `gofmt` 或 `goimports` 作为项目的格式化工具。

`gofumpt` 是 `gofmt` 的严格超集；import 排序由 gofumpt 配合 golangci-lint 的 `gci` 或 `goimports` 规则完成。
