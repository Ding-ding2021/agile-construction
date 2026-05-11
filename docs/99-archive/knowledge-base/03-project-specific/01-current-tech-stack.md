---
title: 01 Current Tech Stack
status: superseded
last_updated: 2026-05-05
superseded_by: docs/ (see docs/README.md for current docs)
---

# 当前项目技术栈

## 核心技术

| 类别   | 技术        | 版本   | 用途             |
| ------ | ----------- | ------ | ---------------- |
| 框架   | React       | 18.x   | UI框架           |
| 语言   | TypeScript  | 5.x    | 类型安全         |
| 构建   | Vite        | 5.x    | 开发服务器与打包 |
| 样式   | TailwindCSS | 3.x    | 原子化CSS        |
| UI组件 | shadcn/ui   | latest | 基础组件库       |
| 图表   | Recharts    | 2.x    | 数据可视化       |
| 路由   | Hash Router | -      | 前端路由         |

## 项目结构

```
src/
├── components/          # 组件
│   ├── project/        # 项目相关组件
│   ├── task/           # 任务相关组件
│   ├── personnel/      # 人员相关组件
│   ├── digital/        # 数字员工组件
│   ├── settings/       # 设置组件
│   └── ui/             # 基础UI组件(shadcn)
├── domain/             # 领域层
│   └── projectStatusMachine.ts  # 项目状态机
├── data/               # 数据层
│   └── projects.ts     # 项目数据与Mock
├── hooks/              # 自定义Hooks
├── types/              # 类型定义
├── lib/                # 工具函数
├── assets/             # 静态资源
└── main.tsx            # 入口
```

## 状态管理现状

当前使用 **React Hooks + Context + localStorage**

```typescript
// App.tsx 核心状态
const [projectsState, setProjectsState] = useState<ProjectsState>(() => {
  // 从 localStorage 恢复
  const saved = localStorage.getItem('pm-projects-state-v1')
  return saved ? JSON.parse(saved) : { projects: mockProjects }
})

// 持久化
useEffect(() => {
  localStorage.setItem('pm-projects-state-v1', JSON.stringify(projectsState))
}, [projectsState])
```

## 路由方案

```typescript
// App.tsx 路由实现
type AppRoute =
  | { name: 'projects' }
  | { name: 'project-detail'; projectId: string }
  | { name: 'tasks'; templateId?: string }
  | { name: 'personnel' }
  | { name: 'digital-employee' }
  | { name: 'settings' }

// Hash 路由读取
function readRouteFromHash(): AppRoute {
  const hash = window.location.hash.slice(1)
  // 解析 hash 返回对应路由
}
```

## 构建配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## 开发命令

```bash
npm install       # 安装依赖
npm run dev       # 本地开发
npm run build     # 生产构建
npm run lint      # ESLint检查
npm run preview   # 预览构建产物
```

## 依赖说明

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "recharts": "^2.x",
    "lucide-react": "图标库",
    "@radix-ui/*": "shadcn/ui 底层",
    "class-variance-authority": "组件变体",
    "clsx": "类名合并",
    "tailwind-merge": "Tailwind类合并"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "eslint": "代码检查",
    "vitest": "单元测试"
  }
}
```

## 演进建议

| 优先级 | 改进项           | 理由                           |
| ------ | ---------------- | ------------------------------ |
| 高     | 引入 React Query | 服务端状态管理更专业           |
| 中     | 接入真实后端     | 当前 localStorage 仅适合演示   |
| 中     | 状态机扩展       | 任务、人员等模块也可使用状态机 |
| 低     | 引入 Zustand     | 全局状态更简洁                 |
