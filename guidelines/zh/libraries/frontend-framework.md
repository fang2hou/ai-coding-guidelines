---
id: libraries/frontend-framework
lang: zh
version: 1
source-lang: en
status: active
digest: d62465f6
---

# 前端框架：Vite 与 Next.js

## 结论

首选——Vite 是默认前端框架；只有项目确实需要全栈能力时才选择 Next.js。

决策规则：

- 默认使用 Vite。
- 只有项目需要全栈 React 应用，或确实需要 Next.js 提供的相关能力时，才使用 Next.js。
- 禁止仅因 Next.js 比 Vite 能力更强而选择它。
- 如果 Next.js 的额外复杂度没有带来价值，就选择 Vite。

## 适用场景

### Vite

- 构建简单、快速的前端应用，且不需要全栈框架。
- 不需要服务端渲染和全栈能力。

### Next.js

- 项目需要全栈 React 应用。
- 项目确实需要 Next.js 提供的相关能力。

## 不适用场景

### Vite

- 项目需要全栈能力，且这些能力确实值得采用 Next.js。

### Next.js

- 唯一理由只是 Next.js 比 Vite 能力更强。
- Next.js 的额外复杂度没有带来价值——此时应使用 Vite。

## 优势

### Vite

- 配置极简，开发服务器速度快。
- 涉及的概念较少，框架强加的约束也少。

### Next.js

- 内置全栈 React 能力：服务端渲染、路由和数据获取。
- 当这些能力确实必要时，一个框架即可满足需求。

## 代价

### Vite

- 不是全栈框架；服务端能力需要另行添加。
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
- 当项目需要全栈 React 应用，或确实需要 Next.js 提供的相关能力时，使用 Next.js。
- 不要仅因 Next.js 比 Vite 能力更强而使用它。
- Next.js 的额外复杂度没有带来价值时，选择 Vite。

## 联动

- [TypeScript 工具链](../toolchain/typescript.md)——搭配：无论项目使用哪种框架，pnpm、oxlint 和 oxfmt 工具链均适用。
