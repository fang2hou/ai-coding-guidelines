---
id: libraries/go-api-stack
lang: zh
version: 1
source-lang: en
status: draft
digest: d4cc51e7
---

# Go API 技术栈

## 结论

优先采用——Echo 是首选的 Go Web 框架，请求校验使用 `github.com/go-playground/validator/v10`。只有依据 [Go 工具链](../toolchain/go.md) 的标准完成 Go 本身的选型论证后，才适用本技术栈。

## 适用场景

- Go 服务需要 HTTP API，且 Go 的采用已满足 [Go 工具链](../toolchain/go.md) 中的论证标准。

## 不适用场景

- Go 未通过选型论证——默认改用 [TypeScript 后端技术栈](../libraries/typescript-backend.md) 或 [Python API 技术栈](../libraries/python-api-stack.md)，不要强行采用本技术栈。

## 优势

- Echo：路由和中间件成熟，API 简洁；内置功能齐备，同时不隐藏 `net/http`。
- Echo：性能高且分配开销低，适合那些因性能要求而选择 Go 的服务。
- Echo：维护活跃——当前主线是 v5，v4 持续接收安全修复和缺陷修复，直至 2026-12-31。
- validator：Go 结构体校验的事实标准，可与 Echo 的请求绑定集成。

## 代价

- 框架上下文容易导致耦合：`echo.Context` 虽然方便，直接基于它编写的业务逻辑会被锁在框架内。下面的分层规则用于限制这种耦合。
- 服务会跟随 Echo 的升级节奏：主版本迁移（v4 到 v5）遵循框架时间表，而不是项目时间表。

## 版本策略

- 新服务使用 Echo 当前稳定的主版本，并跟随该主版本的最新稳定 minor 版本。截至 2026-08，该主版本是 v5（`github.com/labstack/echo/v5`）；开始前以 Echo 的 releases 为准，不要把本文当作版本快照。
- 现有服务保持在所用主版本的最新 minor 版本。仍使用 v4 的服务须在 v4 支持结束（2026-12-31）前，根据 Echo 当前文档中的升级说明迁移到 v5。
- 遵循框架当前文档中的惯用法；绝不要照抄 GOPATH 时代或 modules 出现前的博客写法——import 路径、项目布局和中间件注册方式多年来都已变化。
- 配套库使用较新的稳定主版本，并遵循当前最佳实践；validator 当前的 import 路径为 `github.com/go-playground/validator/v10`。

## 使用规则

### 分层：handler 是轻量适配器

- HTTP handler 是传输边界上的轻量适配器。调用核心层前，将框架上下文（`echo.Context`）转换为标准 `context.Context`，并传入已校验、带类型的请求值。
- 核心业务层只依赖标准库中的 context 和领域类型；既不 import `echo`，也不依赖任何其他 Web 框架。
- 核心层可用普通 Go 测试覆盖，也不依赖具体传输方式。

```go
// Transport layer — the only place Echo appears.
func (h *Handler) CreateUser(c echo.Context) error {
	var in CreateUserInput // transport type with `validate:"..."` tags
	if err := c.Bind(&in); err != nil {
		return err
	}
	if err := c.Validate(&in); err != nil {
		return err
	}
	return h.Service.Do(c.Request().Context(), in.ToDomain())
}
```

`core.Service.Do(ctx context.Context, req CreateUser)` 只接收标准库中的 context 和领域类型；永远不会接触 `echo.Context`。

### 请求校验

- 在传输边界使用 `github.com/go-playground/validator/v10` 校验请求，顺序为 bind → validate → 转换为领域类型。
- 核心层接收的值已经通过校验，不再重复检查传输层关注的问题。

### 中间件

- 中间件（认证、日志、recovery、CORS）仅位于传输层；核心层不感知中间件的存在。

## 联动

### 内部联动

- Echo + validator——启动时注册一次校验器；Echo 的 bind → validate 流水线是领域转换前检查请求结构的标准位置。

### 相关指南

- [Go 工具链](../toolchain/go.md) ——本技术栈沿用其中的 Lint、格式化、context 和错误处理规则。
- [测试策略](../practices/testing.md) ——框架无关的核心层使用表驱动 Go 测试；HTTP 关注点由薄适配器测试覆盖。
- [质量门禁](../toolchain/quality-gates.md) ——同一套检查：prek 与 CI 运行相同的 Lint 和格式化配置。

## 不采用的替代方案

- 让业务逻辑全程依赖 `echo.Context`——离开框架后无法测试，并锁定在 Echo 的内部实现中。
- 在同一服务中采用第二个 Web 框架——每个服务只使用一个框架。
