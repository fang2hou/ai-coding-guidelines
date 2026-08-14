---
id: libraries/python-api-stack
lang: ja
version: 1
source-lang: en
status: active
digest: 6affb64c
---

# Python API Stack

## 判定

推奨 — FastAPI + Pydantic + Uvicorn を推奨の Python API 基盤とする。3 つは個別の選択としてではなく、1 つのスタックとして採用する。

## 使用する場面

- [Python ツールチェーン](../toolchain/python.md)の基準を満たし、Python バックエンドの導入が正当化されている場合。
- データ検証と構造化モデルが必要な Python API を構築する場合。
- デプロイプラットフォームがマネージドな ASGI サーバーを提供しない環境で、FastAPI アプリケーションを提供する場合。

## 避けるべき場面

- TypeScript のみのアーキテクチャで十分な場合 — Python バックエンドを自動的に導入してはならない([Python ツールチェーン](../toolchain/python.md)を参照)。
- デプロイプラットフォームが、Uvicorn の適切なマネージド代替を提供する場合。

## 長所

- FastAPI: 自動的な OpenAPI ドキュメント生成を備えた、高性能な ASGI フレームワーク。
- Pydantic: 型付きのデータ検証と構造化モデル。FastAPI のリクエスト・レスポンス処理と統合される。
- Uvicorn: FastAPI アプリケーションの提供に使う、軽量で標準的な ASGI サーバー。

## トレードオフ

- このスタックの導入により、独自の依存関係とデプロイ対象を持つ Python サービスが加わる。
- Pydantic モデルは、検証対象のデータとの同期を保たなければならない。

## バージョン方針

- 新規プロジェクトでは、FastAPI、Pydantic、Uvicorn の最新安定版を使う。
- 具体的な互換性の理由がない限り、スタックを古いバージョンに留めてはならない。

## 利用ルール

- Python API フレームワークには FastAPI を使う。
- Python のデータ検証と構造化モデルには、必要な箇所で Pydantic を使う。
- FastAPI アプリケーションの標準 ASGI サーバーには Uvicorn を使う。ただし、デプロイプラットフォームが適切なマネージド代替を提供する場合は除く。

## 連携

### 内部の相互関係

- FastAPI + Pydantic — Pydantic モデルが FastAPI の検証レイヤーである。リクエストとレスポンスのスキーマは、自作の検証ではなく Pydantic モデルとして定義する。
- FastAPI + Uvicorn — Uvicorn は FastAPI アプリケーションの標準 ASGI サーバーである。ただし、プラットフォームがマネージド代替を提供する場合は除く。

### 関連ガイドライン

- [Python ツールチェーン](../toolchain/python.md) — pairs-with: このスタックの環境、依存関係、リンティングは uv と ruff で管理する。
