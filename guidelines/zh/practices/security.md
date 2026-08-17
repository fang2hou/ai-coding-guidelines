---
id: practices/security
lang: zh
version: 1
source-lang: en
status: active
digest: 1e0c2988
---

# 安全

## 禁止提交敏感信息

仓库中不得包含敏感信息。

包括但不限于：

- 密码
- API 密钥
- 访问令牌
- 私有凭据
- 敏感凭据
- 敏感连接字符串

## 敏感凭据的存放位置

应使用合适的存放方式：

- 环境变量
- 敏感凭据管理系统
- 部署平台提供的敏感凭据
- 安全配置

确保本地敏感凭据文件不进入版本控制。

## 凭据扫描

凭据扫描应纳入项目的[质量门禁](../toolchain/quality-gates.md)。

每项变更完成前，还必须检查其中是否包含敏感信息（参见[变更纪律](change-discipline.md)）。
