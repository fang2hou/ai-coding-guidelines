---
id: toolchain/typescript
lang: zh
version: 8
source-lang: en
status: active
digest: 4d3116fd
---

# TypeScript 工具链

## 强制要求

TypeScript 和 Python 是 AI 辅助开发的默认语言，因为它们的库生态和 AI Agent 生态最成熟。

语言优先级：

- 产品与全栈开发默认使用 TypeScript。
- Python 仅用于 [Python 工具链](../toolchain/python.md) 列出的适用场景。
- Go 与 Rust 仅用于性能关键或系统级场景；采用前必须说明理由、征得用户批准，并记录在项目 ADR 中。详见 [Go](../toolchain/go.md) 与 [Rust](../toolchain/rust.md)。

框架选型见 [前端框架：Vite 与 Next.js](../libraries/frontend-framework.md)。

## 版本策略

使用最新稳定版 TypeScript 和 Active LTS 线上的最新稳定版 Node.js。

截至 2026-08，Active LTS 版本线为 Node.js 24（EOL 2028-04）；Node.js 22 处于维护期（EOL 2027-04），Node.js 26 在 2026-10 之前仍是 Current 线。绝不以 Current 线为目标；只有新的 LTS 版本线稳定后，才升级 Node 主版本。

模型根据训练数据生成代码，因此主流且经过充分验证的版本在 AI 辅助开发中出错更少；应优先选择这些版本，而不是追求边际收益。该原则见 [核心工程原则](../principles/core-principles.md)。

在项目的 mise 配置中固定 Node.js 的版本；TypeScript 的版本通过 pnpm lockfile 固定，两者都不依赖全局安装的版本。

## pnpm

使用 `pnpm`。这条要求同时适用于普通 Node.js 项目和 monorepo。

在 `mise.toml` 中固定 `pnpm` 版本时，应使用最新版本并通过 mise（`mise latest pnpm`）查询。注意：npm 中的 `pnpm` `latest` 是 11，但实际最新版本是 12。

外部文档给出 npm 或 yarn 命令时，将其改写为 pnpm 等价命令，不要引入其他包管理器。

项目 lockfile 必须与 pnpm 保持一致。

### 不采用的替代方案

禁止使用：

- npm
- yarn

## oxlint

`oxlint` 是 TypeScript / JavaScript 的标准 Lint 工具。

当框架、模板或库推荐 ESLint 时：

1. 弄清它依赖哪些 ESLint 规则或插件。
2. 判断 oxlint 是否支持所需功能。
3. 只要可行，就使用 oxlint 提供的等效功能。
4. 不要仅因模板生成了 ESLint 就保留它。

除非存在具体的兼容性问题，否则使用最新稳定版 oxlint。

### 规则配置

有针对性地配置 oxlint：根据代码实际运行的环境开启规则和插件，不要只用默认配置，也不要因为脚手架模板没开就漏掉有用的检查。

对于运行在 Node.js 上的代码，在 `.oxlintrc.json` 中启用 `node` 插件并开启相关规则（包括防范旧式 CommonJS 写法的规则），同时关闭与项目定位冲突的限制规则（例如，有意同步读写文件的 CLI 工具应保持 `no-sync` 关闭）。

### Type-Aware 与类型检查规则

在项目需要时，启用 oxlint 官方支持的 TypeScript 类型感知（type-aware）Lint 和类型检查。

将配套包 `oxlint-tsgolint` 与新版 `oxlint` 一起安装，并在根目录 `.oxlintrc.json` 中开启 `options.typeAware` 和 `options.typeCheck`（截至 2026-08，`typeCheck` 仍为实验特性）。

参照 oxlint 当前官方文档配置，不要从旧项目照搬过时配置；只要 oxlint 能满足需求，就不要为了类型感知规则再引入 ESLint。

### 不采用的替代方案

禁止将 ESLint 作为默认 Lint 体系。

## oxfmt

`oxfmt` 是 TypeScript / JavaScript 项目的标准格式化工具。

除非存在具体的兼容性问题，否则使用最新稳定版 oxfmt。

不要对同一组源文件运行多个相互竞争的格式化工具。

### 不采用的替代方案

禁止使用 Prettier。

## tsconfig 基线

每个项目从严格的 tsconfig 基线起步：

- `"strict": true`——严格模式的基础；除非有 ADR 级别的理由，否则不得关闭任何单独的严格性标志。
- `"noUncheckedIndexedAccess": true`——索引访问结果为 `T | undefined`，必须处理 `undefined` 情况。
- `"verbatimModuleSyntax": true`——仅用于类型的导入必须使用 `import type`，避免意外产生运行时导入。
- `"isolatedModules": true`——每个文件必须能独立编译，与打包器和转译器的实际处理方式一致。
- 只用 ESM。应用项目使用 `"module": "ESNext"` 配 `"moduleResolution": "Bundler"`；Node 库使用 `"module": "NodeNext"` 配 `"moduleResolution": "NodeNext"`。
- 应用项目不让 tsc 生成输出：设置 `"noEmit": true`，由打包器生成产物。

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

- 值的类型未知时使用 `unknown` 而不是 `any`，先收窄类型再使用。仅在确实需要动态互操作时使用 `any`，并附注释说明理由。
- 非空断言（`!`）必须附注释，说明为什么该值在此处不可能为 null 或 undefined。
- 导出函数显式声明返回类型。
- 使用可辨识联合（discriminated union）为状态建模，不要堆叠一组布尔标志。
- 用 `satisfies` 校验配置对象：错误会在定义处暴露，同时保留字面量类型。
- 字面量表加上 `as const`，使元素类型保持精确。
- 用联合类型或 `const` 对象代替 `enum`。
- 不留悬空 promise：要么 `await`，要么有意用 `void` 丢弃，并附注释说明为何忽略结果。
- 只能抛出 Error 子类；禁止抛出字符串或普通对象。

## 项目约定

- 应用源码放在 `src/` 下，入口通过 `package.json` 暴露。
- 文件名使用 kebab-case（`user-profile-card.tsx`），值使用 camelCase，类型、组件和类使用 PascalCase。
- 避免桶文件（barrel file，即用 `index.ts` 转发整个目录），直接从定义模块导入。桶文件会损害 tree-shaking，还容易造成循环导入。

## 联动

- [前端框架：Vite 与 Next.js](../libraries/frontend-framework.md)
- [TypeScript 后端](../libraries/typescript-backend.md)
- [质量门禁](../toolchain/quality-gates.md)
- [测试策略](../practices/testing.md)
- [编码标准](../practices/coding-standards.md)
