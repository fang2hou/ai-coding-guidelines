---
id: libraries/go-api-stack
lang: ja
version: 1
source-lang: en
status: draft
digest: 1dba5a92
---

# Go API スタック

## 判定

推奨 — Go の Web フレームワークには Echo を推奨し、リクエスト検証には `github.com/go-playground/validator/v10` を使う。Go 自体の採用が [Go ツールチェーン](../toolchain/go.md)の基準に基づいて正当化された場合に限り、このスタックを適用する。

## 使用する場面

- Go サービスが HTTP API を必要とし、Go の採用自体が [Go ツールチェーン](../toolchain/go.md)の基準をすでに満たしている場合。

## 避けるべき場面

- Go の採用が正当化されない場合は、このスタックを無理に選ばず、代わりに既定の [TypeScript バックエンド](../libraries/typescript-backend.md)または [Python API スタック](../libraries/python-api-stack.md)を使う。

## 長所

- Echo：ルーティングとミドルウェアが成熟しており、API はコンパクトである。必要な機能を備えながら、`net/http` を隠さない。
- Echo：高性能でアロケーションのオーバーヘッドが小さく、Go の採用を正当化する性能要件の厳しいサービスに適する。
- Echo：活発に保守されている。現行ラインは v5 であり、v4 も 2026-12-31 までセキュリティ修正とバグ修正を受け続ける。
- validator：Go の構造体検証における事実上の標準ライブラリであり、Echo のリクエストバインディングと統合できる。

## トレードオフ

- フレームワークのコンテキストは結合を招く。`echo.Context` は便利だが、それに依存して書いたビジネスロジックはフレームワークに閉じ込められる。以下のレイヤー規則は、この問題を封じ込めるためにある。
- サービスは Echo のアップグレード周期を引き継ぐ。メジャーラインの移行（v4 から v5）はプロジェクトの都合ではなく、フレームワークのスケジュールで行われる。

## バージョン方針

- 新しいサービスは Echo の現行の安定メジャーラインで始め、最新の安定マイナーを追う。2026-08 時点の現行ラインは v5（`github.com/labstack/echo/v5`）である。着手前に Echo のリリースを確認し、この文書をバージョンの確定情報として扱わない。
- 既存サービスは、使用中のメジャーラインの最新マイナーを使う。v4 のサービスは、v4 のサポート終了（2026-12-31）までに v5 へ移行する。移行には Echo の現行ドキュメントに記載されたアップグレード手順を使う。
- フレームワークの現行ドキュメントに記載された作法に従う。GOPATH 時代や Go modules 以前のブログ記事のパターンを決してコピーしない。import パス、プロジェクト構成、ミドルウェア登録はいずれも年月とともに変化している。
- 周辺ライブラリは新しい安定メジャーを使い、現在のベストプラクティスに従う。validator の現行 import パスは `github.com/go-playground/validator/v10` である。

## 利用ルール

### レイヤー構成：ハンドラは薄いアダプタ

- HTTP ハンドラはトランスポート境界の薄いアダプタである。コア層を呼び出す前に、フレームワークのコンテキスト（`echo.Context`）を標準の `context.Context` と検証済みの型付きリクエスト値に変換する。
- コア／ビジネス層は標準ライブラリの context とドメイン型だけに依存し、`echo` も他の Web フレームワークも import しない。
- これにより、コア層は通常の Go テストで検証でき、トランスポート間でも移植可能である。

```go
// Transport layer — the only place Echo appears.
func (h *Handler) CreateUser(c echo.Context) error {
	var in CreateUserInput // transport type with `validate:"..."` tags
	if err := c.Bind(&in); err != nil {
		return err
	}
	if err := c.Validate(&in); err != nil {
		return err
	}
	return h.Service.Do(c.Request().Context(), in.ToDomain())
}
```

`core.Service.Do(ctx context.Context, req CreateUser)` は標準の context とドメイン型だけを受け取り、`echo.Context` には決して触れない。

### リクエスト検証

- トランスポート境界で `github.com/go-playground/validator/v10` を使ってリクエストを検証する。bind → validate → ドメイン型への変換の順で処理する。
- コア層は検証済みの値を受け取り、トランスポートに関する検証を再度行わない。

### ミドルウェア

- ミドルウェア（認証、ログ、recovery、CORS）はトランスポート層にだけ置く。コア層はミドルウェアの存在を知らない。

## 連携

### 内部の相互関係

- Echo + validator — 起動時に 1 回だけバリデータを登録する。Echo の bind → validate パイプラインが、ドメイン型への変換前にリクエストの形式を検証する標準の場所である。

### 関連ガイドライン

- [Go ツールチェーン](../toolchain/go.md) — このスタックでは、そのリンティング、フォーマット、context、エラー処理のルールに従う。
- [テスト戦略](../practices/testing.md) — フレームワーク非依存のコア層にはテーブル駆動の Go テストを使い、HTTP に関する部分は薄いアダプタのテストでカバーする。
- [品質ゲート](../toolchain/quality-gates.md) — 同じチェック。prek と CI は同じリンターおよびフォーマッター設定でチェックを実行する。

## 採用しない代替案

- ビジネスロジックを `echo.Context` に直接依存させること — フレームワークの外ではテストできず、Echo の内部実装に固定される。
- 同じサービスに 2 つ目の Web フレームワークを導入すること — 1 サービスにつき 1 つのフレームワークとする。
