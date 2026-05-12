---
id: AI-DOCUMENT-GOVERNANCE
human_source: docs/00-governance/document-governance.md
status: active
last_synced: 2026-05-12
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

## Frontmatter 最低要求

| 字段              | 说明                                                                    |
| ----------------- | ----------------------------------------------------------------------- |
| `id`              | 历史 ID，保留不变，如 DOC-00-GOVERNANCE-XXX                             |
| `number`          | 简化编号，如 GOV-002（领域代码-三位序号）                               |
| `domain`          | 一级领域：governance/product/design/development/testing/project/archive |
| `category`        | 二级分类（kebab-case）                                                  |
| `title`           | 文档标题                                                                |
| `owner`           | 维护者                                                                  |
| `status`          | active / superseded / draft / archived                                  |
| `last_updated`    | 最后更新日期 YYYY-MM-DD                                                 |
| `source_of_truth` | true（active 文档）                                                     |
| `ai_contract`     | AI 合约路径（如 docs/ai/contracts/xxx.md）                              |
| `related_code`    | 关联代码路径数组                                                        |
| `related_docs`    | 关联文档路径数组                                                        |

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
