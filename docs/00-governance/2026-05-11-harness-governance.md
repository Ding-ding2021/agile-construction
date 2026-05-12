---
id: DOC-GOVERNANCE-QUALITY-PLAN-HARNESS
number: GOV-012
domain: governance
category: quality-plan
title: Harness 框架 — 后续治理实施计划
owner: docs-maintainer
status: active
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs: []
---

# Harness 框架 — 后续治理实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完成 Harness 框架的三大后续治理任务：Skills 去重归集、文档一致性修复、飞书通知打通。

**Architecture:** 三项任务相互独立，可并行执行。

**Tech Stack:** Markdown + YAML + Shell + GitHub Actions

---

## Phase 1: Skills 治理（独立）

### Task 1: Skills 归集分析

**Files:**

- 扫描: `.agents/skills/` (含 gitnexus/ + superpowers/)
- 扫描: `~/.config/opencode/skills/`
- 扫描: `~/.claude/skills/`
- 输出: `memory/reports/skills-inventory.md`

- [ ] 生成完整 skills 清单（按来源/专业/命名/触发条件）
- [ ] 标记重复 skills（如 test-driven-development 在项目根和 superpowers/ 各有一份）
- [ ] 标记命名不一致的 skills
- [ ] 标记从未被调用的闲置 skills

### Task 2: Skills 去重与重命名

**Files:**

- 可能修改: `.agents/skills/` 目录下的重复 SKILL.md
- 更新: `docs/00-governance/harness/03-skills.md`
- 更新: `.harness/registry.yaml`

- [ ] 保留一份权威版本，删除重复副本
- [ ] 统一命名规范（如有不一致）
- [ ] 更新 03-skills.md 中的技能计数
- [ ] 更新 registry.yaml 中的技能分配

### Task 3: Skills 分专业归集

**Files:**

- 创建: `.agents/skills/产品/` `设计/` `开发/` `测试/` 或索引文件
- 更新: `docs/00-governance/harness/03-skills.md`

- [ ] 将 72 技能按四专业索引
- [ ] 每个专业目录下创建 README.md 索引
- [ ] 验证技能文件路径在 registry.yaml 中正确

---

## Phase 2: 文档治理（独立）

### Task 4: 文档状态扫描

**Files:**

- 扫描: `docs/00-governance/` `01-product/` `02-architecture/` `03-engineering/` `04-operations/`
- 扫描: `docs/knowledge-base/` `docs/99-archive/`
- 输出: `memory/reports/docs-inventory.md`

- [ ] 统计所有文档的 frontmatter status
- [ ] 标记冲突文档（同主题多份 active）
- [ ] 标记 superseded 但未迁移到存档的文档
- [ ] 标记与 Roadmap V1.2 冲突的文档（已知 3 处严重冲突）

### Task 5: 文档一致性修复

**Files:**

- 可能修改: 冲突文档的 frontmatter
- 更新: `docs/README.md`
- 更新: `docs/00-governance/harness/04-knowledge-base.md`

- [ ] 解决 SSOT 冲突：同一主题只保留一份 active
- [ ] 过期文档 frontmatter status 改为 superseded
- [ ] 历史文档迁移到 99-archive/
- [ ] 与 Roadmap V1.2 对齐的文档更新 frontmatter

### Task 6: 文档索引更新

**Files:**

- 更新: `docs/README.md`
- 更新: `docs/00-governance/harness/04-knowledge-base.md`
- 更新: `.harness/registry.yaml` knowledge 段

- [ ] 更新总索引 README.md
- [ ] 更新哈坊知识库索引
- [ ] 更新 registry.yaml 中的路径

---

## Phase 3: 飞书通知打通（独立）

### Task 7: 飞书 Webhook 配置

**前置条件:** 人类在飞书群中添加自定义机器人，提供 webhook URL

**Files:**

- 创建: `scripts/notify-feishu.sh`
- 修改: `.github/workflows/daily-summary.yml`
- 修改: `.github/workflows/weekly-review.yml`
- 修改: `.github/workflows/monthly-review.yml`
- 配置: GitHub Secret `FEISHU_WEBHOOK_URL`

- [ ] 创建飞书通知脚本（封装 curl 调用）
- [ ] 在 GitHub Actions 中添加 webhook 推送步骤
- [ ] 人类在飞书群中配置机器人
- [ ] 人类添加 Secret 到 GitHub
- [ ] 测试推送（手动 workflow_dispatch）

### Task 8: 日报/周报/月报 Workflow 创建

**Files:**

- 创建: `.github/workflows/daily-summary.yml`
- 创建: `.github/workflows/weekly-review.yml`
- 创建: `.github/workflows/monthly-review.yml`
- 创建: `scripts/collect-stats.sh`

- [ ] 创建每日总结 workflow（cron: 0 18 \* \* 1-5）
- [ ] 创建周考核 workflow（cron: 0 17 \* \* 5）
- [ ] 创建月考核 workflow（cron: 0 9 1 \* \*）
- [ ] 创建 stats 采集脚本
- [ ] 各 workflow 中嵌入飞书推送

### Task 9: lark-cli 授权（进阶，可选）

**前置条件:** 人类在飞书开放平台创建企业自建应用

- [ ] 人类创建应用 → 获取 App ID + Secret
- [ ] 配置权限: im:message, im:chat, task:task
- [ ] 执行 `lark-cli config set`
- [ ] 测试 `lark-cli im +messages-send`
- [ ] 更新 scripts/ 和 workflow 文件以支持 lark-cli

---

## 验收标准

- [ ] Skills 无重复、命名统一、按专业索引
- [ ] 文档无 SSOT 冲突、状态标记正确、索引同步
- [ ] 飞书每日/每周/每月通知正常推送
- [ ] CI 无红灯
