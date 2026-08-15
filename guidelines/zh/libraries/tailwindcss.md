---
id: libraries/tailwindcss
lang: zh
version: 2
source-lang: en
status: active
digest: 2b6b6b36
---

# Tailwind CSS

## 结论

优先采用——Tailwind CSS 是前端项目的首选 CSS 框架。

## 适用场景

- 默认用于任何前端项目的样式开发。
- 构建 Tailwind 应用，且组件系统采用 [shadcn/ui](shadcn-ui.md)。

## 不适用场景

- 用户明确要求使用其他 CSS 框架——以用户要求为准。
- 用户明确要求采用项目特有的样式架构——以用户要求为准。

## 优势

- 工具类优先(utility-first)的写法让样式与标记放在一起，避免自定义样式表越积越大。
- 在 React 生态中应用广泛，也是 shadcn/ui 的样式基础。
- 主题与设计令牌在每个大版本内集中于一处配置。

## 代价

- 工具类写在标记里显得冗长，组件内部容易杂乱。
- 各大版本的约定与配置模型互不兼容；混用会导致漂移。

## 版本策略

- 新项目优先使用最新稳定版 Tailwind CSS。
- 不要因为旧教程、旧模板或旧代码片段使用旧版本，就自动降级 Tailwind。
- 用户明确要求使用其他 Tailwind 版本时，以用户要求为准。

## 使用规则

- 前端项目默认使用 Tailwind CSS 作为 CSS 框架。
- 用户明确要求使用其他 Tailwind 版本、其他 CSS 框架或项目特有样式架构时，以用户要求为准。
- 遵循所选 Tailwind 版本的约定与配置模型。
- 不要混用来自互不兼容大版本的模式。

### 类名 Lint 与排序互操作

- 将 `oxlint-tailwindcss` 安装为开发依赖，并通过 `.oxlintrc.json` 的 `jsPlugins` 数组加载。
- 将 `settings.tailwindcss.entryPoint` 指向项目的 Tailwind v4 CSS 入口——即引入 `tailwindcss` 并声明 `@theme` 设计令牌的文件。该设置必填且必须显式指定；插件不做文件系统自动探测。
- 启用 `oxlint-tailwindcss/enforce-sort-order`，其排序结果与官方 Tailwind 类顺序一致。
- 把 `.oxfmtrc.json` 中 oxfmt 的 `sortTailwindcss.stylesheet` 指向同一个 CSS 文件，让 Lint 工具和 oxfmt 基于同一套设计系统。否则 oxfmt 读取的是 `tailwindcss` 包内置的 `theme.css`，在自定义 `@theme` 令牌的排序上与 Lint 工具不一致。

```jsonc
// .oxlintrc.json
{
  "jsPlugins": ["oxlint-tailwindcss"],
  "rules": {
    "tailwindcss/enforce-sort-order": "warn"
  },
  "settings": {
    "tailwindcss": {
      "entryPoint": "src/styles.css"
    }
  }
}

// .oxfmtrc.json
{
  "sortTailwindcss": {
    "stylesheet": "./src/styles.css"
  }
}
```

## 联动

- [shadcn/ui](shadcn-ui.md)——搭配：shadcn/ui 是 Tailwind 应用的首选组件系统，且依赖 Tailwind。
