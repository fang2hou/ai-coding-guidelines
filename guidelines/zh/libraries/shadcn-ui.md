---
id: libraries/shadcn-ui
lang: zh
version: 3
source-lang: en
status: active
digest: d15942be
---

# shadcn/ui

## 结论

优先采用——shadcn/ui 是 Tailwind 应用的首选组件系统。

## 适用场景

- 构建 Tailwind 应用且需要 UI 组件。
- 启动新项目时，用户未明确指定其他组件库或版本。

## 不适用场景

- 用户明确要求使用其他组件库或版本——以用户要求为准。
- 项目不使用 Tailwind CSS;shadcn/ui 是面向 Tailwind 应用的组件系统。

## 优势

- 组件以源码形式复制进仓库，完全可检视、可调整。
- 减少开发成本、维护成本、视觉不一致、升级冲突，以及 AI 生成重复组件的问题。
- 官方变体与配置机制覆盖大部分定制需求，无需改动组件内部。

## 代价

- 复制进来的组件可能与上游漂移；改动组件内部会带来升级风险。
- 要让组件持续贴近官方实现，需要保持纪律。

## 版本策略

- 新项目优先采用最新适用的 shadcn/ui 配置。
- 用户明确要求使用其他组件库或版本时，以用户要求为准。

## 使用规则

- 初始化项目时遵循 shadcn/ui 官方文档。

### 原语层（Radix / Base UI / React Aria）

- shadcn/ui 的每个组件都有多个底层原语实现。Base UI 自 2026 年 7 月起是官方默认，也是本指南的偏好；Radix 与 React Aria 仍然可用。
- 新项目保持默认的 Base UI 层；除非用户明确要求，不要改用 Radix 或 React Aria。
- 存量 Radix 项目继续使用 Radix；迁移是可选项，绝非必须。仅在用户明确要求时迁移，使用官方迁移 skill，一次迁移一个组件。

### 组件路径与结构

- shadcn/ui 组件安装到 `components/ui` 并留在该目录；该路径归上游所有。
- 应用自有组件与它并列，放在 `components/` 之下，按 Atomic Design Methodology 组织子目录：`atoms/`、`molecules/`、`organisms/`，应用确有需要时再加 `templates/` 和 `pages/`。
- 绝不把自定义组件放进 `components/ui`；上游目录与第一方代码保持分离。

示例：

```text
components/
  ui/            # shadcn/ui — upstream-owned
    button.tsx
    dialog.tsx
  atoms/
    price-tag.tsx
  molecules/
    search-field.tsx
  organisms/
    product-table.tsx
```

### 组件复用

- 在合理范围内尽量使用 shadcn/ui 组件。
- 创建自定义组件前，先确认 shadcn/ui 是否已提供合适的基础组件或现成组件。
- 优先使用现成组件及其组合、官方变体和官方配置机制，避免不必要的自定义实现。
- 目的在于减少开发成本、维护成本、视觉不一致、升级冲突，以及 AI 生成重复组件的问题。

### 避免不必要的修改

- 下载的组件应保持贴近官方实现。
- 凡是能通过主题变量、Tailwind 配置、组件组合、现有组件 API、标准变体、包装组件或受支持的设计令牌完成的改动，都不要靠修改组件内部实现。
- 涉及主色、主题配置、排版、markdown 渲染、字号或组件变体等改动时，先查阅 shadcn/ui 官方文档及相关 Tailwind 文档，再考虑直接编辑组件内部。

### 记录必要的改动

- 下载的组件确实需要自定义内部改动时，记录改了哪个组件、改了什么、为什么必须改、该改动会带来什么升级风险。
- 将这些信息保存在仓库内的 Markdown 文档中，以便后续开发者与 AI Agent 在升级 shadcn/ui 时理解这些偏离。

### 将下载组件排除在 Lint 与格式化范围之外

- `components/ui` 是复制进仓库的上游源码，不是第一方代码；将该路径排除出 `oxlint` 与 `oxfmt` 的处理范围，让工具输出聚焦在项目自己的代码上。
- 把 `components/ui/**` 加到 `ignorePatterns` 里，`.oxlintrc.json` 与 `.oxfmtrc.json` 各加一条。两个工具都推荐用配置文件里的 `ignorePatterns`，而不是单独的 ignore 文件；排除之后，升级的 diff 里也不会混入 Lint 与格式化改动。

```json
{ "ignorePatterns": ["components/ui/**"] }
```

### 工具链：MCP 或 CLI

- 组件的添加与更新通过 shadcn CLI 或 shadcn MCP 工具完成；工具可用时，不要手工复制组件文件。
- 开发环境支持 MCP 时，优先使用官方 shadcn MCP 集成；同一套工具可直接操作 `components.json` 中配置的任何 shadcn 兼容 registry。
- 用户环境支持 MCP、正在使用 shadcn/ui 但尚未配置 MCP 集成时，Agent 可协助完成配置。
- 本地可能已有同名组件时，先用 `--dry-run` 或 `--diff` 预览变更。

## 联动

- [Tailwind CSS](tailwindcss.md)——依赖：shadcn/ui 是面向 Tailwind 应用的组件系统。
- [前端框架：Vite 与 Next.js](frontend-framework.md)——配合：无论项目使用 Vite 还是 Next.js,shadcn/ui 均可使用。
- [coss ui](coss.md)——备选：同一套 registry 模型与工具链，可互换；shadcn/ui 仍为首选默认。
