---
id: practices/change-discipline
lang: ja
version: 3
source-lang: en
status: active
digest: e7fb37bc
---

# 変更の規律

自明でない変更をレビューに回す前に、[運用プロトコル](agent-protocol.md)に従い、このチェックリストでも確認すること。

## 完了チェックリスト

変更を完了とみなす前に、次を確認すること。

- 要求された振る舞いが実装されていることを確認する。
- 関連するフォーマットチェックを実行する。
- リンターを実行する。
- 該当する場合は型チェックを実行する。
- 関連するテストを実行する。
- 適切な [prek チェック](../toolchain/quality-gates.md)を実行する。
- コミットを扱う場合は、[Conventional Commits](../toolchain/git.md)を検証する。
- diff をレビューする。
- 変更が場当たり的な回避策になっておらず、周囲のロジックや規約に自然になじんでいるか確認する（[コーディング規約](coding-standards.md)）。
- 追加したコメントをすべて見直す。複雑な制御フローや場当たり的なパッチの言い訳、処理内容の言い換えにとどまるコメントは削除し、明確な命名や関数の分割でコードを修正・リファクタリングする。コメントはコードだけでは読み取れない理由に限り最小限にとどめる（[コーディング規約](coding-standards.md)）。
- 意図しない変更がないか確認する。
- 不要な依存関係を追加していないか確認する。
- 不要なファイルを追加していないか確認する。
- アーキテクチャとの互換性を確認する。
- コードの言語が要件を満たしているか確認する（[言語ポリシー](language-policy.md)）。
- プロダクト言語の要件を満たしているか確認する（[言語ポリシー](language-policy.md)）。
- 機密情報が含まれていないか確認する（[セキュリティ](security.md)）。

## 実例：不安定なログインテストの修正

レビュー対象は、`tests/e2e/login.spec.ts` が CI で断続的に失敗する問題の修正である。固定の 3 秒待ちを session cookie の待機に置き換える。

まず振る舞いを確認する。不安定なテストは繰り返し成功することを確認する必要がある。1 回の成功では不十分である。

```bash
mise run test e2e/login.spec.ts   # 20 consecutive runs, 20/20 green
```

静的チェックを実行する。

```text
$ mise run check
oxfmt   ok
oxlint  ERROR tests/e2e/login.spec.ts:4:3  no-unused-vars  `expect` is never used
tsc     not reached
```

残った import を削除して再実行する。成功時の出力は次のとおりである。

```text
$ mise run check
oxfmt   ok
oxlint  ok
tsc     ok
```

次に diff を確認する。

```text
$ git diff --stat
 tests/e2e/login.spec.ts | 8 +++++---
 1 file changed
```

変更されたのは 1 ファイルだけで、新しい依存関係もファイルもなく、アーキテクチャへの影響もない。追加した 1 件のコメントは、コードからは読み取りにくいタイミング上の制約を英語で説明している（[コーディング規約](coding-standards.md)、[言語ポリシー](language-policy.md)）。ユーザー向けの文字列は変わらないため、プロダクト言語への準拠にも影響しない。認証情報はテストフィクスチャにだけ置き、diff に含めない（[セキュリティ](security.md)）。

コミットする。prek はステージされたツリーに対して同じチェックを実行し、コミットメッセージは [Conventional Commits](../toolchain/git.md) に従うこと。

```text
$ git commit -m "test(e2e): wait for session cookie instead of fixed sleep"
prek  ok  format check, lint, secret scanning
```

コミット前に、すべてのチェックが成功し、diff を 1 行ずつ確認し、すべての変更を説明できる状態にすること。

## CI の成功は証明にならない

CI の通過は必要条件だが、それだけでは実装が正しいことの証明にならない。

パイプラインが成功したからといって、diff のレビューや変更の正しさの確認を省いてはならない。
