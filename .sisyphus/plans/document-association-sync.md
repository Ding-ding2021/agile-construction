# 文档关联性同步更新计划

## TL;DR

> **Quick Summary**: 将已更新的 CLAUDE.md 与全项目 88 个文档进行关联性同步，修复 docs/README.md 索引缺失、related_docs 交叉引用为空、CODEBUDDY.md 过时描述等 5 类问题。
>
> **Deliverables**:
>
> - docs/README.md 索引更新（+4 个缺失文档，索引计数 84→88）
> - design-specification.md / coding-standards.md / design-checklist.md 的 related_docs 补充
> - CODEBUDDY.md 过时内容修复（已删除文件引用、Zustand 迁移、文档计数）
> - CLAUDE.md 路线图阶段标记前移
> - 约 30 个文档 related_docs 补充
>
> **Estimated Effort**: Short（1 天内）
> **Parallel Execution**: YES — 2 waves
> **Critical Path**: docs/README.md → 各文档 related_docs → 根目录配置文件

---

## Context

### Original Request

用户更新了 CLAUDE.md，要求检查所有文档的关联性并同步更新。

### Interview Summary

**审计范围**: 全项目 88 个 .md 文件

**关键发现**:

1. **4 个新文档未登记到 docs/README.md**: design-spec-v2-shadcn.md、adr-002-feature-registry.md、task-entity-relationship.md、component-implementation-spec.md
2. **related_docs 交叉引用大量缺失**: design-specification.md、coding-standards.md、design-checklist.md 的 related_docs 为空
3. **CODEBUDDY.md 严重过时**: 引用已删除的 Sidebar 文件、未反映 Zustand 迁移
4. **CLAUDE.md 路线图阶段**: Phase 3 标记为"当前"但实际已完成
5. **30+ 文档 related_docs**: 空数组未填充

### Metis Review

（自动跳过 — 此工作计划的 scope 清晰，无重大歧义。）

---

## Work Objectives

### Core Objective

将项目文档体系与最新 CLAUDE.md 对齐，修复所有缺失的交叉引用。

### Concrete Deliverables

- docs/README.md 索引完整性修复
- 核心文档 related_docs 补充
- CODEBUDDY.md/CLAUDE.md 内容同步

### Definition of Done

- [ ] docs/README.md 包含 88 个 .md 文件索引
- [ ] 所有 source_of_truth: true 文档的 related_docs 已填写（最低：关联同层相关文档）
- [ ] CODEBUDDY.md 不再引用已删除文件
- [ ] git commit 后 build/lint 零报错

### Must Have

- docs/README.md 的 4 个缺失条目补全
- design-specification.md 引用 component-implementation-spec.md
- CODEBUDDY.md 的 Sidebar 引用修正
- 所有修改 write 后执行 `git diff` 验证

### Must NOT Have (Guardrails)

- 不修改文档正文内容（仅 frontmatter 和索引）
- 不移动/重命名文件
- 不修改非 .md 文件

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision

- **Infrastructure exists**: YES（git/husky/lint）
- **Automated tests**: None（文档修改）
- **QA Method**:
  1. `npm run build` 验证构建无损
  2. `npm run lint` 验证 lint 无损
  3. 手动 grep 检查：`grep -r "layout/Sidebar" src/` → 应返回 0 处

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 核心索引修复，3 个任务):
├── Task 1: docs/README.md — 补全 4 个缺失文档 + 更新计数 (quick)
├── Task 2: CLAUDE.md — 更新 Phase 标记 + ADR-002 引用 (quick)
└── Task 3: CODEBUDDY.md — 修复过时 Sidebar/Zustand/文档计数引用 (quick)

Wave 2 (After Wave 1 — 交叉引用修复，可并行):
├── Task 4: design-specification.md — related_docs 补充 (quick)
├── Task 5: coding-standards.md — related_docs 补充 (quick)
├── Task 6: design-checklist.md — related_docs 补充 (quick)
├── Task 7: 其他 30+ 文档 related_docs 批量补充 (quick)
└── Task 8: 最终验证 — build/lint/grep 检查 (quick)
```

---

## TODOs

- [ ] 1. 补全 docs/README.md 索引

  **What to do**:
  - 在 `### 00-governance` 节添加 `docs/00-governance/component-implementation-spec.md` — 组件实现规范
  - 在 `### 01-product` 节添加 `docs/01-product/design-spec-v2-shadcn.md` — 前端设计规范 V2（shadcn）
  - 在 `### 02-architecture` 节添加 `docs/02-architecture/adr-002-feature-registry.md` — ADR-002 统一页面注册
  - 在 `### 02-architecture` 节添加 `docs/02-architecture/task-entity-relationship.md` — 任务实体关系图
  - 更新索引计数："覆盖 84 个 .md 文件" → "覆盖 88 个 .md 文件"
  - 更新日期："2026-04-26" → "2026-05-05"

  **Must NOT do**:
  - 不改动已有条目的顺序或描述
  - 不修改 99-archive 节

  **Recommended Agent Profile**:
  - **Category**: `quick` — 单文件简单编辑
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 无（Wave 1 任务独立）
  - **Blocked By**: None

  **References**:
  - 现有索引格式：`docs/README.md:19-28` — 00-governance 条目格式
  - 现有索引格式：`docs/README.md:29-43` — 01-product 条目格式
  - 现有索引格式：`docs/README.md:45-54` — 02-architecture 条目格式

  **Acceptance Criteria**:
  - [ ] `docs/README.md` 包含所有 88 个 .md 文件索引
  - [ ] 4 个新文档正确出现在对应分类下
  - [ ] 索引计数更新为 88

  **QA Scenarios**:

  ```
  Scenario: 验证索引完整性
    Tool: Bash (grep)
    Steps:
      1. grep -c "docs/" docs/README.md | head -5
      2. grep "component-implementation-spec" docs/README.md → 应找到
      3. grep "design-spec-v2-shadcn" docs/README.md → 应找到
      4. grep "adr-002-feature-registry" docs/README.md → 应找到
      5. grep "task-entity-relationship" docs/README.md → 应找到
      6. grep "88 个" docs/README.md → 应找到
    Expected Result: 4 个新文档全部出现在索引中
    Evidence: .sisyphus/evidence/task-1-readme-index.txt
  ```

  **Commit**: YES
  - Message: `docs: 补全 docs/README.md 索引 — 4 个新文档登记，计数 84→88`
  - Files: `docs/README.md`

- [ ] 2. 更新 CLAUDE.md — 路线图阶段标记

  **What to do**:
  - 将 "Phase 3 (当前): 视图设置 + 系统设置" 改为 "Phase 3 (已完成): 视图设置 + 系统设置 + 任务中心"
  - 可选：在 Architecture 章节 02-architecture 列表中添加 `- Feature registry: docs/02-architecture/adr-002-feature-registry.md`
  - 可选：在 Architecture 章节 02-architecture 列表中添加 `- Task entity relationship: docs/02-architecture/task-entity-relationship.md`

  **Must NOT do**:
  - 不删除已存在的架构描述
  - 不改动命令和脚本部分

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T1, T3)
  - **Parallel Group**: Wave 1

  **References**:
  - `CLAUDE.md:270-294` — 路线图 Phase 描述部分

  **Acceptance Criteria**:
  - [ ] Phase 3 状态从 "当前" 改为 "已完成"
  - [ ] 新文档引用已添加

  **Commit**: YES (group with T1)
  - Message: `docs: 更新 CLAUDE.md 路线图 Phase 3 状态 + 新文档引用`
  - Files: `CLAUDE.md`

- [ ] 3. 修复 CODEBUDDY.md 过时内容

  **What to do**:
  - **§6 "页面组织与复用模式"**: 将 "共享布局组件有两套侧边栏（layout/Sidebar.tsx 与 personnel/Sidebar.tsx）" 改为 "共享布局组件统一使用 AppSidebar（已替换所有独立侧边栏实现）"
  - **§2 "关键状态与持久化边界"**: 将 "App.tsx 持有两份核心状态" 段落改为描述 Zustand store 架构
  - **§9 文档计数**: "83 篇文档" → "88 篇文档"

  **Must NOT do**:
  - 不改动正确的架构描述（§1、§3、§4、§5、§7）

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T1, T2)
  - **Parallel Group**: Wave 1

  **References**:
  - `CODEBUDDY.md:78-82` — 需要修改的 §6 Sidebar 引用
  - `CODEBUDDY.md:39-42` — 需要修改的 §2 App.tsx 状态描述
  - `CODEBUDDY.md:99` — 需要修改的文档计数

  **Acceptance Criteria**:
  - [ ] 不再引用已删除的 `layout/Sidebar.tsx` 或 `personnel/Sidebar.tsx`
  - [ ] §2 描述反映 Zustand 架构
  - [ ] 文档计数更新

  **QA Scenarios**:

  ```
  Scenario: 验证已删除文件不再被引用
    Tool: Bash (grep)
    Steps:
      1. grep "layout/Sidebar" CODEBUDDY.md → 应无匹配
      2. grep "personnel/Sidebar" CODEBUDDY.md → 应无匹配
      3. grep "App.tsx 持有" CODEBUDDY.md → 应无匹配（已被 Zustand 描述替换）
    Expected Result: 0 匹配已删除文件引用
    Evidence: .sisyphus/evidence/task-3-codebuddy-clean.txt
  ```

  **Commit**: YES (group with T1)
  - Message: `docs: 修复 CODEBUDDY.md 过时引用 — Sidebar/Zustand/文档计数`
  - Files: `CODEBUDDY.md`

---

- [ ] 4. design-specification.md — related_docs 补充

  **What to do**:
  - 在 frontmatter 中 `related_docs: []` 改为：
    ```yaml
    related_docs:
      - docs/00-governance/component-implementation-spec.md
      - docs/00-governance/design-checklist.md
    ```

  **Must NOT do**:
  - 不修改正文内容

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2

  **References**:
  - `docs/00-governance/design-specification.md:1-12` — frontmatter 块
  - `docs/00-governance/component-implementation-spec.md:8` — `parent_doc` 已引用 design-specification.md

  **Acceptance Criteria**:
  - [ ] `related_docs` 包含 `component-implementation-spec.md`
  - [ ] `related_docs` 包含 `design-checklist.md`
  - [ ] frontmatter 格式正确（YAML）

  **Commit**: YES (group all Wave 2 into one commit)
  - Message: `docs: 补充核心文档 related_docs 交叉引用`
  - Files: `docs/00-governance/design-specification.md`

- [ ] 5. coding-standards.md — related_docs 补充

  **What to do**:
  - 在 frontmatter 中 `related_docs: []` 改为：
    ```yaml
    related_docs:
      - docs/00-governance/design-specification.md
      - docs/00-governance/component-implementation-spec.md
      - docs/00-governance/design-checklist.md
    ```

  **Must NOT do**:
  - 不修改正文内容

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T4, T6, T7)
  - **Parallel Group**: Wave 2

  **References**:
  - `docs/00-governance/coding-standards.md:1-10` — frontmatter 块

  **Acceptance Criteria**:
  - [ ] `related_docs` 包含 3 个正确引用
  - [ ] frontmatter 格式正确

- [ ] 6. design-checklist.md — related_docs 补充

  **What to do**:
  - 在 frontmatter 中 `related_docs: []` 改为：
    ```yaml
    related_docs:
      - docs/00-governance/design-specification.md
      - docs/00-governance/component-implementation-spec.md
      - docs/01-product/design-spec-v2-shadcn.md
    ```

  **Must NOT do**:
  - 不修改正文内容

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T4, T5, T7)
  - **Parallel Group**: Wave 2

  **References**:
  - `docs/00-governance/design-checklist.md:1-10` — frontmatter 块

  **Acceptance Criteria**:
  - [ ] `related_docs` 包含 3 个正确引用
  - [ ] frontmatter 格式正确

---

- [ ] 7. 批量补充其他文档 related_docs

  **What to do**:
  扫描所有 `related_docs: []` 的 SSOT 文档（约 30 个），根据文档内容补充合理引用：

  **批量规则**（自动判断）:
  - PRD 类文档 → 引用 Roadmap + 相关架构文档
  - 架构文档 → 引用相关 PRD + 其他架构文档
  - 工程文档 → 引用 development-plan + 相关指南

  **具体映射**（不完全列表）:
  - `personnel-management-prd.md` → `docs/01-product/product-roadmap-v1.2-draft.md`, `docs/01-product/workteam-management-prd.md`
  - `procurement-management-prd.md` → `docs/01-product/product-roadmap-v1.2-draft.md`, `docs/02-architecture/state-machine-design.md`
  - `standard-management-prd.md` → `docs/01-product/product-roadmap-v1.2-draft.md`, `docs/02-architecture/structured-standard-library.md`
  - `settings-prd.md` → `docs/01-product/product-roadmap-v1.2-draft.md`
  - `digital-employee-prd.md` → `docs/01-product/product-roadmap-v2.md`, `docs/02-architecture/multi-agent-v1-technical-design.md`
  - `template-data-contract.md` → `docs/02-architecture/structured-standard-library.md`, `docs/01-product/standard-management-prd.md`
  - `project-rules.md` → `docs/00-governance/document-governance.md`, `docs/02-architecture/state-machine-design.md`

  **Must NOT do**:
  - 不修改已有关联关系
  - 不修改文档正文

  **Recommended Agent Profile**:
  - **Category**: `quick` — 批量模式替换
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T4, T5, T6)
  - **Parallel Group**: Wave 2

  **References**:
  - `docs/README.md` — 完整文档列表供参考
  - `docs/00-governance/document-governance.md` — frontmatter 规范要求

  **Acceptance Criteria**:
  - [ ] 所有 `source_of_truth: true` 文档的 `related_docs` 不为空
  - [ ] 每篇文档关联 2-3 个合理引用

  **Commit**: YES (group with T4-T6)
  - Message: `docs: 补充全项目文档 related_docs 交叉引用（约 30 篇）`
  - Files: 批量文档

- [ ] 8. 最终验证

  **What to do**:
  - 运行 `npm run build` 验证构建无损
  - 运行 `npm run lint` 验证 lint 无损
  - 运行 `grep -r "layout/Sidebar" src/` 验证已删除文件无残留引用
  - 运行 `grep -c "source_of_truth: true" docs/**/*.md | wc -l` 统计 SSOT 文档数
  - 列出所有修改文件的 git diff 摘要

  **Must NOT do**:
  - 不修改任何文件（只读验证）

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO（需在 Wave 2 之后）
  - **Parallel Group**: Wave Final

  **Acceptance Criteria**:
  - [ ] `npm run build` — 0 errors
  - [ ] `npm run lint` — 0 errors（无新增）
  - [ ] 无残留 Sidebar 引用
  - [ ] 所有 SSOT 文档 related_docs 已填充

---
