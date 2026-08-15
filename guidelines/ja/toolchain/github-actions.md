---
id: toolchain/github-actions
lang: ja
version: 3
source-lang: en
status: active
digest: b560c99a
---

# GitHub Actions

## 標準プラットフォーム

GitHub Actions は標準の CI/CD プラットフォームであり、ユーザーがパイプラインシステムを特に指定していない場合のデフォルトである。ツールに依存しない規則は [パイプライン](../practices/pipeline.md) にある。

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

## 命名と可読性

ツールに依存しない原則は [パイプライン](../practices/pipeline.md) を参照。

GitHub Actions では次のように扱う。

- ワークフローには、その目的を示す `name` を与える（`CI`、`Release` など）。ファイル名に頼らない。また、ジョブ名をそのままワークフロー名として繰り返さない。
- すべてのジョブに読める `name` を与える。ジョブ名はブランチ保護のステータスチェックとして表示されるため、失敗したチェックをツールの呼び出しではなく責務（`Validate`、`Validate PR title`）に対応づけられること。
- すべてのステップを、何をするか・何を検証するかを示す短い命令形のフレーズで名付ける（`Install dependencies (pnpm)`、`Check commit history (cog)` など）。`name` のない `run:` ステップは生のコマンドとして表示されるが、コマンドはドキュメントではない。
- ワークフローファイルひとつに持たせる関心はひとつだけ。トリガーや対象者が分岐したら分割する。肥大化するひとつのファイルよりも、複数の小さなワークフローを優先する。

## ハードニングのデフォルト

明確な理由がない限り、すべてのワークフローに次を適用する。

```yaml
permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    timeout-minutes: 15
```

- 最小権限：`permissions` はデフォルトで `contents: read` とし、必要なジョブでのみ緩める。
- すべてのジョブに `timeout-minutes` を設定し、ハングしたジョブがプラットフォームのデフォルト上限までランナー時間を消費しないようにする。
- `cancel-in-progress` 付きの `concurrency` を使い、同じ ref 上の古い実行をキューに並べずにキャンセルする。
- 信頼できない入力（PR タイトル、ブランチ名、issue のテキスト）は環境変数経由で `run:` スクリプトに渡し、`${{ }}` の直接埋め込みは使わない。直接埋め込みはスクリプトインジェクションを可能にする。
- アクションは最低でも検証済み作成者のメジャーバージョンタグに固定し、サードパーティのアクションでは完全なコミット SHA を優先する。

## 関連

- [パイプライン](../practices/pipeline.md) — どの CI システムにも当てはまるパイプラインの構造化と命名の規則。
- [Quality Gates](../toolchain/quality-gates.md) — 同じプロジェクト設定で同等のローカルチェックを実行する。
- [Git Workflow](../toolchain/git.md) — CI における Conventional Commits 検証。squash merge 時のプルリクエストタイトルの規則を含む。
