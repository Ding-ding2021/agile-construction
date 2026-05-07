---
id: DOC-00-GOVERNANCE-QUALITY-METRICS
title: AI 开发质量指标体系
owner: docs-maintainer
status: active
last_updated: 2026-05-07
source_of_truth: true
related_code:
  - scripts/scan-tools.py
  - .workbuddy/stats/
  - AGENTS.md
related_docs:
  - docs/00-governance/agent-squad-protocol.md
---

# AI 开发质量指标体系

> **版本**: v1.0
> **最后更新**: 2026-05-07

---

## 1. 概述

每次开发任务完成后，填写一份结构化质量评价记录，持续追踪 AI 辅助开发的效率和质量趋势。

数据驱动的三大用途：

| 用途           | 说明                                         |
| -------------- | -------------------------------------------- |
| **质量追踪**   | 人工干预率、Bug 率、返工率的变化趋势         |
| **Skill 优化** | 哪些 skills 使用率高、哪些被遗忘、哪些被误用 |
| **流程改进**   | 根据偏差检测结果调整 squad 协议和任务分级    |

---

## 2. KPI 定义

| 指标         | JSON 字段                  | 取值范围        | 说明                               |
| ------------ | -------------------------- | --------------- | ---------------------------------- |
| 人工干预次数 | `human_interventions`      | 0~N             | 你主动修改代码或评价数据的次数     |
| 需求偏差度   | `requirement_deviation`    | 0.0~1.0         | 最终结果偏离最初想法的程度         |
| 需求变更次数 | `spec_changes`             | 0~N             | 开发过程中需求或设计变更的次数     |
| 返工轮次     | `rework_rounds`            | 0~N             | 验收打回后修复再审的轮次           |
| 交付后 Bug   | `bugs_found_post_delivery` | 0~N             | 合并/交付后发现的 bug 数           |
| Skill 调用   | `skills_called`            | `["name", ...]` | 本次任务实际调用的所有 skills 名称 |
| 备注         | `notes`                    | 文本            | 可选，记录特殊情况                 |

### 衍生指标

| 指标             | 计算方式                                    |
| ---------------- | ------------------------------------------- |
| **人工干预率**   | 总干预次数 / 总任务数                       |
| **平均偏差度**   | 所有任务 requirement_deviation 均值         |
| **返工率**       | 有返工的任务数 / 总任务数                   |
| **Bug 率**       | 有 bug 的任务数 / 总任务数                  |
| **Skill 使用率** | 某个 skill 被调用的任务数 / 总任务数        |
| **Skill 偏差**   | 应调未调 + 不应调却调，基于历史同类任务推断 |

---

## 3. JSON 记录格式

文件路径：`.workbuddy/stats/YYYY-MM-DD.json`

```json
{
  "task": "项目简述",
  "date": "2026-05-07",
  "risk_level": "L3",
  "human_interventions": 2,
  "requirement_deviation": 0.2,
  "spec_changes": 1,
  "rework_rounds": 1,
  "bugs_found_post_delivery": 0,
  "skills_called": [
    "karpathy-guidelines",
    "writing-plans",
    "test-driven-development",
    "shadcn-management",
    "verification-before-completion",
    "finishing-a-development-branch"
  ],
  "notes": ""
}
```

### 字段说明

| 字段                       | 必填 | 填写说明                   |
| -------------------------- | ---- | -------------------------- |
| `task`                     | 是   | 一句话描述任务             |
| `date`                     | 是   | 完成日期                   |
| `risk_level`               | 是   | L1 / L2 / L3               |
| `human_interventions`      | 是   | 默认 0，由 AI 引导人工确认 |
| `requirement_deviation`    | 是   | 默认 0.0，偏差越大值越大   |
| `spec_changes`             | 是   | 默认 0                     |
| `rework_rounds`            | 是   | 默认 0                     |
| `bugs_found_post_delivery` | 是   | 默认 0                     |
| `skills_called`            | 是   | 实际调用的 skill 名称列表  |
| `notes`                    | 否   | 特殊情况说明               |

---

## 4. 偏差推断机制

不是靠写死的规则矩阵，而是从**历史统计数据**中自动学习"某类任务应该调哪些 skills"。

### 推断逻辑

```
对每个 risk_level（L1/L2/L3）：
  1. 收集该等级所有历史记录的 skills_called
  2. 计算每个 skill 的调用率 = 调用次数 / 总记录数
  3. 调用率 > 50% 的 skills → "期望调用集"
  4. 偏差 = (期望 - 实际) ∪ (实际 - 期望)
     - 遗漏：在期望集中但未调用的
     - 误用：调用了但不在期望集中的（且调用率 < 20%）
```

### 示例

```
L3 任务的历史记录有 10 条：
  karpathy-guidelines      调用率 100% → 期望
  verification-before-comp 调用率 90%  → 期望
  ui-layout-rules          调用率 70%  → 期望
  writing-plans            调用率 60%  → 期望
  shadcn-management        调用率 10%  → 非期望（偶尔用到）

新 L3 任务实际调用了：
  karpathy-guidelines ✅
  verification-before-comp ✅
  ui-layout-rules ❌ 未调 → 偏差：遗漏
  writing-plans ✅
  shadcn-management ❌ 未调 → 正常（非期望）
  squad-pre-dev-evaluation ❌ 调了 → 偏差：误用（L1 任务才调）
```

---

## 5. 数据生命周期

| 阶段            | 操作                                                  |
| --------------- | ----------------------------------------------------- |
| 任务完成        | AI 引导填写评价记录（默认值 + 人工确认）              |
| 每周/每月       | 运行 `python scripts/scan-tools.py --report` 查看趋势 |
| 每次 Phase 结束 | 将 `stats/` 数据纳入 phase 总结报告                   |
| 长期            | 数据累积越多，偏差推断越准确                          |

### 评价填写交互

任务完成后 AI 提示：

```
📋 任务质量评价（可全部回车接受默认值）：
  - 人工干预次数 [0]:
  - 需求偏差度 0~1 [0.0]:
  - 需求变更次数 [0]:
  - 返工轮次 [0]:
  - 交付后 Bug 数 [0]:
  - 备注（可选）:
```

---

## 6. 与现有流程的关系

| 现有流程                   | 本体系对应                            |
| -------------------------- | ------------------------------------- |
| 任务结束协议 A（日志）     | 不变                                  |
| 任务结束协议 B（长期记忆） | 不变                                  |
| **任务结束协议 C（新增）** | **写入 `.workbuddy/stats/` 质量评价** |
| scan-tools.py 全景扫描     | 新增 `--report` 模式                  |
| squad 验收                 | 验收通过后触发评价填写                |
