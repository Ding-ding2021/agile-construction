---
id: DOC-00-GOVERNANCE-DOCUMENT-GOVERNANCE
title: 文档治理规范
owner: docs-maintainer
status: active
last_updated: 2026-05-06
source_of_truth: true
related_code:
  - CLAUDE.md
  - memory/MEMORY.md
  - .agents/skills/
  - src-next/
related_docs:
  - docs/README.md
  - docs/PLAN.md
---

# 文档治理规范

## 1. 目标

- 建立 `docs/` 作为项目文档唯一源
- 建立 `memory/` 作为项目记忆唯一源（各工具通过 symlink 引用）
- 建立 `.agents/skills/` 作为 AI 技能唯一源
- 建立 **CLAUDE.md + memory/ + docs/** 三层分工体系，避免内容重复

## 2. 信息分层

| 层       | 位置                   | 职责                           | 更新频率     |
| -------- | ---------------------- | ------------------------------ | ------------ |
| 持久规则 | `CLAUDE.md`            | 架构、命令、不可变规则         | 架构变更时   |
| 当前状态 | `memory/MEMORY.md`     | 活跃 Phase、技术债务、决策记录 | Phase 切换时 |
| 增量日志 | `memory/YYYY-MM-DD.md` | 每日开发记录                   | 每日结束时   |
| 完整文档 | `docs/`                | 设计规范、PRD、架构、工程指南  | 按需         |

## 3. 目录与职责

| 子目录            | 内容                   | 状态             |
| ----------------- | ---------------------- | ---------------- |
| `00-governance`   | 规则与标准（含本文件） | 长期有效         |
| `01-product`      | 产品与需求             | 按版本迭代       |
| `02-architecture` | 架构与设计             | 架构变更时更新   |
| `03-engineering`  | 开发交付与发布         | 工程阶段更新     |
| `04-operations`   | 运营指标与治理记录     | 运营阶段更新     |
| `99-archive`      | 历史归档               | 不可作为执行依据 |

## 4. 状态模型

- `draft` — 草稿，禁止作为执行依据
- `active` — 当前执行版本（唯一事实源）
- `superseded` — 已被新版本取代，保留追溯
- `archived` — 仅历史查询

同主题仅允许一个 `active` 文档，其余必须标记 `superseded` 或进入 `99-archive`。

## 5. Frontmatter 最低要求

每篇 `active` 文档必须包含：

```yaml
---
id: # 唯一标识，如 DOC-01-PRODUCT-DESIGN-SPEC-V2-SHADCN
title: # 文档标题
owner: # 维护者
status: active # active / superseded / draft / archived
last_updated: # 最后更新日期 YYYY-MM-DD
source_of_truth: true
related_code: [] # 关联代码路径
related_docs: [] # 关联文档路径
---
```

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

```bash
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

## 7. 单源真理（SSOT）原则

| 信息类型 | 唯一源            | 禁止重复存放                                |
| -------- | ----------------- | ------------------------------------------- |
| 项目文档 | `docs/`           | `.qoder/repowiki/`、`.gitnexus/wiki/`       |
| 项目记忆 | `memory/`         | `.opencode/memory/`（已改 symlink）         |
| AI 技能  | `.agents/skills/` | `.trae/skills/`、`.qoder/skills/`（已删除） |
| 架构规则 | `CLAUDE.md`       | 其他工具根级说明文件                        |

## 8. 引用规则

- 文档引用统一使用 `docs/xxx` 相对路径
- 根目录仅允许 `CLAUDE.md`、`README.md`、`AGENTS.md` 三个入口文件
- 禁止在根目录新增业务规范文档

## 9. 变更流程

1. 修改文档内容
2. 更新 Frontmatter（`last_updated`）
3. 更新 `docs/README.md` 索引（如新增文件）
4. 通过 `docs/00-governance/pr-doc-checklist.md` 检查
5. 合并后记录至审计文档

## 7. 计划文档管理规则

### 7.1 计划总览

所有计划类信息在 `docs/PLAN.md` 集中管理，包括：

- 项目当前阶段与方向
- 活跃计划文档清单
- 关键决策记录（时间线）
- 待办工作项

`docs/PLAN.md` 是计划类文档的唯一入口，其他文档不应再零散记录计划信息。

### 7.2 评估报告生命周期

| 类型       | 说明                                     | 保留策略                 |
| ---------- | ---------------------------------------- | ------------------------ |
| 一次性评估 | 针对某个时间点的评估（进度、审计、报告） | 完成后移入 `99-archive/` |
| 持续跟踪   | 需要持续维护的指标或清单                 | 保留在 `04-operations/`  |

判断标准：文档标题或内容包含具体日期（如 `2026-04-23`）且结论不随时间推移而更新的，属于一次性评估，完成后应归档。

### 7.3 计划升版规则

- 新版本成为 `active` 时，旧版本必须标记 `deprecated` 并填写 `deprecated_reason`
- 旧版本的 `related_docs` 中应指向新版本
- `docs/PLAN.md` 的关键决策记录中追加条目

### 7.4 月度检查

每月至少执行一次：

- `docs/README.md` 状态与文档 frontmatter 一致
- `docs/PLAN.md` 反映当前项目状态
- 无新增散落计划信息

5. 提交并记录变更
