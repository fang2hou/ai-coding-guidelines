---
id: libraries/typescript-backend
lang: ja
version: 2
source-lang: en
status: active
digest: 9b2410ba
---

# TypeScript Backend

## 判定

推奨 — Hono を TypeScript バックエンドの標準フレームワークとする。既定のランタイムは Active LTS ライン上の Node.js であり、Web 標準 API によりサービスは Cloudflare Workers など他のランタイムへ移植できる。モデルは訓練データに基づいてコードを生成するため、主流で十分に検証されたスタックほど AI 支援開発での破綻が少ない。この姿勢が本書の判定を規定している。

Elysia は理由が明確な例外に限る。Elysia は Bun を必須とし、Bun の Node エコシステムに対する互換性リスクは既定では許容できない。採用にはユーザーの明示的な承認と理由の記録が必要で、プロジェクトに ADR があれば ADR に記録する。Express の不採用は変わらない。

## 使用する場面

- TypeScript の API またはバックエンドサービスを構築する場合。

## 避けるべき場面

- サービスが Python の採用基準を満たす場合 — [Python API Stack](../libraries/python-api-stack.md) を使う。
- 成果物が純粋なフロントエンドである場合 — そちらのフレームワーク選定は [フロントエンドフレームワーク：Vite vs Next.js](../libraries/frontend-framework.md) が扱う。

## 長所

- Hono：マルチランタイム — 同じコードが Node.js、Cloudflare Workers、Bun、Deno で動く。これが決定的な長所であり、1 つのフレームワークで Node LTS での既定運用とエッジへのデプロイを同じコードベースで賄える。
- Hono：Web 標準の `Request`/`Response` の上に構築され、コアは極めて小さく、ミドルウェアが実用的である。
- Hono：型付き RPC クライアント（`hono/client`）により、ルートのコントラクトがエンドツーエンドで型付きのまま保たれる。
- Elysia：エンドツーエンドの型推論 — ルートのスキーマが Eden を通じてクライアントまで流れる。
- Elysia：Bun の HTTP スタック上で一流の性能を出す。
- Elysia：スキーマ検証を内蔵し（TypeBox）、別途検証レイヤーを組み込む必要がない。

## トレードオフ

- Elysia は Bun を必須とする。Bun の Node エコシステムに対する互換性リスクが決定的なトレードオフであり、既定のランタイムとしては許容できない。すべての Elysia サービスがこの例外を背負う。
- Hono の同梱機能はレガシーフレームワークより薄く、完全なアプリケーションにはより多くの組み立てが必要である。
- 承認された Elysia サービスは、ランタイムごとにバックエンドのパターンを分岐させる。こうした例外は分離して記録し、フレームワークはサービス単位で 1 つに保つ。

## バージョン方針

- Hono と Elysia は最新の安定メジャーを使う。具体的な互換性の理由なく、サービスを古いメジャーに留めない。
- ランタイムは mise で Node.js の Active LTS ラインに固定する。2026-08 時点では Node.js 24（EOL 2028-04）である。Current ラインでサービスを動かさない。
- Bun は承認された Elysia サービス専用とし、他のツールと同じく mise で管理してピンする。

## 利用ルール

### 境界での検証

- トランスポート境界で検証する。Elysia のルートにスキーマを宣言するか、Hono の validator ミドルウェアを付ける。ハンドラは検証済みで型の付いた値を受け取る。
- コア層はトランスポート関心の再検証をしない。

### ハンドラは薄く、コアはフレームワーク非依存

- ハンドラは薄いアダプタである。境界でフレームワークのリクエストを素の型付き値に変換してからコア層を呼ぶ。コアモジュールは Elysia も Hono も import しない。
- これは [Go API Stack](../libraries/go-api-stack.md) のレイヤー規則と同じ発想である。コア層が依存するのは素の型付き入力と Web 標準 API だけで、Web フレームワークには決して依存しない。

### Web 標準 API

- ランタイム固有の等価物より Web 標準 API（`Request`/`Response`、`fetch`、`URL`、streams）を優先する。コア層はこれにより Node.js、Workers、承認された Bun の例外の間で移植可能になる。

### ルートの型をエンドツーエンドで貫く

- ルートの型を最後まで貫く。クライアント推論には Elysia と Eden を、Hono には RPC クライアント（`hono/client`）を使う。ルートのコントラクトを型のない fetch ラッパーに堕落させない。

### ミドルウェア

- ミドルウェアはトランスポート層にだけ置く。コア層はミドルウェアの存在を知らない。

### デプロイの既定値

- 個人プロジェクトのデプロイ先は Cloudflare Workers とする。Hono は Workers を第一級でサポートしており、コアを Web 標準 API に保てば、同じサービスをローカルの Node.js でも動かせる。
- 仕事のプロジェクトのデプロイ先は Databricks Apps とし、[Databricks](../toolchain/databricks.md) に従う。2026-08 時点で確認できた事実：Databricks Apps は Python、Node.js、またはその両方で作られたアプリをホストする。Node の依存関係は `package.json` からインストールされ（`pnpm-lock.yaml` があれば `pnpm install --frozen-lockfile` を実行）、`app.yaml` に宣言したコマンドでアプリが起動する。管理対象の Node ランタイムはプラットフォーム側で固定されており、2026 年中は Node 22 で、現在の Active LTS ラインより古い。プラットフォーム文書が挙げる Node フレームワークは React、Angular、Svelte、Express である。
- Databricks では Node のバージョンをプロジェクトではなくプラットフォームが決める。ローカルの LTS を前提とせず、サービスをプラットフォームのランタイムとの互換に保つ。Hono は `@hono/node-server` 経由で通常の Node.js アプリとしてデプロイでき、プラットフォーム文書に Express が並んでいても Express 不採用の結論は変わらない。
- データ・AI 中心の Databricks ワークロードは [Python API Stack](../libraries/python-api-stack.md) に従う Python サービスが引き続き標準である。そこで Node サービスを導入するのは、明確に見合う価値があるときだけにする。

## 連携

### 内部の相互関係

- Hono + Node.js LTS — TypeScript サービスの既定の組み合わせ。同じ Hono のコードは、個人プロジェクトでは Cloudflare Workers へのデプロイ対象にもなる。
- Elysia + Bun — 承認された例外専用の組み合わせ。Elysia は Bun ファーストであり、Bun の HTTP、ファイルシステム、ホットリロードの API の上に構築されている。

### 関連ガイドライン

- [TypeScript ツールチェーン](../toolchain/typescript.md) — pairs-with: pnpm、oxlint、oxfmt、厳格な tsconfig ベースラインはバックエンドサービスにもそのまま適用する。
- [Databricks](../toolchain/databricks.md) — 仕事のプロジェクトのデプロイ先。Apps か Jobs かの選択、稼働時間帯、デプロイファイル。
- [テスト戦略](../practices/testing.md) — テストの焦点：フレームワーク非依存のコア層は素のユニットテストで、HTTP 部分は薄いアダプタとしてカバーする。
- [品質ゲート](../toolchain/quality-gates.md) — 同じチェック：prek と CI が同じ Lint とフォーマット設定を実行する。

## 採用しない代替案

- Express：コールバック時代の API、弱い TypeScript 推論、停滞したミドルウェアモデル。テンプレートやホスティングプラットフォームの既定であっても、新しいサービスの足場をその上に作らない。
