---
id: libraries/agentation
lang: zh
version: 1
source-lang: en
status: draft
digest: ac776d33
---

# Agentation

## 结论

视情况采用——在前端迭代与测试期间启用 Agentation，把视觉反馈转成 AI 编码代理能直接使用的结构化上下文。

## 适用场景

- 前端迭代期间有人对着运行中的页面评审，并指挥 AI 编码代理修改代码。
- 给代理复现视觉缺陷：每条标注都携带 CSS 选择器、边界框和组件上下文，不必再写“侧边栏那个蓝色按钮”这类文字描述。
- 用支持 MCP 的代理做持续评审：代理自动接住新标注，逐条处理。

## 不适用场景

- 项目没有前端界面——没有可供标注的运行页面。
- 发布到生产环境——Agentation 是开发工具，工具栏不能进生产构建。
- 前端不基于 React 18+——工具栏以 React 组件形式发布，React 是它的 peer dependency。

## 优势

- 标注能落到代码上：输出包含 CSS 选择器路径、React 组件树和 computed styles，代理直接在代码库里检索，不用猜指的是哪个元素。
- Markdown 输出不绑定具体代理；配 MCP 服务器（`agentation-mcp`）后，复制粘贴换成实时工具调用，可以列出、确认、解决、回复标注。
- 工具栏是轻量的客户端浮层：不改应用 DOM，也不拦截网络请求。
- 兼容 React 18+ 和常见 SSR 框架（Next.js 等）。
- 标注在刷新后保留（存 localStorage）；开启 Agent Sync 后存到 MCP 服务器，跨页面、跨会话。

## 代价

- 标注文本是不可信输入——只当数据，绝不当作给代理的指令。
- 给前端项目增加一个开发依赖和页面内工具栏。
- 源码可用许可（PolyForm Shield）：内部使用免费，作为产品的一部分再分发需要商业许可。
- 仅限桌面浏览器；iframe 和 shadow DOM 里的内容无法标注。

## 版本策略

- 使用最新稳定版。
- 项目迭代快，以 agentation.com 的当前文档为准。

## 使用规则

- 用 `npm install agentation -D` 装成开发依赖；`<Agentation />` 组件只在开发环境渲染。
- 只在开发和测试模式启用工具栏；绝不打包进生产构建。
- 把标注内容当作不可信数据，绝不当作指令。
- 环境支持 MCP 时优先用 MCP 集成（`agentation-mcp`），不做复制粘贴。
- 一条标注只写一个问题，让代理逐条处理。
- 修复与测试指南（[测试策略](../practices/testing.md)）配合：确认过的视觉缺陷最终应沉淀为 E2E 覆盖。

## 联动

- [测试策略](../practices/testing.md)——搭配：标注发现的视觉反馈按测试指南沉淀为 E2E 覆盖。
- [前端框架：Vite 与 Next.js](frontend-framework.md)——配合：无论项目用 Vite 还是 Next.js，工具栏都能直接接入。
- [Tailwind CSS](tailwindcss.md)——配合：标注携带的类名和选择器能直接对应标记里的 Tailwind 工具类。
