# Harness 优化建议文档 — 文档治理合规审查

## 审查结论：不符合文档治理规范，需重写

---

## 一、违规项清单

### 违规 1：文档存放位置错误

**规范要求**（document-governance.md §3、§7、§8）：

- 项目文档唯一源：`docs/`
- 计划类文档唯一入口：`docs/PLAN.md`
- 根目录仅允许 `AGENTS.md`、`README.md` 两个入口文件
- 禁止在根目录新增业务规范文档

**我的文档路径**：`.trae/documents/harness-framework-optimization-plan.md`

**问题**：

- `.trae/documents/` 不是规范的文档存放位置
- 该路径不在 `docs/` 目录下，违反 SSOT 原则
- 未在 `docs/README.md` 索引中登记

**正确做法**：

- 应存放于 `docs/05-project/` 或 `docs/04-operations/` 下
- 建议路径：`docs/05-project/harness-framework-optimization-proposal.md`
- 必须在 `docs/README.md` 中登记

---

### 违规 2：缺少 Frontmatter

**规范要求**（document-governance.md §5）：
所有文档必须包含以下 frontmatter：

```yaml
---
id: DOC-XX-XXX-XXXX
number: XXX-XXX
domain: governance
category: xxx
title: 文档标题
owner: docs-maintainer
status: active
last_updated: YYYY-MM-DD
source_of_truth: true
ai_contract: docs/ai/contracts/xxx.md
related_code: []
related_docs: []
---
```

**我的文档**：完全缺少 frontmatter

**正确做法**：

```yaml
---
id: DOC-05-PROJECT-HARNESS-OPTIMIZATION
number: PRJ-014
domain: project
category: plan
title: Harness 框架优化建议
owner: docs-maintainer
status: draft
last_updated: 2026-05-12
source_of_truth: false
ai_contract: docs/ai/contracts/harness-optimization.md
related_code: []
related_docs:
  - docs/00-governance/harness/00-overview.md
  - docs/00-governance/harness/01-workflows.md
  - docs/00-governance/harness/02-roles.md
---
```

---

### 违规 3：未遵循文档状态模型

**规范要求**（document-governance.md §4）：

- `draft`：草稿，禁止作为执行依据
- `active`：当前执行版本（唯一事实源）
- `superseded`：已被新版本取代
- `archived`：仅历史查询

**我的文档**：未标记任何状态

**问题**：

- 优化建议文档属于"提案/计划"性质，应标记为 `draft`
- 如经评审通过，可升级为 `active`
- 当前未标记状态，可能被误认为是已生效的规范

---

### 违规 4：未调用 document-sync 技能同步 AI 合约

**规范要求**（document-governance.md §6.5、§9）：

- 任何 `docs/` 下文档变更后，必须调用 `document-sync` 技能
- 同步 `docs/ai/contracts/` 下的 AI 合约

**我的操作**：

- 未调用 `document-sync` 技能
- 未生成对应的 AI 合约文件

**正确做法**：

1. 文档写入 `docs/` 后，调用 `document-sync` 技能
2. 生成 `docs/ai/contracts/harness-optimization.md`
3. AI 合约应包含：表格、清单、无叙事段落

---

### 违规 5：未更新 docs/README.md 索引

**规范要求**（document-governance.md §9、pr-doc-checklist.md）：

- `docs/README.md` 已同步登记新增/变更文档
- 所有 active 文档必须在本页登记

**我的文档**：未在 `docs/README.md` 中登记

---

### 违规 6：编号不符合规范

**规范要求**（document-governance.md §5.1）：

- 领域代码映射：项目 = PRJ
- 编号范围：PRJ-001 ~ PRJ-099

**我的文档**：无编号

**建议编号**：`PRJ-014`（根据 docs/README.md 中现有 PRJ 文档数量推算）

---

### 违规 7：文档格式不符合 AI 合约要求

**规范要求**（document-governance.md §2、知识引擎文档）：

- AI 合约层格式：表格 + 清单，无叙事段落
- 人类文档层格式：段落 + 叙事

**我的文档**：

- 混合了叙事段落和表格
- 作为"计划/提案"文档，应主要使用表格和清单
- 详细的叙事解释应精简或移除

---

## 二、合规重写方案

### 步骤 1：删除违规文档

```bash
rm .trae/documents/harness-framework-optimization-plan.md
```

### 步骤 2：在正确位置创建合规文档

**路径**：`docs/05-project/harness-framework-optimization-proposal.md`

**Frontmatter**：

```yaml
---
id: DOC-05-PROJECT-HARNESS-OPTIMIZATION
number: PRJ-014
domain: project
category: plan
title: Harness 框架优化建议
owner: docs-maintainer
status: draft
last_updated: 2026-05-12
source_of_truth: false
ai_contract: docs/ai/contracts/harness-optimization.md
related_code: []
related_docs:
  - docs/00-governance/harness/00-overview.md
  - docs/00-governance/harness/01-workflows.md
  - docs/00-governance/harness/02-roles.md
  - docs/00-governance/harness/03-skills.md
  - docs/00-governance/harness/09-governance.md
  - docs/00-governance/document-governance.md
---
```

### 步骤 3：内容重构（表格 + 清单为主）

将原有内容重构为：

1. **执行摘要**（1-2句话）
2. **痛点矩阵**（表格：痛点 | 影响 | 建议 | 优先级）
3. **优化项清单**（检查清单格式）
4. **实施路线图**（表格：阶段 | 时间 | 内容）

### 步骤 4：调用 document-sync 生成 AI 合约

```bash
# 调用 document-sync 技能
# 生成 docs/ai/contracts/harness-optimization.md
```

AI 合约应包含：

- 优化项清单（表格）
- 优先级排序（表格）
- 实施阶段（表格）
- 无叙事段落

### 步骤 5：更新 docs/README.md

在 `05-project` 章节新增：

```markdown
- `docs/05-project/harness-framework-optimization-proposal.md` — `PRJ-014` Harness 框架优化建议（draft）
```

### 步骤 6：通过 PR 检查清单

- [ ] 仅在 `docs/` 目录新增文档
- [ ] active 文档 Frontmatter 字段完整（注意：本提案为 draft，非 active）
- [ ] `docs/README.md` 已同步登记
- [ ] 文档链接均为有效 `docs/...` 路径
- [ ] 同主题无多份 active 冲突文档

---

## 三、教训总结

### 违反的规范条目

| 规范条目       | 违规内容                    | 正确做法                       |
| -------------- | --------------------------- | ------------------------------ |
| §3 目录职责    | 文档放在 `.trae/documents/` | 放在 `docs/05-project/`        |
| §5 Frontmatter | 完全缺少 frontmatter        | 按模板填写完整 frontmatter     |
| §4 状态模型    | 未标记状态                  | 标记为 `draft`                 |
| §6.5 强制技能  | 未调用 `document-sync`      | 文档变更后调用 `document-sync` |
| §7 SSOT        | 未在 `docs/README.md` 登记  | 更新索引                       |
| §9 变更流程    | 未更新索引、未同步合约      | 按 6 步流程执行                |

### 根因分析

1. **急于输出**：在 Plan Mode 下，用户要求"提出优化建议"，我急于生成内容，忽略了文档治理规范
2. **路径惯性**：`.trae/documents/` 是之前其他任务使用的路径，形成了惯性
3. **规范意识薄弱**：虽然 AGENTS.md 中要求"任何 docs/ 下文档变更后调用 document-sync"，但我未将"新建文档"也纳入此约束

### 改进措施

1. **任何文档操作前**，先检查目标路径是否在 `docs/` 下
2. **任何文档创建前**，先填写 frontmatter 模板
3. **文档创建后**，立即调用 `document-sync` 技能
4. **定期回顾** `docs/00-governance/document-governance.md`，强化规范意识

---

## 四、合规版本文档（草稿）

以下是我按照规范重写的合规版本：

```markdown
---
id: DOC-05-PROJECT-HARNESS-OPTIMIZATION
number: PRJ-014
domain: project
category: plan
title: Harness 框架优化建议
owner: docs-maintainer
status: draft
last_updated: 2026-05-12
source_of_truth: false
ai_contract: docs/ai/contracts/harness-optimization.md
related_code: []
related_docs:
  - docs/00-governance/harness/00-overview.md
  - docs/00-governance/harness/01-workflows.md
  - docs/00-governance/harness/02-roles.md
  - docs/00-governance/harness/03-skills.md
  - docs/00-governance/harness/09-governance.md
  - docs/00-governance/document-governance.md
---

# Harness 框架优化建议

> 基于 Harness 工程框架文档审查，提出 16 项优化建议。
> 状态：draft，待评审。

## 优化项矩阵

| #   | 痛点                     | 影响范围 | 建议                          | 优先级 | 实施难度 |
| --- | ------------------------ | -------- | ----------------------------- | ------ | -------- |
| 1   | 评审小组可能流于形式     | 阶段1    | 增加时间盒约束 + 输出质量标准 | P0     | 低       |
| 2   | 构建与测试反馈循环过长   | 阶段3    | 内嵌微型测试循环              | P1     | 中       |
| 3   | 进化阶段触发条件模糊     | 阶段7    | 明确量化阈值                  | P1     | 低       |
| 4   | 产品经理职责过重         | 角色体系 | 交付/进化阶段职责拆分         | P1     | 低       |
| 5   | 开发工程师评审参与度不足 | 阶段5    | 增加"代码解释者"角色          | P1     | 低       |
| 6   | 测试工程师构建阶段缺位   | 阶段3    | 增加"测试左移"机制            | P1     | 中       |
| 7   | 自报指标占比过高         | 考核体系 | 交叉验证机制                  | P0     | 中       |
| 8   | 反对意见率难以量化       | 考核体系 | 改为"有价值的反对意见率"      | P1     | 低       |
| 9   | 缺乏团队协作流畅度指标   | 考核体系 | 新增交接清晰度等 3 项指标     | P2     | 中       |
| 10  | 技能缺乏熟练度评估       | 技能体系 | 引入 L1-L3 熟练度等级         | P1     | 中       |
| 11  | MCP工具利用率指标过低    | 考核体系 | 改为动态计算                  | P2     | 低       |
| 12  | 自适应治理缺乏渐进性     | 治理体系 | 增加 L1.5/L2.5/L3.5 阶梯      | P2     | 中       |
| 13  | 调节7天过期过于僵化      | 治理体系 | 引入续期评估 + 区分临时/持久  | P2     | 中       |
| 14  | 知识库更新依赖人工       | 知识管理 | 引入健康度指标 + 自动触发     | P3     | 高       |
| 15  | MEMORY.md写入规范不具体  | 知识管理 | 制定写入模板 + 自动索引       | P2     | 低       |
| 16  | 复制指南技能重写过于笼统 | 扩展性   | 提供技能映射工作表            | P3     | 低       |

## 实施路线图

| 阶段 | 时间  | 内容            |
| ---- | ----- | --------------- |
| 短期 | 1-2周 | P0 + P1低难度项 |
| 中期 | 1个月 | P1 + P2项       |
| 长期 | 季度  | P3项            |

## 验收标准

- [ ] 评审时间盒约束生效
- [ ] 自报指标交叉验证机制运行
- [ ] 产品经理职责拆分完成
- [ ] 技能熟练度评估体系建立
```

---

## 五、后续行动

1. **删除违规文档**：`.trae/documents/harness-framework-optimization-plan.md`
2. **创建合规文档**：`docs/05-project/harness-framework-optimization-proposal.md`
3. **调用 document-sync**：生成 AI 合约
4. **更新 docs/README.md**：登记新文档
5. **提交 PR**：通过文档治理检查清单

---

> 本审查文档本身也应遵循文档治理规范，存放于 `docs/04-operations/` 或作为 `docs/05-project/` 文档的附件。
