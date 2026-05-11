---
title: 项目整体管理流程指南
owner: docs-maintainer
status: active
last_updated: 2026-05-01
source_of_truth: true
related_docs: [docs/00-governance/document-governance.md]
---

# 项目整体管理流程指南

## 概述

本项目管理体系基于 "**GitHub 管状态、WorkBuddy 记过程、文档体系做沉淀**" 的三层架构：

| 层次     | 工具                     | 职责                         | 更新者     |
| -------- | ------------------------ | ---------------------------- | ---------- |
| 状态追踪 | GitHub Issues + Projects | 任务状态、里程碑进度、优先级 | Human + AI |
| 执行记录 | `.workbuddy/memory/`     | 每日日志、决策过程、技术细节 | AI         |
| 知识沉淀 | `docs/`                  | 架构决策、PRD、规范、复盘    | Human + AI |

---

## 1. 工作流

### 1.1 七阶段工作流

```
Backlog → Ready → In Progress → AI Completed → In Review → Done
                                                      ↓ (失败)
                                                 Reopened → In Progress
```

| 阶段             | 操作者 | 条件                           | 动作                               |
| ---------------- | ------ | ------------------------------ | ---------------------------------- |
| **Backlog**      | Human  | 新创建的 Issue                 | 添加 Label、Milestone、Priority    |
| **Ready**        | Human  | 依赖已解决、优先级已定         | 将 Issue 移入 Ready 列             |
| **In Progress**  | AI     | Human 指定任务                 | `gh issue develop/start`，开始编码 |
| **AI Completed** | AI     | 代码完成，build/lint/test 通过 | 写日志、提交、移入 In Review       |
| **In Review**    | Human  | AI 标记完成                    | 验收，通过则 Close，不通过则加评论 |
| **Done**         | Human  | 验收通过                       | Close Issue                        |
| **Reopened**     | Human  | 验收不通过                     | 添加评论说明问题，移回 In Progress |

### 1.2 核心原则

- **同一时间只有一个 In Progress**：单人+AI 模式下，不允许并行任务
- **质量门禁**：In Review → Done 必须经过 Human 验收
- **每日同步**：每次会话开始，查看 Project Board 当前状态

---

## 2. Label 体系

### Type（任务类型）

| Label           | 颜色                 | 用途              |
| --------------- | -------------------- | ----------------- |
| `type:feature`  | `#0E8A16` green      | 新功能开发        |
| `type:bug`      | `#D73A4A` red        | 缺陷修复          |
| `type:refactor` | `#FBCA04` yellow     | 重构/技术债务清偿 |
| `type:docs`     | `#5319E7` purple     | 文档编写/更新     |
| `type:test`     | `#006B75` teal       | 测试编写          |
| `type:infra`    | `#BFDADC` light blue | CI/构建/工具链    |
| `type:release`  | `#1D76DB` blue       | 发布管理          |

### Phase（所属阶段）

| Label                   | 颜色               | 对应计划               |
| ----------------------- | ------------------ | ---------------------- |
| `phase:1-foundation`    | `#B60205` dark red | Phase 1 底座搭建       |
| `phase:1.5-base-finish` | `#D93F0B` orange   | Phase 1.5 底座收官     |
| `phase:2-standards`     | `#FBCA04` yellow   | Phase 2 标准与项目     |
| `phase:3-tasks`         | `#0E8A16` green    | Phase 3 任务中心完善   |
| `phase:4-procurement`   | `#006B75` teal     | Phase 4 采购/资源/资产 |
| `phase:5-agent`         | `#1D76DB` blue     | Phase 5 Agent 与工作台 |
| `phase:6-e2e`           | `#5319E7` purple   | Phase 6 联调与验证     |

### Priority（优先级）

| Label         | 颜色             | 含义                    |
| ------------- | ---------------- | ----------------------- |
| `priority:P0` | `#B60205` red    | 阻塞/紧急，必须立即处理 |
| `priority:P1` | `#D93F0B` orange | 高优先级，当前迭代内    |
| `priority:P2` | `#FBCA04` yellow | 中优先级，下次迭代      |
| `priority:P3` | `#C0C0C0` gray   | 低优先级，排期外        |

### Status（辅助状态）

| Label              | 颜色             | 含义               |
| ------------------ | ---------------- | ------------------ |
| `status:blocked`   | `#000000` black  | 被阻塞，需外部条件 |
| `status:in-review` | `#5319E7` purple | 待验收/Review      |

---

## 3. 里程碑与版本

### 3.1 里程碑映射

| 里程碑                      | 对应 Phase | 任务数 | 状态    |
| --------------------------- | ---------- | ------ | ------- |
| M1 - Phase 1 底座搭建       | Phase 1    | 7      | pending |
| M1.5 - Phase 1.5 底座收官   | Phase 1.5  | 6      | pending |
| M2 - Phase 2 标准与项目     | Phase 2    | 9      | pending |
| M3 - Phase 3 任务中心完善   | Phase 3    | 7      | pending |
| M4 - Phase 4 采购/资源/资产 | Phase 4    | 5      | pending |
| M5 - Phase 5 Agent 与工作台 | Phase 5    | 5      | pending |
| M6 - Phase 6 联调与验证     | Phase 6    | 4      | pending |

### 3.2 版本规范

```
v{major}.{minor}.{patch}
```

- **major**: Phase 完成编号（1, 2, 3...）
- **minor**: 阶段内的任务包（0-9）
- **patch**: Hotfix、小文档、CI 修复

示例：`v1.0.0`（Phase 1 完成）、`v1.5.0`（Phase 1.5 完成）

---

## 4. 质量关卡

| 关卡            | 时机       | 执行者     | 检查项                           |
| --------------- | ---------- | ---------- | -------------------------------- |
| L1 Automation   | 每次提交   | Husky + CI | lint → build → test → coverage   |
| L2 AI Process   | 提交前     | AI         | 边界条件、测试覆盖、可解释性     |
| L3 Human Accept | In Review  | Human      | 验收标准逐条确认                 |
| L4 Phase Review | 里程碑关闭 | Human + AI | 回归测试、文档同步、技术债务检查 |

---

## 5. 发布流程

### 5.1 阶段完成发布

```
[Code Complete] → [CI Green] → [Human Accept] → [Phase Release]
                                                       ↓
                                            tag + GitHub Release
```

检查清单：

- [ ] 里程碑内所有 Issue 已关闭
- [ ] `npm run build` 零报错
- [ ] `npm run lint` 零报错
- [ ] `npm run test:coverage` 满足阈值
- [ ] 回归检查清单已执行（`docs/03-engineering/regression-checklist.md`）
- [ ] Phase Review 文档已编写
- [ ] Git tag 已创建（`v{major}.{minor}.0`）
- [ ] GitHub Release 已创建
- [ ] `package.json` version 已更新
- [ ] `development-plan-v1.2.md` 进度状态已更新

### 5.2 Hotfix 发布

- [ ] Issue 关联到 Bug
- [ ] 修复已验证
- [ ] Git tag 已创建（`v{major}.{minor}.{patch+1}`）
- [ ] GitHub Release 已创建

---

## 6. CLAUDE Code 中的 Issue 操作

所有操作通过 `gh CLI` 在终端中完成：

### 查看

```bash
# 列出当前里程碑的 open issues
gh issue list --milestone "Phase 2" --state open

# 查看 Issue 详情
gh issue view <number>

# 列出所有 Issues（含 label 过滤）
gh issue list --label "phase:1-foundation" --limit 30
```

### 创建

```bash
# 创建 Feature Issue
gh issue create --title "[Feature] XXX功能" \
  --label "type:feature,phase:2-standards" \
  --project "敏捷建店管理平台" \
  --milestone "Phase 2" \
  --body "$(cat path/to/body.md)"
```

### 更新

```bash
# 添加评论（进度更新）
gh issue comment <number> --body "进度: CRUD API 实现完成"

# 关闭 Issue（验收通过）
gh issue close <number> --comment "验收通过, build/lint/test 通过"

# 重新打开
gh issue reopen <number>
```

---

## 7. WorkBuddy 日志模板

更新后的日志格式（包含 Issue 引用）：

```markdown
## {任务简述}

### 关联 Issue

- #{number}: {issue title}

### 问题/需求

{描述}

### 修改内容

- {逐条列出}

### 验证

- lint: {结果}
- build: {结果}
- test: {结果}
```
