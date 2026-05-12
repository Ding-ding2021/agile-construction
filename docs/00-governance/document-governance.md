---
id: DOC-00-GOVERNANCE-DOCUMENT-GOVERNANCE
number: GOV-001
domain: governance
category: doc-governance
title: 文档治理规范
owner: docs-maintainer
status: active
last_updated: 2026-05-12（目录结构重组：harness/→00-governance/，specs/→01-product/，plans/→02-architecture/）
source_of_truth: true
ai_contract: docs/ai/contracts/document-governance.md
related_code:
  - AGENTS.md
  - memory/MEMORY.md
  - .agents/skills/
  - src-next/
related_docs:
  - docs/README.md
  - docs/PLAN.md
  - docs/ai/README.md
---

# 文档治理规范

## 1. 目标

- 建立 `docs/` 作为项目文档唯一源
- 建立 `memory/` 作为项目记忆唯一源（各工具通过 symlink 引用）
- 建立 `.agents/skills/` 作为 AI 技能唯一源
- 建立 **AGENTS.md（入口）+ 三层文档架构**（见 §2），避免内容重复

## 2. 三层文档架构

项目文档按读者分为三个层次：

| 层             | 位置        | 读者           | 格式          | 职责                         |
| -------------- | ----------- | -------------- | ------------- | ---------------------------- |
| **入口**       | `AGENTS.md` | AI（启动必读） | 清单式        | 角色、规则、启动流程         |
| **记忆层**     | `memory/`   | AI（跨会话）   | 键值对 + 日志 | 关键决策、模式、每日任务记录 |
| **AI 合约层**  | `docs/ai/`  | AI（按需加载） | 表格 + 清单   | 模块规则、实体定义、API 骨架 |
| **人类文档层** | `docs/`     | 人类 + AI 参考 | 段落 + 叙事   | PRD、架构、工程指南          |

**数据流**：人类写 `docs/` → `document-sync` 技能提取合约 → `docs/ai/` → AI 读合约执行 → 完成 → 模式反哺 `docs/ai/knowledge/` + `memory/`

> 详见 `.agents/skills/document-sync/SKILL.md`

## 3. 目录与职责

| 子目录           | 内容                   | 领域 | 状态             |
| ---------------- | ---------------------- | ---- | ---------------- |
| `00-governance`  | 规则、标准、流程、框架 | 治理 | 长期有效         |
| `01-product`     | 需求、路线图、调研     | 产品 | 按版本迭代       |
| `02-design`      | 视觉系统、组件规范     | 设计 | 按版本迭代       |
| `03-development` | 架构、技术方案、编码   | 开发 | 工程阶段更新     |
| `04-testing`     | 测试规范、策略、指南   | 测试 | 长期有效         |
| `05-project`     | 计划、报告、运营、发布 | 项目 | 运营阶段更新     |
| `ai/`            | AI 合约、知识、上下文  | —    | 随人类文档同步   |
| `99-archive`     | 历史归档               | 归档 | 不可作为执行依据 |

## 4. 状态模型

| 状态         | 说明                       | 判断标准                                                     |
| ------------ | -------------------------- | ------------------------------------------------------------ |
| `draft`      | 草稿，禁止作为执行依据     | 正在编写中，未通过评审                                       |
| `active`     | 当前执行版本（唯一事实源） | 已通过评审，作为唯一执行依据                                 |
| `superseded` | 已被新版本取代，保留追溯   | 有明确的新版本替代，旧版本仍有参考价值（如查看历史决策依据） |
| `archived`   | 仅历史查询                 | 无替代版本，或内容完全过时，仅保留法律/审计追溯              |

同主题仅允许一个 `active` 文档，其余必须标记 `superseded` 或进入 `99-archive`。

## 5. Frontmatter 标准（2026-05-12 统一）

所有文档必须严格按照文档类型选用以下四套模板之一。

### 5.1 模板 A：标准文档（活跃/草稿/被取代）

适用于 `docs/00-governance/` ~ `docs/05-project/` 下的全部活跃文档、草稿、被取代文档。

```yaml
---
id: DOC-00-GOVERNANCE-CODING-STANDARDS # 唯一 ID（历史兼容）
number: GOV-002 # 简化编号
domain: governance # 一级领域（枚举值）
category: code-standards # 二级分类（kebab-case 枚举值）
title: 代码规范 # 文档标题
owner: docs-maintainer # 负责人
status: active # active / draft / superseded
last_updated: 2026-05-12 # 最后更新日期
source_of_truth: true # true / false
related_code: # 关联代码路径
  - src-next/
related_docs: # 关联文档路径
  - docs/00-governance/xxx.md
---
```

必填字段（11 个）：`id`、`number`、`domain`、`category`、`title`、`owner`、`status`、`last_updated`、`source_of_truth`、`related_code`、`related_docs`。

其中 `related_code` 和 `related_docs` 无关联时使用空数组 `[]`；`owner` 无特定负责人时统一为 `docs-maintainer`。

### 5.2 模板 B：归档文档（`99-archive/`）

仅限 `docs/99-archive/` 下的文档使用。

```yaml
---
id: ARC-042
number: ARC-042
domain: archive
category: archived
title: 已归档文档标题
status: archived
last_updated: 2026-05-12
archived_at: 2026-04-24 # 归档日期
archived_reason: 已被 V1.2 整合替代 # 归档原因
---
```

必填字段（9 个）：`id`、`number`、`domain`、`category`、`title`、`status`、`last_updated`、`archived_at`、`archived_reason`。`domain` 固定为 `archive`，`category` 固定为 `archived`。

### 5.3 模板 C：AI 合约（`docs/ai/contracts/`）

仅限 `docs/ai/contracts/` 下的文档使用。

```yaml
---
id: AI-CODING-STANDARDS # 合约 ID
human_source: docs/00-governance/xxx.md # 对应人类文档路径
status: active # active / draft
last_synced: 2026-05-12 # 最后同步时间
---
```

必填字段（4 个）：`id`、`human_source`、`status`、`last_synced`。

### 5.4 模板 D：报告（`docs/05-project/reports/`）

仅限自动生成的报告使用。

```yaml
---
title: 扫描报告
domain: project
category: report
status: active
last_updated: 2026-05-12
generated_at: 2026-05-12 10:30
---
```

必填字段（6 个）：`title`、`domain`、`category`、`status`、`last_updated`、`generated_at`。

### 5.5 字段映射表

| 字段              | 模板 A | 模板 B | 模板 C | 模板 D | 说明                           |
| ----------------- | ------ | ------ | ------ | ------ | ------------------------------ |
| `id`              | 必填   | 必填   | 必填   | —      | 唯一标识                       |
| `number`          | 必填   | 必填   | —      | —      | 简化编号                       |
| `domain`          | 必填   | 固定   | —      | 必填   | 一级领域                       |
| `category`        | 必填   | 固定   | —      | 必填   | 二级分类                       |
| `title`           | 必填   | 必填   | —      | 必填   | 文档标题                       |
| `owner`           | 必填   | —      | —      | —      | 负责人                         |
| `status`          | 必填   | 必填   | 必填   | 必填   | 文档状态                       |
| `last_updated`    | 必填   | 必填   | —      | 必填   | 最后更新                       |
| `source_of_truth` | 必填   | —      | —      | —      | 单源真理标记                   |
| `related_code`    | 必填   | —      | —      | —      | 关联代码                       |
| `related_docs`    | 必填   | —      | —      | —      | 关联文档                       |
| `archived_at`     | —      | 必填   | —      | —      | 归档日期                       |
| `archived_reason` | —      | 必填   | —      | —      | 归档原因                       |
| `human_source`    | —      | —      | 必填   | —      | 人类文档源                     |
| `last_synced`     | —      | —      | 必填   | —      | AI 合约同步时间                |
| `generated_at`    | —      | —      | —      | 必填   | 生成时间戳                     |
| `ai_contract`     | 可选   | —      | —      | —      | AI 合约路径（参见 §5.6）       |
| `superseded_by`   | 可选   | —      | —      | —      | 仅 `status: superseded` 时使用 |

### 5.6 特殊字段规则

- **`ai_contract`**：仅当该文档已通过 `document-sync` 生成了 AI 合约时添加，指向 `docs/ai/contracts/` 下的合约文件。
- **`superseded_by`**：仅当 `status: superseded` 时使用，指向取代当前文档的新文档路径。
- **`supersedes`**：可选，指向被当前文档取代的旧文档路径。

### 5.7 编号规则

| 字段     | 格式                       | 示例                                 | 适用范围  |
| -------- | -------------------------- | ------------------------------------ | --------- |
| `id`     | `DOC-{序号}-{领域}-{标题}` | `DOC-00-GOVERNANCE-CODING-STANDARDS` | 模板 A    |
| `number` | `{领域代码}-{三位序号}`    | `GOV-002`                            | 模板 A、B |

#### 领域代码映射

| 领域 | 代码 | 编号范围          |
| ---- | ---- | ----------------- |
| 治理 | GOV  | GOV-001 ~ GOV-099 |
| 产品 | PRD  | PRD-001 ~ PRD-099 |
| 设计 | DES  | DES-001 ~ DES-099 |
| 开发 | DEV  | DEV-001 ~ DEV-099 |
| 测试 | TST  | TST-001 ~ TST-099 |
| 项目 | PRJ  | PRJ-001 ~ PRJ-099 |
| 归档 | ARC  | ARC-001 ~ ARC-099 |

#### 二级分类（category）枚举

| 领域        | 可选 category 值                                                                                                                                |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| governance  | `doc-governance`, `code-standards`, `review-process`, `collaboration`, `metrics`, `quality-plan`, `language-config`, `harness`, `process-guide` |
| product     | `prd`, `roadmap`, `research`                                                                                                                    |
| design      | `visual-spec`, `design-system`, `design-checklist`                                                                                              |
| development | `architecture`, `technical-design`, `guide`, `implementation`, `refactor`                                                                       |
| testing     | `test-standards`, `test-guide`, `test-strategy`                                                                                                 |
| project     | `process-guide`, `plan`, `report`, `metrics`, `release`                                                                                         |
| archive     | `archived`                                                                                                                                      |

## 6. Skills 治理

AI 技能（SKILL.md）统一管理规则：

### 6.1 中央仓库

所有技能存放在 `.agents/skills/`，每个技能一个子目录：

```
.agents/skills/
  <skill-name>/
    SKILL.md       # 技能定义
    scripts/       # 可选辅助脚本
```

### 6.2 工具引用

各工具的 `skills/` 目录通过符号链接指向 `.agents/skills/`：

| 工具        | 技能目录                   | 引用方式                    |
| ----------- | -------------------------- | --------------------------- |
| Claude Code | `.claude/skills/`          | symlink → `.agents/skills/` |
| OpenCode    | `.config/opencode/skills/` | 系统级 + 项目级合并加载     |
| 其他工具    | `.trae/skills/` 等         | 已废弃，见 §7 单源真理原则  |

```bash
# Claude Code 示例
.claude/skills/<skill-name>   →  symlink  →  ../../.agents/skills/<skill-name>
```

### 6.3 命名规范

- 技能目录名使用 kebab-case
- 参考现有名称：`shadcn-management`, `web-artifacts-builder`, `clone-website`

### 6.4 维护规则

1. 新技能先创建到 `.agents/skills/`，再创建符号链接
2. 定期检查损坏链接：`find . -type l ! -exec test -e {} \; -print`
3. 删除技能时先删符号链接，再删 `.agents/skills/` 中的源目录
4. `.claude/skills/` 中只保留有效链接和本地特定技能

### 6.5 核心强制技能

以下技能在特定场景**必须加载**，不可跳过：

| 技能                             | 触发场景                  | 强制级别 |
| -------------------------------- | ------------------------- | -------- |
| `karpathy-guidelines`            | 任何代码修改前            | 硬性     |
| `document-sync`                  | 任何 `docs/` 下文档变更后 | 硬性     |
| `verification-before-completion` | 声称完成前                | 硬性     |

## 7. 单源真理（SSOT）原则

| 信息类型 | 唯一源            | 禁止重复存放                                |
| -------- | ----------------- | ------------------------------------------- |
| 项目文档 | `docs/`           | `.qoder/repowiki/`、`.gitnexus/wiki/`       |
| 项目记忆 | `memory/`         | `.opencode/memory/`（已改 symlink）         |
| AI 技能  | `.agents/skills/` | `.trae/skills/`、`.qoder/skills/`（已删除） |
| 架构规则 | `AGENTS.md`       | 其他工具根级说明文件                        |

> 如发现上述禁止路径已存在内容，应评估迁移至对应唯一源或标记为 `deprecated`，**禁止新增内容**。

## 8. 引用规则

- 文档引用统一使用 `docs/xxx` 相对路径
- 根目录仅允许 `AGENTS.md`、`README.md` 两个入口文件
- 禁止在根目录新增业务规范文档

## 9. 变更流程

1. 修改文档内容
2. 更新 Frontmatter（`last_updated`）
3. 如文档变更影响 AI 合约，调用 `document-sync` 技能同步 `docs/ai/contracts/`
4. 更新 `docs/README.md` 索引（如新增文件）
5. 通过 `docs/00-governance/pr-doc-checklist.md` 检查
6. 合并后记录至审计文档

## 10. 计划文档管理规则

### 10.1 计划总览

所有计划类信息在 `docs/PLAN.md` 集中管理，包括：

- 项目当前阶段与方向
- 活跃计划文档清单
- 关键决策记录（时间线）
- 待办工作项

`docs/PLAN.md` 是计划类文档的唯一入口，其他文档不应再零散记录计划信息。

### 10.2 评估报告生命周期

| 类型       | 说明                                     | 保留策略                 |
| ---------- | ---------------------------------------- | ------------------------ |
| 一次性评估 | 针对某个时间点的评估（进度、审计、报告） | 完成后移入 `99-archive/` |
| 持续跟踪   | 需要持续维护的指标或清单                 | 保留在 `04-operations/`  |

判断标准：文档标题或内容包含具体日期（如 `2026-04-23`）且结论不随时间推移而更新的，属于一次性评估，完成后应归档。

### 10.3 计划升版规则

- 新版本成为 `active` 时，旧版本必须标记 `superseded` 并填写 `deprecated_reason`
- 旧版本的 `related_docs` 中应指向新版本
- `docs/PLAN.md` 的关键决策记录中追加条目

### 10.4 月度检查

每月至少执行一次：

- `docs/README.md` 状态与文档 frontmatter 一致
- `docs/PLAN.md` 反映当前项目状态
  - 无新增散落计划信息

## 11. 知识架构映射（五层→三层）

项目存在两套互补的知识架构，它们不是对立关系：

### 五层知识架构（知识引擎）

| 层          | 位置                                  | 内容                               |
| ----------- | ------------------------------------- | ---------------------------------- |
| Schema      | AGENTS.md + harness 注册表 + 角色文件 | 告诉 AI 如何组织知识               |
| Harness框架 | docs/00-governance/harness/           | 七阶段流水线、四角色体系、技能映射 |
| Wiki        | docs/                                 | Markdown 文档，人类可读            |
| Skill       | .agents/skills/                       | 可复用程序记忆                     |
| 记忆        | memory/ + docs/ai/knowledge/          | 跨会话持久事实                     |
| Raw         | docs/ai/contracts/                    | 从 PRD 提取的不可变规则            |

### 三层文档架构（document-sync）

| 层         | 位置          | 读者           |
| ---------- | ------------- | -------------- |
| 人类文档层 | docs/ (00-04) | 人类 + AI 参考 |
| AI 合约层  | docs/ai/      | AI 消费        |
| 记忆进化层 | memory/       | AI 跨会话      |

### 映射关系

```
五层              三层
Schema ──→ AGENTS.md（入口）
Wiki   ──→ docs/（人类文档层）
Skill  ──→ .agents/skills/（独立维）
记忆    ──→ memory/ + docs/ai/knowledge/（记忆进化层）
Raw    ──→ docs/ai/contracts/（AI 合约层）
```

> 详见 `docs/01-product/specs/2026-05-11-knowledge-engine.md`
