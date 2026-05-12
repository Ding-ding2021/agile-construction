---
id: AI-DOCUMENT-GOVERNANCE
human_source: docs/00-governance/document-governance.md
status: active
last_synced: 2026-05-12（同步：§5 统一为 4 模板体系）
title: AI 合约：文档治理
last_updated: 2026-05-12
---

# AI 合约：文档治理

## 模块定位

定义 docs/ 三层文档架构、状态模型、变更流程与单源真理原则。

## 三层架构

| 层             | 位置        | 读者           | 格式          | 职责                         |
| -------------- | ----------- | -------------- | ------------- | ---------------------------- |
| **入口**       | `AGENTS.md` | AI（启动必读） | 清单式        | 角色、规则、启动流程         |
| **记忆层**     | `memory/`   | AI（跨会话）   | 键值对 + 日志 | 关键决策、模式、每日任务记录 |
| **AI 合约层**  | `docs/ai/`  | AI（按需加载） | 表格 + 清单   | 模块规则、实体定义、API 骨架 |
| **人类文档层** | `docs/`     | 人类 + AI 参考 | 段落 + 叙事   | PRD、架构、工程指南          |

## 目录职责

| 子目录           | 内容                   | 状态             |
| ---------------- | ---------------------- | ---------------- |
| `00-governance`  | 规则、标准、流程、框架 | 长期有效         |
| `01-product`     | 需求、路线图、调研     | 按版本迭代       |
| `02-design`      | 视觉系统、组件规范     | 按版本迭代       |
| `03-development` | 架构、技术方案、编码   | 工程阶段更新     |
| `04-testing`     | 测试规范、策略、指南   | 长期有效         |
| `05-project`     | 计划、报告、运营、发布 | 运营阶段更新     |
| `ai/`            | AI 合约、知识、上下文  | 随人类文档同步   |
| `99-archive`     | 历史归档               | 不可作为执行依据 |

## 状态模型

| 状态         | 判断标准                                        |
| ------------ | ----------------------------------------------- |
| `draft`      | 正在编写中，未通过评审                          |
| `active`     | 已通过评审，作为唯一执行依据                    |
| `superseded` | 有明确的新版本替代，旧版本仍有参考价值          |
| `archived`   | 无替代版本，或内容完全过时，仅保留法律/审计追溯 |

## Frontmatter 模板（2026-05-12 统一）

4 套模板，按文档所在目录选用。

### 模板 A：标准文档

适用 `00-governance/` ~ `05-project/`。必填 11 字段。

| 字段              | 说明                                                  |
| ----------------- | ----------------------------------------------------- |
| `id`              | DOC-{领域}-{分类}-{标题}                              |
| `number`          | {领域代码}-{三位序号}                                 |
| `domain`          | governance/product/design/development/testing/project |
| `category`        | kebab-case 枚举值                                     |
| `title`           | 文档标题                                              |
| `owner`           | 默认 docs-maintainer                                  |
| `status`          | active/draft/superseded                               |
| `last_updated`    | YYYY-MM-DD                                            |
| `source_of_truth` | true/false                                            |
| `related_code`    | 数组（空则 []）                                       |
| `related_docs`    | 数组（空则 []）                                       |

可选：`ai_contract`（合约路径）、`superseded_by`（仅 superseded 时）。

### 模板 B：归档文档

适用 `99-archive/`。必填 9 字段。domain=archive，category=archived，status=archived。

| 字段              | 说明           |
| ----------------- | -------------- |
| `id`              | ARC-{三位序号} |
| `number`          | ARC-{三位序号} |
| `title`           | 文档标题       |
| `last_updated`    | YYYY-MM-DD     |
| `archived_at`     | 归档日期       |
| `archived_reason` | 归档原因       |

### 模板 C：AI 合约

适用 `docs/ai/contracts/`。必填 4 字段。

| 字段           | 说明             |
| -------------- | ---------------- |
| `id`           | AI-{模块名}      |
| `human_source` | 对应人类文档路径 |
| `status`       | active/draft     |
| `last_synced`  | YYYY-MM-DD       |

### 模板 D：报告

适用 `docs/05-project/reports/`。必填 6 字段。

| 字段           | 说明             |
| -------------- | ---------------- |
| `title`        | 报告标题         |
| `domain`       | project          |
| `category`     | report           |
| `status`       | active           |
| `last_updated` | YYYY-MM-DD       |
| `generated_at` | YYYY-MM-DD HH:MM |

### 领域代码

| 领域        | 代码 | 范围        |
| ----------- | ---- | ----------- |
| governance  | GOV  | GOV-001~099 |
| product     | PRD  | PRD-001~099 |
| design      | DES  | DES-001~099 |
| development | DEV  | DEV-001~099 |
| testing     | TST  | TST-001~099 |
| project     | PRJ  | PRJ-001~099 |
| archive     | ARC  | ARC-001~099 |

## 强制技能

| 技能                             | 触发场景                  | 强制级别 |
| -------------------------------- | ------------------------- | -------- |
| `karpathy-guidelines`            | 任何代码修改前            | 硬性     |
| `document-sync`                  | 任何 `docs/` 下文档变更后 | 硬性     |
| `verification-before-completion` | 声称完成前                | 硬性     |

## 单源真理（SSOT）

| 信息类型 | 唯一源            | 禁止路径                                    |
| -------- | ----------------- | ------------------------------------------- |
| 项目文档 | `docs/`           | `.qoder/repowiki/`、`.gitnexus/wiki/`       |
| 项目记忆 | `memory/`         | `.opencode/memory/`（已改 symlink）         |
| AI 技能  | `.agents/skills/` | `.trae/skills/`、`.qoder/skills/`（已删除） |
| 架构规则 | `AGENTS.md`       | 其他工具根级说明文件                        |

## 变更流程

1. 修改文档内容
2. 更新 Frontmatter（`last_updated`）
3. 如影响 AI 合约，调用 `document-sync` 同步 `docs/ai/contracts/`
4. 更新 `docs/README.md` 索引
5. 通过 `pr-doc-checklist.md` 检查
6. 合并后记录至审计文档

## 知识架构映射

| 五层架构 | 位置                         | 三层映射          |
| -------- | ---------------------------- | ----------------- |
| Schema   | AGENTS.md + harness          | AGENTS.md（入口） |
| Harness  | docs/00-governance/harness/  | 人类文档层        |
| Wiki     | docs/                        | 人类文档层        |
| Skill    | .agents/skills/              | 独立维            |
| 记忆     | memory/ + docs/ai/knowledge/ | 记忆进化层        |
| Raw      | docs/ai/contracts/           | AI 合约层         |

## 计划文档规则

- 所有计划类信息在 `docs/PLAN.md` 集中管理
- 一次性评估完成后移入 `99-archive/`
- 持续跟踪保留在 `04-operations/`
- 每月检查 `docs/README.md` 状态与 frontmatter 一致性

## 工具引用

| 工具        | 技能目录                   | 引用方式                    |
| ----------- | -------------------------- | --------------------------- |
| Claude Code | `.claude/skills/`          | symlink → `.agents/skills/` |
| OpenCode    | `.config/opencode/skills/` | 系统级 + 项目级合并加载     |
| 其他工具    | `.trae/skills/` 等         | 已废弃                      |

## 引用规则

- 文档引用统一使用 `docs/xxx` 相对路径
- 根目录仅允许 `AGENTS.md`、`README.md` 两个入口文件
- 禁止在根目录新增业务规范文档
