---
id: libraries/go-api-stack
lang: ja
version: 1
source-lang: en
status: draft
digest: 3882eb11
---

# Go API Stack

## 判定

推奨 — Echo を Go の標準 Web フレームワークとし、リクエスト検証には `github.com/go-playground/validator/v10` を使う。このスタックは、Go 自体の採用が [Go ツールチェーン](../toolchain/go.md) の基準で正当化された後にのみ適用する。

## 使用する場面

- Go サービスが HTTP API を必要とし、Go の採用自体が [Go ツールチェーン](../toolchain/go.md) の基準を満たしている場合。

## 避けるべき場面

- Go が正当化されていない場合 — 無理にこのスタックを選ばず、既定の [TypeScript Backend](../libraries/typescript-backend.md) または [Python API Stack](../libraries/python-api-stack.md) に戻る。

## 長所

- Echo：ルーティングとミドルウェアが成熟し、API の表面は小さい。必要なミドルウェアを同梱しながら `net/http` を隠さない。
- Echo：性能が高くアロケーションオーバーヘッドが低く、Go を採用する理由となる性能敏感なサービスに適する。
- Echo：保守が活発である — 現行ラインは v5 で、v4 は 2026-12-31 までセキュリティ修正とバグ修正を受け取る。
- validator：Go の事実上の標準的な構造体検証ライブラリであり、Echo のリクエストバインディングと統合される。

## トレードオフ

- フレームワークのコンテキストは結合を誘う。は便利で、これに沿って書いたビジネスロジックはフレームワークの中に閉じ込められる。下のレイヤー規則はこの問題を抑えるためにある。
- サービスは Echo のアップグレード周期を継承する。メジャーラインの移行（v4 から v5）はプロジェクトではなくフレームワークの日程で来る。

## バージョン方針

- 新しいサービスは Echo の現行の安定メジャーラインで始め、その最新の安定マイナーを追う。2026-08 時点の現行ラインは v5（`github.com/labstack/echo/v5`）である。着手前に Echo のリリースで確認し、本文書をバージョンの固定値として扱わない。
- 既存のサービスは使用中メジャーラインの最新マイナーに留まる。v4 上のサービスは v4 のサポート終了（2026-12-31）までに、Echo の現在のドキュメントのアップグレード手順に従って v5 へ移行する。
- フレームワークの現在のドキュメントが示す作法に従う。GOPATH 時代や modules 以前のブログ記事のパターンを決してコピーしない。import パス、プロジェクト構成、ミドルウェア登録はいずれも年月とともに変わっている。
- 支援ライブラリは最近の安定メジャーとその現在のベストプラクティスに保つ。validator の現行 import パスは `github.com/go-playground/validator/v10` である。

## 利用ルール

### レイヤー構成：ハンドラは薄いアダプタ

- HTTP ハンドラはトランスポート境界にある薄いアダプタである。コア層を呼ぶ前に、フレームワークのコンテキスト（`echo.Context`）を標準の `context.Context` と検証済みの型付きリクエスト値に変換する。
- コア／ビジネス層が依存するのは標準ライブラリの context とドメイン型だけである。echo も他のどの Web フレームワークも import しない。
- これによりコア層は素の Go テストで検証でき、トランスポート方式にも縛られない。

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

`core.Service.Do(ctx context.Context, req CreateUser)` は標準の context とドメイン型だけを受け取り、には決して触れない。

### リクエスト検証

- トランスポート境界で `github.com/go-playground/validator/v10` を使ってリクエストを検証する。bind → validate → ドメイン型への変換、の順で行う。
- コア層は既に妥当な値を受け取り、トランスポート関心の再検証はしない。

### ミドルウェア

- ミドルウェア（認証、ログ、recovery、CORS）はトランスポート層にだけ置く。コア層はミドルウェアの存在を知らない。

## 連携

### 内部の相互関係

- Echo + validator — 起動時にバリデータを一度登録する。Echo の bind → validate の流れが、ドメイン型への変換前にリクエストの形を確認する標準の場所である。

### 関連ガイドライン

- [Go ツールチェーン](../toolchain/go.md) — pairs-with: このスタックのリンティング、フォーマット、context とエラー処理の規則。
- [テスト戦略](../practices/testing.md) — テストの焦点：フレームワーク非依存のコア層はテーブル駆動の Go テストで、HTTP 部分は薄いアダプタとしてカバーする。
- [品質ゲート](../toolchain/quality-gates.md) — 同じチェック：prek と CI が同じ Lint とフォーマット設定を実行する。

## 採用しない代替案

- ビジネスロジックを通じて `echo.Context` の上に書くこと — フレームワークの外ではテストできず、Echo の内部実装に固定される。
- 同じサービスへの 2 つ目の Web フレームワークの導入 — 1 サービス 1 フレームワークとする。
