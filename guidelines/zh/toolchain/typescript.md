---
id: toolchain/typescript
lang: zh
version: 1
source-lang: en
status: active
digest: ffb7f20a
---

# TypeScript 工具链

标准的 TypeScript / JavaScript 工具链:包管理用 pnpm,Lint 用 oxlint,格式化用 oxfmt。框架选型见[前端框架:Vite vs Next.js](../libraries/frontend-framework.md)。

## pnpm

使用 `pnpm`。

适用于普通 Node.js 项目与 monorepo。

外部文档给出 npm 或 yarn 命令时,将其转换为 pnpm 等价用法,而不是引入另一个包管理器。

项目 lockfile 必须与 pnpm 保持一致。

### 不采用的替代方案

禁止使用:

* npm
* yarn

## oxlint

`oxlint` 是标准的 TypeScript / JavaScript Lint 工具。

当框架、模板或库推荐 ESLint 时:

1. 弄清它依赖哪些 ESLint 规则或插件。
2. 判断 oxlint 是否支持所需功能。
3. 只要可行,就改用 oxlint 的等价能力。
4. 不要仅因模板生成了 ESLint 就保留它。

除非存在具体的兼容性问题,否则使用最新稳定版 oxlint。

### 规则配置

有意识地配置 oxlint。

启用那些合适且受 oxlint 官方支持的规则与推荐规则集。

不要因为生成的项目配置没有开启,就让有用的推荐检查处于关闭状态。

当某个规则集或兼容层无法被 oxlint 正确支持时,应显式配置处理,而不是把不兼容的 ESLint 行为硬塞进项目。

### Type-Aware / 类型检查规则

在适合项目的情况下,使用 oxlint 官方支持的 TypeScript type-aware 或类型检查能力。

按 oxlint 当前官方文档配置所需的 type-aware 功能。

oxlint 已具备所需能力时,不要仅为获得 type-aware Lint 而引入 ESLint。

具体配置会随 oxlint 演进,因此优先采用 oxlint 当前官方机制,不要从旧项目复制过时配置。

### 不采用的替代方案

禁止将 ESLint 作为默认 Lint 体系。

## oxfmt

`oxfmt` 是 TypeScript / JavaScript 项目的标准格式化工具。

除非存在具体的兼容性问题,否则使用最新稳定版 oxfmt。

不要对同一批源文件运行多个相互竞争的格式化工具。

### 不采用的替代方案

禁止使用 Prettier。
