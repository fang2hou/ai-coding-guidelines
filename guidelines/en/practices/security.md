---
id: practices/security
lang: en
version: 1
source-lang: en
status: active
digest: a63e3967
---

# Security

## Never commit sensitive information

Never commit secrets or sensitive data to the repository, including:

- Passwords
- API keys
- Access tokens
- Private credentials
- Secrets
- Sensitive connection strings

## Where secrets belong

Store secrets in the right place:

- Environment variables
- Secret-management systems
- Deployment-platform secrets
- Secure configuration

Keep local secret files (such as `.env`) out of version control.

## Secret scanning

Run secret scanning as part of [Quality Gates](../toolchain/quality-gates.md), and check every diff for sensitive data before completing a change (see [Change Discipline](change-discipline.md)).
