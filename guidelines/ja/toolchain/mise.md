---
id: toolchain/mise
lang: ja
version: 3
source-lang: en
status: active
digest: 8d64e7ed
---

# mise

## 適用義務

`mise` をすべてのプロジェクトで必須とする。

mise は、次の項目について、プロジェクトレベルで信頼できる唯一の情報源である。

- ランタイムのバージョン
- CLI ツールのバージョン
- 開発ツール
- 環境構成
- プロジェクト共通のタスク
- CI が使用するツールチェーンのセットアップ

mise で管理するツールの例は、次のとおりである。

- Node.js
- pnpm
- Python
- uv
- Databricks CLI
- Cocogitto
- prek
- その他のプロジェクト CLI ツール

mise で要件を満たせる場合は、別の汎用ツールマネージャーを導入しない。

これは、[中核となるエンジニアリング原則](../principles/core-principles.md)に示された中心原則を、ツールチェーンレベルで適用したものである。

## 役割分担

mise が管理するのは、Node.js、pnpm、uv、リンターなどのランタイムとツールバイナリだけである。各言語のパッケージや仮想環境は、それぞれのパッケージマネージャー（Node.js は pnpm、Python は uv）で管理する。mise で言語パッケージをインストールしてはならない。

この役割分担により、1 回の `mise install` でグローバルインストールなしにツールチェーン全体を揃えつつ、各言語の標準パッケージマネージャーをそのまま使える。

## バージョン方針

mise は最新版を使い、理由なく古いバージョンに固定しない。

`mise.toml` でツールのバージョンを固定する際は、最新バージョンを使う（Node.js の Active LTS など、言語別のガイドラインで LTS ラインが指定されている場合を除く）。最新バージョンは学習データや外部レジストリに頼らず、必ず mise 自体（`mise latest <tool>` または `mise ls-remote <tool>`）で確認する。

`pnpm` に関する注意：npm 上の `latest` は 11 になっているが、実際の最新バージョンは 12 である。mise で確認して 12 を指定すること。

## ツールのライフサイクル

使わなくなったツールは `mise.toml` から削除し、環境に不要なツールを残さない。

## タスク

`mise tasks` をプロジェクト共通のタスクインターフェースとして使う。

プロジェクトでよく使うタスクは、次のようなコマンドで実行できるようにする。

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

言語固有のスクリプト（`package.json` に書いて pnpm で実行するフロントエンドスクリプトなど）は各エコシステムに残してよいが、主要なワークフローは mise タスクとして公開し、別のタスク管理の仕組みを作らない。

```text
mise task
    -> pnpm script
        -> underlying frontend tool
```

## ローカルと CI の一致

CI/CD でも、可能な限り mise を使う。

ローカル開発用と CI 用に別々のツールチェーン定義を持たず、どちらの環境でもプロジェクトが管理する同じツール群を使う。

## mise MCP

AI 環境が MCP に対応しており、プロジェクトのワークフローに有益な場合は、mise MCP 連携の設定を優先する。未設定であれば、独自のプロジェクト管理の仕組みを作るのではなく、エージェントが mise MCP の追加を支援してよい。
