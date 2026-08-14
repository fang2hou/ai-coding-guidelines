---
id: toolchain/typescript
lang: ja
version: 1
source-lang: en
status: active
digest: a6dce3e6
---

# TypeScript ツールチェーン

標準の TypeScript / JavaScript ツールチェーンは、パッケージ管理に pnpm、リントに oxlint、フォーマットに oxfmt である。フレームワークの選定については [Frontend Framework: Vite vs Next.js](../libraries/frontend-framework.md) を参照。

## pnpm

`pnpm` を使う。

通常の Node.js プロジェクトにも monorepo にも適用される。

外部ドキュメントが npm や yarn のコマンドを示している場合は、別のパッケージマネージャーを導入せず pnpm に読み替える。

プロジェクトのロックファイルは、常に pnpm と一致した状態を保たなければならない。

### 採用しない代替案

次は使わない。

* npm
* yarn

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
