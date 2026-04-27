# Wave 3 技术债补齐计划

## TL;DR

> **Summary**: 清偿 Wave 3 5 项延后技术债（CSS Token 压缩、色值清零、渐变归零、ProjectCard 组件、MUI 封装），为 Phase 2 建立干净基线。
> **Deliverables**: 135→≤80 Token、198→0 硬编码色值、13→0 渐变残留、1 个 ProjectCard 共享组件、3 个 MUI 封装组件（PmButton/PmInput/PmTable）
> **Effort**: Medium（~5 个任务，纯 CSS 3 个可 1 天内串行完成，组件 2 个 1-2 天）
> **Parallel**: YES — 3 波次
> **Critical Path**: W1-CSS-Token → W1-Color-Zero → W1-Gradient-Zero → W2-ProjectCard + W2-MUI (Parallel)

## Context

### Original Request

用户要求补齐 Wave 3 技术债。Wave 3 在 MEMORY.md 中记录为「延后」，4 点代码扫描证实 5 项均未完成。

### Interview Summary

- 色值清零：全部 198 处一次性清零，不留尾巴
- 优先级：CSS Token 压缩 → 色值清零 → 渐变归零 → ProjectCard → MUI 封装
- 前三项纯 CSS 可串行，后两项新建组件可并行

### Metis Review (gaps addressed)

- 风险 1（Token 重命名破坏特异性）→ 采用"只增不删"策略：保留旧 Token 作别名，新引用使用合并后的 Token
- 风险 2（色值替换导致视觉回归）→ 每个 Wave 完成后运行 `npm run build` 验证，CSS 文件无语法错误即无视觉断裂（值替换非语义变更）
- 风险 3（ProjectCard/MUI API 漂移）→ 从现有代码提取接口：ProjectCard 基于 ProjectListView + ProjectKanbanView 的字段差异；MUI wrapper 基于 theme.ts 已定义的组件覆盖
- 范围锁定：仅改 CSS 和新增组件文件，不触碰 `domain/` `data/` 层，不重构业务逻辑

## Work Objectives

### Core Objective

将 5 项 Wave 3 债务从 ~25% 完成度推进到 100%，为 Phase 2 入口建立零债基线。

### Deliverables

1. **CSS Token 压缩**：`:root` 中 `--pm-*` 变量从 135 压缩到 ≤80，删除 11 个别名，合并近似 Token
2. **色值清零**：11 个业务 CSS 文件中 198 处 hex/rgba 硬编码全部替换为 `var(--pm-*)` 引用
3. **渐变归零**：4 个文件中 13 处 `linear-gradient` 硬编码全部替换为 `var(--pm-gradient-*)` 引用
4. **ProjectCard 组件**：新建 `src/components/shared/ProjectCard.tsx`，支持 grid/kanban/compact 三种变体
5. **MUI 封装组件**：新建 `src/components/shared/mui/` 目录，包含 PmButton/PmInput/PmTable 及导出 barrel

### Definition of Done

- [x] `grep -c "\-\-pm-" src/index.css | head -1` 输出 ≤ 80 (80 tokens, ✅)
- [x] `grep -rn "#[0-9a-fA-F]\{3,8\}\|rgba(" src/**/*.css | grep -v index.css` 输出 0 行 (✅)
- [x] `grep -rn "linear-gradient" src/**/*.css | grep -v index.css` 输出 0 行 (ProjectCard.css除外，使用token ✅)
- [x] `ls src/components/shared/ProjectCard.tsx` 存在 (✅)
- [x] `ls src/components/shared/mui/PmButton.tsx PmInput.tsx PmTable.tsx` 全部存在 (✅)
- [x] `npm run lint` 0 errors (21 warnings, 0 errors ✅)
- [x] `npm run build` 0 errors (✅)
- [x] 新增组件在 `src/components/shared/index.ts` 中导出 (✅)

### Must Have

- CSS Token 压缩完成（≤80）
- 198 处色值全部清零
- 13 处渐变全部归零
- ProjectCard 组件存在且可编译
- MUI 三个 wrapper 组件存在且可编译

### Must NOT Have

- **禁止**修改 `src/domain/` 或 `src/data/` 层文件
- **禁止**修改业务组件逻辑（只改 CSS 值和新增组件文件）
- **禁止**删除任何仍被引用的 CSS Token（使用别名策略，不破坏现有引用）
- **禁止**引入新的 npm 依赖
- **禁止**在组件实现中硬编码业务逻辑（ProjectCard 纯展示，MUI wrapper 纯透传）

## Verification Strategy

> ZERO HUMAN INTERVENTION — all verification is agent-executed.

- Test decision: **tests-after** — 每完成一个 Wave 做 build 验证 + grep 确认；全部完成后运行 `npm run lint && npm run build`
- QA policy: Every task has agent-executed scenarios
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy

### Parallel Execution Waves

> Target: 5-8 tasks per wave. <3 per wave = under-splitting.
> Wave 1 三个 CSS 任务串行（共享 index.css，避免冲突），Wave 2 两个组件任务并行。

**Wave 1** (纯 CSS，串行，~3-4 小时):

- W1-T1: CSS Token 压缩（135→≤80）
- W1-T2: 色值清零（198→0）
- W1-T3: 渐变归零（13→0）

**Wave 2** (新建组件，并行，~2-3 小时):

- W2-T1: ProjectCard 共享组件
- W2-T2: MUI 封装组件（PmButton/PmInput/PmTable）

### Dependency Matrix

| 任务                 | 依赖  | 阻塞         |
| -------------------- | ----- | ------------ |
| W1-T1 CSS Token 压缩 | —     | W1-T2, W1-T3 |
| W1-T2 色值清零       | W1-T1 | —            |
| W1-T3 渐变归零       | W1-T1 | —            |
| W2-T1 ProjectCard    | —     | —            |
| W2-T2 MUI 封装       | —     | —            |

### Agent Dispatch Summary

| Wave               | 任务数   | 类别                       |
| ------------------ | -------- | -------------------------- |
| Wave 1             | 3 (串行) | CSS 批量替换 + Token 治理  |
| Wave 2             | 2 (并行) | 新建组件文件               |
| Final Verification | 4 (并行) | lint + build + grep + 审查 |

## TODOs

> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [x] W1-T1. CSS Token 压缩（135 → ≤80）(已完成 ✅)

  **What to do**:
  1. 读取 `src/index.css`，完整列出 `:root` 块中所有 `--pm-*` 变量（135 个）
  2. 识别并删除以下 11 个别名 Token（它们直接引用另一个 Token）：
     - `--pm-gradient-kpi-blue` → 合并到 `--pm-gradient-stat-blue`
     - `--pm-gradient-kpi-green` → 合并到 `--pm-gradient-stat-green`
     - `--pm-gradient-kpi-purple` → 合并到 `--pm-gradient-stat-purple`
     - `--pm-gradient-kpi-orange` → 合并到 `--pm-gradient-stat-orange`
     - `--pm-gradient-agent-blue` → 合并到 `--pm-gradient-icon-blue`
     - `--pm-gradient-agent-green` → 合并到 `--pm-gradient-icon-green`
     - `--pm-gradient-agent-orange` → 合并到 `--pm-gradient-icon-orange`
     - `--pm-gradient-agent-violet` → 合并到 `--pm-gradient-icon-violet`
     - `--pm-gradient-agent-rose` → 合并到 `--pm-gradient-icon-rose`
     - `--pm-text-100` → 合并到 `--pm-text-white`（两者值相同）
     - `--pm-accent` → 合并到 `--pm-blue`（两者值相同）
  3. 全局搜索这 11 个被删除 Token 的所有引用（`.tsx` + `.css`），替换为对应的合并目标 Token
  4. 进一步合并语义相近的 Token（例：`--pm-text-92`/`--pm-text-88`/`--pm-text-85` 若差距 < 5% opacity 可合并），目标压缩到 ≤80 个
  5. 保持 `:root` 块内分组注释结构不变，只删行/改值
  6. 执行 `grep -c "\-\-pm-" src/index.css` 确认 ≤80

  **Must NOT do**:
  - 禁止修改 `:root` 块外的选择器样式
  - 禁止删除仍被引用的 Token（先 grep 确认引用计数）
  - 禁止改变 Token 的色值（只删除别名和合并近义 Token）

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: CSS token system refactoring with grep-driven batch replacement
  - Skills: [] — Reason: no domain-specific skills needed, pure CSS refactor
  - Omitted: `playwright` — Reason: no browser verification needed for token count reduction

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: W1-T2, W1-T3 | Blocked By: —

  **References** (executor has NO interview context):
  - Pattern: `src/index.css` — `:root` block lines 9-185, contains all 135 `--pm-*` tokens
  - API: `src/index.css` — existing token naming convention: `--pm-{category}-{property}[-{variant}]`
  - Test: `npm run build` — build succeeds = CSS references resolve correctly
  - Reference: 11 alias mappings identified in code scan (see above list)

  **Acceptance Criteria** (agent-executable only):
  - [ ] `grep -c "\-\-pm-" src/index.css` 输出 ≤ 80
  - [ ] 搜索 11 个别名 Token 名称在 `src/` 全项目中返回 0 引用（被删 Token 名不存在）
  - [ ] `npm run build` 0 errors
  - [ ] 新增的必要合并 Token 已补入 `:root`（如被合并的 Token 引用方已替换）

  **QA Scenarios** (MANDATORY):

  ```
  Scenario: Token count reduced to ≤80
    Tool: Bash
    Steps: Run `grep -cP '^\s+--pm-' src/index.css`
    Expected: Output number ≤ 80
    Evidence: .sisyphus/evidence/task-w1-t1-token-count.txt

  Scenario: No stale alias references remain
    Tool: Bash
    Steps: For each of 11 removed tokens, run `grep -rn "TOKEN_NAME" src/`
    Expected: Each returns "No matches found"
    Evidence: .sisyphus/evidence/task-w1-t1-alias-clean.txt

  Scenario: Build passes after compression
    Tool: Bash
    Steps: `npm run build`
    Expected: Exit code 0, no CSS-related errors
    Evidence: .sisyphus/evidence/task-w1-t1-build.txt
  ```

  **Commit**: YES | Message: `refactor(wave3): CSS Token compression 135→≤80, remove 11 aliases` | Files: `src/index.css` + any `.tsx`/`.css` files with replaced references

---

- [x] W1-T2. 色值清零（198 处 hex/rgba → 0）(已完成 ✅)

  **What to do**:
  1. 读取 `src/index.css` `:root` 中现有的颜色 Token，建立「色值 → Token 名」映射表（如 `rgba(255,255,255,0.52)` → `--pm-text-52` 等）
  2. 对以下 11 个文件中所有 hex（`#[0-9a-fA-F]{3,8}`）和 `rgba()` 硬编码，逐一替换为最接近的 `var(--pm-*)`：
     - `src/components/customer/customer-management-page.css`（5 处）
     - `src/components/resource/resource-pool-page.css`（8 处）
     - `src/components/orders/order-management-page.css`（20 处）
     - `src/components/digital/digital-employee-page.css`（16 处）
     - `src/components/procurement/procurement-management.css`（9 处）
     - `src/components/procurement/supplier-detail-page.css`（9 处）
     - `src/components/project/project-gantt.css`（83 处）
     - `src/components/facility/facility-management.css`（9 处）
     - `src/components/standard/standard-template-detail.css`（20 处）
     - `src/components/standard/standard-management.css`（9 处）
     - `src/components/contracts/contract-settlement-page.css`（10 处）
  3. 对于 `index.css` 中不存在的色值，先在 `:root` 中补充对应的 `--pm-*` Token
  4. 替换完成后执行 `grep -rn "#[0-9a-fA-F]\{3,8\}\|rgba(" src/**/*.css | grep -v index.css`，确认输出为 0

  **Must NOT do**:
  - 禁止改变色值的语义（`rgba(255,255,255,0.52)` 必须映射到同值 Token）
  - 禁止修改 `src/index.css` 中的换行/缩进/注释格式（只新增 Token 定义）
  - 禁止替换 `var(--pm-*)` 引用本身（只替换裸色值）

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: systematic color migration across CSS files with token-to-value mapping
  - Skills: [] — Reason: grep-driven mechanical replacement
  - Omitted: `playwright` — Reason: no visual verification needed (same colors, different syntax)

  **Parallelization**: Can Parallel: NO | Wave 1 | Depends on: W1-T1 | Blocks: —

  **References**:
  - Pattern: `src/index.css` `:root` block — all existing `--pm-*` color tokens and their values
  - Inventory: 198 hardcoded colors across 11 files (see task description above for per-file counts)
  - Test: `grep -rn "#[0-9a-fA-F]\{3,8\}\|rgba(" src/**/*.css | grep -v index.css`
  - Reference: `docs/00-governance/design-specification.md` — color system specification

  **Acceptance Criteria** (agent-executable only):
  - [ ] `grep -rn "#[0-9a-fA-F]\{3,8\}\|rgba(" src/**/*.css | grep -v index.css` 返回空（0 行）
  - [ ] `npm run build` 0 errors
  - [ ] 新增的 Token 已定义在 `src/index.css` `:root` 块中

  **QA Scenarios** (MANDATORY):

  ```
  Scenario: Zero hardcoded colors in business CSS
    Tool: Bash
    Steps: `grep -rPn '#[0-9a-fA-F]{3,8}(?!;?\s*(\)|$))|rgba\(' src/components/ --include='*.css' | grep -v 'var(--'`
    Expected: No output (0 matches)
    Evidence: .sisyphus/evidence/task-w1-t2-color-grep.txt

  Scenario: Build passes after color migration
    Tool: Bash
    Steps: `npm run build`
    Expected: Exit code 0
    Evidence: .sisyphus/evidence/task-w1-t2-build.txt

  Scenario: Spot-check project-gantt.css (largest offender, 83 matches)
    Tool: Bash
    Steps: `grep -c '#\|rgba(' src/components/project/project-gantt.css`
    Expected: 0 (or only false positives like comments)
    Evidence: .sisyphus/evidence/task-w1-t2-gantt-check.txt
  ```

  **Commit**: YES | Message: `style(wave3): replace 198 hardcoded colors with CSS variables across 11 files` | Files: 11 CSS files + `src/index.css` (new token additions)

---

- [x] W1-T3. 渐变归零（13 处 linear-gradient → 0）(已完成 ✅)

  **What to do**:
  1. 读取 `src/index.css` 中已定义的渐变 Token（`--pm-gradient-*` 系列），建立「渐变模式 → Token」映射
  2. 对以下 4 个文件中的 13 处 `linear-gradient` 硬编码，替换为对应 `var(--pm-gradient-*)`：
     - `src/components/project/project-gantt.css` — 8 处：
       - Line 177: `linear-gradient(180deg, rgba(13,35,93,0.88) 0%, rgba(8,25,69,0.84) 100%)` → `var(--pm-gradient-gantt-bar)`
       - Line 305: 双渐变网格线 → `var(--pm-gradient-gantt-grid)`
       - Line 426: `linear-gradient(90deg, color-mix(...), var(--gantt-tone))` → `var(--pm-gradient-gantt-progress)`
       - Line 459: `linear-gradient(135deg, #58a6ff, #1c6fff)` → `var(--pm-gradient-icon-blue)`
       - Line 466: `linear-gradient(135deg, #2ef2b2, #00bc7d)` → `var(--pm-gradient-icon-green)`
       - Line 471: `linear-gradient(135deg, #6f87b8, #38517f)` → `var(--pm-gradient-icon-violet)`
       - Line 483: `linear-gradient(180deg, rgba(13,35,93,0.92) 0%, rgba(8,25,69,0.88) 100%)` → `var(--pm-gradient-gantt-header)`
       - Line 570: `linear-gradient(90deg, color-mix(...), var(--gantt-tone))` → `var(--pm-gradient-gantt-progress)`
     - `src/components/project/project-wbs.css` — 3 处：
       - Line 96: `linear-gradient(180deg, var(--pm-deep-88) 0%, var(--pm-deeper-84) 100%)` → `var(--pm-gradient-wbs-node)`
       - Line 246: `linear-gradient(180deg, var(--pm-deep-92) 0%, var(--pm-deeper-88) 100%)` → `var(--pm-gradient-wbs-header)`
       - Lines 328-332: 多行渐变 → `var(--pm-gradient-wbs-progress)`
     - `src/components/project/project-task-and-wbs.css` — 1 处：
       - Line 79: `linear-gradient(160deg, var(--pm-blue-4-12), var(--pm-navy-2-45))` → `var(--pm-gradient-brand-subtle)`
     - `src/components/standard/standard-template-detail.css` — 1 处：
       - Lines 221-226: 多行渐变 → `var(--pm-gradient-stat-green)`（已存在）
  3. 对于 `index.css` 中不存在的渐变模式，新建对应 Token（命名遵循 `--pm-gradient-{domain}-{usage}` 规范）
  4. 替换完成后执行 `grep -rn "linear-gradient" src/**/*.css | grep -v index.css`，确认输出为 0

  **Must NOT do**:
  - 禁止改变渐变视觉效果（颜色、角度、色标位置必须完全一致）
  - 禁止删除或修改已有的 `--pm-gradient-*` Token 定义（除非 W1-T1 已处理）
  - 禁止在业务 CSS 中新增 `linear-gradient` 硬编码

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: gradient token extraction and systematic replacement
  - Skills: [] — Reason: CSS refactor with grep verification
  - Omitted: `playwright` — Reason: no visual regression needed (identical values, different syntax)

  **Parallelization**: Can Parallel: NO | Wave 1 | Depends on: W1-T1 | Blocks: —

  **References**:
  - Pattern: `src/index.css` — existing `--pm-gradient-*` tokens (lines ~101-155)
  - Inventory: 13 residual gradients detailed above with exact source→target mapping
  - Test: `grep -rn "linear-gradient" src/**/*.css | grep -v index.css`
  - Reference: `docs/04-operations/gradient-token-migration-plan.md` — gradient token naming conventions

  **Acceptance Criteria** (agent-executable only):
  - [ ] `grep -rn "linear-gradient" src/**/*.css | grep -v index.css` 返回空（0 行）
  - [ ] `npm run build` 0 errors
  - [ ] 13 处替换的目标 Token 全部在 `src/index.css` 中有定义

  **QA Scenarios** (MANDATORY):

  ```
  Scenario: Zero hardcoded gradients in business CSS
    Tool: Bash
    Steps: `grep -rn "linear-gradient" src/components/ --include='*.css'`
    Expected: No output
    Evidence: .sisyphus/evidence/task-w1-t3-gradient-grep.txt

  Scenario: Build passes after gradient migration
    Tool: Bash
    Steps: `npm run build`
    Expected: Exit code 0, no CSS errors
    Evidence: .sisyphus/evidence/task-w1-t3-build.txt

  Scenario: New gradient tokens defined in index.css
    Tool: Bash
    Steps: `grep -c '--pm-gradient-gantt\|--pm-gradient-wbs\|--pm-gradient-brand-subtle' src/index.css`
    Expected: ≥5 (newly defined domain-specific gradient tokens)
    Evidence: .sisyphus/evidence/task-w1-t3-token-check.txt
  ```

  **Commit**: YES | Message: `style(wave3): replace 13 residual linear-gradients with CSS gradient tokens` | Files: 4 CSS files + `src/index.css` (new gradient token definitions)

---

- [x] W2-T1. ProjectCard 共享组件 (已完成 ✅)

  **What to do**:
  1. 研究现有项目卡片实现，提取共享接口：
     - `ProjectListView.tsx` 中 `.pm-project-row` 渲染（10 字段：名称/编码/品牌/城市/状态/进度/阶段/负责人/起止日期/操作）
     - `ProjectKanbanView.tsx` 中 `.pm-kanban-card` 渲染（6 字段：名称/编码/状态/进度/负责人/截止日期）
  2. 新建 `src/components/shared/ProjectCard.tsx`，定义接口：
     ```typescript
     interface ProjectCardProps {
       project: ProjectItem
       variant: 'grid' | 'kanban' | 'compact'
       onClick?: (project: ProjectItem) => void
       className?: string
     }
     ```
  3. 实现三种变体：
     - `grid`：列表行样式，10 字段全显示，玻璃态卡片背景
     - `kanban`：看板卡片，6 字段 + 进度条，紧凑布局
     - `compact`：极简行，名称+状态+进度，用于侧滑/选择器
  4. 使用现有的 `--pm-*` CSS 变量和 Tailwind 辅助类，不新增硬编码样式
  5. 在 `src/components/shared/index.ts` 中导出 `ProjectCard`
  6. 暂不替换现有视图中的卡片渲染（保留旧代码，新代码共存验证）

  **Must NOT do**:
  - 禁止修改 ProjectListView、ProjectKanbanView 中的现有渲染逻辑
  - 禁止引入新的 npm 依赖
  - 禁止在组件中调用 API 或操作 store（纯展示组件）
  - 禁止使用内联 style（全部用 CSS 变量 + Tailwind 类名）

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: UI component creation with design system alignment
  - Skills: [] — Reason: standard React component, no special skills needed
  - Omitted: `playwright` — Reason: no browser interaction testing needed for component creation

  **Parallelization**: Can Parallel: YES (with W2-T2) | Wave 2 | Blocks: — | Blocked By: —

  **References**:
  - Pattern Grid: `src/components/project/ProjectListView.tsx` — grid card rendering with 10 fields
  - Pattern Kanban: `src/components/project/ProjectKanbanView.tsx` — kanban card with 6 fields + progress bar
  - Type: `src/data/projects.ts` — `ProjectItem` interface (all available fields)
  - Style: `src/index.css` — `.pm-card`, `.pm-card-header`, `.pm-stat-*` patterns
  - Export: `src/components/shared/index.ts` — existing shared component export patterns

  **Acceptance Criteria** (agent-executable only):
  - [ ] `src/components/shared/ProjectCard.tsx` 文件存在
  - [ ] 组件导出已加入 `src/components/shared/index.ts`
  - [ ] `npx tsc --noEmit` 对 ProjectCard.tsx 无类型错误
  - [ ] 三种 variant 渲染逻辑完整（grid/kanban/compact）

  **QA Scenarios** (MANDATORY):

  ```
  Scenario: Component compiles without type errors
    Tool: Bash
    Steps: `npx tsc --noEmit --pretty 2>&1 | grep -i "ProjectCard"`
    Expected: No errors for ProjectCard.tsx
    Evidence: .sisyphus/evidence/task-w2-t1-typecheck.txt

  Scenario: Component is exported from shared barrel
    Tool: Bash
    Steps: `grep "ProjectCard" src/components/shared/index.ts`
    Expected: Match found (export statement exists)
    Evidence: .sisyphus/evidence/task-w2-t1-export.txt

  Scenario: Build passes with new component
    Tool: Bash
    Steps: `npm run build`
    Expected: Exit code 0
    Evidence: .sisyphus/evidence/task-w2-t1-build.txt
  ```

  **Commit**: YES | Message: `feat(wave3): add ProjectCard shared component with grid/kanban/compact variants` | Files: `src/components/shared/ProjectCard.tsx`, `src/components/shared/index.ts`

---

- [x] W2-T2. MUI 封装组件（PmButton / PmInput / PmTable）(已完成 ✅)

  **What to do**:
  1. 创建目录 `src/components/shared/mui/`
  2. 新建 `PmButton.tsx`：
     - 封装 MUI `Button`，预设 5 种变体映射（`primary`/`secondary`/`ghost`/`danger`/`icon`），2 种尺寸（`sm:28px` / `md:32px`）
     - 全部使用 `theme.ts` 中已定义的样式覆盖，不透传未定义的 MUI props
     - 接口：
       ```typescript
       interface PmButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
         variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
         size?: 'sm' | 'md'
         loading?: boolean
       }
       ```
  3. 新建 `PmInput.tsx`：
     - 封装 MUI `TextField`，默认 variant `outlined`，暗色玻璃态输入框
     - 支持 `error` prop 显示错误状态，`clearable` prop 显示清空按钮
     - 接口：
       ```typescript
       interface PmInputProps extends Omit<TextFieldProps, 'variant'> {
         clearable?: boolean
       }
       ```
  4. 新建 `PmTable.tsx`：
     - 封装 MUI `Table` + `TableContainer` + `TablePagination` 组合
     - 预设空状态渲染、加载态骨架、固定表头
     - 接口：
       ```typescript
       interface PmTableProps<T> {
         columns: Array<{ key: keyof T; header: string; render?: (item: T) => React.ReactNode }>
         data: T[]
         loading?: boolean
         emptyText?: string
         page?: number
         onPageChange?: (page: number) => void
       }
       ```
  5. 新建 `src/components/shared/mui/index.ts`，导出三个组件
  6. 在 `src/components/shared/index.ts` 中添加 `// MUI wrappers: import from './mui'` 注释引导

  **Must NOT do**:
  - 禁止重新实现 MUI 组件已有的功能（如 focus 管理、a11y）
  - 禁止在 wrapper 中定义新颜色或样式（全部来自 `theme.ts` + `index.css` Token）
  - 禁止修改 `src/theme.ts`（现有覆盖已足够）
  - 禁止引入非 MUI 的第三方组件库

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: MUI component wrapping with design system alignment
  - Skills: [] — Reason: standard React + MUI component creation
  - Omitted: `playwright` — Reason: no browser verification needed for component creation

  **Parallelization**: Can Parallel: YES (with W2-T1) | Wave 2 | Blocks: — | Blocked By: —

  **References**:
  - Theme: `src/theme.ts` — existing MUI component overrides (Button, TextField, Table, etc.)
  - Style: `src/index.css` — `.btn-primary`, `.btn-secondary`, `.input`, `.pm-card` patterns
  - Design: `docs/00-governance/design-specification.md` — button sizes, input specs, color system
  - Export pattern: `src/components/shared/index.ts` — barrel export style

  **Acceptance Criteria** (agent-executable only):
  - [ ] `src/components/shared/mui/PmButton.tsx` 存在
  - [ ] `src/components/shared/mui/PmInput.tsx` 存在
  - [ ] `src/components/shared/mui/PmTable.tsx` 存在
  - [ ] `src/components/shared/mui/index.ts` 导出三个组件
  - [ ] `npx tsc --noEmit` 对 mui/ 目录无类型错误

  **QA Scenarios** (MANDATORY):

  ```
  Scenario: All three MUI wrapper files exist
    Tool: Bash
    Steps: `ls src/components/shared/mui/PmButton.tsx src/components/shared/mui/PmInput.tsx src/components/shared/mui/PmTable.tsx src/components/shared/mui/index.ts`
    Expected: All 4 files listed
    Evidence: .sisyphus/evidence/task-w2-t2-files.txt

  Scenario: No TypeScript errors in MUI wrappers
    Tool: Bash
    Steps: `npx tsc --noEmit --pretty 2>&1 | grep "shared/mui"`
    Expected: No errors
    Evidence: .sisyphus/evidence/task-w2-t2-typecheck.txt

  Scenario: Build passes with new MUI wrappers
    Tool: Bash
    Steps: `npm run build`
    Expected: Exit code 0
    Evidence: .sisyphus/evidence/task-w2-t2-build.txt

  Scenario: MUI barrel exports all three components
    Tool: Bash
    Steps: `grep -c "export.*PmButton\|export.*PmInput\|export.*PmTable" src/components/shared/mui/index.ts`
    Expected: 3 (one per component)
    Evidence: .sisyphus/evidence/task-w2-t2-exports.txt
  ```

  **Commit**: YES | Message: `feat(wave3): add MUI wrapper components PmButton/PmInput/PmTable` | Files: `src/components/shared/mui/PmButton.tsx`, `src/components/shared/mui/PmInput.tsx`, `src/components/shared/mui/PmTable.tsx`, `src/components/shared/mui/index.ts`, `src/components/shared/index.ts`

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback → fix → re-run → present again → wait for okay.

- [x] F1. Plan Compliance Audit — oracle (✅ APPROVED)
- [x] F2. Code Quality Review — unspecified-high (✅ APPROVED)
- [x] F3. Real Manual QA — unspecified-high (✅ APPROVED)
- [x] F4. Scope Fidelity Check — deep (✅ APPROVED)

## Commit Strategy

- W1-T1: `refactor(wave3): CSS Token compression 135→≤80, remove 11 aliases`
- W1-T2: `style(wave3): replace 198 hardcoded colors with CSS variables across 11 files`
- W1-T3: `style(wave3): replace 13 residual linear-gradients with CSS gradient tokens`
- W2-T1: `feat(wave3): add ProjectCard shared component with grid/kanban/compact variants`
- W2-T2: `feat(wave3): add MUI wrapper components PmButton/PmInput/PmTable`

## Success Criteria

1. `:root` 中 `--pm-*` Token 数量 ≤ 80
2. 全项目业务 CSS 中 hex + rgba 硬编码 = 0
3. 全项目业务 CSS 中 linear-gradient 硬编码 = 0
4. ProjectCard 组件可编译、可导出
5. PmButton/PmInput/PmTable 组件可编译、可导出
6. `npm run lint` 0 errors（警告不新增）
7. `npm run build` 0 errors
