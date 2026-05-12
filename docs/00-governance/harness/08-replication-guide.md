---
id: DOC-GOVERNANCE-HARNESS-
number: GOV-021
domain: governance
category: harness
title: 复制到新项目
owner: docs-maintainer
status: active
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs: []
---

# 复制到新项目

## 概述

Harness 框架设计了四步复制流程，让新项目快速获得完整的 opencode 驱动开发基础设施。

---

## 第一步：复制框架配置

```bash
cp -r .harness/ <目标项目>/.harness/
```

**必须修改**：

| 文件                     | 修改什么                                                 |
| ------------------------ | -------------------------------------------------------- |
| `.harness/manifest.yaml` | `name` → 新项目名、`version` → 1.0.0                     |
| `.harness/registry.yaml` | 删除本项目特定映射，重新按新项目分配 skills/tools/知识库 |

---

## 第二步：复制 harness 文档

```bash
mkdir -p <目标项目>/docs/00-governance/harness/roles
cp -r docs/00-governance/harness/ <目标项目>/docs/00-governance/harness/
```

**必须修改**：

| 文件                       | 修改程度                                 |
| -------------------------- | ---------------------------------------- |
| `00-overview.md`           | 重写：新项目名称、技术栈、团队           |
| `01-workflows.md`          | 保留七阶段骨架，按新项目调整阶段内部步骤 |
| `02-roles.md`              | 保留四专业体系，按新团队调整             |
| `03-skills.md`             | **全量重写**：新项目 skills 清单 + 分配  |
| `04-knowledge-base.md`     | **全量重写**：新项目文档索引 + 映射      |
| `05-context-management.md` | 保留结构，调整加载顺序                   |
| `06-tools-and-mcp.md`      | 替换为新项目的 CLI/MCP 工具              |
| `07-hooks.md`              | 保留 12 hook 骨架，按新项目调整          |
| `08-replication-guide.md`  | **保留本文件不动**                       |
| `09-governance.md`         | 保留指标框架，调整目标值                 |
| `roles/*.md`               | **全量重写**：新项目角色说明 + 指标      |

---

## 第三步：创建 AGENTS.md

**最小模板**：

```markdown
# AGENTS.md

## 语言指令

**必须使用中文进行推理和回答。**

## Repository Overview

<新项目一句话描述> — <技术栈>

## 核心执行流程

按照 harness 七阶段流水线：
定义 → 规划 → 构建 → 测试 → 评审 → 交付 → 进化

详细流程见 docs/00-governance/harness/01-workflows.md

## 硬性规则

- 所有推理和回答必须使用中文
- 新功能在 <新项目 src 目录>
- 修改前先 lint
- 完成的标志是 lint + build + test 全通过
```

---

## 第四步：配置 opencode.json

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["AGENTS.md"],
  "plugin": ["opencode-agent-memory"],
  "agent": {
    "explore": {
      "description": "Fast codebase exploration",
      "mode": "subagent",
      "model": "<可用模型>"
    },
    "general": {
      "description": "General-purpose task execution",
      "mode": "subagent",
      "model": "<可用模型>"
    }
  }
}
```

---

## 第五步（可选）：选择 Skills

新项目不需要全部 72 个 skill。按四大专业选择：

```
.agents/skills/
├── 流程控制类    # 至少保留 brainstorming, karpathy-guidelines, planning
├── 前端工程类    # 如果用 React/Vue → frontend-ui-engineering
├── 质量保障类    # 至少保留 debugging, code-review
├── 架构类        # 按需
└── 交付类        # 至少保留 git-workflow, shipping-and-launch
```

---

## 复制验证清单

- [ ] `.harness/` 目录已复制，manifest.yaml 版本已更新
- [ ] `docs/00-governance/harness/` 目录已复制，项目特定内容已重写
- [ ] `AGENTS.md` 已按新项目重写
- [ ] `opencode.json` 已配置
- [ ] 四份角色文件已按新项目重写
- [ ] `.harness/registry.yaml` 中的 skills/docs/tools 路径指向新项目中的真实文件
