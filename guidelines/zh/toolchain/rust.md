---
id: toolchain/rust
lang: zh
version: 1
source-lang: en
status: draft
digest: 5290a035
---

# Rust 工具链

## 强制要求

TypeScript 与 Python 是 AI 辅助开发的默认语言，因为它们在库生态和 AI Agent 生态方面获得的支持最强。

Rust 不是默认选项。

仅当项目确实需要以下能力时才选择 Rust：

- 兼具内存安全和极致性能
- 系统级组件
- 供其他语言使用的原生扩展
- WebAssembly 目标

采用 Rust 必须给出明确理由、征得用户同意，并在项目 ADR 中记录这些内容。

熟悉 Rust 本身不构成采用理由。

## 适用范围

本文档是 Rust 项目的基线规范。

它不能替代项目级评估。

采用 Rust 前确认两点：需求确实属于上述场景之一；TypeScript、Python 或 Go 无法以可接受的成本满足该需求。

## 版本策略

通过 mise 或 rustup 安装并使用 stable 工具链。

在 `Cargo.toml` 中使用 edition 2024。

默认不启用 nightly 特性；需要 nightly 时，必须将其作为明确决策记录在案。

## 使用规则

### 构建与打包

只使用 `cargo` 进行构建和打包。

不要将标准 cargo 命令封装在自定义构建脚本中。

### 格式化

使用 `rustfmt` 进行格式化。

通过 mise task 提供 `cargo fmt`。

### Lint 工具

使用 `cargo clippy` 进行 Lint。

CI 必须将警告视为错误：

```bash
cargo clippy --all-targets -- -D warnings
```

### unsafe 块

每个 `unsafe` 块必须附带 `// SAFETY:` 注释，说明使该代码块安全的不变量。

不要用 `unsafe` 绕过借用检查器。

### 错误处理

库中的错误类型使用 `thiserror`。

`anyhow` 只用于二进制边界；库的公开 API 不得暴露它。

### 工作区布局

多 crate 项目使用 cargo workspace。

依赖版本在工作区层面保持同步。

### 测试

CI 中运行 `cargo test`。

## 联动

- [mise](../toolchain/mise.md) —— 版本管理：Rust 工具链及相关工具由 mise 管理，并通过 mise task 提供。
- [质量门禁](../toolchain/quality-gates.md) —— 同一套检查：prek 与 CI 运行相同的 Lint 与格式化配置。
- [Git 工作流](../toolchain/git.md) —— 提交纪律：Rust 变更遵循标准的提交和 pull request 规则。
- [测试策略](../practices/testing.md) —— 测试重点：测什么，在哪一层测。
