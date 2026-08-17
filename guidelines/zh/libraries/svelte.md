---
id: libraries/svelte
lang: zh
version: 1
source-lang: en
status: active
digest: 3b630e05
---

# Svelte（Svelte 5 + SvelteKit）

## 结论

视情况采用——Svelte 5 加 SvelteKit 允许用于以开发乐趣为目标的小型个人项目和实验项目。它不是默认选择：生产前端仍使用[前端框架](frontend-framework.md)中选定的 React 技术栈。

## 适用场景

- 项目是个人项目、原型或玩具项目——把乐趣当作目标是正当的。
- 用户明确要求使用 Svelte。

## 不适用场景

- 团队或客户的生产项目，AI 产出效率和生态广度很重要。
- 项目需要 React 和 shadcn/ui 生态的广度。

## 优势

- 主流组件框架中样板代码最少；编译产物具备细粒度响应性和更小的包体积。
- runes 让响应式状态显式化，且可静态分析。
- SvelteKit 在 Vite 之上提供完整的应用层（路由、SSR、form actions）。
- 第一方 AI 工具（MCP 服务器、skills、`sv add ai-tools`）弥补了 LLM 训练语料覆盖较薄的短板。

## 代价

- LLM 训练语料覆盖比 React 薄；主要风险是幻觉出 Svelte 4 的旧模式。用官方 AI 工具缓解，绝不靠记忆。
- 组件生态较小；UI 工作交给 DaisyUI 或 shadcn-svelte。
- 迭代快：SvelteKit 3.0 处于预发布阶段。除非探索新大版本本身就是项目目的，否则留在稳定版线上。

## 版本策略

- Svelte 5 最新稳定版。组件级 `await` 表达式需要 `experimental.async`（Svelte ≥ 5.36）——实验特性，不是默认行为。
- SvelteKit ≥ 2.70 稳定版线；默认不采用 3.0 预发布版。
- DaisyUI 5（Tailwind CSS v4 插件模型）或 shadcn-svelte 最新版（runes 原生、Tailwind v4）。

## 使用规则

- 用 `npx sv create` 搭建项目，然后运行 `npx sv add ai-tools`——它会把 Svelte MCP 工具的官方 AGENTS.md 指令写入项目。
- 注册官方 MCP 服务器（`npx -y @sveltejs/mcp`）。语法不确定时，先 `list-sections` 再 `get-documentation`——绝不凭记忆猜测。每写完或改完一个组件，都运行 `svelte-autofixer`，直到没有任何发现。
- 只用 runes 模式；绝不输出旧语法。具体要求：
  - 计算值用 `$derived`（或 `$derived.by`）——绝不用给状态赋值的 `$effect`；`$effect` 只作为处理真正副作用的兜底。
  - `$state` 只用于必须响应式的值；频繁整体重赋值的大对象（如 API 响应）用 `$state.raw`。
  - 把 props 当作会变化的值：用 `$derived` 从 props 派生，而不是复制进普通 `let`。
  - 事件用 `onclick={...}` 属性（绝不用 `on:click`）；用回调 props 取代 `createEventDispatcher`。
  - 用 `{#snippet}` + `{@render}` 取代插槽；`{#each}` 必须带 key（绝不用索引作 key）；`class` 用数组/对象取值，不用 `class:` 指令。
- 优先用 `<svelte:window>` / `<svelte:document>`，而不是 `onMount` 或 `$effect` 监听器；外部库同步用 `{@attach}` 而不是 `$effect`；共享状态用带类型的 `createContext`，不用共享模块状态。
- 每个项目只选一个 UI 套件：
  - DaisyUI 5——Tailwind 插件（`@plugin "daisyui";`），语义化主题类，没有复制进项目的组件。小型应用和追求速度时优先。
  - shadcn-svelte——CLI 复制的 runes 原生组件，基于 Tailwind v4。需要深度定制或 shadcn 风格的组合时优先。
- 通过 CSS 自定义属性为子组件设置样式（`<Child --color="red" />`）；`:global` 只用于第三方组件。

## 联动

- [Tailwind CSS](tailwindcss.md)——搭配：DaisyUI 和 shadcn-svelte 都基于 Tailwind v4；需应用其 class 排序互操作规则。
- [前端框架](frontend-framework.md)——背景：默认框架选择保持 React 优先；本文档只规定 Svelte 这一例外。
