---
id: toolchain/rust
lang: zh
version: 1
source-lang: en
status: draft
digest: b251de2a
---

# Rust 工具链

## 强制要求

TypeScript 与 Python 是 AI 辅助开发的默认语言,它们的库生态和 agent 生态支持最完善。

Rust 不是默认选项。

仅当项目确实需要以下能力时才选择 Rust:

* 内存安全前提下的极致性能
* 系统级组件
* 供其他语言调用的原生扩展
* WebAssembly 目标

采用 Rust 必须有明确理由,经用户批准,并记录在项目 ADR 中。

熟悉 Rust 本身不构成采用理由。

## 适用范围

本文档是基线规范,采用前需结合具体项目分析。

采用前确认两点:需求确实命中上述场景之一;TypeScript、Python 或 Go 无法以可接受的成本满足该需求。

## 版本策略

通过 mise 或 rustup 安装并使用 stable 工具链。

`Cargo.toml` 使用 edition 2024。

默认不启用 nightly 特性;确需 nightly 时,作为显式决策记录在案。

## 使用规则

### 构建与打包

构建和打包只使用 `cargo`。

不要把标准 cargo 命令藏进自定义构建脚本。

### 格式化

格式化使用 `rustfmt`。

通过 mise task 暴露 `cargo fmt`。

### Lint

Lint 使用 `cargo clippy`。

CI 中必须把 warning 当作错误:

```bash
cargo clippy --all-targets -- -D warnings
```

### unsafe 块

每个 `unsafe` 块必须附带 `// SAFETY:` 注释,说明维持该块安全的不变量。

不要用 `unsafe` 绕过借用检查器。

### 错误处理

库的错误类型使用 `thiserror`。

`anyhow` 只用于二进制边界;不要让它出现在库的公开 API 中。

### 工作区布局

多 crate 项目使用 cargo workspace。

依赖版本在工作区层面保持同步。

### 测试

CI 中运行 `cargo test`。

## 联动

* [mise](../toolchain/mise.md) —— 版本管理:Rust 工具链及相关工具由 mise 管理并经 mise task 暴露。
* [质量门禁](../toolchain/quality-gates.md) —— 同一套检查:prek 与 CI 运行相同的 Lint 与格式化配置。
* [Git 工作流](../toolchain/git.md) —— 提交纪律:Rust 变更同样遵循标准提交与 PR 规则。
* [测试策略](../practices/testing.md) —— 测试重点:测什么,在哪一层测。
