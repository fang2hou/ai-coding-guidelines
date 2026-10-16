---
id: toolchain/databricks
lang: ja
version: 1
source-lang: en
status: active
digest: 4e3f275e
---

# Databricks

## Apps と Jobs

データおよび AI ワークロードでは Databricks を優先する。アプリケーションのホスティングと管理には Databricks Apps、スケジュール実行や自動実行には Databricks Jobs を使う。

## デフォルトの稼働時間帯

アプリケーションを勤務時間内だけ稼働させるプロジェクトでは、デフォルトの稼働時間帯を次のとおりとする。

```text
09:00 - 22:00 GMT+9
```

プロジェクトに別の明示的な要件がある場合を除く。

## デプロイファイル

Databricks のデプロイ YAML と関連するデプロイ設定は、次のディレクトリ以下に置く。

```text
/deploy
```

デプロイ設定は、現行の Databricks Apps デプロイモデルとプロジェクトの環境要件に合わせて保つこと。

## 権限

必要に応じて同じプロジェクトやチームのメンバーに編集権限を付与してよいが、プロジェクトの範囲外へ権限を広げないこと。

Databricks のワークロードを支える Python サービスは、[Python API スタック](../libraries/python-api-stack.md) に従う。
