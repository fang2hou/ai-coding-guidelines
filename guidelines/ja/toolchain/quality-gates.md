---
id: toolchain/quality-gates
lang: ja
version: 2
source-lang: en
status: active
digest: c996fe76
---

# 品質ゲート

## prek

`prek` を標準のプリコミットフレームワークとして使う。

ユーザーが明示的に例外を承認した場合を除き、別のプリコミットフレームワークを導入しない。

フックは、他の処理で使うものと同じエントリーポイントを指すこと。

```yaml
# .pre-commit-config.yaml - the hook runs the shared entry point
repos:
  - repo: local
    hooks:
      - id: check
        entry: mise run check
        language: system
        pass_filenames: false
```

### 採用しない代替案

- pre-commit
- Lefthook

## デフォルトのチェックセット

リポジトリの prek 設定には、プロジェクトに必要で、短時間で実行できるチェックを含める。

デフォルトでは、次のチェックを含める。

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
typecheck    -> tsc --noEmit
```

## チェックを高速に保つ

プリコミットチェックは、意味のあるものに絞り、高速に保つ。

フックの設定を網羅的に見せるためだけに、高コストのチェックを追加しない。

コミットごとに実行するチェックは、人間と AI エージェントが頻繁に利用できる十分な速さを保つ。

```text
# good - fast enough for every commit
lint, format check, typecheck, secret scanning

# bad - too slow for a commit hook; belong in CI
full E2E suite, dependency audit against live registries
```

## ローカルと CI の一致

GitHub 上でホストするリポジトリでは、GitHub Actions で同じプロジェクト設定を使って同等のチェックを実行し、ローカルと CI の検証を一致させる。

不変条件は、ローカルで変更の合否を決めるコマンドと、CI が実行するコマンドが完全に同じであることだ。

```bash
# local
mise run check && mise run test
```

```yaml
# .github/workflows/ci.yml - steps section
- uses: jdx/mise-action@v2 # installs the mise-managed toolchain
- run: mise run check
- run: mise run test
```

これらのコマンドがローカルでは通るのに CI では失敗するなら、両環境にずれが生じている。CI 専用の修正を重ねるのではなく、両環境を一致させること。

CI の階層モデルについては [GitHub Actions](../toolchain/github-actions.md) を、同じツール群をタスク経由で使う方法については [mise](../toolchain/mise.md) を参照。

## 検証のエントリーポイント

可能な限り、品質に関するワークフローを mise タスクとして公開する。

たとえば：

```bash
mise run check
```

このタスクを、プロジェクトの主要な検証ワークフローを実行するための予測可能なエントリーポイントとする。

`check` の後に `test` を連鎖させ、検証を通過していないコードではテストを実行しないこと。

```toml
# mise.toml - the check -> test chain
[tasks.check]
depends = ["lint", "format", "typecheck"]

[tasks.test]
depends = ["check"] # test never runs on unvalidated code
run = "pnpm test"
```
