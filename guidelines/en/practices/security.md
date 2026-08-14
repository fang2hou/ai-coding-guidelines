---
id: practices/security
lang: en
version: 1
source-lang: en
status: active
digest: e587ba72
---

# Security

## Never commit sensitive information

Never include sensitive information in the repository.

This includes, but is not limited to:

- Passwords
- API keys
- Access tokens
- Private credentials
- Secrets
- Sensitive connection strings

## Where secrets belong

Use appropriate:

- Environment variables
- Secret-management systems
- Deployment-platform secrets
- Secure configuration

Ensure local secret files are excluded from version control.

## Secret scanning

Secret scanning should be part of the project [quality workflow](../toolchain/quality-gates.md).

Every change must also be checked for sensitive information before completion (see [Change Discipline](change-discipline.md)).
