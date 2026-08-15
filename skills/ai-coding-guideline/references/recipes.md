# Task Recipes

Condensed from the guideline repository's PORTAL.md. When the repository
itself is available, prefer its full documents (paths below are relative to
`guidelines/en/`); this table is the offline fallback with the same routing.

| Task                                   | Read in order                                                                                                                                                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Baseline (any task)                    | principles/core-principles → practices/agent-protocol                                                                                                                                                                                 |
| Start a TypeScript / frontend project  | Baseline + toolchain/mise → toolchain/typescript → libraries/frontend-framework → libraries/tailwindcss → libraries/shadcn-ui → practices/language-policy → practices/project-documentation → toolchain/quality-gates → toolchain/git |
| Build a TypeScript backend service     | Baseline + toolchain/mise → toolchain/typescript → libraries/typescript-backend → practices/project-documentation → toolchain/quality-gates → toolchain/git                                                                           |
| Start or join a Python service         | Baseline + toolchain/mise → toolchain/python → libraries/python-api-stack → practices/project-documentation → toolchain/quality-gates → toolchain/git                                                                                 |
| Choose an implementation language      | Mandate sections of toolchain/typescript, toolchain/python, toolchain/go, toolchain/rust — TypeScript and Python are the defaults                                                                                                     |
| Start a Go or Rust service             | Baseline + toolchain/mise → toolchain/go (+ libraries/go-api-stack for HTTP APIs) or toolchain/rust → toolchain/quality-gates → toolchain/git                                                                                         |
| Add a dependency                       | practices/dependencies + the matching libraries/ entry                                                                                                                                                                                |
| UI implementation work                 | libraries/tailwindcss → libraries/shadcn-ui → practices/coding-standards → practices/language-policy                                                                                                                                  |
| Frontend iteration with human feedback | libraries/agentation (dev-mode annotation → structured agent context) + practices/testing                                                                                                                                             |
| Build an AI / LLM feature              | libraries/vercel-ai-sdk → libraries/frontend-framework                                                                                                                                                                                |
| Write tests                            | practices/testing                                                                                                                                                                                                                     |
| Commit / open a PR                     | toolchain/git → practices/change-discipline                                                                                                                                                                                           |
| CI/CD work                             | toolchain/github-actions → toolchain/quality-gates                                                                                                                                                                                    |
| Databricks work                        | toolchain/databricks                                                                                                                                                                                                                  |
| Architecture change                    | practices/architecture-governance + the project's own ADRs                                                                                                                                                                            |
| Security-sensitive change              | practices/security                                                                                                                                                                                                                    |

Routing rules:

- Language of the conversation decides which language tree to read: `guidelines/{en,zh,ja}/` mirror each other.
- Documents are conclusions, not discussion: apply them as written; disagreements are raised with the user, not silently worked around.
