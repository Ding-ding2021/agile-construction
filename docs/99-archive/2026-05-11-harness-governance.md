---
id: DOC-ARCHIVE-HARNESS-GOV-PLAN
number: GOV-027
domain: archived
category: plan
title: Harness 治理实施计划（2026-05-11）
owner: docs-maintainer
status: superseded
last_updated: 2026-05-13
source_of_truth: false
related_code: []
related_docs:
  - harness/00-overview.md
  - harness/03-skills.md
  - agent-squad-protocol.md
---

# Harness 治理实施计划（2026-05-11）

> **注意**：本计划已被后续治理文档体系替代。参见 `00-overview.md` 和 `09-governance.md`。

## Clause 1. 计划背景

### 1.1 [参考] 目标

Harness 框架治理清理，解决以下已知问题：

**1.1.1 [参考]** Skills 文件命名不一致（部分 kebab-case，部分 camelCase）。

**1.1.2 [参考]** 多份文档描述同一技能在不同位置，存在 SSOT 冲突。

**1.1.3 [参考]** 72 个技能分散在 `.agents/skills/` 中，未按专业归集索引。

**1.1.4 [参考]** 文档状态标记不一致。

---

## Clause 2. Phase 1：技能治理

### 2.1 [参考] Task 1：Skills 命名统一

**2.1.1 [参考]** 发现 kebab-case / camelCase / PascalCase 混用，统一为 `kebab-case`。

**2.1.2 [参考]** 更新 `.harness/registry.yaml` 中的命名引用。

**2.1.3 [参考]** 更新 `docs/00-governance/harness/03-skills.md` 中的技能记录。

### 2.2 [参考] Task 2：SSOT 技能冲突规整

| 冲突主题      | 涉及文件      | 处理方案                        |
| ------------- | ------------- | ------------------------------- |
| 测试 / review | 多处          | 保留一份权威版本，删除重复副本  |
| 命名规范      | 多处          | 统一命名规范                    |
| 技能计数      | 部分文档      | 更新 03-skills.md 中的技能计数  |
| 角色绑定      | registry.yaml | 更新 registry.yaml 中的技能分配 |

### 2.3 [参考] Task 3：Skills 分专业归集

**2.3.1 [参考]** 将 72 技能按四专业索引。

**2.3.2 [参考]** 创建 `.agents/skills/{专业名}` 索引文件。

**2.3.3 [参考]** 每个专业目录下索引技能文件路径，验证在 registry.yaml 中正确。

---

## Clause 3. Phase 2：文档治理

### 3.1 [参考] Task 4：文档状态扫描

**3.1.1 [参考]** 扫描 `docs/` 下全部分级目录的文档 frontmatter status。

**3.1.2 [参考]** 标记冲突文档（同主题多份 active）。

**3.1.3 [参考]** 标记 superseded 但未迁移到存档的文档。

**3.1.4 [参考]** 标记与 Roadmap V1.2 冲突的文档。

### 3.2 [参考] Task 5：文档一致性修复

**3.2.1 [参考]** 解决 SSOT 冲突，同一主题只保留一份 active。

**3.2.2 [参考]** 过期文档 frontmatter status 改为 superseded。

**3.2.3 [参考]** 历史文档迁移到 99-archive/。

**3.2.4 [参考]** 与 Roadmap V1.2 对齐的文档更新 frontmatter。

### 3.3 [参考] Task 6：文档索引更新

**3.3.1 [参考]** 更新总索引 README.md。

**3.3.2 [参考]** 更新 Harness 知识库索引。

**3.3.3 [参考]** 更新 registry.yaml 中的路径。

---

## Clause 4. Phase 3：飞书通知打通

### 4.1 [参考] Task 7：飞书 Webhook 配置

**4.1.1 [参考]** 创建飞书通知脚本（encapsulation curl call）。

**4.1.2 [参考]** 在 GitHub Actions 中添加 webhook 推送步骤。

**4.1.3 [参考]** 人类在飞书群中配置机器人并添加 GitHub Secret。

### 4.2 [参考] Task 8：日报/周报/月报 Workflow 创建

**4.2.1 [参考]** 创建每日总结 workflow（cron: 0 18 \* \* 1-5）。

**4.2.2 [参考]** 创建周考核 workflow（cron: 0 17 \* \* 5）。

**4.2.3 [参考]** 创建月考核 workflow（cron: 0 9 1 \* \*）。

**4.2.4 [参考]** 创建 stats 采集脚本。

**4.2.5 [参考]** 各 workflow 中嵌入飞书推送。

### 4.3 [参考] Task 9：lark-cli 授权（可选）

**4.3.1 [参考]** 人类创建飞书应用 → 获取 App ID + Secret。

**4.3.2 [参考]** 配置权限后执行 `lark-cli config set`。

---

## Clause 5. 验收标准

### 5.1 [参考] 验收清单

**5.1.1 [参考]** Skills 无重复、命名统一、按专业索引。

**5.1.2 [参考]** 文档无 SSOT 冲突、状态标记正确、索引同步。

**5.1.3 [参考]** 飞书通知正常推送。

**5.1.4 [参考]** CI 无红灯。
