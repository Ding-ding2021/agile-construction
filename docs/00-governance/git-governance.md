---
id: DOC-GOVERNANCE-GIT-GOVERNANCE
number: GOV-007
domain: governance
category: git
title: Git 治理规范
owner: docs-maintainer
status: active
last_updated: 2026-05-13
source_of_truth: true
related_code: []
related_docs:
  - coding-standards.md
  - code-review-checklist.md
  - harness/07-hooks.md
---

# Git 治理规范

## Clause 1. 分支规范

### 1.1 [强制] 分支策略

**1.1.1 [强制]** 主开发分支为 `main`，所有功能分支从 `main` 创建。

**1.1.2 [强制]** 功能分支命名格式：`feat/<description>`。

**1.1.3 [强制]** 修复分支命名格式：`fix/<description>`。

**1.1.4 [强制]** 不允许直接向 `main` 提交代码，必须通过 PR。

**1.1.5 [强制]** 功能分支在合并后立即删除。

### 1.2 [强制] 提交粒度

**1.2.1 [强制]** 每次提交应聚焦一个逻辑单元变更。

**1.2.2 [推荐]** 鼓励频繁、细粒度的提交，而非一次性大提交。

---

## Clause 2. 提交规范

### 2.1 [强制] 提交信息格式

**2.1.1 [强制]** 提交信息采用结构化格式：`type(scope): description`。

**2.1.2 [强制]** 支持的 type：

| type       | 说明                   |
| ---------- | ---------------------- |
| `feat`     | 新功能                 |
| `fix`      | Bug 修复               |
| `chore`    | 构建/工具/依赖变更     |
| `refactor` | 重构                   |
| `test`     | 测试相关               |
| `docs`     | 文档变更               |
| `style`    | 代码格式（不影响功能） |

### 2.2 [强制] 提交信息规范

**2.2.1 [强制]** description 首字母小写，不超过 72 字符。

**2.2.2 [强制]** 使用祈使句（如 `fix: resolve login timeout issue`，而非 `fixed login...`）。

**2.2.3 [推荐]** 复杂变更在正文中说明原因。

### 2.3 [强制] 暂存区管理

**2.3.1 [强制]** 提交前检查暂存区内容，确保无调试代码、临时文件。

**2.3.2 [强制]** 禁止提交密钥、密码、环境变量文件。

---

## Clause 3. Review 协作规范

### 3.1 [强制] 创建 PR

**3.1.1 [强制]** PR 标题格式同提交信息：`type(scope): description`。

**3.1.2 [强制]** PR 正文必须包含变更摘要和测试说明。

### 3.2 [强制] Review 流程

**3.2.1 [强制]** 任何代码变更必须经过至少 1 人 Review。

**3.2.2 [强制]** Reviewer 关注逻辑正确性、测试覆盖、安全风险、代码风格。

### 3.3 [强制] PR 合并

**3.3.1 [强制]** 所有对话 resolved 后方可合并。

**3.3.2 [强制]** 合并方式：Squash Merge。

### 3.4 [强制] 保护规则

**3.4.1 [强制]** `main` 分支必须开启保护：

- 禁止直接推送
- PR 必须通过 CI
- 必须通过 Review
