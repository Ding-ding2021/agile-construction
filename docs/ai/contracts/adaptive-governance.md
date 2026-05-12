---
id: AI-ADAPTIVE-GOVERNANCE
human_source: docs/00-governance/harness/09-governance.md
status: active
last_synced: 2026-05-12
title: AI 合约：自适应治理（L2.5 行为调节）
last_updated: 2026-05-12
---

# AI 合约：自适应治理（L2.5 行为调节）

## 模块定位

基于指标表现自动调节 Agent 行为的闭环。位于进化阶段 L2 与 L3 之间。

## 调节动作

| 动作               | 级别  | 效果                   | 恢复条件          |
| ------------------ | ----- | ---------------------- | ----------------- |
| `inject_prompt`    | L1    | AGENTS.md 注入纠正提示 | 下次评估自动移除  |
| `force_skill`      | L2    | 锁定某技能为强制加载   | 连续 7 天无违规   |
| `escalate_depth`   | L2-L3 | 提升执行深度           | 连续 2 周指标正常 |
| `freeze_autopilot` | L3-L4 | 冻结自主决策           | 人类手动解除      |

## 触发规则

| #   | 指标           | 条件           | 动作                        | 级别 | 角色 |
| --- | -------------- | -------------- | --------------------------- | ---- | ---- |
| 1   | 技能遗漏率     | ≥ 3/任务 × 7天 | force_skill                 | L2   | 全部 |
| 2   | 需求偏差度     | ≥ 3            | escalate_depth              | L2   | 产品 |
| 3   | karpathy 跳过  | ≥ 3 次/周      | force_skill(karpathy)       | L2   | 开发 |
| 4   | 代码审查通过率 | < 40%          | escalate_depth              | L3   | 开发 |
| 5   | E2E 通过率     | < 100%         | freeze_autopilot            | L4   | 全部 |
| 6   | 可访问性阻断   | ≥ 1            | force_skill(accessibility)  | L2   | 设计 |
| 7   | 中文率         | < 80%          | inject_prompt               | L1   | 全部 |
| 8   | 反模式         | ≥ 3 次         | inject_prompt + force_skill | L2   | 全部 |

## 安全规则

1. L1-L2 自动执行，L3-L4 先审后行
2. 调节 7 天过期，逾期自动移除
3. 人类可将 status 改为 overridden 手动覆盖
4. 不惩罚人类，只约束 Agent

## 数据文件

| 文件                        | 用途         | 写入者                  | 读取者         |
| --------------------------- | ------------ | ----------------------- | -------------- |
| `.harness/adjustments.yaml` | 调节状态存储 | evaluate-adjustments.py | Agent 启动时   |
| `AGENTS.md` 矫正块          | 行为矫正提示 | evaluate-adjustments.py | Agent 每次会话 |

## 评估引擎

`scripts/evaluate-adjustments.py`，每周评估触发，dry-run 可预览。
