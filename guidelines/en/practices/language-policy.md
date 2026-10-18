---
id: practices/language-policy
lang: en
version: 1
source-lang: en
status: active
digest: 40b20a51
---

# Language Policy

Choose each of the following languages independently; never infer one from another:

1. Conversation language
2. Source code language
3. Product / UI language

A valid project may use:

```text
Conversation: Chinese
UI: Japanese
Code: English
```

These languages must remain separate and idiomatic.

## Code language

All source code must use standard English except for intentional literal values containing another language.

The following must be written in English:

- Variable names
- Function names
- Method names
- Class names
- Type names
- Interface names
- Enum names
- Module names
- File names
- Directory names
- Code comments
- Docstrings
- Configuration identifiers
- Internal symbolic identifiers

Do not use non-English languages for code identifiers or comments.

In particular, do not use:

- Japanese kana
- Japanese-language identifiers
- Chinese-language identifiers
- Pinyin identifiers
- Japanese romaji identifiers

Examples of prohibited identifiers and their standard-English replacements:

```text
kokyakuName   -> customerName
shinseiStatus -> applicationStatus
kehuName      -> customerName
yonghuId      -> userId
```

Do not transliterate non-English words into Latin letters just to stay in ASCII. The requirement is **standard English**, not merely ASCII.

### Literal values

Non-English text is allowed when it is intentionally part of a literal value, including:

- UI copy
- Localization resources
- User-facing errors
- Test fixtures containing localized content
- Example user content
- Domain data whose original form must be preserved

Literal values do not justify non-English variable names or comments.

## Conversation language

Communicate naturally in the language used by the user.

Conversation should be:

- Natural
- Friendly
- Clear
- Idiomatic
- Appropriate for the user's communication style

Avoid unnecessary language mixing.

When communicating in Chinese, do not insert English phrases merely because the implementation uses English internally.

English is appropriate when referring to:

- Code identifiers
- API names
- Library names
- Commands
- Product names
- Established technical terminology where translation would reduce clarity

Otherwise, communicate naturally in Chinese.

The same principle applies to other languages.

## Product and UI language

Never infer the product language solely from the conversation language.

If the project language is not documented yet, confirm the following with the user before building substantial user-facing content:

- Primary UI language
- Additional supported languages
- Relevant formality or tone requirements

Record the confirmed language policy in `AGENTS.md` (see [Required Project Documentation](project-documentation.md)) and follow it without asking again.

Only reconfirm when:

- The user explicitly changes the requirement
- A new requirement conflicts with the documented policy
- The required target language is genuinely ambiguous

Do not silently change UI language because the user changed conversation language.

## Cross-language quality

Take extra care when conversation, code, and UI languages differ. Write naturally in the target language instead of translating word for word:

- Do not write Chinese-influenced Japanese or carry Chinese sentence structures into Japanese.
- Do not mix English implementation terms into Chinese conversation without a reason.
- Translate each domain concept consistently across the entire UI.
- Do not guess Japanese UI terms from Chinese developer chat, or Chinese UI terms from English code identifiers.

User-facing UI copy should prioritize:

1. Standard usage in the target language
2. Correct grammar
3. Clear meaning
4. Appropriate formality
5. Ease of understanding
6. Ease of use
7. Consistency with the rest of the product

Write professional, natural UI text. Avoid wording that sounds like a literal or machine translation.

When an important term or tone choice is uncertain, ask the user instead of inventing a convention.
