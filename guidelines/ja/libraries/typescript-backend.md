---
id: libraries/typescript-backend
lang: ja
version: 3
source-lang: en
status: active
digest: a9b4e10d
---

# TypeScript バックエンド

## 判定

推奨 — TypeScript バックエンドには Hono を推奨する。既定のランタイムは Active LTS ラインの Node.js である。Web 標準 API によって、サービスを Cloudflare Workers など他のランタイムへ移植できる。モデルは訓練データからコードを生成するため、広く使われ、十分に検証されたスタックほど AI 支援開発でも破綻しにくい。この傾向を本判定に反映している。

## 使用する場面

- TypeScript で API またはバックエンドサービスを構築する場合。

## 避けるべき場面

- Python の採用基準を満たすサービスでは、[Python API スタック](../libraries/python-api-stack.md)を使う。
- 成果物がフロントエンドだけの場合は、フレームワークの選定について [フロントエンドフレームワーク：Vite vs Next.js](../libraries/frontend-framework.md)を参照する。

## 長所

- Hono：マルチランタイム。同じコードを Node.js、Cloudflare Workers、Deno で動かせる。Node LTS を既定とする運用とエッジへのデプロイを、1 つのフレームワークとコードベースで扱える点が決定的な長所である。
- Hono：Web 標準の `Request`/`Response` を基盤とし、コアが小さく、実用的なミドルウェアも備える。
- Hono：型付き RPC クライアント（`hono/client`）により、ルートのコントラクトをエンドツーエンドで型付きのまま維持できる。

## トレードオフ

- Hono はレガシーフレームワークほど機能が揃っておらず、完全なアプリケーションにはより多くの構成要素を組み合わせる必要がある。
- 1 サービスにつき 1 つのフレームワークとする。ランタイムごとにバックエンドの実装パターンを分岐させず、Hono のサービスに別のバックエンドフレームワークを混在させない。

## バージョン方針

- Hono は最新の安定メジャーバージョンを使う。具体的な互換性の理由がない限り、サービスを古いメジャーバージョンに留めない。
- ランタイムは mise で Node.js の Active LTS ラインに固定する。2026-08 時点では Node.js 24（EOL 2028-04）である。サービスを Current ラインで実行してはならない。

## 利用ルール

### 境界での検証

- トランスポート境界で検証する。Hono の validator ミドルウェアを組み込み、ハンドラが検証済みの型付き値を受け取るようにする。
- コア層では、トランスポートに関する検証を再度行わない。

### 薄いハンドラとフレームワーク非依存のコア

- ハンドラは薄いアダプタである。境界でフレームワークのリクエストをフレームワークに依存しない型付き値へ変換し、その後コア層を呼び出す。コアモジュールは Hono を import しない。
- これは [Go API スタック](../libraries/go-api-stack.md)のレイヤー構成規則と同じ方針である。コア層が依存するのは素の型付き入力と Web 標準 API だけで、Web フレームワークには決して依存しない。

### Web 標準 API

- ランタイム固有の API ではなく、Web 標準 API（`Request`/`Response`、`fetch`、`URL`、streams）を優先する。これにより、コア層を Node.js と Workers の間で移植可能に保てる。

### エンドツーエンドの型付きルート

- Hono の RPC クライアント（`hono/client`）でクライアント側の型推論を行い、ルートの型をエンドツーエンドで保つ。ルートのコントラクトを型のない fetch ラッパーに変えてはならない。

### ミドルウェア

- ミドルウェアはトランスポート層にだけ置く。コア層はミドルウェアの存在を知らない。

### デプロイ先の既定値

- 個人プロジェクトのデプロイ先は Cloudflare Workers とする。Hono は Workers への第一級サポートを提供しており、コアを Web 標準 API に保てば、同じサービスをローカルの Node.js でも動かせる。
- 仕事のプロジェクトのデプロイ先は Databricks Apps とし、[Databricks](../toolchain/databricks.md)に従う。2026-08 時点の確認結果は次のとおりである。Databricks Apps は Python、Node.js、またはその両方で構築されたアプリをホストする。Node の依存関係は `package.json` からインストールされ、`pnpm-lock.yaml` がある場合は `pnpm install --frozen-lockfile` が実行される。アプリは `app.yaml` に宣言したコマンドで起動する。管理対象の Node ランタイムはプラットフォームによって固定されており、2026 年半ばの時点では Node 22 で、現在の Active LTS ラインより古い。プラットフォームが公式文書で挙げている Node フレームワークは React、Angular、Svelte、Express である。
- Databricks では、Node のバージョンをプロジェクトではなくプラットフォームが決める。ローカルの LTS を前提とせず、サービスをプラットフォームのランタイムと互換性のある状態に保つ。Hono は `@hono/node-server`経由で通常の Node.js アプリとしてデプロイできる。プラットフォームの文書が Express を挙げていても、Express を採用しない方針は変わらない。
- データと AI を中心とする Databricks のワークロードは、[Python API スタック](../libraries/python-api-stack.md)に従い、引き続き Python で扱う。Node サービスは、明確に導入価値がある場合に限って追加する。

## 連携

### 内部の相互関係

- Hono + Node.js LTS — TypeScript サービスの既定の組み合わせである。個人プロジェクトでは、同じ Hono のコードを Cloudflare Workers にもデプロイできる。

### 関連ガイドライン

- [TypeScript ツールチェーン](../toolchain/typescript.md) — pnpm、oxlint、oxfmt と厳格な tsconfig ベースラインは、バックエンドサービスにもそのまま適用される。
- [Databricks](../toolchain/databricks.md) — 仕事のプロジェクトのデプロイ先、Apps と Jobs の選択、稼働時間帯、デプロイファイルに関する指針。
- [テスト戦略](../practices/testing.md) — フレームワーク非依存のコア層には通常のユニットテストを行い、HTTP に関する部分は薄いアダプタのテストでカバーする。
- [品質ゲート](../toolchain/quality-gates.md) — 同じチェック。prek と CI は同じリンターおよびフォーマッター設定でチェックを実行する。

## 採用しない代替案

- Express：コールバック時代の API、弱い TypeScript の型推論、更新が停滞したミドルウェアモデル。テンプレートやホスティングプラットフォームの既定であっても、新しいサービスに Express を採用してはならない。
