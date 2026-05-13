---
id: DOC-DEVELOPMENT-GUIDE-CLOUDFLARE
number: GOV-003
domain: development
category: guide
title: Cloudflare 设置指南
owner: docs-maintainer
status: active
last_updated: 2026-05-13
source_of_truth: true
related_code: []
related_docs: []
---

# Cloudflare 设置指南

## Clause 1. 账号注册

### 1.1 [强制] 注册步骤

**1.1.1 [强制]** 访问 https://dash.cloudflare.com/sign-up 注册。

**1.1.2 [强制]** 输入邮箱和密码完成注册。

**1.1.3 [强制]** 完成邮箱验证后登录 Cloudflare 控制台。

---

## Clause 2. API 凭证获取

### 2.1 [推荐] 方法 A：API Token（推荐）

**2.1.1 [推荐]** 登录后点击右上角头像 → "My Profile"。

**2.1.2 [推荐]** 左侧菜单选择 "API Tokens"，点击 "Create Token"。

**2.1.3 [推荐]** 使用 "Create Custom Token" 模板，配置权限：

| 权限范围                     | 权限级别 |
| ---------------------------- | -------- |
| Account → Workers KV Storage | Edit     |
| Account → Account Settings   | Read     |
| Zone → Zone Settings         | Read     |

**2.1.4 [强制]** 生成后立即复制 Token（只显示一次）。

### 2.2 [参考] 方法 B：Global API Key

**2.2.1 [参考]** 登录后点击右上角头像 → "My Profile"。

**2.2.2 [参考]** 左侧菜单选择 "API Tokens"，向下滚动到 "Global API Key" → "View"。

**2.2.3 [参考]** 验证密码后复制 Global API Key。

**2.2.4 [参考]** Account ID 在 Cloudflare 控制台右下角。

---

## Clause 3. MCP Memory Service 配置

### 3.1 [强制] 环境变量配置

编辑项目根目录下 `.env` 文件：

**3.1.1 [强制]** 配置 Cloudflare 账号信息：

```env
CLOUDFLARE_ACCOUNT_ID=你的_Account_ID
CLOUDFLARE_API_TOKEN=你的_API_Token
```

**3.1.2 [强制]** 配置存储后端：

```env
MCP_MEMORY_STORAGE_BACKEND=hybrid
```

### 3.2 [强制] 完成配置

**3.2.1 [强制]** 运行安装脚本：

```bash
scripts/install-mcp-memory.sh
```

**3.2.2 [强制]** 编辑 `.mcp.json`，将 memory 服务的 `disabled` 改为 `false`。

**3.2.3 [强制]** 重启 AI IDE（Trae/OpenCode）。

---

## Clause 4. 提示与备选方案

### 4.1 [参考] 免费额度

**4.1.1 [参考]** Cloudflare 免费账号完全够用。

### 4.2 [参考] 本地备选

**4.2.1 [参考]** 如不想注册 Cloudflare，可使用本地 SQLite 模式，将 `MCP_MEMORY_STORAGE_BACKEND` 改为 `sqlite`。

**4.2.2 [参考]** 两种模式可以随时切换。
