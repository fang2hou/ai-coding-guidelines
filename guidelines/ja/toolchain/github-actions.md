---
id: toolchain/github-actions
lang: ja
version: 3
source-lang: en
status: active
digest: f14d31cd
---

# GitHub Actions

## 標準プラットフォーム

GitHub Actions は標準の CI/CD プラットフォームであり、ユーザーがパイプラインシステムを指定していない場合のデフォルトである。ツールに依存しないパイプラインの規則は [パイプライン](../practices/pipeline.md) に記載されている。

## アクション更新のチェックリスト

GitHub Actions のワークフローを作成または変更するときは、次の事項を確認する。

1. 使用するアクションに新しい安定版があるか確認する。
2. 更新前に公式の README またはドキュメントを確認する。
3. 破壊的変更がないか確認する。
4. 必要な入力、権限、ランタイムバージョン、挙動に変更がないか確認する。
5. 移行が安全な場合は、現在サポートされているバージョンへの移行を優先する。

移行要件を確認せず、アクションのバージョン番号だけを闇雲に更新しない。

## CI の階層構造

CI でも、可能な限りローカル開発で使う標準のプロジェクトツールと同じものを使う。

次の構造を優先する。

```text
GitHub Actions
    -> mise
        -> project task
            -> pnpm / uv / prek / cocogitto / test tooling
```

プロジェクトのロジックをワークフロー YAML に直接重複して記述するのではなく、この構造を使う。

mise を CI から呼び出すエントリーポイントとし、ツールのセットアップ手順をワークフロー YAML に重複して記述しないこと。詳細は [mise](../toolchain/mise.md) を参照。

## 命名と可読性

ツールに依存しない原則については [パイプライン](../practices/pipeline.md) を参照。

GitHub Actions 固有の規則は次のとおりである。

- ワークフローには、目的を示す `name` を設定する（`CI`、`Release` など）。ファイル名に頼らず、ジョブ名をワークフロー名としてそのまま使わない。
- すべてのジョブにわかりやすい `name` を設定する。ジョブ名はブランチ保護のステータスチェックとして表示されるため、失敗したチェックからツールの呼び出しではなく責務（`Validate`、`Validate PR title`）を特定できるようにする。
- すべてのステップには、何をするか、何を検証するかを示す短い命令形のフレーズで名前を付ける（`Install dependencies (pnpm)`、`Check commit history (cog)` など）。`name` のない `run:` ステップは生のコマンドとして表示されるが、コマンドはドキュメントではない。
- 1 つのワークフローファイルには 1 つの関心事だけを持たせる。トリガーや対象者が分かれる場合は分割し、肥大化した 1 つのファイルより複数の小さなワークフローを優先する。

## ハードニングの既定設定

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

- 最小権限：`permissions` はデフォルトで `contents: read` とし、必要なジョブでのみ権限を広げる。
- すべてのジョブに `timeout-minutes` を設定し、ハングしたジョブがプラットフォームのデフォルト上限までランナーの実行時間を消費しないようにする。
- `cancel-in-progress` 付きの `concurrency` を使い、同じ ref で置き換えられた実行をキューに残さず、キャンセルする。
- 信頼できない入力（プルリクエストのタイトル、ブランチ名、issue の内容）は、環境変数を介して `run:` スクリプトに渡し、`${{ }}` に直接埋め込まないこと。直接埋め込むと、スクリプトインジェクションが可能になる。
- アクションは、少なくとも検証済みの作成者が公開するメジャーバージョンタグに固定し、サードパーティ製アクションでは完全なコミット SHA を優先する。

## 関連

- [パイプライン](../practices/pipeline.md) — どの CI システムにも適用できるパイプラインの構造と命名に関する規則。
- [品質ゲート](../toolchain/quality-gates.md) — 同じプロジェクト設定で、ローカルと同等のチェックを実行する。
- [Git ワークフロー](../toolchain/git.md) — CI における Conventional Commits の検証。squash merge 時のプルリクエストタイトルに関する規則を含む。
