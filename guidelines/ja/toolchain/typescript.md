---
id: toolchain/typescript
lang: ja
version: 6
source-lang: en
status: active
digest: c5920981
---

# TypeScript ツールチェーン

## 適用義務

TypeScript は AI 支援のプロダクト開発におけるデフォルト言語である。ライブラリと AI エージェントを支えるエコシステムが、利用可能な言語の中で最も充実しているためである。

言語の優先順位：

- TypeScript と Python は、ライブラリと AI エージェントを支えるエコシステムが最も充実しているため、AI 支援開発のデフォルト言語である。
- Python は [Python ツールチェーン](../toolchain/python.md) に示す妥当なケースに限り使う。
- Go と Rust は、性能が重要な処理やシステム領域に限って使う。導入には明確な根拠とユーザーの承認が必要であり、その内容をプロジェクトの ADR に記録する。[Go](../toolchain/go.md) と [Rust](../toolchain/rust.md) を参照。

フレームワークの選定については [フロントエンドフレームワーク：Vite vs Next.js](../libraries/frontend-framework.md) を参照。

## バージョン方針

最新の安定版 TypeScript と Active LTS ラインの Node.js を mise で管理して使う。

2026-08 時点では、Active LTS ラインは Node.js 24（EOL 2028-04）である。Node.js 22 はメンテナンス期（EOL 2027-04）にあり、Node.js 26 は 2026-10 まで Current ラインである。Current ラインを対象にしてはならない。Node.js のメジャーバージョンは、新しい LTS ラインが定着してから更新する。

モデルは学習データに基づいてコードを生成する。そのため、AI 支援開発では主流で十分に検証されたバージョンのほうが破綻が少ない。わずかな性能向上よりも、これらのバージョンを優先する。この原則は [中核となるエンジニアリング原則](../principles/core-principles.md) に定められている。

Node.js と TypeScript のバージョンは、プロジェクトの mise 設定に固定し、グローバルにインストールされたバージョンに依存しない。

## pnpm

`pnpm` を使う。

この方針は、通常の Node.js プロジェクトと monorepo の両方に適用する。

外部ドキュメントに npm や yarn のコマンドが記載されている場合は、別のパッケージマネージャーを導入せず、pnpm 用のコマンドに読み替える。

プロジェクトのロックファイルは、pnpm と整合した状態を保たなければならない。

### 採用しない代替案

次のツールは使わない。

- npm
- yarn

## oxlint

`oxlint` は TypeScript / JavaScript の標準リンターである。

フレームワーク、テンプレート、ライブラリが ESLint を推奨する場合は、次の手順で対応する。

1. どの ESLint ルールやプラグインに依存しているかを特定する。
2. 必要な機能が oxlint でサポートされているかを確認する。
3. 可能な限り oxlint の対応する機能を使う。
4. テンプレートが生成したというだけの理由で、ESLint を残してはならない。

具体的な互換性の問題がない限り、最新の安定版 oxlint を使う。

### ルール設定

oxlint は、目的を明確にして設定する。

oxlint が公式にサポートしており、プロジェクトに適したルールと推奨ルールセットを有効にする。

生成されたプロジェクト設定で有効になっていないというだけの理由で、有用な推奨チェックを無効のままにしてはならない。

ルールセットや互換レイヤーが oxlint で正しくサポートされない場合は、互換性のない ESLint の挙動を無理に再現しようとせず、明示的に設定する。

コードの実行環境に対応するプラグインを読み込む。デフォルトのプラグインだけに頼ってはならない。Node.js 上で動くコードでは、`.oxlintrc.json` で `node` プラグインを有効にし、そのルールを意図的に有効化する。CommonJS 時代のパターンを検出するルールも含める一方、プロジェクトの目的と衝突する制限ルールは無効にする（たとえば、同期的なファイルアクセスを意図的に使う CLI では `no-sync` を無効のままにする）。

### 型情報を使うリントと型チェック

プロジェクトに適している場合は、oxlint が公式にサポートする TypeScript の型情報を利用したリント機能や型チェック機能を使う。

型情報を利用したリントと型チェックには、補助パッケージ `oxlint-tsgolint` が必要である。これを新しい `oxlint` とともにインストールし、ルートの `.oxlintrc.json` で `options.typeAware` と `options.typeCheck` を有効にする（`typeCheck` は 2026-08 時点で実験的である）。この設定は、2026-08 時点の oxc 公式ドキュメントで確認した内容である。

必要な型情報機能の設定は、現行の公式 oxlint ドキュメントに従う。

oxlint が必要な機能を提供しているのに、型情報を利用したリントだけを目的として ESLint を導入してはならない。

設定方法の詳細は oxlint とともに変わり得るため、古いプロジェクトの設定をコピーせず、現行の公式な仕組みを優先する。

### 採用しない代替案

デフォルトのリントシステムとして ESLint を使わない。

## oxfmt

`oxfmt` は TypeScript / JavaScript プロジェクトの標準フォーマッターである。

具体的な互換性の問題がない限り、最新の安定版 oxfmt を使う。

同じソースファイルに対して、競合する複数のフォーマッターを実行しない。

### 採用しない代替案

Prettier を使わない。

## tsconfig のベースライン

すべてのプロジェクトで、厳格な tsconfig ベースラインを起点にする。

- `"strict": true`——厳格モードの基盤。ADR レベルの理由なく、個別の strict フラグを無効化しない。
- `"noUncheckedIndexedAccess": true`——インデックスアクセスが `T | undefined` になり、未定義ケースの処理を強制する。
- `"verbatimModuleSyntax": true`——型だけのインポートには `import type` を必須とし、誤ってランタイムのインポートが混入するのを防ぐ。
- `"isolatedModules": true`——各ファイルが独立してコンパイルできることを強制し、bundler やトランスパイラの実際の処理単位と一致させる。
- ESM のみ。アプリケーションは `"module": "ESNext"` と `"moduleResolution": "Bundler"`、Node.js 向けライブラリは `"module": "NodeNext"` と `"moduleResolution": "NodeNext"` を使う。
- アプリケーションでは tsc による出力を行わない。`"noEmit": true` を設定し、出力は bundler に任せる。

ベースラインの例：

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

## 言語の利用ルール

- 値の型がまだ不明な場合は `any` ではなく `unknown` を使い、使用前に型を絞り込む。`any` は本当に動的な相互運用が必要な場合に限り、理由をコメントで示す。
- 非 null アサーション演算子（`!`）を使う場合は、その時点で値が null や undefined になり得ない理由をコメントで示す。
- エクスポートする関数には戻り値の型を明示する。
- 状態はブール値のグループではなく、判別可能なユニオン（discriminated union）でモデル化する。
- 設定オブジェクトは `satisfies` で検証する。定義時にエラーが表面化し、リテラル型も保持される。
- リテラルテーブルには `as const` を適用し、要素型を狭く保つ。
- `enum` の代わりにユニオン型または `const` オブジェクトを使う。
- Promise を放置しない。`await` するか、結果を意図的に破棄する場合は `void` と、その理由を示すコメントを付ける。
- 例外には `Error` のサブクラスだけを使い、文字列やプレーンオブジェクトを送出してはならない。

## プロジェクト規約

- アプリケーションのソースは `src/` に置き、エントリーポイントを `package.json` 経由で公開する。
- ファイル名は kebab-case（`user-profile-card.tsx`）、値は camelCase、型、コンポーネント、クラスは PascalCase とする。
- バレルファイル（`index.ts` でディレクトリ全体を再エクスポートするファイル）は避け、定義元のモジュールから直接インポートする。バレルファイルは tree-shaking を阻害し、循環インポートを招きやすい。

## 連携

- [フロントエンドフレームワーク：Vite vs Next.js](../libraries/frontend-framework.md)
- [TypeScript バックエンド](../libraries/typescript-backend.md)
- [品質ゲート](../toolchain/quality-gates.md)
- [テスト戦略](../practices/testing.md)
- [コーディング規約](../practices/coding-standards.md)
