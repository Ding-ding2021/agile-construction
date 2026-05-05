# 文档治理与体系清理计划

## TL;DR

> **Quick Summary**: 全项目文档体系健康度审计已完成 + 项目根目录旧工具残留清理。存在 2 份冲突的设计规范、~18 份已完成 Phase 的历史评估文档、4 个已淘汰开发工具的残留目录、2 个旧测试文件。按用户决策全面清理。
>
> **Deliverables**:
>
> - 1 份冲突设计规范归档（V1 → 99-archive）
> - ~18 份已完成 Phase 的历史评估文档归档
> - docs/README.md 索引同步更新（70+ active 文件）
> - document-governance.md 升级为执行规范
> - **删除 3 个旧工具目录**: .codebuddy/ (18M)、.qoder/ (2.1M)、.trae/ (空)
> - **2 个旧文件移动**: engineer-assistant-page.png + personnel-management.html → .archive/
>
> **Estimated Effort**: Short（半天内）
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Wave 0（工具清理）→ Wave 1（文档归档）→ Wave 2（索引）→ Wave 3（治理规范）

---

## Context

### Original Request

用户：shadcn 分支测试通过，已更新计划文档和共享记忆系统文档（CLAUDE.md），要求扫描全部文档、清理过期/无效文档、建立清晰文档体系、制定规范、统一管理。

### Interview Summary

**已扫描范围**: `docs/` 目录 102 个 .md 文件（90 个 active + 12 个 archived）

**用户决策**:

1. **设计规范冲突**：`design-specification.md`（V1 暗色玻璃态）→ 归档到 99-archive；`design-spec-v2-shadcn.md`（V2 Neutral Light）保留为唯一 SSOT
2. **历史评估文档**：Phase 1/1.5/3 的历史评估/Audit/Report → 归档到 99-archive/legacy/
3. **旧工具目录**：`.codebuddy/` → 全部删除；`.qoder/` + `.trae/` → 全部删除
4. **根目录旧文件**：`engineer-assistant-page.png` + `personnel-management.html` → 移动到 `.archive/`
5. **.claude/worktrees/ (2.8GB)**：先保留（用户暂不处理）
6. **playwright-cli/ (528K)**：同旧工具，一并删除
7. **knowledge-base**：保留不动，标记为通用参考层

**待归档文档清单**（共 ~18 份）：

| 类别         | 文件                                                            | 理由                |
| ------------ | --------------------------------------------------------------- | ------------------- |
| V1 设计规范  | `docs/00-governance/design-specification.md`                    | 被 V2 取代          |
| Phase 3      | `phase3/cloudbase-e2e-checklist.md`                             | 已完成 Phase        |
| Phase 3      | `phase3/collaboration-matrix.md`                                | 已完成 Phase        |
| Phase 3      | `phase3/document-governance-audit-2026-04-16.md`                | 已完成 Phase        |
| Phase 3      | `phase3/local-backend-feasibility.md`                           | 已完成 Phase        |
| Phase 3      | `phase3/weekly-governance-metrics.md`                           | 已完成 Phase        |
| Phase 1      | `phase1/development-progress-assessment-2026-04-25.md`          | 已完成 Phase        |
| Phase 1      | `phase1/p1-p1.5-fix-plan-2026-04-25.md`                         | 已完成 Phase        |
| Phase 4 评估 | `phase4/development-progress-assessment-2026-04-23.md`          | 历史评估            |
| Phase 4 评估 | `phase4/page-issues-audit-2026-04-25.md`                        | 历史评估            |
| Phase 4 评估 | `phase4/phase15-assessment-2026-04-25.md`                       | Phase 1.5 评估      |
| Phase 4 评估 | `phase4/phase3-retrospective-and-phase4-proposal-2026-04-16.md` | 历史回顾            |
| Phase 4 评估 | `phase4/roadmap-v1.2-impact-assessment.md`                      | 旧 Roadmap 影响评估 |
| Phase 4 评估 | `phase4/task-center-prd-evaluation-report.md`                   | 已完成的 PRD 评估   |
| Phase 4 评估 | `phase4/task-management-assessment-2026-04-23.md`               | 已完成的评估        |
| Phase 4 评估 | `phase4/task-missing-fields-report-2026-04-23.md`               | 已完成的报告        |
| Phase 4 评估 | `phase4/task-simplification-proposal-2026-04-23.md`             | 用户明确拒绝的方案  |

> 注：04-operations 顶层文档（商业化、组件系统提案、甘特图等）未包含在清理范围中，用户可后续决定。

### Metis Review

（自动跳过 — 范围清晰，用户已明确决策。）

---

## Work Objectives

### Core Objective

建立统一、干净、可治理的文档体系，消除冲突、归档历史、明确 SSOT。

### Concrete Deliverables

- 干净的 `docs/` 目录树（无冲突 SSOT、无已完成 Phase 评估残留）
- 更新后的 `docs/README.md`（精准索引 70+ active 文件）
- 升级后的 `docs/00-governance/document-governance.md`（可执行的治理规范）
- 修复后的 `CODEBUDDY.md`

### Definition of Done

- [ ] `docs/00-governance/design-specification.md` → `docs/99-archive/`（同时更新所有引用它的文档）
- [ ] ~18 份历史评估文档 → `docs/99-archive/legacy/`
- [ ] `docs/README.md` 索引反映真实文件状态
- [ ] `document-governance.md` 新增 Section: SSOT 冲突解决流程、归档触发条件、季度审计要求
- [ ] `npm run build` 零报错（确保没有代码级引用）

### Must Have

- V1 设计规范归档后，任何指向它的文档（AGENTS.md、CODEBUDDY.md、CLAUDE.md）同步更新引用
- 归档后的文件不可从 active 索引访问
- document-governance.md 升级为可执行规范（不只是描述性文档）

### Must NOT Have (Guardrails)

- 不删除任何文件（只移动，保留完整历史）
- 不修改 knowledge-base/ 内容
- 不修改 src/ 或 src-next/ 任何代码文件
- 不修改文档正文的业务内容（仅 frontmatter 状态和路径更新）

---

## Verification Strategy

### Test Decision

- **Automated tests**: None（纯文档操作）
- **QA Method**:
  1. `find docs/ -name '*.md' | wc -l` 验证总数合理
  2. `grep -r "design-specification.md" docs/ AGENTS.md CODEBUDDY.md CLAUDE.md` 验证旧引用已被更新
  3. `grep -r "04-operations/phase1\|04-operations/phase3" docs/README.md` 验证已归档文件不在索引中
  4. `npm run build` 验证构建不受影响

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0（旧工具清理 — 独立执行，3 任务并行）:
├── Task A: 删除 .codebuddy/ (18M) + .qoder/ (2.1M) + .trae/ (空) + .playwright-cli/ (528K)
├── Task B: engineer-assistant-page.png + personnel-management.html → .archive/
└── Task C: 检查并清理 package.json / opencode.json 中旧工具的残留引用

Wave 1（文档归档 — 3 任务并行）:
├── Task 1: V1 设计规范 → 99-archive（design-specification.md）
├── Task 2: Phase 1/1.5/3 评估文档 → 99-archive/legacy/
├── Task 3: Phase 4 历史评估文档 → 99-archive/legacy/
├── Task 4: 同步更新所有引用 V1 设计规范的文件（AGENTS.md、CODEBUDDY.md、CLAUDE.md）

Wave 2（索引修复 — 依赖 Wave 1 完成）:
├── Task 5: docs/README.md 重写索引（精确计数、删除已归档条目、标注 active/archived）
└── Task 6: design-checklist.md frontmatter 更新（删掉对 V1 规范的引用）

Wave 3（治理规范升级 — 可独立执行）:
└── Task 7: document-governance.md 重写为执行规范（新增 SSOT 冲突仲裁、归档触发条件、生命周期管理、季度审计流程）
```

---

## TODOs

### Wave 0：旧工具目录清理

- [ ] A. 删除已淘汰工具目录

  **What to do**:
  - 使用 `rm -rf` 删除以下目录（确认无误后执行）：
    - `.codebuddy/` — CodeBuddy 工具残留（18M，含 figma/ 设计稿 + plans/ + rules/）
    - `.qoder/` — Qoder 工具残留（2.1M，含 repowiki/ + 空 skills/）
    - `.trae/` — Trae IDE 残留（空目录，仅含 skills/ 子目录）
    - `.playwright-cli/` — 旧 E2E 测试配置（528K）

  **Must NOT do**:
  - 不删除 `.opencode/`、`.claude/`、`.husky/`、`.vscode/`、`.obsidian/`、`.gitnexus/`
  - 删除前先用 `ls -la` 确认目录内容，防止误删

  **Recommended Agent Profile**: `quick`
  **Skills**: `[]`

  **Parallelization**: Wave 0 | Parallel with B, C
  **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] `ls -d .codebuddy/ 2>/dev/null` → 空（已删除）
  - [ ] `ls -d .qoder/ 2>/dev/null` → 空（已删除）
  - [ ] `ls -d .trae/ 2>/dev/null` → 空（已删除）
  - [ ] `ls -d .playwright-cli/ 2>/dev/null` → 空（已删除）
  - [ ] `.claude/`、`.opencode/` 等保留目录存在

  **QA Scenarios**:

  ```
  Scenario: 验证旧工具目录已删除
    Tool: Bash
    Steps:
      1. ls -d .codebuddy/ .qoder/ .trae/ .playwright-cli/ 2>&1
      2. ls -d .claude/ .opencode/ .husky/ 2>&1
    Expected Result: 旧目录报错"不存在"，保留目录正常显示
  ```

  **Commit**: YES
  - Message: `chore: 删除已淘汰开发工具目录 — .codebuddy/ .qoder/ .trae/ .playwright-cli/`
  - Files: 删除的目录（git rm -r）

- [ ] B. 根目录旧测试文件归档

  **What to do**:
  - 移动 `engineer-assistant-page.png` (95KB) → `.archive/engineer-assistant-page.png`
  - 移动 `personnel-management.html` (62KB) → `.archive/personnel-management.html`
  - 确保 `.archive/` 目录存在

  **Must NOT do**:
  - 不删除文件（只移动）
  - 不移动其他根文件

  **Recommended Agent Profile**: `quick`

  **Parallelization**: Wave 0 | Parallel with A, C

  **Acceptance Criteria**:
  - [ ] `ls engineer-assistant-page.png 2>/dev/null` → 空（已移动）
  - [ ] `ls personnel-management.html 2>/dev/null` → 空（已移动）
  - [ ] `ls .archive/engineer-assistant-page.png` → 存在

  **Commit**: YES (group with A)

- [ ] C. 检查旧工具配置残留

  **What to do**:
  - 检查 `opencode.json` 中是否有对 .codebuddy/、.trae/、.qoder/ 的引用
  - 检查 `.gitignore` 中是否有旧工具的忽略规则（如果有，保留但确认无误）
  - 检查 `package.json` 中是否有旧工具相关的 scripts 依赖

  **Must NOT do**:
  - 不改动仍在使用的配置

  **Recommended Agent Profile**: `quick`

  **Parallelization**: Wave 0 | Parallel with A, B

  **References**:
  - `opencode.json` — 当前工具配置
  - `.gitignore` — 需要保留的忽略规则

  **Acceptance Criteria**:
  - [ ] 无旧工具残留引用
  - [ ] `.gitignore` 中旧工具规则标注为"已废弃"

  **Commit**: YES (group with A)

---

### Wave 1：文档归档

- [ ] 1. V1 设计规范归档

  **What to do**:
  - 移动：`docs/00-governance/design-specification.md` → `docs/99-archive/design-specification-v2.0-mui.md`
  - 文件首行添加 frontmatter: `status: archived`
  - 在归档文件顶部添加红色 banner: `⚠️ 此规范已被 design-spec-v2-shadcn.md（V2 Neutral Light）取代。请勿作为执行依据。`
  - 记录迁移日期和替代文档路径

  **Must NOT do**:
  - 不修改原文件的正文内容
  - 不删除原文件（通过 git mv 移动）

  **Recommended Agent Profile**: `quick`

  **Parallelization**: Wave 1 | Parallel with T2, T3
  **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] 文件成功移动到 99-archive/
  - [ ] frontmatter status = archived
  - [ ] 文件头有弃用说明

  **QA**:

  ```
  Scenario: 验证 V1 设计规范已归档
    Tool: Bash
    Steps:
      1. ls docs/00-governance/design-specification.md → 应报错（文件不存在）
      2. ls docs/99-archive/design-specification-* → 应找到文件
      3. head -10 docs/99-archive/design-specification-*.md | grep "archived" → 应找到
    Expected Result: V1 规范已从 active 移至 archive
  ```

  **Commit**: YES
  - Files: `docs/99-archive/design-specification-v2.0-mui.md`

- [ ] 2. Phase 3 评估文档归档

  **What to do**:
  - 移动 5 个文件：`docs/04-operations/phase3/*.md` → `docs/99-archive/legacy/phase3/`
  - 在 `docs/99-archive/legacy/` 下创建 `phase3/` 子目录
  - 每个文件添加 frontmatter: `status: archived`（如已有则更新）

  **文件清单**:
  - `cloudbase-e2e-checklist.md`
  - `collaboration-matrix.md`
  - `document-governance-audit-2026-04-16.md`
  - `local-backend-feasibility.md`
  - `weekly-governance-metrics.md`

  **Recommended Agent Profile**: `quick`

  **Parallelization**: Wave 1 | Parallel with T1, T3

  **Acceptance Criteria**:
  - [ ] Phase 3 目录从 `docs/04-operations/phase3/` 清空（或只保留 gitkeep）
  - [ ] 文件在 `docs/99-archive/legacy/phase3/` 存在

- [ ] 3. Phase 1/1.5 + Phase 4 历史评估文档归档

  **What to do**:
  - 移动 Phase 1 文件到 `docs/99-archive/legacy/phase1/`
  - 移动 Phase 4 评估文件到 `docs/99-archive/legacy/phase4-assessments/`
  - 每个文件添加 frontmatter: `status: archived`

  **Phase 1 文件清单**:
  - `development-progress-assessment-2026-04-25.md`
  - `p1-p1.5-fix-plan-2026-04-25.md`

  **Phase 4 评估文件清单**:
  - `development-progress-assessment-2026-04-23.md`
  - `page-issues-audit-2026-04-25.md`
  - `phase15-assessment-2026-04-25.md`
  - `phase3-retrospective-and-phase4-proposal-2026-04-16.md`
  - `roadmap-v1.2-impact-assessment.md`
  - `task-center-prd-evaluation-report.md`
  - `task-management-assessment-2026-04-23.md`
  - `task-missing-fields-report-2026-04-23.md`
  - `task-simplification-proposal-2026-04-23.md`

  **Recommended Agent Profile**: `quick`

  **Parallelization**: Wave 1 | Parallel with T1, T2

- [ ] 4. 全项目引用更新

  **What to do**:
  搜索所有指向 `docs/00-governance/design-specification.md` 的引用，更新为指向 `docs/01-product/design-spec-v2-shadcn.md`：

  **需更新的文件**:
  - `AGENTS.md`: §"查视觉基线" → 改为指向 `docs/01-product/design-spec-v2-shadcn.md`
  - `CODEBUDDY.md`: §9"设计规范参考" → 改为指向 design-spec-v2-shadcn.md
  - `CLAUDE.md`: §"Design conventions" → 增加备注说明旧版 V1 已归档
  - `docs/00-governance/coding-standards.md`: 头部"基于设计规范"引用 → 改为 design-spec-v2-shadcn.md
  - `docs/03-engineering/development-guide.md`: §5 检查清单引用 → 改为设计规范 V2
  - `docs/00-governance/component-implementation-spec.md`: parent_doc 引用 → 改为 design-spec-v2-shadcn.md
  - `docs/00-governance/design-checklist.md`: 引用 → 改为 design-spec-v2-shadcn.md

  **Must NOT do**:
  - 不改动 99-archive 中已归档文件的引用（它们引用的 V1 规范也在 archive 中，保持一致）

  **Recommended Agent Profile**: `quick`

  **Parallelization**: Wave 1 | 依赖 T1 完成
  **Blocked By**: Task 1

  **Acceptance Criteria**:
  - [ ] `grep -r "00-governance/design-specification" --include="*.md" docs/00-governance/ docs/01-product/ docs/02-architecture/ docs/03-engineering/ CODEBUDDY.md AGENTS.md CLAUDE.md 2>/dev/null` → 0 匹配（除非引用指向 archived 版本）

  **Commit**: YES (group T1-T4 together)
  - Message: `docs: 归档 V1 设计规范 + Phase 1/1.5/3 历史评估 + 更新全项目引用`
  - Files: 所有移动和修改的文件

- [ ] 5. docs/README.md 索引重写

  **What to do**:
  - 更新文件计数：从"覆盖 88 个 .md 文件"改为"覆盖约 70 个 active .md 文件"
  - 删除已归档文件的索引条目：
    - `00-governance` 中删除 `design-specification.md`
    - `04-operations` 中删除 Phase 1/3 全部条目
    - `04-operations` 中删除 Phase 4 中已归档的 9 个评估条目
  - 新增已归档文件的索引小节 `### 99-archive（历史归档）`：
    - 添加 `design-specification-v2.0-mui.md` — 旧版设计规范（已归档）
    - 添加 `legacy/phase1/` — Phase 1 历史评估
    - 添加 `legacy/phase3/` — Phase 3 历史评估
    - 添加 `legacy/phase4-assessments/` — Phase 4 历史评估
  - 保留的 04-operations 条目：
    - 顶层约 10 个文档不动
    - Phase 4 中保留与当前阶段相关的条目（如还有未完成的）

  **Recommended Agent Profile**: `quick`

  **Parallelization**: Wave 2
  **Blocked By**: T1-T4

  **References**:
  - `docs/README.md:1-161` — 当前完整索引

  **Acceptance Criteria**:
  - [ ] README 文件计数准确
  - [ ] 已归档文件不在 active 索引中
  - [ ] 归档索引指向正确的 99-archive 路径

- [ ] 6. design-checklist.md frontmatter 更新

  **What to do**:
  - changed related_docs from `docs/00-governance/design-specification.md` to `docs/01-product/design-spec-v2-shadcn.md`
  - Remove reference to V1 spec

  **Recommended Agent Profile**: `quick`

  **Parallelization**: Wave 2 | Parallel with T5

- [ ] 7. document-governance.md 升级为执行规范

  **What to do**:
  重写 `docs/00-governance/document-governance.md`，从描述性文档升级为可执行的治理规范。

  **新增内容**:

  ### SSOT 冲突解决流程
  - 当两份文档标记为 `source_of_truth: true` 且内容冲突时：
    1. 通过 Issue 提出冲突报告
    2. 明确哪份文档优先（通常为更新时间更新的）
    3. 将被取代的文档改为 `source_of_truth: false` 并标注 `replaced_by: docs/xx.md`
    4. 在 replaced_by 文档的 related_docs 中确认引用

  ### 文档生命周期管理

  ```
  draft → active → deprecated → archived
  ```

  - **draft**: 草稿，不可作执行依据
  - **active**: 当前执行版本（唯一 SSOT）
  - **deprecated**: 已废弃，保留在前台用于引用追溯
  - **archived**: 归档，仅在 99-archive 中保留历史

  ### 归档触发条件

  以下情况应触发文档归档：
  - Phase 全部完成 → 该 Phase 的评估/审计/报告 → 归档
  - 被新版本取代的规范 → 归档
  - 被用户明确拒绝的方案 → 归档
  - 任何超过 30 天未更新的 draft 文档 → 审查是否归档

  ### 季度审计要求
  - 每季度执行一次文档完整性审计
  - 检查：索引覆盖率 100%、无冲突 SSOT、related_docs 非空、last_updated 不超 90 天
  - 审计结果写入 `docs/04-operations/` 作为运营指标

  ### frontmatter 强制执行
  - id、title、owner、status、last_updated、source_of_truth、related_code、related_docs 为必填
  - 新增可选字段：`replaced_by`（被取代时指向新文档）、`supersedes`（取代旧文档时指向旧文档）

  **Must NOT do**:
  - 不删除旧文档治理内容（仅扩展和升级）
  - 不改动其他文档

  **Recommended Agent Profile**: `writing` — 需要良好的文档结构能力
  - **Skills**: `[]`

  **Parallelization**: Wave 3（独立）
  **Blocked By**: None（可与 Wave 2 并行）

  **References**:
  - `docs/00-governance/document-governance.md:1-62` — 当前完整内容
  - `docs/README.md` — 索引格式参考
  - 行内已有：分层目录、状态模型、frontmatter 要求 → 扩展而非重写

  **Acceptance Criteria**:
  - [ ] 新增 SSOT 冲突解决流程
  - [ ] 新增归档触发条件
  - [ ] 新增季度审计要求
  - [ ] 新增 frontmatter 可选字段（replaced_by / supersedes）
  - [ ] 原有内容完整保留

  **Commit**: YES (group T5-T7)
  - Message: `docs: 更新 README 索引 + design-checklist + document-governance 治理规范升级`
  - Files: `docs/README.md`, `docs/00-governance/design-checklist.md`, `docs/00-governance/document-governance.md`

---

## Success Criteria

### Verification Commands

```bash
# W0. 旧工具目录已删除
ls -d .codebuddy/ .qoder/ .trae/ .playwright-cli/ 2>&1  # 全部报错

# W0. 旧根文件已归档
ls engineer-assistant-page.png personnel-management.html 2>&1  # 报错

# W1. 验证 V1 规范不在 active
ls docs/00-governance/design-specification.md 2>&1  # 应报错

# W1. 验证 Phase 3 不在 active
ls docs/04-operations/phase3/ 2>&1  # 应为空

# W1. 验证全部引用更新
grep -r "00-governance/design-specification" --include="*.md" AGENTS.md CODEBUDDY.md CLAUDE.md docs/00-governance/ docs/01-product/ docs/02-architecture/ docs/03-engineering/ 2>/dev/null | grep -v "99-archive" | grep -v "archived"
# 应 0 匹配

# W2. 验证 README 索引
grep "files\b" docs/README.md  # 应显示 active 计数

# W3. 验证构建无损
npm run build  # 0 errors
```

### Final Checklist

- [ ] 旧工具目录全部删除（.codebuddy/ .qoder/ .trae/ .playwright-cli/）
- [ ] 根目录旧测试文件已归档
- [ ] 所有归档文件移到 99-archive/legacy/
- [ ] V1 设计规范引用全项目更新
- [ ] README 索引精确
- [ ] document-governance.md 新增 SSOT 冲突/生命周期/归档/审计规则
- [ ] npm run build 通过
- [ ] git status 干净，无意外修改
