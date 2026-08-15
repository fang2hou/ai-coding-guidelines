---
id: toolchain/typescript
lang: zh
version: 5
source-lang: en
status: active
digest: e7a04176
---

# TypeScript 工具链

## 强制要求

TypeScript 是 AI 辅助产品开发的默认语言，其库生态与 agent 生态支持在现有语言中最强。

语言优先级：

- TypeScript 和 Python 是 AI 辅助开发的默认语言，因为二者的库生态与 agent 生态支持最强。
- Python 仅用于 [Python 工具链](../toolchain/python.md)中列出的正当场景。
- Go 与 Rust 只留给性能关键或系统级场景；引入前必须给出明确理由并征得用户同意，记录在项目 ADR 中。见 [Go](../toolchain/go.md) 与 [Rust](../toolchain/rust.md)。

框架选型见[前端框架：Vite 与 Next.js](../libraries/frontend-framework.md)。

## 版本策略

通过 mise 使用最新稳定版 TypeScript 与 Active LTS 线上的 Node.js。

截至 2026-08，Active LTS 线是 Node.js 24（EOL 2028-04）；Node.js 22 处于维护期（EOL 2027-04），Node.js 26 在 2026-10 之前仍是 Current 线。绝不以 Current 线为目标；只有新的 LTS 线稳定之后，才升级 Node 主版本。

模型基于训练数据生成代码，主流且经过充分验证的版本在 AI 辅助开发中出错更少——优先于边际收益。该原则见[核心工程原则](../principles/core-principles.md)。

在项目 mise 配置中固定 Node.js 与 TypeScript 的版本，不要依赖全局安装的版本。

## pnpm

使用 `pnpm`。

适用于普通 Node.js 项目与 monorepo。

外部文档给出 npm 或 yarn 命令时，将其转换为 pnpm 等价用法，而不是引入另一个包管理器。

项目 lockfile 必须与 pnpm 保持一致。

### 不采用的替代方案

禁止使用：

- npm
- yarn

## oxlint

`oxlint` 是标准的 TypeScript / JavaScript Lint 工具。

当框架、模板或库推荐 ESLint 时：

1. 弄清它依赖哪些 ESLint 规则或插件。
2. 判断 oxlint 是否支持所需功能。
3. 只要可行，就改用 oxlint 的等价能力。
4. 不要仅因模板生成了 ESLint 就保留它。

除非存在具体的兼容性问题，否则使用最新稳定版 oxlint。

### 规则配置

有意识地配置 oxlint。

启用那些合适且受 oxlint 官方支持的规则与推荐规则集。

不要因为生成的项目配置没有开启，就让有用的推荐检查处于关闭状态。

当某个规则集或兼容层无法被 oxlint 正确支持时，应显式配置处理，而不是把不兼容的 ESLint 行为硬塞进项目。

### Type-Aware 与类型检查规则

在适合项目的情况下，使用 oxlint 官方支持的 TypeScript type-aware 或类型检查能力。

Type-aware Lint 与类型检查需要额外的配套依赖：安装 `oxlint-tsgolint` 包并搭配较新的 `oxlint`，在根配置 `.oxlintrc.json` 里通过 `options.typeAware` 与 `options.typeCheck` 开启（`typeCheck` 仍属实验特性）。截至 2026-08 已对照 oxc 官方文档核实。

按 oxlint 当前官方文档配置所需的 type-aware 功能。

oxlint 已具备所需能力时，不要仅为获得 type-aware Lint 而引入 ESLint。

具体配置会随 oxlint 演进，因此优先采用 oxlint 当前官方机制，不要从旧项目复制过时配置。

### 不采用的替代方案

禁止将 ESLint 作为默认 Lint 体系。

## oxfmt

`oxfmt` 是 TypeScript / JavaScript 项目的标准格式化工具。

除非存在具体的兼容性问题，否则使用最新稳定版 oxfmt。

不要对同一批源文件运行多个相互竞争的格式化工具。

### 不采用的替代方案

禁止使用 Prettier。

## tsconfig 基线

每个项目从严格的 tsconfig 基线起步：

- `"strict": true`——严格模式的基础；除非有 ADR 记录在案，不得关闭其中任何一项。
- `"noUncheckedIndexedAccess": true`——索引访问返回 `T | undefined`，迫使调用方处理 undefined。
- `"verbatimModuleSyntax": true`——纯类型导入必须写 `import type`，防止误引入运行时导入。
- `"isolatedModules": true`——每个文件必须能独立编译，与打包器和转译器的实际处理方式一致。
- 只用 ESM。应用项目用 `"module": "ESNext"` 配 `"moduleResolution": "Bundler"`;Node 库用 `"module": "NodeNext"` 配 `"moduleResolution": "NodeNext"`。
- 应用不由 tsc 产出构建物：设 `"noEmit": true`，输出交给打包器。

基线示例：

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "noEmit": true,
  },
}
```

## 语言使用规则

- 值的类型未知时用 `unknown` 而不是 `any`，先收窄再使用。`any` 只保留给真正的动态互操作场景，并附注释说明理由。
- 非空断言(`!`)必须附带注释，说明该值在此处为何不可能为 null 或 undefined。
- 导出函数显式声明返回类型。
- 用可辨识联合(discriminated union)建模状态，不要堆一组布尔标志。
- 配置对象用 `satisfies` 校验：在定义处暴露错误，同时保留字面量类型。
- 静态字面量表加 `as const`，保持元素类型精确。
- 用联合类型或 `const` 对象代替 `enum`。
- 不留悬空 promise：要么 `await`，要么有意用 `void` 丢弃并注释说明为何忽略结果。
- 只 throw `Error` 子类，禁止 throw 字符串或裸对象。

## 项目约定

- 应用源码放在 `src/` 下，入口通过 `package.json` 暴露。
- 文件名用 kebab-case(`user-profile-card.tsx`)，值用 camelCase，类型、组件与类用 PascalCase。
- 避免桶文件(barrel file，即用 `index.ts` 转发整个目录)，直接从定义模块导入。桶文件损害 tree-shaking，还容易制造循环导入。

## 联动

- [前端框架：Vite 与 Next.js](../libraries/frontend-framework.md)
- [TypeScript 后端](../libraries/typescript-backend.md)
- [质量门禁](../toolchain/quality-gates.md)
- [测试策略](../practices/testing.md)
- [编码标准](../practices/coding-standards.md)
