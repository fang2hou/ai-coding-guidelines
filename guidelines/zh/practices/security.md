---
id: practices/security
lang: zh
version: 1
source-lang: en
status: active
digest: 96cb59b8
---

# 安全

## 禁止提交敏感信息

严禁向仓库提交任何敏感信息，包括但不限于：

- 密码
- API 密钥
- 访问令牌
- 私有认证信息
- 敏感凭据
- 敏感连接字符串

## 敏感凭据的存放位置

将敏感凭据存放在合适的位置：

- 环境变量
- 敏感凭据管理系统
- 部署平台提供的敏感凭据
- 安全配置

确保本地敏感凭据文件（如 `.env`）已排除在版本控制之外。

## 凭据扫描

把凭据扫描纳入项目的[质量门禁](../toolchain/quality-gates.md)，并在每项变更完成前检查 diff 是否包含敏感信息（参见[变更纪律](change-discipline.md)）。
