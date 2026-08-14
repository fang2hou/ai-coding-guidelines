---
id: libraries/typescript-backend
lang: ja
version: 1
source-lang: en
status: active
digest: 44854cd0
---

# TypeScript Backend

## 判定

推奨 — Elysia を TypeScript バックエンドの標準フレームワークとする。実行は Bun 上で行い、Bun は mise で管理する。ランタイムが Node.js、Cloudflare Workers のようなエッジプラットフォーム、または複数ランタイムでなければならない場合は、Hono を標準の代替とする。Express は採用しない。

## 使用する場面

- TypeScript の API またはバックエンドサービスを構築する場合。

## 避けるべき場面

- サービスが Python の採用基準を満たす場合 — [Python API Stack](../libraries/python-api-stack.md) を使う。
- 成果物が純粋なフロントエンドである場合 — そちらのフレームワーク選定は [フロントエンドフレームワーク：Vite vs Next.js](../libraries/frontend-framework.md) が扱う。

## 長所

- Elysia：エンドツーエンドの型推論 — ルートのスキーマが Eden を通じてクライアントまで流れる。
- Elysia：Bun の HTTP スタック上で一流の性能を出す。
- Elysia：スキーマ検証を内蔵し（TypeBox）、別途検証レイヤーを組み込む必要がない。
- Hono：Web 標準の `Request`/`Response` の上に構築され、コアは極めて小さく、ミドルウェアが実用的である。
- Hono：マルチランタイム — 同じコードが Cloudflare Workers、Bun、Node.js、Deno で動く。

## トレードオフ

- Elysia は Bun ファーストである。Node アダプタ（`@elysiajs/node`）は存在するが、Bun 上で直接動かす場合より若い。Node は既定の選択ではなく、制約のあるデプロイ対象と扱う。
- Hono の同梱機能はレガシーフレームワークより薄く、完全なアプリケーションにはより多くの組み立てが必要である。
- Bun 上で Elysia、それ以外で Hono と分担すると、サービスのパターンがランタイムごとに分岐する。フレームワークはルート単位ではなくサービス単位で 1 つ選ぶ。

## バージョン方針

- Elysia、Hono、Bun はいずれも最新の安定メジャーを使う。具体的な互換性の理由なく、サービスを古いメジャーに留めない。
- Bun は他のツールと同じく mise で管理し、プロジェクトの mise 設定にピンする。
- どちらのフレームワークも現在のドキュメントが示す作法に従う。Express 時代のミドルウェアパターンを持ち込まない。

## 利用ルール

### 境界での検証

- トランスポート境界で検証する。Elysia のルートにスキーマを宣言するか、Hono の validator ミドルウェアを付ける。ハンドラは検証済みで型の付いた値を受け取る。
- コア層はトランスポート関心の再検証をしない。

### ハンドラは薄く、コアはフレームワーク非依存

- ハンドラは薄いアダプタである。境界でフレームワークのリクエストを素の型付き値に変換してからコア層を呼ぶ。コアモジュールは Elysia も Hono も import しない。
- これは [Go API Stack](../libraries/go-api-stack.md) のレイヤー規則と同じ発想である。コア層が依存するのは素の型付き入力と Web 標準 API だけで、Web フレームワークには決して依存しない。

### Web 標準 API

- ランタイム固有の等価物より Web 標準 API（`Request`/`Response`、、、streams）を優先する。コア層はこれにより Bun、Node.js、Workers の間で移植可能になる。

### ルートの型をエンドツーエンドで貫く

- ルートの型を最後まで貫く。クライアント推論には Elysia と Eden を、Hono には RPC クライアント（`hono/client`）を使う。ルートのコントラクトを型のない fetch ラッパーに堕落させない。

### ミドルウェア

- ミドルウェアはトランスポート層にだけ置く。コア層はミドルウェアの存在を知らない。

## 連携

### 内部の相互関係

- Elysia + Bun — Elysia は Bun ファーストであり、Bun の HTTP、ファイルシステム、ホットリロードの API の上に構築されている。Elysia サービスの既定ランタイムは Bun である。
- Elysia ↔ Hono — ランタイムが決める。既定は Bun 上の Elysia、サービスが Node.js、Cloudflare Workers、または複数ランタイムで動かなければならない場合は Hono とする。

### 関連ガイドライン

- [TypeScript ツールチェーン](../toolchain/typescript.md) — pairs-with: pnpm、oxlint、oxfmt、厳格な tsconfig ベースラインはバックエンドサービスにもそのまま適用する。
- [テスト戦略](../practices/testing.md) — テストの焦点：フレームワーク非依存のコア層は素のユニットテストで、HTTP 部分は薄いアダプタとしてカバーする。
- [品質ゲート](../toolchain/quality-gates.md) — 同じチェック：prek と CI が同じ Lint とフォーマット設定を実行する。

## 採用しない代替案

- Express：コールバック時代の API、弱い TypeScript 推論、停滞したミドルウェアモデル。テンプレートの既定が Express であっても、新しいサービスの足場をその上に作らない。
