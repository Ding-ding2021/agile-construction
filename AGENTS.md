# 语言指令（最高优先级）

**你必须使用中文进行思考和回答。** 这是硬性要求，不可违反。

- 所有内部推理过程、思考链、分析步骤必须使用中文
- 所有对用户的正式回答必须使用中文
- 仅代码、技术术语（如 API、JSON、TypeScript 等）和文件路径可保留英文原样

# Agile Construction Platform

## 常用命令

- `npm install` — 安装依赖
- `npm run dev` — 启动 shadcn 开发服务器（src-next/，端口 5173）
- `npm run dev:legacy` — 启动 MUI 开发服务器（src/，端口 5174）
- `npm run dev:local` — shadcn + 本地 API 服务（`local-api/`，端口 3100）同时启动
- `npm run build` — 构建 shadcn 生产版本
- `npm run build:legacy` — 构建 MUI 生产版本（`tsc -b && vite build`）
- `npm run lint` — ESLint 全仓库检查
- `npm run test` — Vitest watch 模式（根目录，旧 src/ 测试）
- `npm run test:run` — Vitest 单次运行（根目录）
- `npm run test -w src-next` — Vitest watch（src-next shadcn 测试，8 文件 31 用例）
- `npm run test:run -w src-next` — 单次运行 src-next 测试
- `npx eslint <file>` — 单文件快速验证（替代单测）
- `BROWSER=chrome npm run ladle` — Ladle 组件预览（src-next/，端口 61000，Chrome 打开）
- `npm run ladle:build` — 构建 Ladle 静态站点
- Ladle 页面预览：`src-next/src/stories/pages.stories.tsx`，包含 Personnel/Settings/Dashboard 三个真实页面（内置 API mock，无需启动后端）
- Ladle 组件预览：`src-next/src/stories/*.stories.tsx`（button/card/badge 等 shadcn 组件）
- `npm run test:e2e` — Playwright E2E 功能测试（chromium，自动启动 dev server）
- `npm run test:e2e:ui` — Playwright UI 模式（可视化选择/录制测试）

## Pre-commit 流水线

`.husky/pre-commit` 执行：

1. `lint-staged` — ESLint + Prettier（仅暂存文件）
2. `tsc --noEmit` — 类型检查

Prettier 配置：`semi: false`, `singleQuote: true`, `printWidth: 100`, `arrowParens: avoid`

## 架构速查

| 做什么             | 找这里                                                                        |
| ------------------ | ----------------------------------------------------------------------------- |
| 改路由 / 加页面    | `src-next/App.tsx` → BrowserRouter `<Routes>`                                 |
| 改导航跳转         | `src-next/components/app-sidebar.tsx` → nav items                             |
| 改项目状态流转     | `src/domain/projectStatusMachine.ts` → `canTransition` / `allowedTransitions` |
| 改项目数据模型     | `src/data/projects.ts` → `ProjectItem`                                        |
| 改 shadcn 组件     | `src-next/components/ui/` → 对应组件                                          |
| 改业务组件         | `src-next/components/` → domain 子目录                                        |
| 改任务页面         | `src-next/pages/tasks/`                                                       |
| 改全局样式与 Token | `src-next/index.css` → `@theme` + CSS 变量                                    |
| 改数据层           | `src-next/services/api.ts`                                                    |
| 改类型定义         | `src-next/types/`                                                             |
| 查 UI 设计规范     | `docs/01-product/design-spec-v2-shadcn.md`                                    |
| 查编码规范         | `docs/00-governance/coding-standards.md`                                      |
| 查完整文档索引     | `docs/README.md`                                                              |
| 查项目计划         | `docs/PLAN.md`                                                                |

## 项目约定

- **UI 主栈**: shadcn/ui (base-nova) + @base-ui/react（`src-next/`）
- **UI 副栈（维护模式）**: MUI v9 + Emotion（`src/`），仅修 bug，不新增功能
- **文件组织**: 页面组件 `src-next/components/{domain}/`，共享组件 `src-next/components/ui/`
- **数据流**: `data/` → `store/`（Zustand）→ `domain/` → `components/`，组件不直接操作 storage
- **路由**: BrowserRouter（`/tasks`, `/projects`, `/personnel` 等）
- **状态管理**: `src/store/projectStore.ts`（Zustand + `persist` 中间件），localStorage key `pm-projects-state-v1`
- **后端**: `local-api/`（Node.js + Express + better-sqlite3 + Prisma schema），端口 3100
- **样式**: Tailwind CSS v4 oklch 色值，`@theme` 指令
- **新增文件前**先看同级目录现有文件的模式，模仿其写法

## 红线约束

- **禁止**在 `src/`（MUI）中新增功能代码 — 新功能一律在 `src-next/` 开发
- **禁止**直接修改 `src-next/node_modules/` 下的任何文件
- **禁止**在子组件中直接 `localStorage.setItem` 修改状态 — 统一通过 `useProjectStore`
- **禁止**绕过 `canTransition` 守卫直接修改 `project.status`
- **禁止**在组件中重复实现状态机逻辑
- **禁止**修改 `src/data/` 中类型定义不同步更新 UI 消费方
- **修改前**先 `npm run lint`

## 测试约束

- **前端功能必须有 Playwright E2E 测试覆盖**，覆盖核心用户流程
- E2E 测试是验收前置条件，`npm run test:e2e` 未通过不得交付

## Squad 小组协作约束

- **强制评估**：任何开发任务先评估风险等级，L2/L3 自动触发 `squad-pre-dev-evaluation`（L1 豁免）
- **强制验收**：开发完成后必须调用 `squad-post-dev-review` skill（L1 低风险任务可豁免）
- **全票通过制**：评估/验收组中任一角色投反对票则流程中止（组长可仲裁）
- **独立输出**：子代理各自输出独立评估/验收报告，不得共享状态
- **先评估后计划**：评估组全票通过后方可编写实现计划
- **Karpathy 准则**：开发交付者编码前必须调用 `karpathy-guidelines` skill，四项准则贯穿编码全程（Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven Execution）
- **增量重审**：验收打回后仅派有问题的角色重审，避免全量重新调用

## 模型分配约束

- **强推理任务**（组长/技术评估员/开发交付者/代码质量验收员）→ v4-pro
- **模式化检查任务**（产品/UI评估员、功能/UI验收员）→ v4-flash
- **L1 极简任务** → v4-flash 或 opencode go

## 项目管理

完整流程见 `docs/00-governance/project-management-guide.md`

### 常用 gh CLI 命令

```bash
# 列出当前阶段任务
gh issue list --label "phase:1-foundation" --state open --json number,title,labels

# 查看 Issue
gh issue view <number>

# 创建 Issue
gh issue create --title "[Px-Tx] 任务名" --label "type:feature,phase:2-standards" \
  --milestone "Phase 2" --project "敏捷建店管理平台"

# 关闭 Issue（验收通过后）
gh issue close <number> --comment "验收通过，build/lint/test 通过"
```

### 工作流概览

```
Backlog → Ready → In Progress → AI Completed → In Review → Done
```

- **同一时间只有一个 In Progress**
- **质量门禁**: build/lint/test 通过 → Human 验收 → 关闭
- **Python 脚本**: `python scripts/gh-sync.py` 查看今日日志
- **全景扫描**: `python scripts/scan-tools.py` 查看 Skills/Agents/MCP 统计
- **保存报告**: `python scripts/scan-tools.py --md --save` 生成 `docs/SCAN-REPORT.md`
- **质量仪表盘**: `python scripts/scan-tools.py --report` 查看 KPI 和 Skill 使用率
- **保存仪表盘**: `python scripts/scan-tools.py --report --md --save` 生成 `docs/DASHBOARD.md`

### 标签体系（20 个）

- type: feature / bug / refactor / docs / test / infra / release
- phase: 1-foundation / 1.5-base-finish / 2-standards / 3-tasks / 4-procurement / 5-agent / 6-e2e
- priority: P0(阻塞) / P1(当前迭代) / P2(下次) / P3(排期外)
- status: blocked / in-review

## 任务结束协议

每次完成开发任务后，执行：

### A. 写入每日日志（含 Issue 引用）

将任务内容写入 `.workbuddy/memory/YYYY-MM-DD.md`，格式：

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

### B. 更新长期记忆（如有以下情况）

如有架构决策（ADR 级）、技术债务变化、关键文档索引变化，同步更新 `.workbuddy/memory/MEMORY.md`。

### C. 写入质量评价（新增）

将本次任务的质量数据写入 `.workbuddy/stats/YYYY-MM-DD.json`：

```json
{
  "task": "{任务简述}",
  "date": "{YYYY-MM-DD}",
  "risk_level": "L1/L2/L3",
  "human_interventions": 0,
  "requirement_deviation": 0.0,
  "spec_changes": 0,
  "rework_rounds": 0,
  "bugs_found_post_delivery": 0,
  "skills_called": ["skill1", "skill2"],
  "notes": ""
}
```

填写后运行 `python scripts/scan-tools.py --report` 确认仪表盘已更新。

## 深度引用

- 设计规范: @docs/01-product/design-spec-v2-shadcn.md
- 编码规范: @docs/00-governance/coding-standards.md
- 开发指南: @docs/03-engineering/development-guide.md
- 完整文档索引: @docs/README.md
