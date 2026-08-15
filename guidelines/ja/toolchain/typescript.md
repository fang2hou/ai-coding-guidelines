---
id: toolchain/typescript
lang: ja
version: 5
source-lang: en
status: active
digest: bf24173e
---

# TypeScript ツールチェーン

## 適用義務

TypeScript は AI 支援のプロダクト開発におけるデフォルト言語である。ライブラリとエージェントのエコシステム支援が、利用可能な言語の中で最も強いためである。

言語の優先順位：

- TypeScript と Python は、ライブラリとエージェントのエコシステム支援が最も強いため、AI 支援開発のデフォルト言語である。
- Python は [Python ツールチェーン](../toolchain/python.md)に挙げた正当なケースでのみ使う。
- Go と Rust はパフォーマンスが重要なケースやシステムレベルのケースに限る。導入には明確な根拠に加えてユーザーの承認が必要で、プロジェクトの ADR に記録する。[Go](../toolchain/go.md) と [Rust](../toolchain/rust.md) を参照。

フレームワークの選定については [フロントエンドフレームワーク：Vite vs Next.js](../libraries/frontend-framework.md) を参照。

## バージョン方針

最新の安定版 TypeScript と、Active LTS ライン上の Node.js を、mise で管理して使う。

2026-08 時点の Active LTS ラインは Node.js 24（EOL 2028-04）である。Node.js 22 はメンテナンス期（EOL 2027-04）にあり、Node.js 26 は 2026-10 まで Current ラインである。Current ラインを対象にせず、Node のメジャーは新しい LTS ラインが落ち着いてから上げる。

モデルは訓練データに基づいてコードを生成するため、主流で十分に検証されたバージョンほど AI 支援開発での破綻が少なく、限界的な性能より優先する。この原則は[中核となるエンジニアリング原則](../principles/core-principles.md)に定める。

Node.js と TypeScript のバージョンはプロジェクトの mise 設定に固定し、グローバルにインストールされたバージョンに依存しない。

## pnpm

`pnpm` を使う。

通常の Node.js プロジェクトにも monorepo にも適用される。

外部ドキュメントが npm や yarn のコマンドを示している場合は、別のパッケージマネージャーを導入せず pnpm に読み替える。

プロジェクトのロックファイルは、常に pnpm と一致した状態を保たなければならない。

### 採用しない代替案

次は使わない。

- npm
- yarn

## oxlint

`oxlint` は TypeScript / JavaScript の標準リンターである。

フレームワーク、テンプレート、ライブラリが ESLint を推奨している場合は、次のように扱う。

1. どの ESLint ルールやプラグインに依存しているかを特定する。
2. 必要な機能が oxlint でサポートされているかを確認する。
3. 可能な限り oxlint の等価な機能を使う。
4. テンプレートが生成したからという理由で ESLint を残さない。

具体的な互換性の問題がない限り、最新の安定版 oxlint を使う。

### ルール設定

oxlint の設定は意図を持って行う。

oxlint が公式にサポートしており、プロジェクトに適したルールと推奨ルールセットを有効化する。

生成されたプロジェクト設定で有効になっていないからという理由で、有用な推奨チェックを無効のままにしない。

ルールセットや互換レイヤーが oxlint で正しくサポートされない場合は、互換性のない ESLint の挙動を無理に持ち込まず、明示的に設定する。

### 型認識・型チェックルール

プロジェクトに適している場合は、oxlint が公式にサポートする TypeScript の型認識 (type-aware) 機能または型チェック機能を使う。

型認識リントと型チェックには、追加のコンパニオンパッケージが必要である。`oxlint-tsgolint` を比較的新しい `oxlint` と併せてインストールし、ルートの `.oxlintrc.json` で `options.typeAware` と `options.typeCheck` を有効化する（`typeCheck` は 2026-08 時点で実験的である）。名称と設定キーは 2026-08 時点の oxc 公式ドキュメントで確認済みである。

必要な型認識機能の設定は、現在の公式 oxlint ドキュメントに従う。

oxlint が必要な機能を提供しているのに、型認識リントのためだけに ESLint を導入しない。

設定の具体像は oxlint のバージョンとともに変わり得るため、古いプロジェクトから設定をコピーするのではなく、現在の公式の仕組みを使う。

### 採用しない代替案

デフォルトのリントシステムとして ESLint を使わない。

## oxfmt

`oxfmt` は TypeScript / JavaScript プロジェクトの標準フォーマッターである。

具体的な互換性の問題がない限り、最新の安定版 oxfmt を使う。

同じソースファイルに、競合する複数のフォーマッターを実行しない。

### 採用しない代替案

Prettier を使わない。

## tsconfig のベースライン

すべてのプロジェクトを、厳格な tsconfig のベースラインから始める。

- `"strict": true`——厳格モードの基盤。ADR レベルの理由なく、個別の strict フラグを無効化しない。
- `"noUncheckedIndexedAccess": true`——インデックスアクセスが `T | undefined` になり、未定義ケースの処理を強制する。
- `"verbatimModuleSyntax": true`——型だけのインポートには `import type` を必須とし、誤ってランタイムのインポートが混入するのを防ぐ。
- `"isolatedModules": true`——各ファイルが独立してコンパイルできることを強制し、bundler やトランスパイラの実際の処理単位と一致させる。
- ESM のみ。アプリケーションは `"module": "ESNext"` と `"moduleResolution": "Bundler"`、Node 向けライブラリは `"module": "NodeNext"` と `"moduleResolution": "NodeNext"` を使う。
- アプリケーションで tsc から出力しない。`"noEmit": true` を設定し、出力は bundler に任せる。

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

- 値の型が不明なときは `any` ではなく `unknown` を使い、使用前に絞り込む。`any` は本当に動的な相互運用に限り、理由をコメントで示す。
- 非nullアサーション演算子 (`!`) を使う場合は、その時点で値が null や undefined になり得ない理由をコメントで示す。
- エクスポートする関数には戻り値の型を明示する。
- 状態はブール値の羅列ではなく、判別可能なユニオン (discriminated union) でモデル化する。
- 設定オブジェクトは `satisfies` で検証する。定義時点でエラーが表面化し、リテラル型も保持される。
- 静的なリテラルテーブルには `as const` を付け、要素型を狭く保つ。
- `enum` の代わりにユニオン型または `const` オブジェクトを使う。
- promise を放置しない。`await` するか、結果を意図的に破棄する場合のみ `void` を使い、なぜ無視するのかをコメントで示す。
- 例外として投げるのは `Error` のサブクラスだけにする。文字列や素のオブジェクトを throw しない。

## プロジェクト規約

- アプリケーションのソースは `src/` に置き、エントリポイントは `package.json` 経由で公開する。
- ファイル名は kebab-case(`user-profile-card.tsx`)、値は camelCase、型・コンポーネント・クラスは PascalCase とする。
- バレルファイル(`index.ts` でディレクトリ全体を再エクスポートする構成)は避け、定義元のモジュールから直接インポートする。バレルファイルは tree-shaking を阻害し、循環インポートを招きやすい。

## 連携

- [フロントエンドフレームワーク：Vite vs Next.js](../libraries/frontend-framework.md)
- [TypeScript バックエンド](../libraries/typescript-backend.md)
- [品質ゲート](../toolchain/quality-gates.md)
- [テスト戦略](../practices/testing.md)
- [コーディング規約](../practices/coding-standards.md)
