---
id: AI-PROJECT-CHARTER
human_source: docs/00-governance/project-charter.md
status: active
last_synced: 2026-05-12
title: AI 合约：Project Charter
last_updated: 2026-05-12
---

# AI 合约：Project Charter

## 模块定位

项目治理宪法，定义六大原则、工作流、Label 体系和质量关卡。

## 六大原则

| 原则     | 核心要求                         | 参考文档                   |
| -------- | -------------------------------- | -------------------------- |
| 规范驱动 | 所有行为对应成文规范             | codes/standards/docs       |
| 测试驱动 | TDD 流程，先写测试后写代码       | testing-standards.md       |
| 角色驱动 | 四角色 + Squad 协作 + 自适应奖惩 | agent-squad-protocol.md    |
| 技能驱动 | 按场景加载 Skill，禁止跳过       | harness/03-skills.md       |
| 需求澄清 | 先分级再评估，L2/L3 走 Squad     | agent-squad-protocol.md §4 |
| 自我进化 | 会话自检 → 模式沉淀 → 知识引擎   | checkpoint.md              |

## 自适应治理规则

| 触发条件         | 级别  | 动作                    |
| ---------------- | ----- | ----------------------- |
| 跳过技能         | L2    | force_skill             |
| 英文推理         | L1    | inject_prompt           |
| 同错误 ≥ 3 次    | L2-L3 | escalate_depth          |
| 重复红线违规     | L3-L4 | freeze_autopilot        |
| 核心模块擅自修改 | L4    | freeze_autopilot + 审批 |

## 工作流

Backlog → Ready → [评估] → In Progress → [验收] → Done

## 质量门禁

L1 自动化 / L2 AI 自检 / L3 人类验收 / L4 阶段评审

## Label 类型

type, priority, status（Phase label 参见 project-planning.md PRJ-017）
