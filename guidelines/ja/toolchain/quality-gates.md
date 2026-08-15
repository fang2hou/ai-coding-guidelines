---
id: toolchain/quality-gates
lang: ja
version: 2
source-lang: en
status: active
digest: e9cd32e5
---

# 品質ゲート

## prek

標準のプリコミットフレームワークとして `prek` を使う。

ユーザーが明示的に例外を承認しない限り、別のプリコミットフレームワークを導入しない。

フックは、他のすべての環境と同じエントリーポイントを指すこと。

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

リポジトリの prek 設定には、プロジェクトに関係する高速なチェックを含める。

デフォルトでは次を含める。

- リント
- フォーマットのチェック
- 言語固有の静的チェック
- セキュリティ関連のチェック
- 適切な場合の依存関係チェック
- シークレットスキャニング

具体的なツールに対応づけると、次のようになる。

```text
lint         -> oxlint / ruff check
format check -> oxfmt --check / ruff format --check
typecheck    -> tsc --noEmit
```

## チェックを高速に保つ

プリコミットのチェックは、意味のあるものにとどめ、高速に保つ。

フック設定を網羅的に見せるためだけに、コストの高いチェックを追加しない。

コミットごとに実行するチェックは、人間にも AI エージェントにも気軽に実行できる速度を保つ。

```text
# good - fast enough for every commit
lint, format check, typecheck, secret scanning

# bad - too slow for a commit hook; belong in CI
full E2E suite, dependency audit against live registries
```

## ローカルと CI の一致

GitHub でホストするリポジトリでは、GitHub Actions が同じプロジェクト設定で同等のチェックを実行し、ローカルと CI の検証が乖離しないようにする。

不変条件は、ローカルで変更の合否を決めるコマンドと、CI が実行するコマンドが完全に同一であることだ。

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

これらのコマンドがローカルで通って CI で失敗するなら、両環境はすでに乖離している。CI 専用の修正を積み重ねるのではなく、環境どうしを一致させること。

CI の階層モデルについては [GitHub Actions](../toolchain/github-actions.md) を、同じツール群をタスク経由で使う方法については [mise](../toolchain/mise.md) を参照。

## 検証のエントリーポイント

可能な範囲で、品質に関わるワークフローを mise タスクとして公開する。

たとえば：

```bash
mise run check
```

このタスクを、プロジェクトの主要な検証ワークフローの決まったエントリーポイントとする。

`test` を `check` の後につなぎ、検証を通っていないコードでテストを実行しないこと。

```toml
# mise.toml - the check -> test chain
[tasks.check]
depends = ["lint", "format", "typecheck"]

[tasks.test]
depends = ["check"] # test never runs on unvalidated code
run = "pnpm test"
```
