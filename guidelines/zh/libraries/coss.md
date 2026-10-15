---
id: libraries/coss
lang: zh
version: 3
source-lang: en
status: active
digest: 84865aab
---

# coss ui

## 结论

视情况采用——coss ui 是显式选择它的项目所用的复制式组件系统。默认方案是用原生 CSS 编写自己的组件。

## 适用场景

- 用户明确为项目选择 coss ui 作为组件系统。
- 项目已在使用 coss ui。

## 不适用场景

- 新项目没有明确的 coss ui 需求——用原生 CSS 构建 UI。

## 优势

- 组件以源码形式复制到仓库，通过 shadcn CLI 从 `@coss` registry 安装；shadcn MCP 工具也可直接操作这些组件。
- 原生基于 Base UI 构建，使用 Tailwind CSS v4 设置样式。
- 精选的 particle 目录：每个原语都提供贴近生产环境的组合示例。
- 官方迁移指南逐组件说明 API 差异，覆盖基于 Radix 的既有代码。

## 代价

- 生态规模和采用率低于主流 React 组件库。
- API 与 Radix 并非一一对应（触发器组合、Select items、Slider 取值等）；现有基于 Radix 的代码必须迁移，不能只改 import。
- 本指南禁止直接修改已安装组件；因此，所有定制从一开始就必须规划为组合、包装或主题化。

## 版本策略

- 需要 Tailwind CSS v4 和 Base UI；跟踪 registry 的最新状态。
- 组件通过 shadcn CLI（`pnpm dlx shadcn@latest add`）更新，不按 npm 包版本更新。

## 使用规则

### 安装与工具链

- 通过 shadcn CLI 安装组件：`pnpm dlx shadcn@latest add @coss/<component>`；通过 `pnpm dlx shadcn@latest init @coss/style` 初始化项目。
- 进行 coss ui 开发时，安装 agent skill：`pnpm dlx skills add cosscom/coss`。默认安装到项目范围内；只有用户要求时才全局安装。
- 优先使用 shadcn MCP 工具或 shadcn CLI，而不是手工复制文件；如果本地可能已有该组件，先用 `--dry-run` 或 `--diff` 预览。
- 初始化项目时遵循 coss ui 官方文档。

### 绝不修改已安装的组件

- 绝不编辑已安装的 coss ui 组件文件。没有“记录改动即可例外”的做法：`components/ui` 必须完全保持 registry 安装后的状态。
- 定制应通过组件组合、包装组件、主题变量和设计令牌，或使用官方 `*Primitive` 导出来实现。
- 不要照搬 Radix 的模式；遵循官方迁移指南（`asChild` 改为 `render`、`onSelect` 改为 `onClick`、Select 以 items 为先、ToggleGroup 使用 `multiple`、Slider 使用标量值）。

### 组件路径与结构

- coss ui 组件安装到 `components/ui`，并保持在该目录；该路径属于上游。
- 应用组件与 `components/ui` 并列放在 `components/` 下，按 Atomic Design Methodology 组织到子目录中：`atoms/`、`molecules/`、`organisms/`，只有应用确有需要时才添加 `templates/` 和 `pages/`。
- 在 `.oxlintrc.json` 和 `.oxfmtrc.json` 的 `ignorePatterns` 中加入 `components/ui/**`，将其排除在 `oxlint` 和 `oxfmt` 的处理范围之外。

### 组件复用

- 编写自定义标记前，先查阅组件目录和 particle 示例。
- 在合理范围内尽量使用 coss ui 组件；通过组合这些组件构建应用专属 UI。

## 联动

- [Tailwind CSS](tailwindcss.md)——依赖：coss ui 用 Tailwind CSS v4 完成样式。
- [前端框架：Vite 与 Next.js](frontend-framework.md)——配合：无论项目使用 Vite 还是 Next.js，coss ui 都适用。
