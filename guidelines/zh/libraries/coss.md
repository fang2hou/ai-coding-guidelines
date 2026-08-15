---
id: libraries/coss
lang: zh
version: 1
source-lang: en
status: active
digest: 52cd1418
---

# coss ui

## 结论

次选——coss ui 是排在 [shadcn/ui](shadcn-ui.md) 之后的获批第二选项；新项目绝不默认选用。

## 适用场景

- 用户为项目明确选择 coss ui 作为组件系统。
- 项目已在使用 coss ui。

## 不适用场景

- 新项目没有明确的 coss ui 需求——使用 shadcn/ui。
- 项目已在用 shadcn/ui，且用户未要求迁移。

## 优势

- 与 shadcn/ui 同一套分发模型和工具链：组件以源码形式复制进仓库，通过 shadcn CLI（`@coss` registry）安装；shadcn MCP 工具可直接操作。
- 原生构建在 Base UI 之上——正是 shadcn/ui 当前的默认底层——并用 Tailwind CSS v4 完成样式。
- 精选的 particle 目录：每个原语都有贴近生产的组合示例。
- 官方提供 Radix/shadcn 迁移指南，逐组件说明 API 差异。

## 代价

- 生态规模与采用度小于 shadcn/ui。
- API 与 shadcn/Radix 不是一一对应（触发器组合、Select items、Slider 取值等）；既有 shadcn 代码必须迁移，不能只改 import。
- 本指南完全禁止修改已安装组件，任何定制都要从一开始就按组合、包装或主题化的方式规划。

## 版本策略

- 依赖 Tailwind CSS v4 与 Base UI；跟随 registry 的最新状态。
- 组件通过 shadcn CLI（`npx shadcn@latest add`）更新，而不是通过 npm 包版本。

## 使用规则

### 安装与工具链

- 用 shadcn CLI 安装组件：`npx shadcn@latest add @coss/<component>`；项目初始化用 `npx shadcn@latest init @coss/style`。
- 从事 coss ui 相关工作时安装 agent skill：`npx skills add cosscom/coss`。默认装到项目内；仅当用户要求时才装到全局。
- 优先使用 shadcn MCP 工具或 shadcn CLI，而不是手工复制文件；本地可能已有同名组件时，先用 `--dry-run` 或 `--diff` 预览。
- 初始化项目时遵循 coss ui 官方文档。

### 绝不修改已安装的组件

- 绝不编辑已安装的 coss ui 组件文件。与 shadcn/ui 不同，这里没有“记录例外”通道：`components/ui` 保持与 registry 安装时的输出一致。
- 定制一律通过组件组合、包装组件、主题变量与设计令牌，或官方 `*Primitive` 导出实现自定义组合。
- 不要照搬 shadcn/Radix 的写法；遵循官方迁移指南（`asChild` 改为 `render`、`onSelect` 改为 `onClick`、Select 用 items 优先、ToggleGroup 用 `multiple`、Slider 用标量取值）。

### 组件路径与结构

- coss ui 组件安装到 `components/ui` 并留在该目录；该路径归上游所有。
- 应用自有组件与它并列，放在 `components/` 之下，按 Atomic Design Methodology 组织子目录：`atoms/`、`molecules/`、`organisms/`，应用确有需要时再加 `templates/` 和 `pages/`——与 [shadcn/ui](shadcn-ui.md) 相同。
- 与 shadcn/ui 相同，把 `components/ui/**` 加进 `.oxlintrc.json` 与 `.oxfmtrc.json` 的 `ignorePatterns`，排除出 `oxlint` 与 `oxfmt` 的处理范围。

### 组件复用

- 写自定义标记之前，先查组件目录与 particle 示例。
- 在合理范围内尽量使用 coss ui 组件；应用特定 UI 用它们的组合来搭建。

## 联动

- [Tailwind CSS](tailwindcss.md)——依赖：coss ui 用 Tailwind CSS v4 完成样式。
- [shadcn/ui](shadcn-ui.md)——备选：同一套 registry 模型与工具链，可互换；shadcn/ui 仍为默认，coss ui 是次选。
- [前端框架：Vite 与 Next.js](frontend-framework.md)——配合：无论项目使用 Vite 还是 Next.js,coss ui 均可使用。
