---
id: toolchain/go
lang: ja
version: 1
source-lang: en
status: draft
digest: 9208e54b
---

# Go ツールチェーン

## 適用義務

TypeScript と Python は AI 支援開発のデフォルト言語である。ライブラリとエージェントのエコシステム支援が最も充実しているためである。

Go はデフォルトの選択肢ではない。

次の要件が本当に必要な場合にのみ Go を選ぶ。

* 性能要件の厳しいネットワークサービス
* 単一バイナリとして配布するコマンドラインツール
* 静的な単一バイナリのデプロイ対象
* 並行性の高いワークロード

Go の採用には明確な理由とユーザーの承認が必要であり、プロジェクトの ADR に記録する。

Go に慣れていること自体は理由にならない。

## 適用範囲

これはベースラインであり、採用前にプロジェクト個別の分析を行う。

採用前に、要件が上記の場面のいずれかに該当すること、そして TypeScript または Python では許容できるコストで満たせないことを確認する。

## バージョン方針

最新の安定版 Go を mise で管理して使う。

`go.mod` の `toolchain` ディレクティブは、mise で管理する Go のバージョンと一致させる。

記録された理由がない限り、古い Go のバージョンに固定しない。

## 利用ルール

### リント

リンターには `golangci-lint` を使う。

mise タスクとして公開し、ローカルと CI で同じ設定を使う。

### フォーマット

フォーマッターには `gofumpt` を使う。

フォーマット確認は pre-commit 設定と CI に含める。

### エラー処理

文脈を追加するときは `%w` でエラーをラップする。

```go
return fmt.Errorf("loading config: %w", err)
```

ラップされたエラーは `errors.Is` と `errors.As` で調べる。

エラーメッセージの文字列比較で判定しない。

### Context

ブロックする関数およびリクエストスコープの関数では、最初のパラメータとして `context.Context` を渡す。

呼び出し元の context を伝播させ、ライブラリコードの内部で新たに `context.Background` を作らない。

### 並行処理

goroutine の所有者を明示する。すべての goroutine には、そのライフサイクルに責任を持つ所有者を一つ定める。

キャンセルは context の伝播によって明示する。

goroutine をリークさせない。

### テスト

複数の入力がある振る舞いは、テーブル駆動テストでカバーする。

CI では `go test -race` を実行する。

### panic

ライブラリコードでは `panic` を使わず、エラーを返す。

`panic` は `cmd/` のエントリーポイントにおける回復不能な起動時エラーにのみ使う。

### ディレクトリ構成

エントリーポイントは `cmd/` に置く。

公開しないパッケージは `internal/` に置く。

## 連携

* [mise](../toolchain/mise.md) — バージョン管理: Go と golangci-lint を mise で管理し、mise タスクとして公開する。
* [品質ゲート](../toolchain/quality-gates.md) — 同じチェック: prek と CI が同じリント・フォーマット設定を実行する。
* [Git ワークフロー](../toolchain/git.md) — コミット規律: Go の変更も標準のコミットおよび PR ルールに従う。
* [テスト戦略](../practices/testing.md) — テストの焦点: 何をどのレベルで検証するか。

## 採用しない代替案

プロジェクトのフォーマッターとして、単体の `gofmt` や `goimports` は使わない。

`gofumpt` は `gofmt` の厳密な上位集合であり、import の並べ替えは gofumpt と golangci-lint の `gci` または `goimports` ルールで処理する。
