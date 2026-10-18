---
id: libraries/svelte
lang: zh
version: 3
source-lang: en
status: active
digest: a7039eff
---

# Svelte（Svelte 5 + SvelteKit）

## 结论

视情况采用——Svelte 5 加 SvelteKit 允许用于以开发乐趣为目标的小型个人项目和实验项目。它不是默认选择：生产前端仍使用[前端框架](frontend-framework.md)中选定的 React 技术栈。

## 适用场景

- 个人项目、原型或小型实验项目——把开发乐趣当作目标是合理的。
- 用户明确要求使用 Svelte。

## 不适用场景

- 团队或客户的生产项目，AI 产出效率和生态广度很重要。
- 项目需要 React 生态的广度。

## 优势

- 主流组件框架中样板代码最少；编译产物具备细粒度响应性和更小的包体积。
- runes 让响应式状态显式化，且可静态分析。
- SvelteKit 在 Vite 之上提供完整的应用层（路由、SSR、form actions）。
- 第一方 AI 工具（MCP 服务器、skills、`sv add ai-tools`）弥补了 LLM 训练语料覆盖较薄的短板。

## 代价

- LLM 训练语料中的 Svelte 示例比 React 少，主要风险是模型因幻觉生成 Svelte 4 的旧写法。用官方 AI 工具降低这一风险，不凭记忆编写。
- 组件生态较小；使用 DaisyUI 或手写组件构建 UI。
- 迭代快：预发布的大版本走 `next` 通道，`latest` 始终是稳定版。除非探索新大版本本身就是项目目的，否则留在 `latest` 上。

## 版本策略

- Svelte 5 最新稳定版。组件级 `await` 表达式需要 `experimental.async`（Svelte ≥ 5.36）——实验特性，不是默认行为。
- SvelteKit 3.x `latest` 稳定版线；默认不采用 `next` 通道的预发布版。
- 需要基于类的 UI 套件时用 DaisyUI 5（Tailwind CSS v4 插件模型），否则用手写的原生 CSS 组件。

## 使用规则

- 用 `npx sv create` 搭建项目，然后运行 `npx sv add ai-tools`——它会把 Svelte MCP 工具的官方 AGENTS.md 指令写入项目。
- 注册官方 MCP 服务器（`npx -y @sveltejs/mcp`）。拿不准语法时，先调 `list-sections` 再调 `get-documentation`，绝不凭记忆猜测。每编写或修改一个组件，都要运行 `svelte-autofixer`，直到不再报错。
- 只用 runes 模式；绝不输出旧语法。具体要求：
  - 计算值用 `$derived`（或 `$derived.by`）——绝不用给状态赋值的 `$effect`；`$effect` 只作为处理真正副作用的兜底。
  - `$state` 只用于必须响应式的值；频繁整体重赋值的大对象（如 API 响应）用 `$state.raw`。
  - 把 props 当作会变化的值：用 `$derived` 从 props 派生，而不是复制进普通 `let`。
  - 事件用 `onclick={...}` 属性（绝不用 `on:click`）；用回调 props 取代 `createEventDispatcher`。
  - 用 `{#snippet}` + `{@render}` 取代插槽；`{#each}` 必须带 key（绝不用索引作 key）；`class` 用数组/对象取值，不用 `class:` 指令。
- 优先用 `<svelte:window>` / `<svelte:document>`，而不是 `onMount` 或 `$effect` 监听器；外部库同步用 `{@attach}` 而不是 `$effect`；共享状态用带类型的 `createContext`，不用共享模块状态。
- 每个项目只选一种 UI 方案：
  - 手写组件加原生 CSS——默认方案；不依赖套件，完全可控。
  - DaisyUI 5——Tailwind 插件（`@plugin "daisyui";`），语义化主题类，没有复制进项目的组件。小型应用和追求速度时优先。
- 通过 CSS 自定义属性为子组件设置样式（`<Child --color="red" />`）；`:global` 只用于第三方组件。

## 联动

- [Tailwind CSS](tailwindcss.md)——搭配：使用 DaisyUI 5 时基于 Tailwind v4；需应用其 class 排序互操作规则。
- [前端框架](frontend-framework.md)——背景：默认框架选择保持 React 优先；本文档只规定 Svelte 这一例外。
