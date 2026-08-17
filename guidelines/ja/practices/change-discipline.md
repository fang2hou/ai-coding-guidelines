---
id: practices/change-discipline
lang: ja
version: 2
source-lang: en
status: active
digest: 00eb5935
---

# 変更の規律

単純ではない変更は、[運用プロトコル](agent-protocol.md) に加えて、レビューに回す前にこのチェックリストで確認すること。

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
- 意図しない変更がないか確認する。
- 不要な依存関係を追加していないか確認する。
- 不要なファイルを追加していないか確認する。
- アーキテクチャとの互換性を確認する。
- コードの言語が要件を満たしているか確認する（[言語ポリシー](language-policy.md)）。
- プロダクト言語の要件を満たしているか確認する（[言語ポリシー](language-policy.md)）。
- 機密情報が含まれていないか確認する（[セキュリティ](security.md)）。

## 実例：不安定なログインテストの修正

レビュー対象は、`tests/e2e/login.spec.ts` が CI で断続的に失敗する問題の修正である。固定の 3 秒待ちを session cookie の待機に置き換える。

まず振る舞いを確認する。不安定なテストは繰り返し通過する必要があり、1 回の成功では不十分である。

```bash
mise run test e2e/login.spec.ts   # 20 consecutive runs, 20/20 green
```

静的ゲートを実行し、問題を検出する。

```text
$ mise run check
oxfmt   ok
oxlint  ERROR tests/e2e/login.spec.ts:4:3  no-unused-vars  `expect` is never used
tsc     not reached
```

残った import を削除して再実行する。通過時の出力は次のとおりである。

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

変更されたのは 1 ファイルだけで、新しい依存関係もファイルもなく、アーキテクチャへの影響もない。テストに追加したコメントは、[言語ポリシー](language-policy.md) に従って英語になっている。ユーザー向けの文字列は変わらないため、プロダクト言語への準拠にも影響しない。認証情報はテストフィクスチャにだけ置き、diff に含めない（[セキュリティ](security.md)）。

コミットする。prek はステージされたツリーに対して同じチェックを実行し、コミットメッセージは [Conventional Commits](../toolchain/git.md) に従うこと。

```text
$ git commit -m "test(e2e): wait for session cookie instead of fixed sleep"
prek  ok  format check, lint, secret scanning
```

これが、すべてのチェックに通り、diff を 1 行ずつ確認し、説明できない変更を残していない状態である。

## CI の成功は証明にならない

CI の通過は必要条件だが、それだけでは実装が正しいことの証明にならない。

パイプラインが成功したからといって、diff のレビューや変更の正しさの確認を省いてはならない。
