---
id: toolchain/python
lang: ja
version: 4
source-lang: en
status: active
digest: b483a26f
---

# Python ツールチェーン

## 適用義務

Python は TypeScript と並び、AI 支援開発のデフォルト言語である。どちらの言語も、ライブラリとエージェントのエコシステム支援が最も強いためである。

言語の優先順位：

- TypeScript と Python は、ライブラリとエージェントのエコシステム支援が最も強いため、AI 支援開発のデフォルト言語である。
- Go と Rust はパフォーマンスが重要なケースやシステムレベルのケースに限る。導入には明確な根拠に加えてユーザーの承認が必要で、プロジェクトの ADR に記録する。[Go](../toolchain/go.md) と [Rust](../toolchain/rust.md) を参照。

Python バックエンドを自動的に導入してはならない。TypeScript のみの構成で十分なら、それを優先する。[TypeScript ツールチェーン](../toolchain/typescript.md)を参照。

プロジェクトに Python ならではの価値をもたらす要件、特に次のような要件がある場合に Python バックエンドを導入する。

- バックエンドのロジックが十分に複雑である
- Python 固有のライブラリが意味のある価値を提供する
- 実装の一部を別チームが担当する
- データサイエンスエンジニアがワークフローの一部を変更する必要がある
- エージェントやデータ処理のロジックを独立して委譲する必要がある

たとえば、エージェントワークフローの一部をデータサイエンスチームが保守することが想定される場合、Python サービスは適切な選択になり得る。

標準の API フレームワーク、検証、サーバースタックについては [Python API Stack](../libraries/python-api-stack.md) を参照。

## バージョン方針

既定は Python 3.12 とする。mise はインタープリターと uv 本体を提供し、環境と依存関係(`uv.lock` など)は uv が管理する。ML エコシステムとモデルの訓練データが追いつくまで、新しい CPython ラインを採用しない。エコシステムの既定が移った時点で再検討する。

モデルは訓練データに基づいてコードを生成するため、成熟し広く訓練に含まれたバージョンほど AI 支援開発での破綻が少ない。この原則は[中核となるエンジニアリング原則](../principles/core-principles.md)に定める。

Python のバージョンはプロジェクトの mise 設定で固定する。

`uv.lock` をコミットし、どの環境でも同じ依存関係のバージョンが解決されるようにする。

## uv

Python の環境管理と依存関係管理には `uv` を使う。

第二の Python 環境管理システムを導入しない。

標準のワークフロー：

- `uv init`——プロジェクトを開始する。
- `uv add <package>`——ランタイムの依存関係を追加し、ロックファイルを更新する。
- `uv add --dev <package>`——リントやテストツールなど、開発専用の依存関係を追加する。
- `uv remove <package>`——依存関係を削除する。
- `uv lock --upgrade`——ロックされた依存関係のバージョンを更新する。
- `uv sync`——ロックされた環境をインストールする。
- `uv run <command>`——プロジェクト環境の中でコマンドを実行する。

素の `python` や `pip` を実行しない。どちらもプロジェクト環境とロックファイルを無視する。代わりに `uv run python` と `uv add` / `uv sync` を使う。

依存関係の定義は `pyproject.toml` に記述する。`uv.lock` は生成物であり、手で編集しない。

単体のスクリプトでは、PEP 723 のインラインスクリプトメタデータで依存関係を宣言し、`uv run script.py` で実行する。

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx"]
# ///
```

### 採用しない代替案

次は使わない。

- Pipenv
- Poetry

## ruff

Python のリントとフォーマットには `ruff` を使う。

ruff が必要なワークフローをカバーしているのに、個別ツールを別に保守しない。

リントには `ruff check`、フォーマットには `ruff format` を使い、どちらもプロジェクトの品質ゲート経由で実行する。ruff の設定は `pyproject.toml` に記述する。ベースラインのルール選択：

```toml
[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "SIM"]
```

E と F は構文レベルと正確性の問題を、I はインポートの整列を、B は典型的なバグパターンを、UP は構文の近代化を、SIM は簡略化可能なコードを検出する。必要であればプロジェクト単位でこのベースラインを拡張する。知らないうちに縮めない。

### 採用しない代替案

次は使わない。

- flake8
- black

## 言語の利用ルール

- すべての公開関数に型ヒントを付ける。引数と戻り値の両方を網羅する。
- ファイルシステムのパスには `os.path` ではなく `pathlib` を使う。
- 文字列の組み立てには f-string を使う。新しいコードで `%` フォーマットや `str.format` を使わない。
- 可変オブジェクトをデフォルト引数にしない(`def f(items=[])`)。デフォルトは `None` にし、コレクションは関数の中で生成する。
- ファイル、ソケット、セッション、クライアントなどのリソースは、コンテキストマネージャー(`with`)で管理する。
- 例外を投げ直すときは原因を保持し、`raise NewError(...) from err` とする。
- 内部のデータ構造には `dataclasses` を使う。Pydantic は検証の境界でのみ使う。詳しくは [Python API Stack](../libraries/python-api-stack.md) を参照。

## プロジェクトレイアウト

- パッケージは `src/` の下(`src/<package>/`)に置き、`tests/` をプロジェクトルートに並置する。
- この構成は、パッケージをインストールせずに誤ってインポートすることを防ぐ。

## 連携

- [Python API Stack](../libraries/python-api-stack.md)
- [品質ゲート](../toolchain/quality-gates.md)
- [テスト戦略](../practices/testing.md)
