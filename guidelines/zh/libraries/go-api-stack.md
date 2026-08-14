---
id: libraries/go-api-stack
lang: zh
version: 1
source-lang: en
status: draft
digest: ec02610b
---

# Go API 技术栈

## 结论

优先采用——Echo 是首选的 Go Web 框架，请求校验用 `github.com/go-playground/validator/v10`。只有当 Go 本身已按 [Go 工具链](../toolchain/go.md) 的标准完成论证后，才适用本技术栈。

## 适用场景

- Go 服务需要 HTTP API，且采用 Go 已满足 [Go 工具链](../toolchain/go.md) 中的论证要求。

## 不适用场景

- Go 未通过论证——回到默认的 [TypeScript 后端技术栈](../libraries/typescript-backend.md) 或 [Python API 技术栈](../libraries/python-api-stack.md)，不要硬套本技术栈。

## 优势

- Echo：路由与中间件成熟，API 面小；常用中间件齐备，同时不遮蔽 `net/http`。
- Echo：性能好、分配开销低，匹配那些让 Go 值得采用的性能敏感服务。
- Echo：维护活跃——当前主线为 v5，v4 的安全与缺陷修复支持到 2026-12-31。
- validator：事实上的 Go 结构体校验库，与 Echo 的请求绑定集成。

## 代价

- 框架上下文诱发耦合：用起来顺手，针对它写的业务逻辑会被困在框架里。下面的分层规则就是用来约束这一点的。
- 服务继承 Echo 的升级节奏：主线迁移（v4 到 v5）按框架的时间表到来，而不是项目的时间表。

## 版本策略

- 新服务从 Echo 当前稳定主线起步，并跟随其最新稳定 minor。截至 2026-08 该主线为 v5（`github.com/labstack/echo/v5`）；开工前以 Echo 的 releases 为准，不要把本文当成版本快照。
- 存量服务停留在所用主线的最新 minor。仍在 v4 上的服务须在 v4 支持结束（2026-12-31）前，按 Echo 当前文档中的升级说明迁往 v5。
- 遵循框架当前文档的惯用法；绝不照抄 GOPATH 时代或前 modules 时期的博客写法——import 路径、项目布局、中间件注册多年来都变过。
- 配套库保持较新的稳定主线并跟随其当前最佳实践；validator 的当前 import 路径是 `github.com/go-playground/validator/v10`。

## 使用规则

### 分层：handler 是薄适配器

- HTTP handler 是传输边界的薄适配器。调用核心层之前，先把框架上下文（`echo.Context`）转换为标准 `context.Context` 加上已校验的类型化请求值。
- 核心／业务层只依赖标准库 context 和领域类型；既不 import `echo`，也不依赖任何其他 Web 框架。
- 核心层因此可以用纯 Go 测试直接覆盖，也不绑定传输方式。

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

`core.Service.Do(ctx context.Context, req CreateUser)` 只接收标准 context 和领域类型，永远见不到 `echo.Context`。

### 请求校验

- 在传输边界用 `github.com/go-playground/validator/v10` 校验请求：bind → validate → 转换为领域类型。
- 核心层拿到的值已经合法，不再复查传输层关注点。

### 中间件

- 中间件（认证、日志、recovery、CORS）只存在于传输层；核心层不知道中间件的存在。

## 联动

### 内部联动

- Echo + validator——启动时注册一次校验器；Echo 的 bind → validate 流水线是在领域转换前确认请求形状的标准位置。

### 相关指南

- [Go 工具链](../toolchain/go.md) —— 搭配：本技术栈的 Lint、格式化、context 与错误处理规则。
- [测试策略](../practices/testing.md) —— 测试重点：不依赖框架的核心层用表驱动 Go 测试覆盖；HTTP 部分按薄适配器覆盖。
- [质量门禁](../toolchain/quality-gates.md) —— 同一套检查：prek 与 CI 运行相同的 Lint 与格式化配置。

## 不采用的替代方案

- 业务逻辑通篇写在 `echo.Context` 上——离开框架无法测试，并被锁死在 Echo 内部实现上。
- 在同一服务里引入第二个 Web 框架——一个服务只用一个框架。
