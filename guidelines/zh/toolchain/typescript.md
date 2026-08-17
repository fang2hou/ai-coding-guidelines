---
id: toolchain/typescript
lang: zh
version: 6
source-lang: en
status: active
digest: 50bd819c
---

# TypeScript 工具链

## 强制要求

TypeScript 是 AI 辅助产品开发的默认语言；在现有语言中，它获得的库生态和 AI Agent 生态支持最强。

语言优先级：

- TypeScript 和 Python 是 AI 辅助开发的默认语言，因为它们在库生态和 AI Agent 生态方面获得的支持最强。
- Python 仅用于 [Python 工具链](../toolchain/python.md) 中列出的合理场景。
- Go 与 Rust 仅用于性能关键或系统级场景；采用 Go 或 Rust 前必须给出明确理由、征得用户同意，并在项目 ADR 中记录这些内容。详见 [Go](../toolchain/go.md) 与 [Rust](../toolchain/rust.md)。

框架选型见 [前端框架：Vite 与 Next.js](../libraries/frontend-framework.md)。

## 版本策略

使用 mise 管理最新稳定版 TypeScript 和 Active LTS 线上的最新稳定版 Node.js。

截至 2026-08，Active LTS 版本线为 Node.js 24（EOL 2028-04）；Node.js 22 处于维护期（EOL 2027-04），Node.js 26 在 2026-10 之前仍是 Current 线。绝不以 Current 线为目标；只有新的 LTS 版本线稳定后，才升级 Node 主版本。

模型根据训练数据生成代码，因此主流且经过充分验证的版本在 AI 辅助开发中出错更少；应优先选择这些版本，而不是追求边际收益。该原则见 [核心工程原则](../principles/core-principles.md)。

在项目的 mise 配置中固定 Node.js 与 TypeScript 的版本，不要依赖全局安装的版本。

## pnpm

使用 `pnpm`。

这条要求适用于普通 Node.js 项目和 monorepo。

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

应明确配置 oxlint。

启用适合项目且由 oxlint 官方支持的规则和推荐规则集。

不要因为生成的项目配置默认未启用，就关闭有用的推荐检查。

如果 oxlint 无法正确支持某个规则集或兼容层，应明确配置，而不是强行把不兼容的 ESLint 行为塞进项目。

应根据代码实际运行的环境加载插件，而不只是使用默认插件：对于运行在 Node.js 上的代码，应在 `.oxlintrc.json` 中启用 `node` 插件，并明确开启所需规则——包括 CommonJS 时代的模式防护；同时跳过与项目意图冲突的限制类规则（例如，对于有意使用同步文件访问的 CLI，应保持 `no-sync` 关闭）。

### Type-Aware 与类型检查规则

在项目确实需要时，使用 oxlint 官方支持的 TypeScript type-aware 或类型检查功能。

Type-aware Lint 和类型检查需要安装配套依赖：将 `oxlint-tsgolint` 与较新的 `oxlint` 一起安装，并在根目录的 `.oxlintrc.json` 中通过 `options.typeAware` 和 `options.typeCheck` 开启（`typeCheck` 仍属实验特性）。截至 2026-08，已对照 oxc 官方文档核实。

按照 oxlint 当前的官方文档配置所需的 type-aware 功能。

oxlint 已具备所需能力时，不要仅为获得 type-aware Lint 而引入 ESLint。

具体配置会随 oxlint 演进，因此优先采用 oxlint 当前的官方机制，不要从旧项目复制过时配置。

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
