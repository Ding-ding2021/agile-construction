---
id: DOC-00-GOVERNANCE-CODING-STANDARDS
title: 📝 连锁门店建设管理系统 - 代码规范
owner: docs-maintainer
status: active
last_updated: 2026-05-05
source_of_truth: true
related_code:
  - eslint.config.js
  - .prettierrc
  - tsconfig.app.json
related_docs:
  - docs/00-governance/design-specification.md
  - docs/00-governance/component-development-contract.md
  - docs/03-engineering/development-guide.md
---

# 📝 连锁门店建设管理系统 - 代码规范

> **版本**: v2.0.0  
> **最后更新**: 2026-05-05  
> **基于设计规范**: docs/01-product/design-spec-v2-shadcn.md v2.1.0
> **执行补充（2026-03-31）**: 注释规则采用工程模式，关键逻辑/边界条件/复杂状态流需中文注释，不执行“每一行代码都注释”。

---

## 📋 目录

1. [代码风格](#1-代码风格)
2. [TypeScript 规范](#2-typescript-规范)
3. [React 组件规范](#3-react-组件规范)
4. [样式规范](#4-样式规范)
5. [文件组织](#5-文件组织)
6. [命名规范](#6-命名规范)
7. [注释规范](#7-注释规范)
8. [性能优化](#8-性能优化)
9. [Git 提交规范](#9-git-提交规范)
10. [双栈编码规范](#10-双栈编码规范)

---

## 1. 代码风格

### 1.1 ESLint 配置

项目使用 ESLint flat config（`eslint.config.js`），基于 `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`：

```javascript
// eslint.config.js — 实际配置（flat config）
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'src/generated/prisma']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // 质量防线
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',

      // React 规范
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-render': 'off',

      // TypeScript 严格
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
])
```

### 1.2 Prettier 配置

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

### 1.3 代码格式示例

```tsx
// ✅ 推荐：无分号、箭头参数无括号
function MyComponent({ prop1, prop2 }: MyComponentProps) {
  const [state, setState] = useState(initialValue)

  useEffect(() => {
    // 副作用逻辑
  }, [dependency])

  const handleClick = useCallback(() => {
    // 处理逻辑
  }, [])

  return (
    <div className="container">
      <h1>Title</h1>
      <p>Content</p>
    </div>
  )
}

// ❌ 避免：使用分号、箭头参数加括号、缺少类型标注
function myComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  return (
    <div className="container">
      <h1>Title</h1>
      <p>Content</p>
    </div>
  );
}
```

---

## 2. TypeScript 规范

### 2.1 类型定义原则

```typescript
// ✅ 推荐：使用 interface 定义对象类型
interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// ✅ 推荐：使用 type 定义联合类型和工具类型
type Status = 'pending' | 'active' | 'completed'
type PartialUser = Partial<User>
type UserWithId = Pick<User, 'id' | 'name'>

// ✅ 推荐：使用 enum 定义常量枚举
enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// ❌ 避免：使用 any 类型
const data: any = fetchData() // 不推荐
```

### 2.2 Props 类型定义

```tsx
// ✅ 推荐：清晰的 Props 接口
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  loading?: boolean
  className?: string
}

// ✅ 推荐：使用 React 内置类型
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

// ✅ 推荐：默认值解构
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  // 组件逻辑
}
```

### 2.3 类型守卫

```typescript
// ✅ 推荐：类型守卫函数
interface Project {
  type: 'project';
  name: string;
  progress: number;
}

interface Task {
  type: 'task';
  title: string;
  completed: boolean;
}

type Item = Project | Task;

function isProject(item: Item): item is Project {
  return item.type === 'project';
}

function isTask(item: Item): item is Task {
  return item.type === 'task';
}

// 使用
function renderItem(item: Item) {
  if (isProject(item)) {
    return <ProjectCard project={item} />;
  }
  if (isTask(item)) {
    return <TaskCard task={item} />;
  }
}
```

---

## 3. React 组件规范

### 3.1 组件结构

```tsx
// ✅ 推荐：标准组件结构
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MyComponentProps {
  id: string
  title: string
  onUpdate?: (id: string) => void
}

export function MyComponent({ id, title, onUpdate }: MyComponentProps) {
  // 1. Hooks
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<Data | null>(null)

  // 2. 计算属性 (useMemo)
  const formattedTitle = useMemo(() => {
    return title.toUpperCase()
  }, [title])

  // 3. 副作用 (useEffect)
  useEffect(() => {
    loadData()
  }, [id])

  // 4. 事件处理 (useCallback)
  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await fetchData(id)
      setData(result)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleClick = useCallback(() => {
    onUpdate?.(id)
    navigate(`/items/${id}`)
  }, [id, navigate, onUpdate])

  // 5. 渲染辅助函数
  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />
    if (!data) return <EmptyState />
    return <DataView data={data} />
  }

  // 6. 返回 JSX
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-6">
      <h2 className="text-xl font-bold text-white">{formattedTitle}</h2>
      {renderContent()}
      <Button onClick={handleClick} disabled={isLoading}>
        查看详情
      </Button>
    </div>
  )
}
```

### 3.2 自定义 Hook

```tsx
// ✅ 推荐：use 前缀，返回数组或对象
import { useState, useEffect, useCallback } from 'react'

interface UseDataOptions {
  autoFetch?: boolean
}

interface UseDataResult<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: UseDataOptions = {}
): UseDataResult<T> {
  const { autoFetch = true } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [...dependencies, autoFetch, fetchData])

  return { data, isLoading, error, refetch: fetchData }
}
```

### 3.3 组件组合

```tsx
// ✅ 推荐：组合优于继承
interface CardProps {
  children: React.ReactNode
  className?: string
}

function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-2xl bg-white/[0.04] border border-white/8 p-6', className)}>
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ children, className }: CardProps) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

Card.Title = function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-white">{children}</h3>
}

Card.Content = function CardContent({ children, className }: CardProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}

// 使用
;<Card>
  <Card.Header>
    <Card.Title>项目信息</Card.Title>
  </Card.Header>
  <Card.Content>
    <p>内容...</p>
  </Card.Content>
</Card>
```

---

## 4. 样式规范

### 4.1 Tailwind CSS 使用规范

```tsx
// ✅ 推荐：配合设计规范的样式
function GlassCard() {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-6 hover:bg-white/[0.06] hover:border-white/12 transition-all duration-200">
      内容
    </div>
  )
}

// ✅ 推荐：使用 cn 合并类名
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function Button({ variant = 'primary', className }: ButtonProps) {
  const baseStyles = 'rounded-xl h-10 px-6 font-medium transition-all duration-200'

  const variants = {
    primary: 'bg-[#154DD9] hover:bg-[#1a5ae8] text-white shadow-lg shadow-blue-900/30',
    secondary: 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10',
  }

  return <button className={cn(baseStyles, variants[variant], className)} />
}
```

### 4.2 响应式设计

```tsx
// ✅ 推荐：移动端优先的响应式
function ResponsiveGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 移动端 2 列，桌面端 4 列 */}
      {items.map(item => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  )
}

// ✅ 推荐：渐进式响应
function ResponsiveLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* 渐进式增加列数 */}
    </div>
  )
}
```

---

## 5. 文件组织

### 5.1 目录结构

```
src/
├── config/           # 路由、导航、特性注册表
│   ├── routes.ts    # 路由配置 + AppRoute 类型
│   └── navigation.ts # 统一导航函数
├── components/       # 页面组件 + 共享组件
│   ├── project/     # 项目管理域
│   ├── task/        # 任务管理域
│   ├── shared/      # 共享组件（AppSidebar, PageHeader, StatsCards 等）
│   │   ├── navigation/
│   │   ├── data-display/
│   │   └── mui/
│   └── router/      # AppRouter
├── domain/           # 纯领域逻辑（状态机、守卫）
│   ├── projectStatusMachine.ts
│   └── taskStateMachine.guards.ts
├── data/             # 静态/mock 数据
│   ├── projects.ts
│   └── taskManagement.data.ts
├── services/         # API 客户端、Repository
│   ├── repositories/
│   ├── api/
│   └── prisma.ts
├── store/            # Zustand 状态管理
│   └── projectStore.ts
├── config/           # 路由、导航
├── App.tsx           # 主应用编排
└── main.tsx          # 入口
```

### 5.2 文件命名

```
// ✅ 推荐
components/ui/button.tsx
components/features/projects/ProjectCard.tsx
pages/ProjectsPage.tsx
hooks/useProjects.ts
types/project.ts
lib/utils.ts

// ❌ 避免
components/Button.js
pages/projects.js
hooks/use_projects.ts
```

---

## 6. 命名规范

### 6.1 变量与函数

```typescript
// ✅ 推荐：camelCase
const userName = '张三'
const isLoading = false
const projectList = []

function fetchData() {}
function handleClick() {}
function formatDate() {}

// ✅ 推荐：布尔值前缀
const isActive = true
const hasPermission = true
const shouldUpdate = true
const canEdit = true

// ❌ 避免
const UserName = '张三'
const fetch_data = () => {}
```

### 6.2 组件与类型

```typescript
// ✅ 推荐：PascalCase
function ProjectCard() {}
function UserAvatar() {}

interface Project {}
interface User {}

type Status = 'active' | 'inactive'

// ✅ 推荐：组件名包含功能
function ProjectList() {}
function ProjectDetail() {}
function ProjectForm() {}

// ❌ 避免
function projectCard() {}
function PCard() {}
```

### 6.3 常量

```typescript
// ✅ 推荐：UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_PAGE_SIZE = 50
const DEFAULT_THEME = 'dark'

// ✅ 推荐：枚举
enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

// ✅ 推荐：配置对象
const CONFIG = {
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 10000,
  },
  pagination: {
    defaultSize: 10,
    maxSize: 50,
  },
} as const
```

---

## 7. 注释规范

### 7.1 注释执行规则

**执行标准：关键逻辑注释（工程模式）**

仅在边界条件、复杂流程、状态变更、关键业务逻辑处加注释，不要求每行都注释。

> **统一原则**：仅对**关键逻辑、业务边界、复杂状态流转**写中文注释。不要求 import 语句、简单变量声明、普通 JSX 的注释。

### 7.2 传统项目注释规范（参考）

```typescript
// ✅ 推荐：复杂逻辑注释
function calculateProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0

  // 计算已完成任务占比，权重按任务优先级调整
  const completedTasks = tasks.filter(t => t.completed)
  const totalWeight = tasks.reduce((sum, t) => sum + getTaskWeight(t), 0)
  const completedWeight = completedTasks.reduce((sum, t) => sum + getTaskWeight(t), 0)

  return Math.round((completedWeight / totalWeight) * 100)
}

// ✅ 推荐：JSDoc 文档
/**
 * 根据项目状态返回对应的颜色配置
 * @param status - 项目状态
 * @returns 颜色配置对象
 */
function getStatusColors(status: Status) {
  const colors = {
    [Status.PREPARATION]: { bg: 'bg-amber-500/10', dot: 'bg-amber-400', bar: 'bg-amber-500' },
    [Status.IN_PROGRESS]: { bg: 'bg-blue-500/10', dot: 'bg-blue-400', bar: 'bg-blue-500' },
    [Status.COMPLETED]: { bg: 'bg-emerald-500/10', dot: 'bg-emerald-400', bar: 'bg-emerald-500' },
  }
  return colors[status] || colors[Status.PREPARATION]
}
```

### 7.3 组件注释

````tsx
/**
 * 项目统计卡片组件
 *
 * @description 显示项目关键指标，支持点击筛选
 * @example
 * ```tsx
 * <StatCard
 *   label="进行中"
 *   value="85"
 *   change="+5"
 *   trend="up"
 *   icon={TrendingUp}
 *   color="blue"
 *   onClick={() => setFilter('active')}
 * />
 * ```
 */
interface StatCardProps {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
  color: 'blue' | 'emerald' | 'violet' | 'amber'
  onClick?: () => void
  isActive?: boolean
}

export function StatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  color,
  onClick,
  isActive = false,
}: StatCardProps) {
  // 组件实现
}
````

---

## 8. 性能优化

### 8.1 React 性能优化

```tsx
// ✅ 推荐：使用 useMemo 缓存计算结果
const sortedProjects = useMemo(() => {
  return [...projects].sort((a, b) => a.name.localeCompare(b.name))
}, [projects])

// ✅ 推荐：使用 useCallback 缓存函数
const handleProjectClick = useCallback(
  (projectId: string) => {
    navigate(`/projects/${projectId}`)
  },
  [navigate]
)

// ✅ 推荐：组件懒加载
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'))

// ✅ 推荐：虚拟滚动（长列表）
import { FixedSizeList as List } from 'react-window'

function LongList({ items }: { items: Item[] }) {
  return (
    <List height={600} itemCount={items.length} itemSize={100} width="100%">
      {({ index, style }) => (
        <div style={style}>
          <ItemCard item={items[index]} />
        </div>
      )}
    </List>
  )
}
```

### 8.2 避免常见问题

```tsx
// ❌ 避免：在 render 中创建新对象/数组
function BadComponent() {
  // 每次渲染都创建新数组
  const items = [{ id: 1 }, { id: 2 }]

  // 每次渲染都创建新函数
  const handleClick = () => {
    console.log('clicked')
  }

  return <Child items={items} onClick={handleClick} />
}

// ✅ 推荐：使用 useMemo 和 useCallback
function GoodComponent() {
  const items = useMemo(() => [{ id: 1 }, { id: 2 }], [])

  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return <Child items={items} onClick={handleClick} />
}
```

---

## 9. Git 提交规范

### 9.1 Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 9.2 Type 类型

| 类型       | 说明                                   |
| ---------- | -------------------------------------- |
| `feat`     | 新功能                                 |
| `fix`      | 修复 bug                               |
| `docs`     | 文档更新                               |
| `style`    | 代码格式（不影响代码运行）             |
| `refactor` | 重构（既不是新增功能，也不是修复 bug） |
| `perf`     | 性能优化                               |
| `test`     | 测试相关                               |
| `chore`    | 构建过程或辅助工具的变动               |

### 9.3 示例

```bash
# ✅ 推荐
feat(projects): 添加项目看板视图
- 实现看板拖拽功能
- 添加状态列配置
- 完善动画效果

fix(tasks): 修复任务进度计算错误
- 更新计算逻辑
- 添加边界测试

docs: 更新技术栈文档
- 添加 Supabase 配置说明
- 补充数据库表设计

style: 统一代码格式
- 应用 Prettier 格式化
- 修复 ESLint 警告

refactor(auth): 重构认证逻辑
- 提取 useAuth hook
- 简化登录流程

# ❌ 避免
git commit -m "修复"
git commit -m "update"
git commit -m "add feature"
```

---

## 10. 双栈编码规范

项目有两条独立的开发线，共享 `node_modules/prisma/local-api`：

### 10.1 src/（MUI 版 — 维护模式）

| 维度 | 规范 |
|------|------|
| UI 库 | MUI v9 + Emotion |
| 样式 | CSS 变量 `var(--pm-*)`，深色玻璃态 |
| 路由 | Hash 路由，`readRouteFromHash()` + `navigation.ts` |
| 状态 | Zustand + persist（`projectStore.ts`） |
| 数据 | Repository 模式（API 优先 + localStorage 降级） |
| CSS | 同文件 `.css`，不使用 CSS Modules |

### 10.2 src-next/（shadcn 版 — 活跃开发）

| 维度 | 规范 |
|------|------|
| UI 库 | shadcn/ui (base-nova) + @base-ui/react |
| 样式 | Tailwind CSS v4，oklch 色值 |
| 路由 | React Router v7 BrowserRouter |
| 图标 | lucide-react（通过 icon.tsx 适配层统一 16px） |
| 组件来源 | 必须来自 shadcn 官方 registry |
| 禁止事项 | `--pm-*` 旧品牌色、MUI `sx/style` prop、`bg-white/X` 透明度色值 |

---

## 📚 相关文档

- [设计规范](./docs/01-product/design-spec-v2-shadcn.md)
- [编码规范](./docs/00-governance/coding-standards.md)
- [开发指南](./docs/03-engineering/development-guide.md)

---

**维护者**: 技术团队  
**下次评审**: 2026-06-14
