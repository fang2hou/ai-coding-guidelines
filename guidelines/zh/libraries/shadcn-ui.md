---
id: libraries/shadcn-ui
lang: zh
version: 3
source-lang: en
status: active
digest: efbe3cf9
---

# shadcn/ui

## 结论

优先——对于基于 Tailwind 的应用，shadcn/ui 是首选组件系统。

## 适用场景

- 构建基于 Tailwind、需要 UI 组件的应用。
- 启动新项目，且用户未明确指定其他组件库或版本。

## 不适用场景

- 用户明确要求使用其他组件库或版本——以用户要求为准。
- 项目不使用 Tailwind CSS；shadcn/ui 是面向基于 Tailwind 的应用的组件系统。

## 优势

- 组件以源码形式复制到仓库，便于完整查看和调整。
- 降低开发和维护成本，避免视觉不一致、升级冲突和 AI 生成重复组件。
- 官方变体和配置机制已覆盖大多数定制需求，无需修改组件内部实现。

## 代价

- 复制的组件可能逐渐偏离上游；修改内部实现会增加升级风险。
- 需要主动维护组件，使其保持接近官方实现。

## 版本策略

- 新项目优先采用最新适用的 shadcn/ui 配置。
- 用户明确要求使用其他组件库或版本时，以用户要求为准。

## 使用规则

- 初始化项目时遵循 shadcn/ui 官方文档。

### 原语层（Radix / Base UI / React Aria）

- shadcn/ui 为每个组件提供多个底层原语层。自 2026 年 7 月起，Base UI 是上游默认层，也是本指南的首选；Radix 与 React Aria 仍然可用。
- 新项目应保留默认的 Base UI 层；除非用户明确要求，不要改用 Radix 或 React Aria。
- 现有 Radix 项目继续使用 Radix；迁移是可选项，并非必需。只有用户明确要求时才迁移，并使用官方迁移 skill，一次迁移一个组件。

### 组件路径与结构

- shadcn/ui 组件安装到 `components/ui`，并保持在该目录；该路径属于上游。
- 应用组件与 `components/ui` 并列放在 `components/` 下，按 Atomic Design Methodology 组织到子目录中：`atoms/`、`molecules/`、`organisms/`，只有应用确有需要时才添加 `templates/` 和 `pages/`。
- 禁止将自定义组件放进 `components/ui`；上游目录与项目自有代码保持分离。

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
- 优先使用现有组件、现有组件的组合、官方变体和官方配置机制，避免不必要的自定义实现。
- 这样做是为了降低开发和维护成本，避免视觉不一致、升级冲突和 AI 生成重复组件。

### 避免不必要的修改

- 下载的组件应尽量保持与官方实现一致。
- 如果改动可以通过主题变量、Tailwind 配置、组件组合、现有组件 API、标准变体、包装组件或受支持的设计令牌实现，就不要修改组件内部。
- 涉及主色、主题配置、排版、markdown 渲染、字号或组件变体等改动时，先查阅 shadcn/ui 官方文档和相关 Tailwind 文档，再考虑直接编辑组件内部。

### 记录必要的改动

- 如果下载的组件确实需要修改内部实现，记录修改了哪个组件、改了什么、为什么必须改，以及该改动会带来什么升级风险。
- 将这些信息保存在仓库内的 Markdown 文档中，让后续开发者和 AI Agent 在升级 shadcn/ui 时了解这些差异。

### 将下载的组件排除在 Lint 与格式化范围之外

- `components/ui` 是纳入仓库的上游源码，不属于项目自有代码；将该路径从 `oxlint` 和 `oxfmt` 的处理范围中排除，让工具输出只关注项目代码。
- 分别在 `.oxlintrc.json` 和 `.oxfmtrc.json` 的 `ignorePatterns` 中加入 `components/ui/**`。两个工具都建议优先在配置文件中使用 `ignorePatterns`，而不是单独的 ignore 文件；这样升级 diff 就不会混入 Lint 和格式化改动。

```json
{ "ignorePatterns": ["components/ui/**"] }
```

### 工具链：MCP 或 CLI

- 添加和更新组件时，使用 shadcn CLI 或 shadcn MCP 工具；工具可用时，不要手工复制组件文件。
- 开发环境支持 MCP 时，优先使用官方 shadcn MCP 集成；同一套工具可直接操作 `components.json` 中配置的任何 shadcn 兼容 registry。
- 如果用户使用的环境支持 MCP，且正在使用 shadcn/ui 但尚未配置 MCP 集成，Agent 可以协助完成配置。
- 本地可能已有同名组件时，先用 `--dry-run` 或 `--diff` 预览变更。

## 联动

- [Tailwind CSS](tailwindcss.md)——依赖：shadcn/ui 是 Tailwind 应用的组件系统。
- [前端框架：Vite 与 Next.js](frontend-framework.md)——配合：无论项目使用 Vite 还是 Next.js，shadcn/ui 都适用。
- [coss ui](coss.md)——备选：二者使用同一套 registry 模型和工具链，可以互换；shadcn/ui 仍是默认首选。
