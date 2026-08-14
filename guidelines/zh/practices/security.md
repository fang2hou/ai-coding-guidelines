---
id: practices/security
lang: zh
version: 1
source-lang: en
status: active
digest: d9bb2a54
---

# 安全

## 永不提交敏感信息

仓库中永远不得包含敏感信息。

包括但不限于:

* 密码
* API 密钥
* 访问令牌
* 私有凭据
* 敏感凭据
* 敏感连接字符串

## 敏感凭据应存放于何处

使用合适的:

* 环境变量
* 敏感凭据管理系统
* 部署平台自带的凭据机制
* 安全的配置方式

确保本地凭据文件被排除在版本控制之外。

## 敏感凭据扫描

敏感凭据扫描应成为项目[质量工作流](../toolchain/quality-gates.md)的一部分。

每项变更在完成之前,还须检查是否含有敏感信息(参见[变更纪律](change-discipline.md))。
