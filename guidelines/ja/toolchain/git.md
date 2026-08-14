---
id: toolchain/git
lang: ja
version: 1
source-lang: en
status: active
digest: d526d166
---

# Git ワークフロー

## Conventional Commits

プロジェクトのすべてのコミットは、Conventional Commits 仕様に従わなければならない。

次のような意味のあるタイプを使う。

```text
feat
fix
refactor
test
docs
build
ci
chore
```

明確さが増す場合はスコープを使う。

例:

```text
feat(chat): add streaming response rendering
fix(auth): handle expired sessions
refactor(api): simplify request validation
test(search): cover empty-result behavior
ci(commit): validate conventional commits
```

共有リポジトリの歴史に残るコミットに対して、次のような無意味なコミットメッセージを使わない。

```text
update
changes
fix stuff
wip
```

破壊的変更は、Conventional Commits の規約に従って表現しなければならない。

## Cocogitto

Cocogitto は標準の Conventional Commits 検証ツールである。

リポジトリごとに異なるコミットバリデーターを選ぶのではなく、プロジェクト間で一貫して Cocogitto を使う。

適切な場合は、標準化されたプロジェクトツール経由で、Cocogitto をローカルのコミットワークフローに統合する。

Cocogitto が必要な検証をすでに提供しているのに、独自の Conventional Commits パーサーを実装しない。

## GitHub Actions での検証

GitHub Actions には、Conventional Commits の検証チェックを含めなければならない。

この検証には Cocogitto を使う。

不正なコミットメッセージを含むプルリクエストは、該当する検証パイプラインを失敗させる。

リポジトリが squash merge を使用し、結果のコミットメッセージがプルリクエストのタイトルに基づく場合は、プルリクエストのタイトルも同じ Conventional Commits 規約に従わなければならない。

目標は、次の両方を一貫させることである。

* プルリクエストの検証
* 最終的なリポジトリの歴史

CI ワークフローの標準については [GitHub Actions](../toolchain/github-actions.md) を参照。

## Git の安全運用

適切なレビューと承認なしに、共有リポジトリの歴史へ force push しない。

確立されたレビューワークフローに従う。

利便性だけのために共有の歴史を書き換えない。

AI エージェントは、破壊的な Git 操作を軽々しく行ってはならない。
