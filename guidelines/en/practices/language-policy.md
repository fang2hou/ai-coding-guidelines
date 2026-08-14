---
id: practices/language-policy
lang: en
version: 1
source-lang: en
status: active
digest: fc7702dd
---

# Language Policy

Language boundaries are a project constraint and must be treated explicitly.

Three concepts are independent:

1. Conversation language
2. Source code language
3. Product / UI language

Do not infer one from another.

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

Do not transliterate a non-English word into Latin characters merely to satisfy an ASCII requirement.

The requirement is **standard English**, not merely ASCII.

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

Before implementing substantial user-facing content when the project language has not already been documented, confirm with the user:

- Primary UI language
- Additional supported languages
- Relevant formality or tone requirements

Record the confirmed language policy in the project documentation (see [Required Project Documentation](project-documentation.md)).

Once recorded, follow it without repeatedly asking the same question.

Only reconfirm when:

- The user explicitly changes the requirement
- A new requirement conflicts with the documented policy
- The required target language is genuinely ambiguous

Do not silently change UI language because the user changed conversation language.

## Cross-language quality

When conversation, code, and product languages differ, take additional care.

Do not mechanically translate wording across languages.

In particular:

- Do not create Chinese-influenced Japanese.
- Do not reproduce Chinese sentence structures unnaturally in Japanese.
- Do not insert implementation-oriented English directly into otherwise natural Chinese conversation without a reason.
- Do not translate the same domain concept inconsistently across the UI.
- Do not infer Japanese UI terminology from Chinese developer conversation.
- Do not infer Chinese UI terminology from English source code identifiers.

User-facing UI copy should prioritize:

1. Standard usage in the target language
2. Correct grammar
3. Clear meaning
4. Appropriate formality
5. Ease of understanding
6. Ease of use
7. Consistency with the rest of the product

UI text should be professional and natural rather than literal or machine-translated in tone.

When an important term or tone choice is uncertain, ask the user instead of inventing a convention.
