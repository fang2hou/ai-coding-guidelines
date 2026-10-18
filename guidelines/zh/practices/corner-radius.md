---
id: practices/corner-radius
lang: zh
version: 2
source-lang: en
status: active
digest: 48fdb75e
---

# 圆角

## 原则

- 圆角是一套体系，不要给每个元素单独写死数值：项目只需定义几个固定的设计令牌档位，所有圆角都从中选取。
- 两条规则涵盖所有情况：单层表面用连续圆角，嵌套表面用同心圆角。
- 严格执行这两条规则。单个圆角孤立看很少出错，但错误地组合在一起就会显得粗糙、割裂。

## 圆角档位

```css
:root {
  --radius-s: 6px;       /* dense rows, chips */
  --radius-m: 8px;       /* buttons, inputs — the default control radius */
  --radius-l: 12px;      /* popovers, menus */
  --radius-xl: 20px;     /* cards, sheets, dialogs */
  --radius-full: 9999px; /* circles, pills */
}
```

- 项目中的所有圆角都取自这组档位。单独写死数值（如 `13px`）会绕过用于计算嵌套圆角的共享令牌，容易造成不一致。
- 相邻档位必须拉开可辨识的差距（在这个尺寸下 ≥ 2px）。

## 单个表面：连续圆角

- 只用 `border-radius` 时，直边与圆弧相接，曲率突变正是普通网页圆角比苹果连续圆角显得生硬的原因。
- 把 `corner-shape` 与现有的 `border-radius` 配对使用：`border-radius` 继续决定圆角大小，`corner-shape` 只改变曲线形状。背景、边框、outline、阴影、`overflow: hidden` 和 `backdrop-filter` 都会跟随最终形状——不需要 `clip-path`，也不需要 SVG 遮罩。
- 全项目统一使用 `squircle`（= `superellipse(2)`）这一个值。圆角形状属于令牌体系的一部分，不要逐元素改变。
- 用在圆角形状明显影响外观的地方：卡片、浮层、对话框、磁贴、媒体、应用级表面（≥ `--radius-l`）。低于约 6px 时与 `round` 的差异不可见——不要在那里设置。
- 只做渐进增强：截至 2026 年末，只有基于 Chromium 的浏览器（139+）会渲染 `corner-shape`；Safari 和 Firefox 会忽略它并回退到普通圆角。这种回退可以接受。绝不为此引入 JS 或 SVG polyfill。
- `border-radius` 为 `0` 时，`corner-shape` 不产生任何效果。

```css
.card {
  border-radius: var(--radius-xl);
  corner-shape: squircle;
}
```

## 按钮与控件：中等圆角

- 按钮、输入框、下拉框默认使用中等档位（`--radius-m`，在 36–40px 控件高度上约为 8px）。紧凑布局可以使用浅档（`--radius-s`）作为下限。
- 中等圆角保留了一段平直边缘，让文字和相邻控件对齐，也为控件内部的 hover 和按压状态留出保持同心的空间。
- 全圆（`--radius-full`）按钮只用于 chip、标签和身份元素（头像、开关）。不要用于操作按钮。

## 嵌套表面：同心规则

- 当内层元素距离外层表面（半径 `R`）边缘的间距为 `p` px 时，内层半径应为 `r = R − p`（最小为 0）。这样内外圆角共享同一个圆心，内层看起来与外层属于同一个表面。
- 该规则适用于 hover 与按压浮层（`::before` / `::after`）、焦点环、卡片上的徽章、带内边距容器中的媒体和控件、分段控件以及 tooltip。
- 内外半径相等或内层随意取值，都会破坏同心关系，让 hover 状态和徽章与周围表面显得不协调。

### 常见场景

- 覆盖层位于 `inset: 0`：用 `border-radius: inherit`。
- 内缩距离等于表面内边距：用同一组令牌以 `calc()` 计算。
- 控件外侧的焦点环：用 `outline` 或 `box-shadow`——两者都会自动跟随外层半径。
- 宽度为 `w` 的边框画在圆角盒子上：内边缘已经按 `R − w` 绘制；不要再额外加圆角。
- 嵌套在设置了 `corner-shape` 的表面内部的层：用 `corner-shape: inherit` 在内层设置相同形状——该属性默认不继承；外层 squircle 配内层普通圆角会破坏同心观感。

```css
.button {
  border-radius: var(--radius-m);
}
.button::before {
  /* hover fill */
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit; /* concentric by construction */
}

.card {
  --card-inset: 12px;
  border-radius: var(--radius-xl);
  corner-shape: squircle;
  padding: var(--card-inset);
}
.card .media {
  /* 20 - 12 = 8: same center of curvature and same curve family as the card */
  border-radius: calc(var(--radius-xl) - var(--card-inset));
  corner-shape: inherit;
}
```

- 遇到位图边缘或特殊图形、无法精确对齐时，宁小勿大：保持 `r ≤ R − p`。内层圆角稍微收紧一点显得利落，偏大则会显得错位。

## 检查清单

- diff 中的每个圆角都来自令牌档位。
- 控件使用中等档位；全圆只出现在 chip、标签和身份元素上。
- 每个嵌套层要么满足 `r = R − p`，要么继承半径，要么使用 `outline` / `box-shadow`。
- 位于设置了 `corner-shape` 的表面内部的层使用相同的角形状（`corner-shape: inherit`）。
- ≥ `--radius-l` 的表面设置了 `corner-shape: squircle`；没有为它引入 polyfill。

## 联动

- [编码标准](coding-standards.md)——背景：圆角档位是“禁止魔法值”规则的一个实例。
- [Tailwind CSS](../libraries/tailwindcss.md)——搭配（视情况）：使用 Tailwind 的项目把档位表达为主题令牌；同心规则不变。
- [Liquid Glass 设计](../platforms/liquid-glass-design.md)——背景：在苹果平台上使用系统自带的连续圆角 API，而不是网页近似方案。
