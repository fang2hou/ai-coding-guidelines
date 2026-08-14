---
id: libraries/frontend-framework
lang: zh
version: 1
source-lang: en
status: active
digest: 4e5209c4
---

# 前端框架：Vite 与 Next.js

## 结论

优先采用——Vite 是默认前端框架；只有确实需要全栈能力时才选择 Next.js。

决策规则：

- 默认使用 Vite。
- 仅当项目需要全栈 React 应用，或所需能力足以构成采用 Next.js 的正当理由时，才使用 Next.js。
- 禁止仅因 Next.js 比 Vite 能力更强而选择它。
- 只要 Next.js 的额外复杂度带不来价值，就选 Vite。

## 适用场景

### Vite

- 应用是简单、快速的纯前端，不需要全栈框架。
- 不需要服务端渲染和全栈能力。

### Next.js

- 项目需要全栈 React 应用。
- 项目所需的能力足以构成采用 Next.js 的正当理由。

## 不适用场景

### Vite

- 项目所需的全栈能力足以构成采用 Next.js 的正当理由。

### Next.js

- 唯一理由只是 Next.js 比 Vite 能力更强。
- Next.js 的额外复杂度带不来价值——此时应使用 Vite。

## 优势

### Vite

- 配置极简，开发服务器速度快。
- 涉及的概念少，框架强加的约束也少。

### Next.js

- 内置全栈 React 能力：服务端渲染、路由和数据获取。
- 确需这些能力时，一个框架即可覆盖全部需求。

## 代价

### Vite

- 不是全栈框架；服务端能力需另行补齐。
- 升级 Vite 时必须检查插件兼容性。

### Next.js

- 在架构、约定和运维层面都比 Vite 更复杂。
- 大版本升级时需要审查相关插件与集成的兼容性。

## 版本策略

### Vite

- 新项目优先使用最新稳定版 Vite。
- Vite 插件优先使用最新兼容版本。
- 升级 Vite 时检查插件兼容性。
- 没有具体的兼容性理由，不要让项目停留在过时版本上。

### Next.js

- 新项目优先使用最新稳定版 Next.js。
- 相关插件与集成优先使用最新兼容版本。
- 大版本升级时审查兼容性。

## 使用规则

- 对无需全栈框架的简单、快速前端应用，使用 Vite。
- 项目需要全栈 React 应用，或所需能力足以构成采用 Next.js 的正当理由时，使用 Next.js。
- 不要仅因 Next.js 比 Vite 能力更强而使用它。
- Next.js 的额外复杂度带不来价值时，选择 Vite。

## 联动

- [TypeScript 工具链](../toolchain/typescript.md)——搭配：无论项目基于哪种框架，pnpm、oxlint、oxfmt 工具链均适用。
