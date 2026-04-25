# 📝 连锁门店建设管理系统 - 代码规范

> **版本**: v1.0.0  
> **最后更新**: 2026-03-14  
> **基于设计规范**: DESIGN_SPECIFICATION.md v2.0.0
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

---

## 1. 代码风格

### 1.1 ESLint 配置

**推荐规则：**

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/prop-types': 'off',
  },
}
```

### 1.2 Prettier 配置

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 1.3 代码格式示例

```tsx
// ✅ 推荐
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

// ❌ 避免
function myComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue)
  return (
    <div className="container">
      <h1>Title</h1>
      <p>Content</p>
    </div>
  )
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
├── app/                      # 应用入口
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首页
│   └── routes.tsx           # 路由配置
├── components/               # 通用组件
│   ├── ui/                  # UI 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/              # 布局组件
│   │   ├── DashboardLayout.tsx
│   │   └── Sidebar.tsx
│   └── features/            # 功能组件
│       ├── projects/
│       └── tasks/
├── pages/                   # 页面组件
│   ├── ProjectsPage.tsx
│   ├── ProjectDetailPage.tsx
│   └── ...
├── hooks/                   # 自定义 Hooks
│   ├── useData.ts
│   ├── useProjects.ts
│   └── ...
├── lib/                     # 工具函数
│   ├── utils.ts
│   ├── supabase.ts
│   └── ...
├── types/                   # TypeScript 类型定义
│   ├── index.ts
│   ├── project.ts
│   └── ...
├── constants/               # 常量
│   ├── index.ts
│   └── routes.ts
├── styles/                  # 全局样式
│   └── globals.css
└── assets/                  # 静态资源
    ├── images/
    └── icons/
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

### 7.1 产品经理学习项目特殊规则：每一行代码都需要中文注释

**⚠️ 重要：本项目专为产品经理学习编程设计，所有代码文件的每一行都必须添加中文注释！**

#### 7.1.1 行内注释规范

```typescript
// ✅ 推荐：每一行都有清晰的中文解释
import { clsx } from 'clsx'; // 导入 clsx 库，用于动态拼接 CSS 类名
import type { PaginationData } from './types'; // 导入类型定义，用于类型检查

// 自定义向左箭头图标组件
const ChevronLeft = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
    <path d="M10 12L5 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 定义组件属性类型接口
interface PaginationInfoProps {
  data: PaginationData; // 接收分页数据对象
}

// 分页信息组件：显示总记录数和当前页码
export function PaginationInfo({ data }: PaginationInfoProps) {
  return (
    <div className="flex items-center">
      <span className="text-xs text-white/40 leading-[16px]">
        共 {data.totalItems} 条记录，当前第 {data.currentPage} / {data.totalPages} 页
      </span>
    </div>
  );
}
```

#### 7.1.2 注释内容要求

| 代码类型     | 注释要求             | 示例                                                                               |
| ------------ | -------------------- | ---------------------------------------------------------------------------------- |
| **导入语句** | 说明导入的内容和用途 | `import { useState } from 'react'; // 导入 React 的状态管理 Hook`                  |
| **变量声明** | 说明变量的作用       | `const [isLoading, setIsLoading] = useState(false); // 定义加载状态，初始为未加载` |
| **函数定义** | 说明函数的功能       | `function fetchData() { // 从后端 API 获取数据`                                    |
| **条件判断** | 说明判断的逻辑       | `if (data.currentPage === 1) { // 如果是第一页`                                    |
| **循环语句** | 说明循环的目的       | `pages.map((page) => { // 遍历所有页码，生成按钮`                                  |
| **JSX 元素** | 说明组件的作用       | `<PaginationInfo data={data} /> // 渲染分页信息组件`                               |
| **CSS 类名** | （可选，复杂时说明） | `className="bg-[#154DD9]" // 使用品牌蓝色作为背景`                                 |

#### 7.1.3 注释位置

```typescript
// ✅ 推荐：注释在代码上方或行尾
import { useState } from 'react'; // 导入状态管理 Hook

// 定义组件属性接口
interface ButtonProps {
  label: string; // 按钮显示的文字
  onClick: () => void; // 点击事件处理函数
}

// 按钮组件：可点击的交互按钮
export function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick} // 点击时触发传入的函数
      className="px-4 py-2 bg-blue-500 text-white" // 蓝色背景白色文字
    >
      {label}
    </button>
  );
}
```

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

## 📚 相关文档

- [设计规范](./DESIGN_SPECIFICATION.md)
- [技术栈文档](./TECHNOLOGY_STACK.md)
- [项目结构](./PROJECT_STRUCTURE.md)
- [开发指南](./DEVELOPMENT_GUIDE.md)

---

**维护者**: 技术团队  
**下次评审**: 2026-06-14
