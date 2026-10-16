---
id: libraries/tailwindcss
lang: zh
version: 4
source-lang: en
status: active
digest: 49c6f5b7
---

# Tailwind CSS

## 结论

视情况采用——项目已在用 Tailwind，或组件套件依赖 Tailwind 时才使用。新的样式开发默认使用原生 CSS。

## 适用场景

- 项目已在使用 Tailwind CSS。
- 所选组件套件依赖 Tailwind（如 DaisyUI），或用户明确要求使用。

## 不适用场景

- 新的 UI 工作没有 Tailwind 需求——用原生 CSS 完成样式：自定义属性、嵌套、`:has()`、容器查询、`light-dark()`。
- 用户明确要求使用其他 CSS 框架或项目特有的样式架构——以用户要求为准。

## 优势

- 工具类（utility class）让样式直接写在标记旁，避免自定义样式表不断膨胀。
- 在 React 生态中应用广泛。
- 每个大版本都可以在一处配置主题和设计令牌。

## 代价

- 工具类写在标记里显得冗长，组件内部容易杂乱。
- 不同大版本的约定和配置模型彼此不兼容；混用会导致配置和实现逐渐偏离。

## 版本策略

- 新项目优先使用最新稳定版 Tailwind CSS。
- 不要因为旧教程、旧模板或旧代码片段使用旧版本，就自动降级 Tailwind。
- 用户明确要求使用其他 Tailwind 版本时，以用户要求为准。

## 使用规则

- 默认使用原生 CSS；没有明确需求时，不要在尚未使用 Tailwind 的项目中引入它。
- 遵循项目所用 Tailwind 大版本的约定与配置模型，切勿混用不同大版本的写法。

### 类名 Lint 与排序工具互操作

- 将 `oxlint-tailwindcss` 安装为开发依赖，并通过 `.oxlintrc.json` 的 `jsPlugins` 数组加载。
- 将 `settings.tailwindcss.entryPoint` 指向项目的 Tailwind v4 CSS 入口，即引入 `tailwindcss` 并声明 `@theme` 设计令牌的文件。该设置为必填项，且必须显式指定；插件不会自动探测文件系统。
- 启用 `oxlint-tailwindcss/enforce-sort-order`，以采用 Tailwind 官方的类名排序顺序。
- 将 `.oxfmtrc.json` 中 oxfmt 的 `sortTailwindcss.stylesheet` 指向同一个 CSS 文件，使 Lint 工具和 oxfmt 使用同一设计系统。否则，oxfmt 会读取 `tailwindcss` 包内置的 `theme.css`，在自定义 `@theme` 令牌的排序上与 Lint 工具产生不一致。

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

- [圆角](../practices/corner-radius.md)——通用：使用 Tailwind 时，把圆角档位定义为 Tailwind 主题令牌。
