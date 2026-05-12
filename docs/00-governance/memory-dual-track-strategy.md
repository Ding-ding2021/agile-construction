# 双轨记忆策略：Markdown + MCP Memory Service

## 概述

本项目采用 **双轨记忆策略**，结合 Markdown 文件（真相源）和 MCP Memory Service（增强层）的优势。

---

## 双轨策略详情

| 记忆类型     | Markdown 文件（真相源）                                 | MCP Memory Service（增强层）          |
| ------------ | ------------------------------------------------------- | ------------------------------------- |
| **作用**     | 长期事实存储、架构决策、团队共享                        | 临时会话记忆、语义搜索、跨 Agent 共享 |
| **路径**     | `MEMORY.md`、`.workbuddy/memory/`、`docs/ai/knowledge/` | 本地 SQLite + Cloudflare              |
| **管理方式** | Git 版本控制、团队协作                                  | 自动同步、语义索引                    |
| **启用状态** | ✅ 永久启用                                             | ⚙️ 可选启用（默认 disabled）          |

---

## 分工细节

### Markdown 负责（真相源）

- 长期架构决策和技术文档
- 项目进展、里程碑记录
- 用户习惯和避坑清单
- 模式、反模式和经验总结
- 每日操作日志（`.workbuddy/memory/YYYY-MM-DD.md`）

### MCP Memory Service 负责（增强层）

- 会话相关的临时记忆（方便召回）
- 语义搜索（理解意图，而非简单关键词）
- 跨设备/跨 Agent 的记忆同步
- 团队协作记忆（可选）

---

## 如何启用 MCP Memory Service

### 1. 安装依赖（已完成）

- ✅ Python 3.11 已通过 Homebrew 安装在 `/opt/homebrew/bin/python3.11`

### 2. 安装 mcp-memory-service

```bash
# 方法 A：用 pip（推荐）
/opt/homebrew/bin/python3.11 -m ensurepip
/opt/homebrew/bin/python3.11 -m pip install mcp-memory-service

# 方法 B：用 uv
uv venv
source .venv/bin/activate
uv pip install mcp-memory-service
```

### 3. 启用 MCP 服务

编辑 `.mcp.json`，将 `memory` 服务的 `disabled` 改为 `false`：

```json
"memory": {
  "command": "/opt/homebrew/bin/python3.11",
  "args": ["-m", "memory", "server"],
  "env": {
    "MCP_MEMORY_STORAGE_BACKEND": "hybrid"
  },
  "disabled": false
}
```

---

## 当前配置文件

- `.mcp.json`：已配置 memory 服务（默认 disabled）
- `.harness/registry.yaml`：已添加 agentmemory 说明
- `AGENTS.md`：已适配 Trae 环境的自检机制

---

## 演进路线

| 阶段   | 状态      | 说明                            |
| ------ | --------- | ------------------------------- |
| 阶段 1 | ✅ 完成   | 仅 Markdown（当前模式）         |
| 阶段 2 | ⏳ 进行中 | 双轨并行（Markdown + MCP 可选） |
| 阶段 3 | ⏳ 待定   | 根据使用情况决定是否深度整合    |

---

## 注意事项

1. **真相源始终是 Markdown**：重要决策必须记录在 Markdown 文件中并提交 Git
2. **MCP 只是增强**：不要仅依赖 MCP，它是辅助工具
3. **定期同步**：可以考虑写脚本从 Markdown 导入到 MCP（未来）
