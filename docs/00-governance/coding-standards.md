---
id: DOC-00-GOVERNANCE-CODING-STANDARDS
number: GOV-002
domain: governance
category: code-standards
title: 代码规范
owner: docs-maintainer
status: active
last_updated: 2026-05-11
source_of_truth: true
ai_contract: docs/ai/contracts/coding-standards.md
related_code:
  - eslint.config.js
  - .prettierrc
  - tsconfig.app.json
related_docs:
  - docs/00-governance/testing-standards.md
  - docs/00-governance/code-review-checklist.md
  - docs/00-governance/component-development-contract.md
---

# 代码规范

> 版本: v3.0.0
> 最后更新: 2026-05-11
> 工具链: TypeScript strict + ESLint flat config + Prettier + Tailwind CSS v4

---

## 1. 铁律

| #   | 规则                                                             | 强制 |
| --- | ---------------------------------------------------------------- | ---- |
| 1.1 | 禁止使用 `any` 类型（必须 `eslint-disable` + 注释理由）          | 强制 |
| 1.2 | 禁止硬编码色值/间距/圆角（全部使用设计 Token 或 Tailwind class） | 强制 |
| 1.3 | 禁止绕过状态机守卫直接修改状态                                   | 强制 |
| 1.4 | 禁止在子组件中直接操作 `localStorage`                            | 强制 |
| 1.5 | 路由跳转使用 `navigation.ts` 的 `goTo*` 函数                     | 强制 |
| 1.6 | 数据操作通过 Repository / Store 层                               | 强制 |
| 1.7 | 禁止 `console.log`（仅允许 `warn` / `error` / `info`）           | 强制 |
| 1.8 | 禁止 `@ts-ignore` / `@ts-expect-error`（除非有关联 Issue）       | 强制 |

---

## 2. 工具配置

### 2.1 ESLint（`eslint.config.js`）

```javascript
// 关键规则（非完整配置）
'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
'no-debugger': 'error',
'react-hooks/exhaustive-deps': 'warn',
'@typescript-eslint/no-explicit-any': 'warn',        // 目标：改为 error
'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],  // 目标：改为 error
```

忽略目录：`dist`, `src/generated/prisma`

### 2.2 Prettier（`.prettierrc`）

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

### 2.3 TypeScript（`tsconfig.app.json`）

| 配置                 | 值                                          | 说明                             |
| -------------------- | ------------------------------------------- | -------------------------------- |
| `strict`             | `true`                                      | 严格模式                         |
| `noUnusedLocals`     | `true`                                      | 禁止未使用的局部变量             |
| `noUnusedParameters` | `true`                                      | 禁止未使用的参数（`_` 前缀豁免） |
| path alias           | `@/*` → `src/*` 和 `@next/*` → `src-next/*` | 双栈别名                         |

---

## 3. TypeScript 规范

### 3.1 类型定义

| 用途          | 方式                 | 示例                        |
| ------------- | -------------------- | --------------------------- |
| 对象类型      | `interface`          | `interface Project { ... }` |
| 联合/工具类型 | `type`               | `type Status = 'a' \| 'b'`  |
| 常量枚举      | `enum` 或 `as const` | `enum Priority { ... }`     |

### 3.2 Props 类型

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}
```

- Props 必须显式定义接口（禁止 `React.FC`）
- 默认值通过解构赋值，不在函数体内赋值
- 回调命名统一为 `onXxx` 格式

### 3.3 类型守卫

```typescript
// 推荐：使用 discriminated union + 类型守卫
function isProject(item: Item): item is Project {
  return item.type === 'project'
}
```

---

## 4. React 组件规范

### 4.1 组件结构

```
1. imports（外部 → 内部）
2. interface Props
3. export function Component({ prop1, prop2 }: Props)
4.   hooks（useState → useMemo → useCallback → useEffect）
5.   事件处理（handleXxx）
6.   渲染辅助函数（renderXxx）
7.   return JSX
```

### 4.2 自定义 Hook

- 命名：`use<功能>`，返回对象或元组
- 职责：封装有状态逻辑，不包含 JSX

### 4.3 组件组合

- 使用复合组件模式（`Card.Header`、`Card.Content`）
- 组合优于继承
- 单个组件超过 300 行必须拆分

---

## 5. 样式规范

### 5.1 Tailwind CSS

```typescript
// 推荐：使用 cn() 合并类名
import { cn } from '@/lib/utils'

function Button({ variant = 'primary', className }: ButtonProps) {
  const base = 'rounded-xl h-10 px-6 font-medium transition-all'
  const variants = {
    primary: 'bg-[#154DD9] hover:bg-[#1a5ae8] text-white',
    secondary: 'bg-white/5 hover:bg-white/10 text-white/70',
  }
  return <button className={cn(base, variants[variant], className)} />
}
```

- 所有色值/间距/圆角使用 Tailwind class 或设计 Token
- 禁止在 className 中硬编码 `rgba()`、`#` 色值（除非是极少数无法映射的例外）
- 使用 `cn()` 函数合并类名

### 5.2 响应式

- 移动端优先：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- 断点：sm(640) / md(768) / lg(1024) / xl(1280)

### 5.3 暗色模式

- 使用 `dark:` 前缀覆盖所有表层颜色
- 当前主题为深色，后续支持 light 切换

---

## 6. 文件组织

### 6.1 目录结构

```
src/
├── config/           # 路由、导航、特性注册表
├── components/       # 页面组件 + 共享组件
│   ├── project/      # 项目管理域
│   ├── task/         # 任务管理域
│   ├── shared/       # 共享组件
│   └── router/       # AppRouter
├── domain/           # 纯领域逻辑（状态机、守卫）
├── data/             # 静态/mock 数据
├── services/         # API 客户端、Repository
│   ├── repositories/
│   ├── api/
│   └── errors/
├── store/            # Zustand 状态管理
├── App.tsx
└── main.tsx
```

### 6.2 文件命名

| 类型      | 格式           | 示例              |
| --------- | -------------- | ----------------- |
| 组件文件  | PascalCase     | `ProjectCard.tsx` |
| Hook 文件 | useXxx         | `useProjects.ts`  |
| 工具文件  | camelCase      | `utils.ts`        |
| 类型文件  | camelCase      | `types.ts`        |
| 样式文件  | 与被测文件同名 | `ProjectCard.css` |

---

## 7. 命名规范

### 7.1 标识符

| 类型      | 格式                           | 示例                            |
| --------- | ------------------------------ | ------------------------------- |
| 变量/函数 | `camelCase`                    | `userName`, `fetchData()`       |
| 组件/类型 | `PascalCase`                   | `ProjectCard`, `interface User` |
| 常量      | `UPPER_SNAKE_CASE`             | `MAX_PAGE_SIZE`                 |
| 枚举      | PascalCase 值 UPPER            | `enum Status { ACTIVE }`        |
| 布尔变量  | `is`/`has`/`should`/`can` 前缀 | `isActive`, `hasPermission`     |

### 7.2 文件名与组件名一致

```typescript
// ✅
// ProjectDetail.tsx
export function ProjectDetail() {}

// ❌
// index.tsx
// 或文件名与组件名不一致
```

---

## 8. 注释规范

### 8.1 执行原则

**仅对关键逻辑、业务边界、复杂状态流转写中文注释。** 不要求以下内容注释：

- `import` 语句
- 简单变量声明
- 普通 JSX
- 明显的循环/条件

### 8.2 何时注释

```typescript
// 需要注释的场景：

// 1. 复杂计算逻辑
// 计算已完成任务占比，权重按任务优先级调整
const progress = (completedWeight / totalWeight) * 100

// 2. 边界条件
// 空任务列表直接返回，避免除零
if (tasks.length === 0) return 0

// 3. 非显而易见的业务规则
// 状态"已归档"不可再流转——业务要求
if (status === 'archived') return false

// 4. JSDoc 对外接口
/** 根据项目状态返回对应的颜色配置 */
function getStatusColors(status: Status): ColorConfig
```

### 8.3 禁止事项

- 禁止行末注释（`const x = 1 // x 是 1`）
- 禁止逐行注释（每行都加注释）
- 禁止中英混写注释（全中文或全英文）

---

## 9. 架构约束

### 9.1 分层依赖规则

```
components/ → store/ → services/ → domain/
      ↓                          ↓
  共享组件不可引用           数据/领域层
  服务层或领域层              禁止引用组件
```

### 9.2 状态管理

- 组件内部状态：`useState`
- 跨组件共享：Zustand Store
- 禁止 Props drilling 超过 2 层
- 动画状态：CSS transition，禁止 `useEffect` + `setTimeout`

### 9.3 数据流

```
用户操作 → Store/Repository（写本地 + 远程同步）
   ↓
组件通过 Store selector 订阅变更
   ↓
状态机守卫验证操作合法性
```

---

## 10. 双栈编码规范

项目有两条独立的开发线：

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

| 维度     | 规范                                                              |
| -------- | ----------------------------------------------------------------- |
| UI 库    | shadcn/ui (base-nova) + @base-ui/react                            |
| 样式     | Tailwind CSS v4，oklch 色值                                       |
| 路由     | React Router v7 BrowserRouter                                     |
| 图标     | lucide-react（通过 `icon.tsx` 适配层统一 16px）                   |
| 组件来源 | 必须来自 shadcn 官方 registry                                     |
| 禁止事项 | `--pm-*` 旧品牌色、MUI `sx`/`style` prop、`bg-white/X` 透明度色值 |

---

## 11. Git 提交规范

### 11.1 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 11.2 Type

| 类型       | 说明          |
| ---------- | ------------- |
| `feat`     | 新功能        |
| `fix`      | Bug 修复      |
| `docs`     | 文档更新      |
| `refactor` | 重构          |
| `style`    | 代码格式      |
| `perf`     | 性能优化      |
| `test`     | 测试相关      |
| `chore`    | 构建/工具变动 |

### 11.3 示例

```bash
# ✅
feat(projects): 添加项目看板视图
fix(tasks): 修复任务进度计算错误
docs: 更新技术栈文档
refactor(auth): 重构认证逻辑

# ❌
git commit -m "修复"
git commit -m "update"
git commit -m "add stuff"
```

### 11.4 分支命名

```
<type>/<scope>-<description>
# 示例：feat/projects-kanban-view
# 示例：fix/task-progress-calculation
```

---

## 12. 附则

### 12.1 自检清单

提交前确认：

- [ ] 无 `any` 类型（或有 `eslint-disable` 注释说明理由）
- [ ] 无硬编码色值/尺寸
- [ ] 命名符合规范
- [ ] 无 `console.log`
- [ ] 无死代码（定义了但未使用）
- [ ] 无过度抽象
- [ ] `npm run lint` 0 errors
- [ ] `npm run build` 0 errors

### 12.2 相关文档

- [代码规范](./coding-standards.md)（本文）
- [测试规范](./testing-standards.md)
- [Code Review Checklist](./code-review-checklist.md)
- [组件开发契约](./component-development-contract.md)
