# 代码规范与代码审查优化计划

## TL;DR

> **Quick Summary**: 完成全项目代码规范与审查体系审计，发现 6 类问题（coding-standards.md 严重过时、CI 路径错误、注释规范矛盾、Review 流程缺失、ESLint 规则松弛、commit message 无校验）。按 P0→P1→P2 优先级执行优化。
>
> **Deliverables**:
>
> - P0: coding-standards.md 重写 §1(代码风格) + §5(文件组织) + CI 路径修复
> - P1: 注释规范统一、双栈规范补充、ESLint 规则收紧
> - P2: Code Review Checklist 新建、Review 工作流定义、commit message 校验
>
> **Estimated Effort**: Medium（2-3 天）
> **Parallel Execution**: YES — 3 waves
> **Critical Path**: P0 → P1 → P2

---

## Context

### Original Request

用户要求对代码规范和代码审查进行评估并优化。

### Interview Summary

**审计覆盖**:

- coding-standards.md（877 行，last_updated 2026-03-14）
- eslint.config.js / .prettierrc / .husky/pre-commit
- .github/workflows/ci.yml（50 行）
- vitest.config.ts / tsconfig.app.json
- component-development-contract.md / mvp-code-quality-plan-v2.md
- 实际 lint/build/test 运行结果

**审计发现 6 类问题**:

| 问题                                                       | 严重度 | 分类      |
| ---------------------------------------------------------- | ------ | --------- |
| coding-standards.md Prettier/ESLint/目录结构与实际严重偏离 | 🔴 P0  | 规范文档  |
| CI verify stage3 docs 路径错误                             | 🔴 P0  | CI 流水线 |
| 注释规范 §7.1 与 §7.1.1 自相矛盾                           | 🟡 P1  | 规范文档  |
| 缺少双栈规范（MUI + shadcn）                               | 🟡 P1  | 规范文档  |
| ESLint `no-explicit-any`/`no-unused-vars` 仅 warn          | 🟡 P1  | 工具配置  |
| 无 Code Review Checklist / Review 工作流未定义             | 🟢 P2  | 流程缺失  |
| commit message 格式无自动化校验                            | 🟢 P2  | 工具配置  |

---

## Work Objectives

### Core Objective

建立与项目实际代码匹配的编码规范体系 + 定义可执行的代码审查流程。

### Concrete Deliverables

- **P0**: coding-standards.md §1+§5 重写 + CI 路径修复
- **P1**: 注释规范统一、双栈规范、ESLint 规则收紧
- **P2**: code-review-checklist.md 新建、commitlint 配置

### Definition of Done

- [ ] `npm run lint` → 0 errors（无新增，现有 warning 不影响）
- [ ] `npm run test:run` → All tests passing
- [ ] coding-standards.md 的 Prettier/ESLint/目录与实际一致
- [ ] CI pipeline 文档验证路径正确
- [ ] code-review-checklist.md 初版可用

---

## Verification Strategy

### QA Policy

每个任务完成后执行：

- `npm run lint` monitoring（确认 lint 不恶化）
- `npm run build`（确认构建不破坏）
- 手动验证改动内容正确

---

## Execution Strategy

### Parallel Execution Waves

```
Wave P0（周一 — 急修，3 任务）:
├── Task P0-1: coding-standards.md §1+§5 重写
├── Task P0-2: CI pipeline 路径修复 + 规则清理
└── Task P0-3: coding-standards.md frontmatter & related_docs 更新

Wave P1（周二 — 规范完善，3 任务）:
├── Task P1-1: §7 注释规范统一（工程模式一致化）
├── Task P1-2: 新增 §10 双栈规范（MUI + shadcn）
└── Task P1-3: ESLint 规则收紧 + warning 清理

Wave P2（周三 — 流程建设，2 任务）:
├── Task P2-1: 新建 code-review-checklist.md
└── Task P2-2: 配置 commitlint + pre-commit hook
```

---

## TODOs

### Wave P0：紧急修复

- [x] P0-1. 重写 coding-standards.md §1 代码风格 + §5 文件组织

  **What to do**:
  - **§1.1 ESLint 配置**：删除旧的 `.eslintrc.js` 示例，替换为当前实际 `eslint.config.js` 内容（flat config 格式）
  - **§1.2 Prettier 配置**：JSON 内容与 `.prettierrc` 完全对齐：
    ```json
    {
      "semi": false,
      "singleQuote": true,
      "printWidth": 100,
      "trailingComma": "es5",
      "arrowParens": "avoid"
    }
    ```
  - **§1.3 代码格式示例**：更新为项目实际风格（no-semi, arrow-parens avoid）
  - **§5.1 目录结构**：替换为项目实际目录树：
    ```
    src/
    ├── config/       # 路由、导航、特性注册表
    ├── components/   # 页面组件 + 共享组件
    ├── domain/       # 纯领域逻辑（状态机等）
    ├── data/         # 静态/mock 数据
    ├── services/     # API 客户端、Repository
    ├── store/        # Zustand 状态管理
    └── App.tsx       # 主应用编排
    ```
  - **§5.2 文件命名**：保留，与实际一致
  - 同时删除 frontmatter 中 `related_code: []` 和 `related_docs: []`，补充为：
    ```yaml
    related_code:
      - eslint.config.js
      - .prettierrc
      - tsconfig.app.json
    related_docs:
      - docs/00-governance/design-specification.md
      - docs/00-governance/component-development-contract.md
      - docs/03-engineering/development-guide.md
    ```

  **Must NOT do**:
  - 不改动 §2（TypeScript）、§3（React）、§6（命名规范）、§8（性能优化）、§9（Git 提交）——这些仍然适用
  - 不改动 Prettier 或 ESLint 的实际配置文件

  **References**:
  - `eslint.config.js:1-38` — 实际 ESLint 配置
  - `.prettierrc:1-8` — 实际 Prettier 配置
  - `tsconfig.app.json:1-28` — 实际 TS 配置

  **Commit**: YES (group P0 tasks)
  - Message: `docs(P0): 重写 coding-standards.md §1 §5 对齐实际配置`

- [x] P0-2. 修复 CI pipeline 路径错误

  **What to do**:
  - 修改 `.github/workflows/ci.yml` 第 29-35 行的 `Verify stage3 docs` 步骤：
    ```yaml
    - name: Verify stage3 docs
      run: |
        test -f docs/03-engineering/release/launch-checklist.md
        test -f docs/03-engineering/release/feishu-publish-runbook.md
        test -f docs/03-engineering/integration-guide.md
        test -f docs/00-governance/document-governance.md
        test -f docs/README.md
    ```
  - 将 `Verify stage3 docs` 改为通用的 `Verify key docs exist`（因为 stag3 已过时）

  **Must NOT do**:
  - 不改动 CI 的其他步骤（lint/build/test/coverage）

  **References**:
  - `.github/workflows/ci.yml:26-35` — 需要修改的部分

- [x] P0-3. 更新 coding-standards.md frontmatter

  **What to do**:
  - `last_updated`: `2026-03-14` → `2026-05-05`
  - `related_code`: `[]` → `[eslint.config.js, .prettierrc, tsconfig.app.json]`
  - `related_docs`: `[]` → `[docs/00-governance/design-specification.md, docs/00-governance/component-development-contract.md, docs/03-engineering/development-guide.md]`
  - 头部引用：`docs/00-governance/design-specification.md v1.1.0` → `docs/01-product/design-spec-v2-shadcn.md v2.1.0`
  - 删除 §结尾已经损坏的引用（TECHNOLOGY_STACK.md, PROJECT_STRUCTURE.md 已不存在）

  **Commit**: YES (group with P0-1)

---

### Wave P1：规范完善

- [x] P1-1. 统一注释规范（§7）

  **What to do**:
  - 删除 §7.1.1 中"每一行都有清晰的中文解释"的示例
  - 删除 §7.1.2 "注释内容要求"表格（要求导入/变量/函数/条件/循环都注释——太严格）
  - 保留 §7.1 的工程模式描述（关键逻辑/边界条件/复杂状态流）
  - 保留 §7.2 的复杂逻辑注释示例和 §7.3 的组件注释示例
  - 统一为一条原则：**"仅对关键逻辑、业务边界、复杂状态流转写中文注释。不要求 import 语句、简单变量声明、普通 JSX 的注释。"**

  **Must NOT do**:
  - 不改动其他章节

  **References**:
  - `coding-standards.md:588-738` — 注释规范当前内容

- [x] P1-2. 新增 §10 双栈规范

  **What to do**:
  在 §9 (Git 提交规范) 之后新增 §10：

  ```markdown
  ## 10. 双栈编码规范

  项目有两条独立的开发线，共享 node_modules/prisma/local-api：

  ### 10.1 src/（MUI 版 — 维护模式）

  | 维度  | 规范                                               |
  | ----- | -------------------------------------------------- |
  | UI 库 | MUI v9 + Emotion                                   |
  | 样式  | CSS 变量 `var(--pm-*)`，深色玻璃态                 |
  | 路由  | Hash 路由，`readRouteFromHash()` + `navigation.ts` |
  | 状态  | Zustand + persist（`projectStore.ts`）             |
  | 数据  | Repository 模式（API 优先 + localStorage 降级）    |
  | CSS   | 同文件 `.css`，不使用 CSS Modules                  |

  ### 10.2 src-next/（shadcn 版 — 活跃开发）

  | 维度     | 规范                                                       |
  | -------- | ---------------------------------------------------------- |
  | UI 库    | shadcn/ui (base-nova) + @base-ui/react                     |
  | 样式     | Tailwind CSS v4，oklch 色值                                |
  | 路由     | React Router v7 BrowserRouter                              |
  | 图标     | lucide-react（通过 icon.tsx 适配层统一 16px）              |
  | 组件来源 | 必须来自 shadcn 官方 registry                              |
  | 禁止事项 | --pm-\* 旧品牌色、MUI sx/style prop、bg-white/X 透明度色值 |
  ```

  **References**:
  - `CLAUDE.md:37-75` — src/ 架构描述
  - `CLAUDE.md:78-154` — src-next/ 架构描述
  - `docs/01-product/design-spec-v2-shadcn.md` — shadcn 设计规范
  - `docs/00-governance/design-specification.md` — MUI 设计规范

- [x] P1-3. 收紧 ESLint 规则 + warning 清理

  **What to do**:
  - `eslint.config.js` 中修改：
    - `'@typescript-eslint/no-explicit-any': 'warn'` → `'error'`
    - `'@typescript-eslint/no-unused-vars': ['warn', ...]` → `['error', ...]`
  - 运行 `npm run lint "src/**/*.{ts,tsx}"` 检查新增 error 数
  - 如果 error 过多（预期 20-40 个），逐个修复：
    - `no-explicit-any`: 能用具体类型替换的替换；能力不足的加 `// eslint-disable-next-line @typescript-eslint/no-explicit-any` 并注释理由
    - `no-unused-vars`: 删除未使用的变量
  - 修复完成后确认 `src/` 0 errors

  **Must NOT do**:
  - 不改动 `src-next/` 或 `local-api/` 的代码
  - 不降低已有规则严格度

  **References**:
  - `eslint.config.js:34-35` — 需要修改的行
  - 当前 warning 分布：`src/test/` 约 20 处 `no-explicit-any`，`src/services/` 约 10 处

---

### Wave P2：流程建设

- [x] P2-1. 新建 Code Review Checklist

  **What to do**:
  创建 `docs/00-governance/code-review-checklist.md`：

  ```markdown
  # Code Review Checklist

  ## 适用范围

  所有 AI 完成开发后，进入"In Review"阶段前必须经过本 checklist。

  ## 1. 门禁检查（自动化，必须全部通过）

  - [ ] `npm run build` — 0 errors
  - [ ] `npm run lint` — 0 errors
  - [ ] `npm run test:run` — All tests passing
  - [ ] 覆盖率未低于阈值（lines 55% / functions 42% / branches 42%）

  ## 2. 逻辑验证

  - [ ] 新增/修改代码有对应的单元测试
  - [ ] 测试用例名称描述业务场景（非 test1/test2）
  - [ ] 核心模块输出了可解释交付物（测试用例清单 + 流程图 + 边界条件）

  ## 3. 编码规范

  - [ ] 无 `any` 类型（除非有 `eslint-disable` 注释说明理由）
  - [ ] 无硬编码色值/尺寸（使用 CSS 变量或设计 Token）
  - [ ] 命名符合规范（组件 PascalCase，函数 camelCase，常量 UPPER_SNAKE_CASE）
  - [ ] 注释仅用于关键逻辑/边界条件/复杂状态流（工程模式）
  - [ ] 无 `console.log`（仅允许 console.warn/error/info）

  ## 4. 架构合规

  - [ ] 未绕过状态机守卫直接修改状态
  - [ ] 未在子组件中直接操作 localStorage
  - [ ] 路由跳转使用 navigation.ts 的 goTo\* 函数（非 window.location.hash 硬编码）
  - [ ] 数据操作通过 Repository/Store 层（非直接 fetch）

  ## 5. AI 产物检查

  - [ ] 无死代码（定义了但未使用）
  - [ ] 无过度抽象（不要为了"将来可能用"创建接口/工具函数）
  - [ ] 无过度注释（不要"每一行都加注释"）
  - [ ] 无 `@ts-ignore` / `@ts-expect-error`（除非有 Issue 引用）

  ## 6. QA 验证

  - [ ] 核心场景手动验证通过
  - [ ] 边界条件（空数据、错误输入、网络异常）验证通过
  - [ ] UI 变更：检查响应式布局、暗色模式、加载态、空态、错误态

  ## Review 结论

  - [ ] **APPROVED** — 全部通过，可合并
  - [ ] **CHANGES REQUESTED** — 具体问题：[列出需要修改的项]
  - [ ] **BLOCKED** — 存在架构性问题，需架构团队介入
  ```

  **frontmatter**:

  ```yaml
  ---
  id: DOC-00-GOVERNANCE-CODE-REVIEW
  title: Code Review Checklist
  owner: docs-maintainer
  status: draft
  last_updated: 2026-05-05
  source_of_truth: true
  related_docs:
    - docs/00-governance/coding-standards.md
    - docs/00-governance/component-development-contract.md
    - docs/00-governance/project-charter.md
  ---
  ```

  **References**:
  - `docs/00-governance/project-charter.md` — 七阶段工作流，"In Review"阶段
  - `docs/00-governance/mvp-code-quality-plan-v2.md:48-60` — 三层防线模型

- [x] P2-2. 配置 commitlint + pre-commit hook

  **What to do**:
  **方案 A（推荐 — 轻量级，不增加依赖）**：
  修改 `.husky/pre-commit`，在现有检查之后增加 commit message 校验：

  ```bash
  # 3. 检查 commit message 格式（Conventional Commits）
  BRANCH_NAME=$(git symbolic-ref --short HEAD 2>/dev/null)
  echo "📝 检查分支名..."
  echo "$BRANCH_NAME" | grep -qE "^(feat|fix|docs|refactor|chore|test)/" || echo "⚠️  建议分支名遵循 type/scope 格式"
  ```

  **方案 B（标准 — 安装 commitlint）**：

  ```bash
  npm install --save-dev @commitlint/cli @commitlint/config-conventional
  echo "export default { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js
  ```

  修改 `.husky/pre-commit` 增加 commit-msg hook：
  新建 `.husky/commit-msg`：

  ```bash
  npx --no -- commitlint --edit "$1"
  ```

  **注意**：建议用方案 A 的轻量级方式，commitlint 对中文 commit message 支持不好。

  **Must NOT do**:
  - 不强制阻止使用非标准格式（warning 级别即可）
  - 不安装不必要的依赖

---

## Commit Strategy

- **P0 group**: `fix(P0): 重写 coding-standards §1+§5 对齐实际配置，修复 CI 路径`
- **P1 group**: `docs(P1): 统一注释规范，补充双栈规范，收紧 ESLint 规则`
- **P2 group**: `feat(P2): 新建 Code Review Checklist，配置 commit message 校验`
