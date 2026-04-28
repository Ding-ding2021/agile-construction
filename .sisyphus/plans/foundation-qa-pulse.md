# Foundation + QA Pulse — 测试与质量基线建设（Wave 1+2 合并计划）

## TL;DR

> **Summary**: 为项目建立稳定的测试、Lint、TypeScript 检查与 CI 质量门禁基底，确保后续功能迭代有牢固的回归防线。Wave 1 建立工具链与基线测试，Wave 2 接入覆盖率阈值与集成测试。
> **Deliverables**: Vitest 基线测试骨架、ESLint+Prettier 提交门禁、CI 工作流（lint→type-check→test→coverage）、覆盖率阈值（≥70%）、后端集成测试用例、QA 场景集
> **Effort**: Medium
> **Parallel**: YES — 3 waves (Wave 1 可高度并行)
> **Critical Path**: Task 1 (Vitest 验证) → Task 7 (CI 工作流) → Task 8 (覆盖率阈值) → Task 10 (集成测试)

## Context

### Original Request

用户要求为后续开发任务建立质量基线计划。经四选一方案（A: 测试基线 / B: 注册模式统一 / C: 性能优化 / D: 后端 API 稳定化）投票，选定 **Option A — Foundation + QA Pulse** 作为第一版计划，并合并 Wave 1 与 Wave 2 为一期计划。

### Interview Summary

- 核心理念：在功能扩展前先筑牢测试与质量防线，后续每期迭代均可在此基线上增补测试。
- 选型确认：沿用项目已有的 Vitest + React Testing Library + jsdom，ESLint + Prettier（已有配置），GitHub Actions CI（已存在 ci.yml 但缺少测试步骤）。
- 覆盖率目标：初期 ≥70%（行/语句），后续随迭代提升。

### 背景探索发现（bg_724f5907 + bg_40d817b0）

- **测试框架**: Vitest 已配置（`vitest.config.ts`），环境 jsdom，setup 文件 `src/test/setup.ts`，已有 `@testing-library/jest-dom`。
- **测试分布**: `src/domain/__tests__/`、`src/services/__tests__/`、`src/components/task/__tests__/` 等，命名遵循 `*.test.ts`。
- **CI 现状**: `.github/workflows/ci.yml` 执行 lint + Type & Build，但**未运行测试**，无覆盖率阈值。
- **路由/注册**: 集中于 `src/config/routes.ts`（`pageComponentRegistry`），导航在 `src/config/navigation.ts`，AppRouter 在 `src/components/router/AppRouter.tsx`。
- **状态管理**: Zustand（`src/store/projectStore.ts`），领域逻辑在 `src/domain/projectStatusMachine.ts`。
- **设计系统**: CSS 变量体系 `--pm-*` 在 `src/index.css`，MUI 主题在 `src/theme.ts`。

### Metis 审查要点（已纳入）

- 明确定义每波验收标准（lint=0 errors、type-check=0 errors、coverage ≥ 阈值）。
- 补充测试数据种子/隔离策略（内存 Mock、Prisma 客户端 Mock）。
- 增加 CI 密钥/敏感信息防护要求。
- 定义可回滚策略与报告归档路径。
- 避免范围蔓延：基线计划不实现任何业务功能。

## Work Objectives

### Core Objective

建立可验证的测试、Lint、类型检查与 CI 质量门禁基线，为后续所有功能开发提供回归防线。

### Deliverables

1. **Vitest 基线测试骨架**: 覆盖核心 domain + services + selectors + guards。
2. **Pre-commit 门禁**: ESLint + Prettier + tsc 检查，通过 lint-staged + husky 强制执行。
3. **CI 工作流**: GitHub Actions 运行 lint → type-check → test → coverage，PR 不通过不可合入。
4. **覆盖率阈值**: vitest.config.ts 引入 threshold（行/语句 ≥70%），CI 阻断低于阈值的 PR。
5. **集成测试**: 后端 API 端点测试（Express + Prisma mock），前端关键 UI 测试（React Testing Library）。
6. **QA 场景集**: Happy path + Edge case + 边界条件，覆盖核心业务流程与错误路径。
7. **测试数据策略文档**: 种子/Mock 策略、隔离原则、清理策略。

### Definition of Done（可执行命令验证）

- [ ] `npm run lint` 通过，0 errors。
- [ ] `npm run test:run` 全部通过，覆盖率 ≥70%。
- [ ] `npm run build` 成功（含 tsc 类型检查）。
- [ ] `git commit` 触发 husky pre-commit 门禁（lint-staged + tsc --noEmit）。
- [ ] PR 创建后 CI 自动运行 lint → type-check → test → coverage，全部绿后才能合入。
- [ ] `.sisyphus/evidence/` 下有每个 task 的 QA 场景证据文件。

### Must Have

- Vitest 测试框架配置完整且所有已有测试通过。
- ESLint + Prettier 提交门禁生效。
- CI 工作流包含测试执行步骤。
- vitest.config.ts 含 coverage.threshold 配置。
- ≥2 个后端集成测试 + ≥2 个前端 UI 测试。

### Must NOT Have（红线约束）

- **禁止**在基线阶段实现新业务功能。
- **禁止**修改 `src/data/` 中类型定义而不同步更新消费方。
- **禁止**绕过 `canTransition` 守卫直接修改 `project.status`。
- **禁止**在子组件中直接 `localStorage.setItem` — 统一通过 `useProjectStore`。
- **禁止**新增路由/页面而不在 `pageComponentRegistry` 注册。

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — 所有验证为 agent 执行。

- **测试策略**: tests-after（已有测试先行补充骨架，后续迭代转为 TDD）。
- **框架**: Vitest + React Testing Library + jsdom。
- **QA 策略**: 每个 task 附 Playwright 或 Bash 可执行 QA 场景，证据存入 `.sisyphus/evidence/task-{N}-{slug}.{ext}`。

## Execution Strategy

### Parallel Execution Waves

> Target: 3–4 tasks per wave. Wave 1 任务可高度并行（1A–1F 可同时启动）。

| Wave   | Tasks   | 并行度                        | 说明                                 |
| ------ | ------- | ----------------------------- | ------------------------------------ |
| Wave 1 | T1–T6   | HIGH — 6 tasks 可并行         | 工具链验证 + 基础配置 + 基线测试骨架 |
| Wave 2 | T7–T11  | MEDIUM — T7 独先后并行 T8–T10 | CI 集成 → 覆盖率阈值 → 集成测试 → QA |
| Wave 3 | T12–T14 | LOW — 串行微调                | 清理、文档、回归验证                 |

### Dependency Matrix（关键依赖链）

```
T1(Vitest验证) ─┬─→ T3(ESLint Prettier) ──→ T6(Pre-commit门禁测试)
                ├─→ T4(TypeScript检查) ────→ T6
                ├─→ T5(基线测试骨架) ──────→ T7(CI工作流) ──→ T8(覆盖率阈值)
                └─→ T2(测试数据策略) ──────→ T10(集成测试) ──→ T11(QA场景扩展)

T7(CI工作流) ──→ T8(覆盖率阈值) ──→ T9(CI结果验证)
T8 + T10 ──→ T11(QA场景) ──→ T13(回归验证)
```

### Agent Dispatch Summary

| Wave   | Tasks   | 推荐 Agent 类型                            | 分类             |
| ------ | ------- | ------------------------------------------ | ---------------- |
| Wave 1 | 6 tasks | quick（配置类）/ unspecified-low（验证类） | tooling, testing |
| Wave 2 | 5 tasks | unspecified-low / quick                    | testing, ci      |
| Wave 3 | 3 tasks | deep（最终审查）                           | review, docs     |

---

## TODOs

> **实现 + 测试 = 一个 Task。不分离。**
> **每个 Task 必须有: Agent Profile + 并行度 + QA Scenarios。**

- [ ] **T1. 验证 Vitest 测试框架配置并与现有测试对齐**

  **What to do**:
  1. 读取 `vitest.config.ts`，确认 `environment: 'jsdom'`、`setupFiles: ['./src/test/setup.ts']` 配置正确。
  2. 运行 `npx vitest run` 确认所有现有 `__tests__` 下的测试通过。
  3. 如有个别测试因配置问题失败，修复至全部通过。
  4. 在 `package.json` 中确认 `"test:run": "vitest run"` 脚本存在且可用。

  **Must NOT do**:
  - 不要新增业务逻辑测试。
  - 不要修改已有的 `.test.ts` 测试断言逻辑（除非因配置变更导致断言失效）。
  - 不要改变 vitest.config.ts 中已有的 `coverage` exclude 列表。

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: 验证型任务，无新逻辑，仅确认配置与已有测试通过。
  - Skills: `[]`
  - Omitted: `playwright` — 纯终端验证，不需要浏览器。

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: T5, T7 | Blocked By: none

  **References**:
  - Pattern: `vitest.config.ts:1-30` — 现有 Vitest 配置结构
  - API/Type: `src/test/setup.ts` — 测试环境初始化
  - Test: `src/domain/__tests__/projectStatusMachine.test.ts` — 现有测试模式参考
  - Config: `package.json` — scripts.test / scripts.test:run

  **Acceptance Criteria**:
  - [ ] `npm run test:run` 所有已有测试通过（exit code 0）
  - [ ] `vitest.config.ts` environment 为 `jsdom`，setupFiles 指向 `src/test/setup.ts`

  **QA Scenarios**:

  ```
  Scenario: 全量已有测试通过
    Tool: Bash
    Steps: npm run test:run
    Expected: "Tests  XX passed" 信息，exit code 0。XX 与现有测试文件总数匹配。
    Evidence: .sisyphus/evidence/task-1-vitest-verify.txt

  Scenario: 单个测试文件执行
    Tool: Bash
    Steps: npx vitest run src/domain/__tests__/projectStatusMachine.test.ts
    Expected: 该文件所有测试用例通过，exit code 0。
    Evidence: .sisyphus/evidence/task-1-vitest-verify-single.txt
  ```

  **Commit**: YES | Message: `chore(test): verify Vitest config and all existing tests pass` | Files: vitest.config.ts（如修改）

---

- [ ] **T2. 制定测试数据种子与 Mock 策略文档**

  **What to do**:
  1. 分析现有测试中的数据使用方式（`localStorage` mock、Prisma mock 等）。
  2. 在 `src/test/` 下创建 `test-data-strategy.md`，描述：
     - 单元测试数据策略：纯函数 + Mock 外部依赖。
     - 仓库测试策略：Mock Prisma 客户端，使用内存数据。
     - API 集成测试策略：启动 Express 测试实例，Mock Prisma。
     - 数据隔离：每个测试用例独立创建和清理数据。
  3. 在 `src/test/` 下创建 `mocks/prisma.mock.ts`，提供 `createMockPrismaClient()` 工厂函数。

  **Must NOT do**:
  - 不要创建真实的数据库连接或写入 `prisma/dev.db`。
  - 不要在测试策略文档中包含业务逻辑描述。

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: 文档 + 简单 Mock 工厂，无复杂逻辑。
  - Skills: `[]`
  - Omitted: `playwright` — 不涉及浏览器。

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: T10 | Blocked By: none

  **References**:
  - Pattern: `src/services/__tests__/projectRepository.test.ts` — 已有 Prisma 仓库测试的数据模式
  - API/Type: `server/lib/prisma.ts` — PrismaClient 导出方式
  - Test: `src/components/task/__tests__/taskManagement.selectors.test.ts` — 现有测试数据生成模式

  **Acceptance Criteria**:
  - [ ] `src/test/test-data-strategy.md` 存在，包含 4 个策略章节。
  - [ ] `src/test/mocks/prisma.mock.ts` 存在，导出 `createMockPrismaClient()`。
  - [ ] 工厂函数返回可 mock 的 Prisma 客户端对象。

  **QA Scenarios**:

  ```
  Scenario: Mock 工厂函数可创建可用对象
    Tool: Bash
    Steps: 创建临时测试文件引入 createMockPrismaClient()，调用并检查返回值。
    Expected: 返回值含 project.findMany、project.create 等方法，不抛出异常。
    Evidence: .sisyphus/evidence/task-2-mock-factory.txt

  Scenario: 策略文档结构完整
    Tool: Bash
    Steps: 检查 src/test/test-data-strategy.md 文件大小 > 500 bytes，含 ## 单元测试 ## 仓库测试 ## 集成测试 ## 数据隔离 标题。
    Expected: 4 个章节全部存在。
    Evidence: .sisyphus/evidence/task-2-strategy-doc.txt
  ```

  **Commit**: YES | Message: `docs(test): add test data strategy and Prisma mock factory` | Files: src/test/test-data-strategy.md, src/test/mocks/prisma.mock.ts

---

- [ ] **T3. 配置 ESLint + Prettier 提交门禁**

  **What to do**:
  1. 读取现有 `eslint.config.js` 和 `.prettierrc`，确认配置符合编码规范（AGENTS.md 中的 rules）。
  2. 确认 `.husky/pre-commit` 中存在 `lint-staged` 调用。
  3. 检查 `package.json` 中的 `lint-staged` 配置，确保：
     - `*.{ts,tsx}` 文件执行 `eslint --fix` + `prettier --write`
     - 全局执行 `tsc --noEmit`（或仅在 lint-staged 后触发）
  4. 在 `lint-staged` 配置中加入 `*.css` 文件的 prettier 处理。
  5. 测试 pre-commit hook：创建临时 lint 违规文件并尝试提交，确认被拦截。

  **Must NOT do**:
  - 不要改变 ESLint rules 导致大量已有文件 lint 报错。
  - 不要禁用 `@typescript-eslint/no-explicit-any` 等关键规则。

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: 配置验证 + 小改动，无逻辑。
  - Skills: `[]`
  - Omitted: `playwright` — 纯终端验证。

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: T6 | Blocked By: T1

  **References**:
  - Pattern: `.husky/pre-commit` — 现有 pre-commit 脚本
  - Config: `eslint.config.js` — ESLint 配置
  - Config: `.prettierrc` — Prettier 配置（semi: false, singleQuote: true, printWidth: 100, arrowParens: avoid）
  - Config: `package.json` — lint-staged 配置段
  - Standard: `docs/00-governance/coding-standards.md` — ESLint/Prettier 规则参考

  **Acceptance Criteria**:
  - [ ] `npx lint-staged` 对暂存文件执行 ESLint + Prettier 成功。
  - [ ] pre-commit hook 可拦截 lint 违规文件（验证性测试后撤销）。
  - [ ] `package.json` 中 lint-staged 配置包含 ts/tsx/css 三类文件。

  **QA Scenarios**:

  ```
  Scenario: lint-staged 对合规文件通过
    Tool: Bash
    Steps: touch src/test/_lint_test_ok.ts && git add src/test/_lint_test_ok.ts && npx lint-staged
    Expected: exit code 0，无错误输出。
    Evidence: .sisyphus/evidence/task-3-lint-staged-pass.txt

  Scenario: lint-staged 对违规文件拦截
    Tool: Bash
    Steps: 创建含 console.log("test") 但未处理 no-console 规则的文件，暂存后运行 lint-staged。
    Expected: exit code ≠ 0，输出 ESLint 错误信息。
    Evidence: .sisyphus/evidence/task-3-lint-staged-fail.txt
  ```

  **Commit**: YES | Message: `chore(lint): configure ESLint + Prettier as pre-commit gates` | Files: package.json, .husky/pre-commit（如修改）

---

- [ ] **T4. 确保 TypeScript 类型检查在 CI 与本地提交前均强制执行**

  **What to do**:
  1. 确认 `package.json` 的 `"build"` 脚本中包含 `tsc -b`（现有配置）。
  2. 在 `.husky/pre-commit` 中确认（或添加）`tsc --noEmit` 步骤（不含 `-b`，因 pre-commit 不需要项目引用构建）。
  3. 运行 `npm run build` 确认类型检查通过（如有错误先修复）。
  4. 在 CI 工作流备忘中标注 Type & Build 步骤的作用（为后续 T7 整合做准备）。

  **Must NOT do**:
  - 不要修改 `tsconfig.json` 中的 `strict` 等核心编译选项。
  - 不要在修复类型错误时引入运行时逻辑变更。

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: 配置验证，无新逻辑。
  - Skills: `[]`

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: T6 | Blocked By: T1

  **References**:
  - Config: `package.json` — scripts.build: `tsc -b && vite build`
  - Config: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
  - Hook: `.husky/pre-commit` — 现有内容
  - CI: `.github/workflows/ci.yml` — Type & Build 步骤

  **Acceptance Criteria**:
  - [ ] `npm run build` 成功（exit code 0）。
  - [ ] `tsc --noEmit` 在项目根执行成功（exit code 0）。
  - [ ] pre-commit hook 包含 `tsc --noEmit`（或等价类型检查步骤）。

  **QA Scenarios**:

  ```
  Scenario: 完整构建通过
    Tool: Bash
    Steps: npm run build
    Expected: exit code 0，无 tsc 错误，Vite build 完成。
    Evidence: .sisyphus/evidence/task-4-tsc-build-pass.txt

  Scenario: 类型错误被捕获
    Tool: Bash
    Steps: 临时在源文件中引入类型错误（如 const x: number = "str"），运行 tsc --noEmit。
    Expected: exit code ≠ 0，输出类型错误信息。
    Evidence: .sisyphus/evidence/task-4-tsc-error-catch.txt
  ```

  **Commit**: YES | Message: `chore(ts): enforce tsc --noEmit in pre-commit hook` | Files: .husky/pre-commit（如修改）

---

- [ ] **T5. 创建基线测试骨架（domain + services + selectors + guards）**

  **What to do**:
  1. 扫描 `src/domain/` 和 `src/services/` 目录，确定缺少测试覆盖的核心模块。
  2. 为以下模块创建或补充基线测试（若已有则验证并补充边界用例）：
     - `src/domain/__tests__/projectStatusMachine.test.ts` — 状态转换 + 守卫逻辑
     - `src/services/__tests__/projectRepository.test.ts` — CRUD 操作
     - `src/components/task/__tests__/taskManagement.selectors.test.ts` — 选择器逻辑
     - `src/components/task/__tests__/taskStateMachine.guards.test.ts` — 任务状态守卫
  3. 每个测试文件至少包含：1 个 Happy path + 1 个 Edge case + 1 个 Error path。
  4. 遵循现有 `describe('模块名', () => { it('场景描述', () => { ... }) })` 模式。

  **Must NOT do**:
  - 不要在测试中修改被测源码的逻辑。
  - 不要创建无实际断言的空测试用例。

  **Recommended Agent Profile**:
  - Category: `unspecified-low` — Reason: 需理解领域逻辑，写出有意义的测试。
  - Skills: `[]`

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: T7 | Blocked By: T1

  **References**:
  - Pattern: `src/domain/__tests__/projectStatusMachine.test.ts` — 现有测试结构和断言风格
  - Pattern: `src/components/task/__tests__/taskManagement.selectors.test.ts` — 选择器测试模式
  - Domain: `src/domain/projectStatusMachine.ts` — canTransition, allowedTransitions 等暴露的 API
  - Service: `src/services/projectRepository.ts` — 仓库方法签名
  - Types: `src/data/projects.ts` — ProjectItem 类型

  **Acceptance Criteria**:
  - [ ] ≥4 个测试文件通过，每个≥2 个用例（Happy + Edge）。
  - [ ] `npm run test:run` 所有（含新旧）测试通过。
  - [ ] 新增测试覆盖 `canTransition`, `getAvailableTransitions`, 仓库 CRUD, 选择器过滤/排序。

  **QA Scenarios**:

  ```
  Scenario: 新增测试全部通过
    Tool: Bash
    Steps: npm run test:run
    Expected: 测试数量增加（相对 T1），全部通过，exit code 0。
    Evidence: .sisyphus/evidence/task-5-baseline-tests-pass.txt

  Scenario: 单个测试文件覆盖关键场景
    Tool: Bash
    Steps: npx vitest run src/domain/__tests__/projectStatusMachine.test.ts --reporter=verbose
    Expected: 输出每个场景的描述，至少包含 canTransition happy/edge/error 三类。
    Evidence: .sisyphus/evidence/task-5-status-machine-verbose.txt
  ```

  **Commit**: YES | Message: `test: add baseline test skeletons for domain, services, selectors` | Files: src/domain/**tests**/_, src/services/**tests**/_, src/components/task/**tests**/\*

---

- [ ] **T6. 端到端验证 Pre-commit 门禁（lint-staged + tsc）**

  **What to do**:
  1. 综合验证 T3 + T4 的成果：在 repo 根目录运行完整 pre-commit 流程。
  2. 创建临时测试文件（含 lint 违规）→ 暂存 → 尝试 `git commit` → 确认被拦截。
  3. 修复违规 → 再次尝试提交 → 确认通过。
  4. 测试后清理临时文件，确保工作区干净。
  5. 验证 `.husky/pre-commit` 的 hook 脚本语法正确且可执行。

  **Must NOT do**:
  - 不要在验证过程中产生 noise commit。
  - 不要修改 `.husky/pre-commit` 中已有的其他检查步骤。

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: 纯验证，确认 T3+T4 集成生效。
  - Skills: `[]`

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: T7 | Blocked By: T3, T4

  **References**:
  - Hook: `.husky/pre-commit` — 最终版本
  - Config: `package.json` — lint-staged 配置
  - Standard: `docs/00-governance/coding-standards.md` — Pre-commit 流水线说明

  **Acceptance Criteria**:
  - [ ] lint 违规文件被 pre-commit hook 拦截（exit code ≠ 0）。
  - [ ] 合规文件通过 pre-commit hook（exit code = 0）。
  - [ ] 测试后工作区干净（无未提交变更）。

  **QA Scenarios**:

  ```
  Scenario: Pre-commit 拦截 lint 违规
    Tool: Bash
    Steps:
      1. 创建临时文件 src/test/_hook_test_bad.ts，写入含 no-console 违规的代码
      2. git add src/test/_hook_test_bad.ts
      3. git commit -m "test: pre-commit hook test"（预期失败）
      4. git reset HEAD src/test/_hook_test_bad.ts && rm src/test/_hook_test_bad.ts
    Expected: 步骤 3 exit code ≠ 0，输出 lint 错误。步骤 4 恢复工作区干净。
    Evidence: .sisyphus/evidence/task-6-precommit-fail.txt

  Scenario: Pre-commit 通过合规提交
    Tool: Bash
    Steps:
      1. 创建临时文件 src/test/_hook_test_ok.ts，写入合规代码
      2. git add src/test/_hook_test_ok.ts
      3. git commit -m "test: pre-commit hook test pass"（预期成功）
      4. git reset --soft HEAD~1 && rm src/test/_hook_test_ok.ts
    Expected: 步骤 3 exit code = 0。步骤 4 恢复工作区干净。
    Evidence: .sisyphus/evidence/task-6-precommit-pass.txt
  ```

  **Commit**: NO — 验证型任务，不产生实际提交。

---

- [ ] **T7. 创建/更新 GitHub Actions CI 工作流（lint → type-check → test → coverage）**

  **What to do**:
  1. 读取现有 `.github/workflows/ci.yml`，在 Type & Build 步骤后新增测试执行步骤。
  2. 新增步骤结构：
     - `name: Run unit tests` → `run: npm run test:run`
     - `name: Run tests with coverage` → `run: npm run test:coverage`
  3. 确保 CI 使用 `npm ci`（非 `npm install`）安装依赖以锁定版本。
  4. 添加 `upload-artifact` 步骤将覆盖率报告（`coverage/` 目录）上传为 CI artifact。
  5. 添加 job 级别的 `timeout-minutes: 10` 防止挂死。
  6. 验证 yml 语法正确（可用 `actionlint` 或在线 validator 检查）。

  **Must NOT do**:
  - 不要删除现有的 lint 或 Type & Build 步骤。
  - 不要在 CI 中引入需要外部密钥的步骤（测试无需真实数据库）。

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: CI 配置修改，YAML 编辑。
  - Skills: `[]`
  - Omitted: `playwright` — 不涉及浏览器。

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: T8, T9 | Blocked By: T1, T5, T6

  **References**:
  - Existing CI: `.github/workflows/ci.yml` — 当前工作流结构
  - Scripts: `package.json` — test:run, test:coverage 脚本名
  - Vitest: `vitest.config.ts` — coverage 输出配置
  - External: `https://docs.github.com/en/actions/using-workflows` — GitHub Actions 参考

  **Acceptance Criteria**:
  - [ ] `.github/workflows/ci.yml` 包含 Run unit tests + Run tests with coverage 步骤。
  - [ ] CI 工作流 YAML 语法验证通过。
  - [ ] `npm run test:run` 在 CI 步骤中被正确引用（非 `npm test` watch 模式）。

  **QA Scenarios**:

  ```
  Scenario: 本地模拟 CI 测试步骤
    Tool: Bash
    Steps: npm ci && npm run test:run && npm run test:coverage
    Expected: 三步全部 exit code 0，覆盖率报告在 coverage/ 目录生成。
    Evidence: .sisyphus/evidence/task-7-ci-local-simulate.txt

  Scenario: YAML 语法检查
    Tool: Bash
    Steps: 使用 python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))" 或在线 validator。
    Expected: YAML 解析成功，无语法错误。
    Evidence: .sisyphus/evidence/task-7-yaml-validate.txt
  ```

  **Commit**: YES | Message: `ci: add test execution and coverage steps to CI workflow` | Files: .github/workflows/ci.yml

---

- [ ] **T8. 配置覆盖率阈值（vitest.config.ts coverage.threshold）**

  **What to do**:
  1. 在 `vitest.config.ts` 的 `test.coverage` 对象中添加 `thresholds` 配置：
     ```ts
     thresholds: {
       lines: 70,
       statements: 70,
       functions: 60,
       branches: 60,
     }
     ```
  2. 运行 `npm run test:coverage` 确认当前覆盖率与阈值的关系。
  3. 如当前覆盖率远低于阈值，先设置较保守的初始阈值（如 40%），待 T5 新增测试后提升至 70%。
  4. 在 CI 工作流中确认 `test:coverage` 步骤遇到低于阈值的 PR 会 fail。

  **Must NOT do**:
  - 不要设置虚高的阈值导致所有 PR 被阻断（根据当前实际覆盖率调整初始值）。
  - 不要修改 `coverage.provider` 或 `exclude` 列表（已在 T1 验证）。

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: 配置参数修改。
  - Skills: `[]`

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: T11 | Blocked By: T7

  **References**:
  - Config: `vitest.config.ts` — 现有 test 和 coverage 配置
  - External: `https://vitest.dev/config/#coverage-thresholds` — thresholds 参数文档

  **Acceptance Criteria**:
  - [ ] `vitest.config.ts` 中 `coverage.thresholds` 已定义（lines ≥ 40 初始值，此计划完成后升至 ≥70）。
  - [ ] `npm run test:coverage` 不因当前覆盖率低于阈值而 fail（如果 fail，调低初始阈值至可接受值）。
  - [ ] coverage 报告显示 thresholds 状态。

  **QA Scenarios**:

  ```
  Scenario: 覆盖率命令可执行且报告生成
    Tool: Bash
    Steps: npm run test:coverage
    Expected: exit code 0（或根据阈值可能非 0），coverage/ 目录有 index.html。
    Evidence: .sisyphus/evidence/task-8-coverage-report.txt

  Scenario: 阈值低于当前覆盖不阻断
    Tool: Bash
    Steps: grep "thresholds" vitest.config.ts 确认配置存在。
    Expected: 配置存在，运行 test:coverage 后阈值为 "PASS" 或 "FAIL" 均有明确输出。
    Evidence: .sisyphus/evidence/task-8-threshold-config.txt
  ```

  **Commit**: YES | Message: `chore(test): add coverage thresholds to vitest.config.ts` | Files: vitest.config.ts

---

- [ ] **T9. 验证 CI 结果反馈（lint + type-check + test + coverage 全流程）**

  **What to do**:
  1. 触发一次完整的本地 CI 模拟：`npm ci && npm run lint && npm run build && npm run test:coverage`。
  2. 验证每一步的 exit code 和输出是否符合预期。
  3. 检查覆盖率报告 HTML 是否在 `coverage/index.html` 生成且可读。
  4. 确认 CI 工作流的所有步骤在逻辑上连贯（lint → build → test → coverage）。
  5. 检查 `.github/workflows/ci.yml` 中是否有遗漏的错误处理（如 `set -e` 或 `shell: bash` 配置）。

  **Must NOT do**:
  - 不要在 GitHub 上真实触发 CI（仅本地模拟验证）。
  - 不要在验证中引入未跟踪文件。

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: 验证型任务。
  - Skills: `[]`

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: T12 | Blocked By: T7, T8

  **References**:
  - CI: `.github/workflows/ci.yml`
  - Scripts: `package.json` — lint, build, test:coverage
  - Coverage: `coverage/index.html` — 报告入口

  **Acceptance Criteria**:
  - [ ] `npm ci && npm run lint && npm run build && npm run test:coverage` 全流程通过。
  - [ ] `coverage/index.html` 文件存在且可被浏览器打开预览。
  - [ ] CI 工作流步骤顺序正确：lint → Type & Build → test → coverage。

  **QA Scenarios**:

  ```
  Scenario: 本地 CI 全流程模拟
    Tool: Bash
    Steps: npm ci && npm run lint && npm run build && npm run test:coverage
    Expected: 所有命令 exit code 0（或 test:coverage 根据阈值可能非 0，但 lint+build 必须为 0）。
    Evidence: .sisyphus/evidence/task-9-full-ci-local.txt

  Scenario: 覆盖率 HTML 报告可读
    Tool: Bash
    Steps: ls -la coverage/index.html && head -n 5 coverage/index.html
    Expected: 文件存在，开头为合法的 HTML doctype 或 html 标签。
    Evidence: .sisyphus/evidence/task-9-coverage-html.txt
  ```

  **Commit**: NO — 验证型任务。

---

- [ ] **T10. 添加后端 API 集成测试与前端关键 UI 测试**

  **What to do**:
  1. **后端集成测试**（≥2 个）：
     - 创建 `server/__tests__/projects.api.test.ts`：测试 `GET /api/projects` 和 `POST /api/projects`。
     - 使用 Mock Prisma 客户端（T2 的 `createMockPrismaClient()`）。
     - 使用 `supertest` 或 Express 测试工具发送 HTTP 请求。
     - 验证 HTTP 状态码和响应体结构。
  2. **前端 UI 测试**（≥2 个）：
     - 创建 `src/components/project/__tests__/ProjectDetailPage.test.tsx`：测试页面渲染和 Tab 切换。
     - 创建 `src/components/shared/__tests__/PageHeader.test.tsx`：测试标题渲染和搜索输入。
     - 使用 `@testing-library/react` 的 `render` + `screen` + `fireEvent`。

  **Must NOT do**:
  - 不需要启动真实的 Express 服务器（使用 supertest 的 request 方法）。
  - 不要为 UI 测试启动完整的 App 路由栈（仅测试组件级渲染）。
  - 不要引入 Playwright 或真实浏览器（此阶段不做 E2E）。

  **Recommended Agent Profile**:
  - Category: `unspecified-low` — Reason: 需要编写有意义的测试，但遵循现有模式。
  - Skills: `[]`
  - Omitted: `playwright` — 此阶段不涉及 E2E。

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: T11 | Blocked By: T2, T5

  **References**:
  - Backend API: `server/routes/projects.ts` — 路由定义和 handler
  - Backend Controller: `server/controllers/projects.ts` — 控制器逻辑
  - Frontend Component: `src/components/project/ProjectDetailPage.tsx` — 页面组件
  - Frontend Component: `src/components/shared/PageHeader.tsx` — 共享头部组件
  - Mock: `src/test/mocks/prisma.mock.ts` — Mock 工厂（T2 产物）
  - Test Pattern: `src/services/__tests__/projectRepository.test.ts` — 现有仓库测试模式

  **Acceptance Criteria**:
  - [ ] `server/__tests__/projects.api.test.ts` 至少包含 GET 200 和 POST 201 两个测试。
  - [ ] `src/components/project/__tests__/ProjectDetailPage.test.tsx` 至少验证页面渲染 + Tab 存在。
  - [ ] `src/components/shared/__tests__/PageHeader.test.tsx` 至少验证标题渲染。
  - [ ] `npm run test:run` 全部通过（含新增集成/UI 测试）。

  **QA Scenarios**:

  ```
  Scenario: 后端 GET /api/projects 返回 200
    Tool: Bash
    Steps: npx vitest run server/__tests__/projects.api.test.ts
    Expected: 测试通过，包含 GET 返回 200 且响应体为数组。
    Evidence: .sisyphus/evidence/task-10-api-get-200.txt

  Scenario: 前端 ProjectDetailPage 渲染
    Tool: Bash
    Steps: npx vitest run src/components/project/__tests__/ProjectDetailPage.test.tsx
    Expected: 测试通过，页面渲染不出错，Tabs 列表存在。
    Evidence: .sisyphus/evidence/task-10-ui-project-detail.txt
  ```

  **Commit**: YES | Message: `test: add backend API integration tests and frontend UI component tests` | Files: server/**tests**/_, src/components/project/**tests**/_, src/components/shared/**tests**/\*

---

- [ ] **T11. 扩展 QA 场景集（Happy path + Edge case + 边界条件）**

  **What to do**:
  1. 为 T5 和 T10 中创建的测试补充完整的 QA 场景文档。
  2. 在 `.sisyphus/evidence/` 下为每个核心模块生成 QA 场景 checklist（markdown 格式）。
  3. 确保每个模块涵盖：
     - Happy path（正常业务流程）
     - Edge case（空数据、极值、并发）
     - Error path（错误输入、网络失败、权限不足）
  4. 为后端 API 测试添加：空请求体、无效 ID、超长输入 等边界测试。
  5. 为前端 UI 测试添加：空 props、缺失必填 props 时的降级渲染。

  **Must NOT do**:
  - 不需要写 E2E 测试（留到后续 Plan）。
  - 不需要创建不需要的测试（每个边界场景对应一个具体的断言）。

  **Recommended Agent Profile**:
  - Category: `unspecified-low` — Reason: 需要系统性思维覆盖边界，但无新基础设施。
  - Skills: `[]`

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: T12, T13 | Blocked By: T8, T10

  **References**:
  - QA Evidence Dir: `.sisyphus/evidence/` — 证据存放位置
  - Domain: `src/domain/projectStatusMachine.ts` — 所有状态转换路径
  - Backend: `server/routes/projects.ts` — 所有 API 端点
  - Frontend: `src/components/project/ProjectDetailPage.tsx` — 所有渲染分支

  **Acceptance Criteria**:
  - [ ] `.sisyphus/evidence/task-11-qa-scenarios.md` 存在，≥3 个模块的场景描述。
  - [ ] 每个模块 Happy + Edge + Error 三类全覆盖。
  - [ ] `npm run test:run` 全部通过（含新增边界测试）。

  **QA Scenarios**:

  ```
  Scenario: QA 场景文档结构完整
    Tool: Bash
    Steps: grep -c "Happy path\|Edge case\|Error path" .sisyphus/evidence/task-11-qa-scenarios.md
    Expected: 每个分类至少出现 3 次（对应 ≥3 个模块）。
    Evidence: .sisyphus/evidence/task-11-qa-count.txt

  Scenario: 边界测试可执行
    Tool: Bash
    Steps: npm run test:run -- --reporter=verbose 2>&1 | grep -E "(PASS|FAIL)"
    Expected: 所有测试 PASS，测试用例总数相比 T10 增加。
    Evidence: .sisyphus/evidence/task-11-test-count.txt
  ```

  **Commit**: YES | Message: `test(qa): add comprehensive QA scenarios with edge cases` | Files: .sisyphus/evidence/task-11-qa-scenarios.md, test files（按需）

---

- [ ] **T12. 清理临时文件、验证工作区干净、更新计划文档**

  **What to do**:
  1. 检查 `src/test/_hook_test_*` 等临时测试文件是否已删除（T6 验证后清理）。
  2. 运行 `git status` 确认无 leftover 未跟踪文件。
  3. 更新 `docs/03-engineering/development-guide.md` 补充测试运行指令和 CI 流程说明。
  4. 核对 `.sisyphus/plans/foundation-qa-pulse.md` 与 `.sisyphus/drafts/foundation-qa-pulse.md` 一致性。

  **Must NOT do**:
  - 不要提交 `coverage/`、`node_modules/` 等构建产物。
  - 不要删除 `.sisyphus/evidence/` 中已有的证据文件。

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: 清理 + 文档更新。
  - Skills: `[]`

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: T13 | Blocked By: T9, T11

  **References**:
  - Guide: `docs/03-engineering/development-guide.md` — 补充 CI/测试章节
  - Evidence: `.sisyphus/evidence/` — 所有任务证据
  - Draft: `.sisyphus/drafts/foundation-qa-pulse.md`

  **Acceptance Criteria**:
  - [ ] `git status` 干净（无临时文件、无未跟踪残留）。
  - [ ] `docs/03-engineering/development-guide.md` 包含测试/CI 更新。
  - [ ] Plan 与 Draft 内容一致（关键决策和范围声明吻合）。

  **QA Scenarios**:

  ```
  Scenario: 工作区干净
    Tool: Bash
    Steps: git status --porcelain
    Expected: 无输出（完全干净）或仅有 .sisyphus/ 下的计划文件变更。
    Evidence: .sisyphus/evidence/task-12-git-clean.txt

  Scenario: 开发指南已更新
    Tool: Bash
    Steps: grep -A5 "## CI" docs/03-engineering/development-guide.md
    Expected: 有 CI 相关说明，含 test:run 和 test:coverage 引用。
    Evidence: .sisyphus/evidence/task-12-guide-updated.txt
  ```

  **Commit**: YES | Message: `docs: update development guide with CI/test instructions` | Files: docs/03-engineering/development-guide.md

---

- [ ] **T13. 完整回归验证（lint + build + test + coverage 全流程 + pre-commit）**

  **What to do**:
  1. 运行完整回归命令：`npm ci && npm run lint && npm run build && npm run test:coverage`。
  2. 模拟 pre-commit hook（`npx lint-staged` + `tsc --noEmit`）。
  3. 检查覆盖率报告是否达到 ≥40% 初始阈值。
  4. 确认所有新增测试文件在 `npm run test:run` 中可见且通过。
  5. 统计最终测试用例总数，与 T1 基线的增量对比。

  **Must NOT do**:
  - 不要在回归验证过程中修改任何源文件。
  - 修复问题时产生的新变更必须走正常的 T1–T12 流程或通过新的 task。

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: 最后防线，需全面审视所有环节。
  - Skills: `[]`

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: T14 | Blocked By: T12

  **References**:
  - All: 以上所有 task 的引用路径汇总

  **Acceptance Criteria**:
  - [ ] `npm ci && npm run lint && npm run build && npm run test:coverage` 全部通过。
  - [ ] pre-commit 模拟通过。
  - [ ] 覆盖率 ≥40%（初始阈值），测试用例总数明确记录。

  **QA Scenarios**:

  ```
  Scenario: 全流程回归通过
    Tool: Bash
    Steps: npm ci && npm run lint && npm run build && npm run test:coverage
    Expected: 所有命令 exit code 0（或 test:coverage 根据阈值可能非 0，记录是否达标）。
    Evidence: .sisyphus/evidence/task-13-regression-full.txt

  Scenario: Pre-commit 模拟通过
    Tool: Bash
    Steps: npx lint-staged && tsc --noEmit
    Expected: exit code 0。
    Evidence: .sisyphus/evidence/task-13-precommit-sim.txt
  ```

  **Commit**: NO — 验证型任务。如有修复，走新 commit。

---

- [ ] **T14. 最终审查与归档**

  **What to do**:
  1. 汇总 `.sisyphus/evidence/` 下所有 task 证据，生成一个 `SUMMARY.md`。
  2. 用 `@done` 命令写工作日志到 `.workbuddy/memory/2026-04-28.md`。
  3. 如有架构决策（如覆盖率阈值选值理由），记录到 `MEMORY.md`。
  4. 标记计划状态为 Complete。

  **Must NOT do**:
  - 不要创建额外的 README 或文档文件（除非是 `AGENTS.md` 约定的日志文件）。

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: 汇总 + 日志写入。
  - Skills: `[]`

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: none | Blocked By: T13

  **References**:
  - Evidence Dir: `.sisyphus/evidence/`
  - Memory Dir: `.workbuddy/memory/`
  - Plan: `.sisyphus/plans/foundation-qa-pulse.md`

  **Acceptance Criteria**:
  - [ ] `.sisyphus/evidence/SUMMARY.md` 存在，汇总所有 task 结果。
  - [ ] `.workbuddy/memory/2026-04-28.md` 存在，记录本计划完成日志。
  - [ ] Plan 状态标记为 Complete。

  **QA Scenarios**:

  ```
  Scenario: 汇总文件完整性
    Tool: Bash
    Steps: wc -l .sisyphus/evidence/SUMMARY.md && grep -c "task-" .sisyphus/evidence/SUMMARY.md
    Expected: 行数 > 30，task 引用 ≥10 个。
    Evidence: .sisyphus/evidence/task-14-summary-check.txt
  ```

  **Commit**: YES | Message: `docs: archive completion summary and daily log` | Files: .sisyphus/evidence/SUMMARY.md, .workbuddy/memory/2026-04-28.md

---

## Final Verification Wave（MANDATORY — 所有实现任务完成后）

> 4 个审查 agent 并行执行。全部必须 APPROVE。
> **等待用户显式"okay"后才能标记 Complete。**
> **用户拒绝或反馈 → 修复 → 重新审查 → 再次等待用户 okay。**

- [ ] **F1. Plan Compliance Audit** — oracle
      检查计划中每项任务是否按照规范完成，验收标准是否全部满足。
- [ ] **F2. Code Quality Review** — unspecified-high
      检查新增/修改代码是否符合编码规范（`docs/00-governance/coding-standards.md`）。
- [ ] **F3. Real Manual QA** — unspecified-high (+ playwright if UI)
      对基线测试、CI 工作流、pre-commit hook 做手工 QA 验证。
- [ ] **F4. Scope Fidelity Check** — deep
      确认无范围蔓延（无业务功能被错误引入），红线约束未被违反。

## Commit Strategy

- 每个 task 独立提交（task 粒度 commit message 见各 task 的 Commit 行）。
- 禁止跨 task 合并提交。
- Commit message 格式：`type(scope): desc`，遵循 AGENTS.md 规范。

## Success Criteria

- [ ] `npm run test:run` 全部测试通过（含新增测试）。
- [ ] `npm run test:coverage` 覆盖率 ≥ 初始阈值（40%），且 `vitest.config.ts` 中 thresholds 目标指向 ≥70%。
- [ ] `npm run lint` 0 errors。
- [ ] `npm run build` 成功（tsc + vite build）。
- [ ] pre-commit hook 能拦截 lint 违规。
- [ ] CI 工作流包含 lint → type-check → test → coverage 完整链路。
- [ ] 后端 API 集成测试 ≥ 2 个，前端 UI 测试 ≥ 2 个。
- [ ] `.sisyphus/evidence/` 下每个 task 有对应的证据文件。
- [ ] Final Verification Wave 全部 APPROVE，用户显式 okay。
