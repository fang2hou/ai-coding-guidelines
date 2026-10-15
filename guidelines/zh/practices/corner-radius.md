---
id: practices/corner-radius
lang: zh
version: 1
source-lang: en
status: active
digest: 36a7f57c
---

# 圆角

## 原则

- 圆角是一套体系，而不是每个元素各写一个值：每个项目先定义一组少量令牌档位，所有圆角都从中取值。
- 两条规则覆盖所有场景：单个表面用连续曲率，嵌套表面用同心曲率。
- 机械地执行这两条规则。单个圆角孤立看很少显得错；错误的组合才显得廉价或割裂。

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

- 项目里的每个圆角都来自这组档位。随手写的一次性值（`13px`）无法参与嵌套运算，而且很快就会失控。
- 相邻档位必须拉开可辨识的差距（在这个尺寸下 ≥ 2px）。

## 单个表面：连续圆角

- 只用 `border-radius` 时，直边与圆弧相接，曲率突变正是普通网页圆角比苹果连续圆角显得生硬的原因。
- 把 `corner-shape` 与现有的 `border-radius` 配对使用：`border-radius` 继续决定圆角大小，`corner-shape` 只改变曲线形状。背景、边框、outline、阴影、`overflow: hidden` 和 `backdrop-filter` 都会跟随最终形状——不需要 `clip-path`，也不需要 SVG 遮罩。
- 全项目统一使用 `squircle`（= `superellipse(2)`）这一个值。圆角形状属于令牌体系的一部分，不要逐元素改变。
- 用在圆角本身构成设计决策的地方：卡片、浮层、对话框、磁贴、媒体、应用级表面（≥ `--radius-l`）。低于约 6px 时与 `round` 的差异不可见——不要在那里设置。
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

- 当一层元素位于外层半径为 `R` 的表面内侧 `p` px 处时，它的半径必须为 `r = R − p`（下限为 0）。这样两个圆角共享同一个曲率中心，内层看起来是同一块表面被抬起——而不是贴上去的一张贴纸。
- 该规则适用于 hover 与按压覆盖层（`::before` / `::after`）、焦点环、卡片上的徽章、带内边距表面中的媒体和控件、分段控件、tooltip。
- 不匹配的嵌套——内外半径相等，或内层取任意值——正是 hover 状态和徽章看起来像割裂外来层的原因。

### 标准实现方式

- 覆盖层位于 `inset: 0`：用 `border-radius: inherit`。
- 内缩距离等于表面内边距：用同一组令牌以 `calc()` 计算。
- 控件外侧的焦点环：用 `outline` 或 `box-shadow`——两者都会自动跟随外层半径。
- 宽度为 `w` 的边框画在圆角盒子上：内边缘已经按 `R − w` 绘制；不要再额外加圆角。

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
  border-radius: var(--radius-xl);
  padding: 12px;
}
.card .media {
  /* 20 - 12 = 8: same center of curvature as the card */
  border-radius: calc(var(--radius-xl) - 12px);
}
```

- 无法精确匹配时（任意图形、位图边缘），宁紧勿松：保持 `r ≤ R − p`。略紧的内角看起来是有意为之；偏松的内角看起来是坏的。

## 检查清单

- diff 中的每个圆角都来自令牌档位。
- 控件使用中等档位；全圆只出现在 chip、标签和身份元素上。
- 每个嵌套层要么满足 `r = R − p`，要么继承半径，要么使用 `outline` / `box-shadow`。
- ≥ `--radius-l` 的表面设置了 `corner-shape: squircle`；没有为它引入 polyfill。

## 联动

- [编码标准](coding-standards.md)——背景：圆角档位是“禁止魔法值”规则的一个实例。
- [Tailwind CSS](../libraries/tailwindcss.md)——搭配（视情况）：使用 Tailwind 的项目把档位表达为主题令牌；同心规则不变。
- [Liquid Glass 设计](../platforms/liquid-glass-design.md)——背景：在苹果平台上使用系统自带的连续圆角 API，而不是网页近似方案。
