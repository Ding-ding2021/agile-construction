---
id: DOC-GOVERNANCE-GUIDE-CLOUDFLARE
number: GOV-000
domain: governance
category: guide
title: Cloudflare 设置指南
owner: docs-maintainer
status: active
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs: []
---

# Cloudflare 注册和配置指南

## 🚀 步骤 1：注册 Cloudflare 账号

1. 访问：https://dash.cloudflare.com/sign-up
2. 输入邮箱和密码
3. 完成邮箱验证
4. 登录 Cloudflare 控制台

## 🔑 步骤 2：获取 API 凭证

### 方法 A：使用 API Token（推荐，更安全）

1. 登录 Cloudflare 后，点击右上角头像 → "My Profile"
2. 左侧菜单选择 "API Tokens"
3. 点击 "Create Token"
4. 使用 "Create Custom Token" 模板
5. 配置权限：
   - Account → Workers KV Storage → Edit
   - Account → Account Settings → Read
   - Zone → Zone Settings → Read
6. 点击 "Continue to summary" → "Create Token"
7. **重要！** 复制生成的 Token（只显示一次！）

### 方法 B：使用 Global API Key（简单但不太安全）

1. 登录 Cloudflare 后，点击右上角头像 → "My Profile"
2. 左侧菜单选择 "API Tokens"
3. 向下滚动到 "Global API Key" → "View"
4. 验证密码，复制 Global API Key
5. 你的 Account ID 在 Cloudflare 控制台右下角

## 📝 步骤 3：配置 MCP Memory Service

编辑项目根目录下的 `.env` 文件（如果没有就创建）：

```env
# Cloudflare 配置
CLOUDFLARE_ACCOUNT_ID=你的_Account_ID
CLOUDFLARE_API_TOKEN=你的_API_Token

# 或使用 Global API Key（不推荐）
# CLOUDFLARE_EMAIL=你的_Cloudflare_邮箱
# CLOUDFLARE_GLOBAL_API_KEY=你的_Global_API_Key

# 存储后端
MCP_MEMORY_STORAGE_BACKEND=hybrid
```

## 🔄 步骤 4：完成配置

1. 运行安装脚本：

```bash
scripts/install-mcp-memory.sh
```

2. 编辑 `.mcp.json`，将 memory 服务的 `disabled` 改为 `false`

3. 重启你的 AI IDE（Trae/OpenCode）

## 💡 提示

- Cloudflare 免费账号完全够用
- 如果你不想注册 Cloudflare，也可以只使用本地 SQLite 模式（将 `MCP_MEMORY_STORAGE_BACKEND` 改为 `sqlite`）
- 两种模式可以随时切换
