---
id: toolchain/github-actions
lang: ja
version: 1
source-lang: en
status: active
digest: e19446ea
---

# GitHub Actions

## 標準プラットフォーム

GitHub Actions は標準の CI/CD プラットフォームである。

## アクション更新のチェックリスト

GitHub Actions のワークフローを作成または変更するときは、次を確認する。

1. 使用しているアクションに新しい安定版があるか。
2. 更新前に公式の README またはドキュメントを確認したか。
3. 破壊的変更がないか。
4. 必要な入力、権限、ランタイムバージョン、挙動が変わっていないか。
5. 移行が安全な場合は、現在サポートされているバージョンへの移行を優先する。

移行要件を確認せずに、アクションのバージョン番号だけを闇雲に更新しない。

## CI の階層構造

CI では、可能な限りローカル開発と同じ標準プロジェクトツールを使う。

次の構造を優先する。

```text
GitHub Actions
    -> mise
        -> project task
            -> pnpm / uv / prek / cocogitto / test tooling
```

プロジェクトロジックをワークフロー YAML に直接書き写すのではなく、この構造を使う。

mise は CI が呼び出すエントリーポイントであり、ツールのセットアップ手順をワークフロー YAML に重複して書くものではない。詳細は [mise](../toolchain/mise.md) を参照。

## 関連

* [Quality Gates](../toolchain/quality-gates.md) — 同じプロジェクト設定で同等のローカルチェックを実行する。
* [Git Workflow](../toolchain/git.md) — CI における Conventional Commits 検証。squash merge 時のプルリクエストタイトルの規則を含む。
