---
id: toolchain/mise
lang: ja
version: 1
source-lang: en
status: active
digest: 82a4009f
---

# mise

## 適用義務

すべてのプロジェクトで `mise` を必須とする。

mise は、次の項目に関するプロジェクトレベルの信頼できる唯一の情報源である。

* ランタイムのバージョン
* CLI ツールのバージョン
* 開発ツール
* 環境構成
* プロジェクト共通のタスク
* CI が使用するツールチェーンのセットアップ

mise で管理するツールの例は次のとおりである。

* Node.js
* pnpm
* Python
* uv
* Databricks CLI
* Cocogitto
* prek
* その他のプロジェクト CLI ツール

mise で要件を満たせるのに、別の汎用ツールマネージャーを導入しない。

これは[中核となるエンジニアリング原則](../principles/core-principles.md)の中心原則を、ツールチェーンレベルに適用したものである。

## バージョン方針

mise は可能な限り最新版を使う。

プロジェクトを保守するときは、必要もないのに古いバージョンへ固定せず、mise 自体を最新に保つ。

## ツールのライフサイクル

プロジェクトで使われなくなったツールは、mise の設定から削除する。

不要になったツールをプロジェクト環境に残さない。

## タスク

`mise tasks` をプロジェクト共通のタスクインターフェースとして使う。

典型的なプロジェクトコマンドには、次のようなコマンド経由でアクセスできるようにする。

```bash
mise run dev
mise run lint
mise run format
mise run typecheck
mise run test
mise run e2e
mise run check
mise run build
mise run deploy
```

言語固有のタスク定義は、適切であればそれぞれのエコシステムに置いたままでよい。

たとえば、フロントエンドのスクリプトは `package.json` に記述し、pnpm 経由で実行してよい。

その場合、プロジェクト独自の第二のタスクシステムを新設するのではなく、該当するワークフローを mise タスクとして公開する。

例:

```text
mise task
    -> pnpm script
        -> underlying frontend tool
```

## ローカルと CI の一致

CI/CD では、実用可能な限り mise を使う。

ローカル開発用と CI 用でまったく別のツールチェーン定義を保持してはならない。

どちらの環境でも、同じプロジェクト管理下のツール群を使用する。

## mise MCP

AI 環境が MCP をサポートしており、プロジェクトのワークフローが mise MCP 連携の恩恵を受けられる場合は、その設定を優先する。

ユーザーが MCP 対応環境を使っているのに mise MCP が設定されていない場合、エージェントは独自のプロジェクト管理機構を新設するのではなく、設定の追加を支援してよい。
