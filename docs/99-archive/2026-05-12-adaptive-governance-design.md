---
id: DOC-DESIGN-TECHNICAL-DESIGN-L2-5
number: DES-000
domain: design
category: technical-design
title: 自适应治理（L2.5 行为调节层）设计文档
owner: docs-maintainer
status: draft
last_updated: 2026-05-12
source_of_truth: true
ai_contract: docs/ai/contracts/adaptive-governance.md
related_code: []
related_docs: []
---

# 自适应治理（L2.5 行为调节层）设计文档

## 1. 背景

### 1.1 问题

Harness 框架已有完整的指标采集体系（44 项）和五级考核节奏（每任务/每日/每周/每月/每发布），但指标结果只用于**报告和告警**，没有反哺回 Agent 行为本身。

### 1.2 目标

在指标采集和 Agent 行为之间建立反馈闭环：指标反常 → 自动调节 Agent 行为 → 下次会话生效。

### 1.3 约束

- 只调节 Agent 不调节人类
- L3-L4 级别必须人类先审批
- 调节 7 天过期，逾期自动移除
- 人类可用 status=overridden 手动覆盖

## 2. 方案设计

### 2.1 架构

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ memory/     │ ──▶ │ evaluate-        │ ──▶ │ .harness/         │
│ daily logs  │     │ adjustments.py   │     │ adjustments.yaml  │
│ (自检块)    │     │ (周五 17:00 H10) │     │                   │
└─────────────┘     └──────────────────┘     └───────┬──────────┘
                                                      │
                                                      ▼
                                              ┌──────────────────┐
                                              │ AGENTS.md        │
                                              │ 矫正块           │
                                              │ Agent 启动时读取  │
                                              └──────────────────┘
```

### 2.2 核心要素

| 要素     | 说明                                                                                        |
| -------- | ------------------------------------------------------------------------------------------- |
| 触发源   | memory/ 中自检块的"避坑"统计数据                                                            |
| 规则表   | 8 条初始规则（技能遗漏/中文率/需求偏差/karpathy 跳过/E2E 失败等）                           |
| 调节动作 | 4 种：inject_prompt(L1) / force_skill(L2) / escalate_depth(L2-L3) / freeze_autopilot(L3-L4) |
| 存储     | `.harness/adjustments.yaml`，自动管理                                                       |
| 传递     | AGENTS.md 矫正块 → Agent 启动时自动读取                                                     |

### 2.3 调节生命周期

```
指标采集 → 评估引擎 → 匹配规则 → 生成调节
  ├── L1-L2: 自动写入 adjustments.yaml + AGENTS.md
  ├── L3-L4: 生成审批待办 → 飞书 → 人类确认后写入
  └── 7天后: 自动检查恢复条件 → 已恢复则移除
```

## 3. 文件变更清单

| 文件                                          | 操作 | 用途                   |
| --------------------------------------------- | ---- | ---------------------- |
| `.harness/adjustments.yaml`                   | 新建 | 调节状态存储           |
| `scripts/evaluate-adjustments.py`             | 新建 | 评估引擎，约 200 行    |
| `AGENTS.md`                                   | 修改 | 新增动态矫正块注释段   |
| `.github/workflows/weekly-review.yml`         | 修改 | 集成评估步骤           |
| `docs/00-governance/harness/09-governance.md` | 修改 | 新增"六、行为调节"章节 |
| `.harness/registry.yaml`                      | 修改 | 注册 L2.5 调节层       |
| `docs/ai/contracts/adaptive-governance.md`    | 新建 | AI 合约                |

## 4. 安全规则

1. L1-L2 自动执行，L3-L4 先审后行
2. 所有调节 7 天过期
3. 人类手动覆盖：status=overridden
4. 永不惩罚人类

## 5. 执行状态

- [x] 评估引擎已实现
- [x] 8 条规则已编码
- [x] L1-L2 自动执行逻辑已实现
- [x] L3-L4 待审批逻辑已实现（生成审批待办 JSON）
- [x] AGENTS.md 矫正块同步已实现
- [ ] 飞书审批表单集成（待完成）
- [ ] 首次全量运行验证（待下一轮周五 H10 触发）
