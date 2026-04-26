# Agile Construction Platform

## 常用命令

- `npm install` — 安装依赖
- `npm run dev` — 启动 Vite 开发服务器
- `npm run build` — 类型检查 + 生产构建
- `npm run lint` — ESLint 全仓库检查
- `npm run test:run` — Vitest 测试套件

## 架构速查

| 做什么             | 找这里                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------- |
| 改路由 / 加页面    | `src/App.tsx` → `readRouteFromHash`                                                      |
| 改项目状态流转     | `src/domain/projectStatusMachine.ts` → `canTransition` / `allowedTransitions`            |
| 改项目数据模型     | `src/data/projects.ts` → `ProjectItem`                                                   |
| 改任务筛选 / 排序  | `src/components/task/taskManagement.selectors.ts`                                        |
| 改任务类型定义     | `src/components/task/taskManagement.types.ts`                                            |
| 改全局样式与 Token | `src/index.css` → `:root` 变量                                                           |
| 改标准对象         | `src/components/standard/standard.types.ts` → `ExecutionStandard` / `AcceptanceStandard` |
| 改任务模版编辑器   | `src/components/standard/TaskTemplateEditor.tsx`（复用 `TaskDetailPage` 样式）           |
| 查视觉基线         | `docs/00-governance/design-specification.md`                                             |
| 查编码规范         | `docs/00-governance/coding-standards.md`                                                 |

## 项目约定

- **文件组织**: 页面组件 `src/components/{domain}/`，共享组件 `src/components/shared/`
- **数据流**: `data/` → `domain/` → `components/`，组件不直接操作 storage
- **路由**: Hash 路由 (`#/projects`, `#/tasks`, `#/personnel` 等)
- **状态管理**: `App.tsx` 持有 `projectsState` + `projectStatusLogs`，persist 到 localStorage
- **后端**: `local-api/` (Node.js + Express + better-sqlite3 + Prisma)
- **样式**: CSS 变量体系 (`--pm-*`)，深色玻璃态视觉基线
- **新增文件前**先看同级目录现有文件的模式，模仿其写法

## 红线约束

- **禁止**在子组件中直接 `localStorage.setItem` 修改项目/任务状态
- **禁止**绕过 `canTransition` 守卫直接修改 `project.status`
- **禁止**在组件中重复实现状态机逻辑
- **禁止**修改 `src/data/` 中类型定义不同步更新 UI 消费方
- **禁止**修改 `src/domain/` 层代码（人工设计的类型和状态机）
- **修改前**先 `npm run lint`，每次只改一个任务

## 任务结束协议

**每次完成用户的一个开发任务后，必须执行以下步骤：**

### A. 写入每日日志

调用 `task-memory` 工具，将任务内容写入 `.workbuddy/memory/YYYY-MM-DD.md`。

日志条目格式：

```markdown
## {任务简述}

### 问题/需求

{描述}

### 修改内容

- {逐条列出}

### 验证

- lint: {结果}
- build: {结果}
```

### B. 更新长期记忆（如有以下情况）

如有**架构决策**（ADR 级）、**技术债务变化**、**关键文档索引变化**，调用 `task-memory` 工具同步更新 `.workbuddy/memory/MEMORY.md`。

## 深度引用

- 设计规范: @docs/00-governance/design-specification.md
- 编码规范: @docs/00-governance/coding-standards.md
- 开发指南: @docs/03-engineering/development-guide.md
- 完整文档索引: @docs/README.md
