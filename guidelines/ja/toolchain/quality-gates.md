---
id: toolchain/quality-gates
lang: ja
version: 5
source-lang: en
status: active
digest: 70ab7b48
---

# 品質ゲート

## prek

`prek` を標準のプリコミットフレームワークとして使う。

ユーザーが明示的に例外を承認した場合を除き、別のプリコミットフレームワークを導入しない。

フック設定には prek のネイティブ形式 `prek.toml` を使う。pre-commit との互換性が必要な場合に限り `.pre-commit-config.yaml` を使う。

フックは、他の処理で使うものと同じエントリーポイントを指すこと。

```toml
# prek.toml - the hook runs the shared entry point
[[repos]]
repo = "local"
hooks = [
  { id = "check", entry = "mise run check", language = "system", pass_filenames = false }
]
```

### 採用しない代替案

- pre-commit
- Lefthook

## デフォルトのチェックセット

`prek.toml` には、短時間で実行できるプロジェクトのチェックを含める。デフォルトは次のとおりである。

- リント
- フォーマットチェック
- 言語固有の静的チェック
- セキュリティ関連のチェック
- 必要に応じた依存関係チェック
- シークレットスキャニング

このツールチェーンでの対応は、具体的には次のとおりである。

```text
lint         -> oxlint / ruff check
format check -> oxfmt --check / ruff format --check
typecheck    -> typeCheck を有効にした oxlint（tsgolint）/ tsc --noEmit
```

oxlint の `options.typeCheck`（`oxlint-tsgolint` 経由）は TypeScript の診断を報告し、非ゼロの終了コードで失敗する。そのため、typecheck をこの 1 コマンドで担える。型を考慮したリントを設定していない場合は、単体の `tsc --noEmit` を使う。

## チェックを高速に保つ

プリコミットチェックはコミットのたびに走るため、人間も AI エージェントもストレスなく繰り返せる速さに保つこと。網羅的に見せるためだけに重いチェックを入れない。

```text
# good - fast enough for every commit
lint, format check, typecheck, secret scanning

# bad - too slow for a commit hook; belong in CI
full E2E suite, dependency audit against live registries
```

## ローカルと CI の一致

GitHub でホストするリポジトリでは、ローカルで変更の合否を決めるコマンドとまったく同じコマンドを GitHub Actions でも実行し、両環境のずれを防ぐ。

```bash
# local
mise run check && mise run test
```

```yaml
# .github/workflows/ci.yml - steps section
- uses: jdx/mise-action@v4 # installs the mise-managed toolchain
- run: mise run check
- run: mise run test
```

これらのコマンドがローカルでは通るのに CI では失敗するなら、両環境にずれが生じている。CI 専用の修正を重ねるのではなく、両環境を一致させること。

CI の階層モデルについては [GitHub Actions](../toolchain/github-actions.md) を、同じツール群をタスク経由で使う方法については [mise](../toolchain/mise.md) を参照。

## 検証のエントリーポイント

可能な限り、主要な検証ワークフローを `mise run check` として公開する。

```bash
mise run check
```

`check` の後に `test` を連鎖させ、検証を通過していないコードではテストを実行しないこと。

```toml
# mise.toml - the check -> test chain
[tasks.check]
depends = ["lint", "format", "typecheck"]

[tasks.test]
depends = ["check"] # test never runs on unvalidated code
run = "pnpm test"
```
