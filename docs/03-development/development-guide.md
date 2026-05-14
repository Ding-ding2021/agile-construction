---
id: DOC-03-ENGINEERING-DEVELOPMENT-GUIDE
number: DEV-012
domain: development
category: guide
title: 🚀 数字营建项目 - 开发指南
owner: docs-maintainer
status: active
last_updated: 2026-04-16
source_of_truth: true
related_code: []
related_docs: []
---

# 🚀 数字营建项目 - 开发指南

> **版本**: v2.1.0  
> **最后更新**: 2026-04-24  
> **基于设计规范**: docs/00-governance/design-specification.md v1.1.0
> **技术栈统一声明（2026-04-24）**: 前端 `React + TypeScript + Tailwind`；V1 后端 `Node.js + Express + SQLite + Prisma`（轻量方案，快速验证）；V2 后端迁移 `PostgreSQL + Redis`。

---

## 📋 目录

1. [快速开始](#1-快速开始)
2. [后端开发](#2-后端开发)
3. [数据库开发](#3-数据库开发)
4. [前端开发](#4-前端开发)
5. [设计规范遵循](#5-设计规范遵循)
6. [常见问题](#6-常见问题)
7. [部署指南](#7-部署指南)

---

## 1. 快速开始

### 1.1 环境要求

```bash
# 必需
- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0
- Git

推荐
- VS Code（配合推荐插件）
```

### 1.2 项目初始化

```bash
# 1. 克隆项目
git clone <repository-url>
cd 002

# 2. 安装依赖
npm install
# 或
pnpm install

# 3. 初始化数据库
npm run db:init
# 或
pnpm db:init

# 4. 启动后端服务器（新终端）
npm run server:dev
# 或
pnpm server:dev

# 5. 启动前端开发服务器（新终端）
npm run dev
# 或
pnpm dev

# 6. 打开浏览器访问
# 前端: http://localhost:5173
# 后端: http://localhost:3001
# 数据库管理: http://localhost:5555
```

### 1.3 项目脚本

```json
// package.json 脚本
{
  "scripts": {
    "dev": "vite", // 启动前端开发服务器
    "build": "tsc && vite build", // 构建生产版本
    "preview": "vite preview", // 预览构建结果
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit", // 类型检查
    "test": "vitest", // 启动 Vitest 测试（watch 模式）
    "test:run": "vitest run", // 单次运行所有测试
    "test:coverage": "vitest run --coverage", // 运行测试并生成覆盖率报告

    // 新增：后端和数据库相关
    "server:dev": "tsx watch server/index.ts", // 启动后端开发服务器
    "server:build": "tsc -p tsconfig.server.json", // 构建后端
    "server:start": "node dist/server/index.js", // 启动生产后端

    "db:init": "prisma generate && prisma migrate dev", // 初始化数据库
    "db:migrate": "prisma migrate dev", // 创建并应用数据库迁移
    "db:studio": "prisma studio", // 启动 Prisma Studio（数据库 GUI）
    "db:seed": "tsx prisma/seed.ts" // 填充初始数据
  }
}
```

### 1.4 测试与 CI

**测试框架**: Vitest + React Testing Library + jsdom

```bash
# 单次运行测试
npm run test:run

# 运行测试并查看覆盖率
npm run test:coverage

# 覆盖率报告将输出到 coverage/ 目录
# 覆盖率阈值配置在 vitest.config.ts（当前: lines≥40%, statements≥40%, functions≥30%, branches≥30%）
```

**Pre-commit 门禁**（自动强制执行）:

```
1. lint-staged → ESLint + Prettier（仅暂存文件）
2. tsc --noEmit（类型检查）
```

**CI 流水线**（GitHub Actions，在 `.github/workflows/ci.yml`）:

```yaml
触发条件: pull_request + push to main
步骤顺序:
  1. Lint（核心文件）
  2. Verify stage3 docs
  3. Type & Build（tsc -b && vite build）
  4. Run unit tests（npm run test:run）
  5. Run tests with coverage（npm run test:coverage）
  6. Upload coverage report（artifact: coverage-report）
```

所有步骤必须通过方可合并 PR。

---

## 2. 后端开发

### 2.1 后端项目结构

```
server/
├── index.ts              # 服务器入口
├── routes/               # 路由
│   ├── index.ts         # 路由聚合
│   ├── projects.ts      # 项目接口
│   ├── personnel.ts     # 人员接口
│   └── settings.ts      # 设置接口
├── controllers/          # 控制器
│   ├── projects.ts
│   ├── personnel.ts
│   └── settings.ts
├── middleware/           # 中间件
│   ├── error.ts         # 错误处理
│   └── cors.ts          # CORS 配置
└── lib/                 # 工具函数
    └── prisma.ts       # Prisma 客户端
```

### 2.2 创建后端接口步骤

**步骤 1: 创建路由文件**

```typescript
// server/routes/projects.ts
import express from 'express'
import { getProjects, createProject } from '../controllers/projects'

const router = express.Router()

// 获取所有项目
router.get('/', getProjects)

// 创建新项目
router.post('/', createProject)

export default router
```

**步骤 2: 创建控制器**

```typescript
// server/controllers/projects.ts
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export async function getProjects(req: Request, res: Response) {
  try {
    const projects = await prisma.project.findMany()
    res.json(projects)
  } catch (error) {
    res.status(500).json({ error: '获取项目失败' })
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const { code, name, description } = req.body
    const project = await prisma.project.create({
      data: {
        code,
        name,
        description,
      },
    })
    res.status(201).json(project)
  } catch (error) {
    res.status(500).json({ error: '创建项目失败' })
  }
}
```

**步骤 3: 聚合路由**

```typescript
// server/routes/index.ts
import express from 'express'
import projectsRouter from './projects'
import personnelRouter from './personnel'

const router = express.Router()

router.use('/projects', projectsRouter)
router.use('/personnel', personnelRouter)

export default router
```

**步骤 4: 主服务器文件**

```typescript
// server/index.ts
import express from 'express'
import cors from 'cors'
import routes from './routes'

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API 路由
app.use('/api', routes)

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 后端服务器运行在 http://localhost:${PORT}`)
})
```

### 2.3 测试 API

```bash
# 使用 curl 测试健康检查
curl http://localhost:3001/api/health

# 使用 curl 测试获取项目
curl http://localhost:3001/api/projects

# 使用 curl 创建项目
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{"code":"PRJ001","name":"测试项目"}'
```

---

## 3. 数据库开发

### 3.1 Prisma 基础

Prisma 是我们的 ORM（对象关系映射）工具，它让数据库操作变得简单安全。

### 3.2 数据库 Schema 定义

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// 项目表
model Project {
  id          String   @id @default(uuid())
  code        String   @unique
  name        String
  description String?
  status      String   @default("前期准备")
  progress    Int      @default(0)
  startDate   DateTime?
  endDate     DateTime?
  latitude    Float?
  longitude   Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 人员表
model Personnel {
  id          String   @id @default(uuid())
  name        String
  email       String   @unique
  role        String
  department  String
  status      String   @default("active")
  lastLogin   DateTime?
  isExternal  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 3.3 数据库操作流程

```bash
# 1. 修改 schema.prisma 文件后，创建迁移
npm run db:migrate

# 2. 打开数据库管理界面（像 Excel 一样）
npm run db:studio

# 3. 填充初始数据（如果需要）
npm run db:seed
```

### 3.4 Prisma Client 使用

```typescript
// server/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

```typescript
// 查询所有项目
const projects = await prisma.project.findMany()

// 查询单个项目
const project = await prisma.project.findUnique({
  where: { id: 'project-id' },
})

// 创建项目
const newProject = await prisma.project.create({
  data: {
    code: 'PRJ001',
    name: '新项目',
    status: '前期准备',
  },
})

// 更新项目
const updatedProject = await prisma.project.update({
  where: { id: 'project-id' },
  data: { progress: 50 },
})

// 删除项目
await prisma.project.delete({
  where: { id: 'project-id' },
})
```

### 3.5 Prisma Studio（推荐使用）

Prisma Studio 是一个图形化的数据库管理工具，就像 Excel 一样简单：

```bash
# 启动 Prisma Studio
npm run db:studio
```

然后浏览器会自动打开 `http://localhost:5555`，你可以：

- ✅ 查看所有数据
- ✅ 添加新记录
- ✅ 编辑现有记录
- ✅ 删除记录
- ✅ 筛选和搜索数据

---

## 4. 前端开发

### 4.1 组件开发

详细的组件开发指南请参考之前的内容，这里重点讲解如何连接后端。

### 4.2 连接后端 API

**步骤 1: 创建 API 客户端**

```typescript
// src/lib/api.ts
const API_BASE = 'http://localhost:3001/api'

export async function fetchProjects() {
  const response = await fetch(`${API_BASE}/projects`)
  if (!response.ok) throw new Error('获取项目失败')
  return response.json()
}

export async function createProject(data: { code: string; name: string }) {
  const response = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('创建项目失败')
  return response.json()
}
```

**步骤 2: 在组件中使用**

```typescript
// src/pages/ProjectsPage.tsx
import { useState, useEffect } from 'react';
import { fetchProjects, createProject } from '@/lib/api';

export function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        setIsLoading(true);
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error('加载项目失败:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      {/* 展示项目 */}
    </div>
  );
}
```

### 4.3 页面开发

详细的页面开发指南请参考之前的内容。

---

## 5. 设计规范遵循

### 5.1 色彩使用检查清单

使用任何组件/页面时，确保：

颜色

- [ ] 使用品牌蓝 #154DD9 为主色
- [ ] 使用玻璃态背景 bg-white/[0.04]
- [ ] 背景色使用 #030B1A（主背景）
- [ ] 侧边栏使用 #0A2363

圆角

- [ ] 按钮使用 rounded-xl (12px)
- [ ] 卡片使用 rounded-2xl (16px)

动画

- [ ] 过渡动画使用 transition-all duration-200
- [ ] 悬停状态有明确视觉反馈

玻璃态

- [ ] 卡片使用 bg-white/[0.04] + border-white/8
- [ ] 悬停态使用 bg-white/[0.06] + border-white/12

---

## 6. 常见问题

### 6.1 开发问题

**Q: 如何启动完整开发环境？**

A: 需要打开三个终端：

```bash
# 终端 1: 启动后端
npm run server:dev

# 终端 2: 启动前端
npm run dev

# 终端 3（可选）: 打开数据库管理
npm run db:studio
```

**Q: 数据库文件在哪里？**

A: SQLite 数据库文件在 `prisma/dev.db`，这是一个文件，可以直接复制备份。

**Q: 如何重置数据库？**

A:

```bash
# 删除数据库文件
rm prisma/dev.db

# 重新初始化
npm run db:init
```

**Q: 如何合并 Tailwind 类名？**

A: 使用 `cn` 函数：

```typescript
import { cn } from '@/lib/utils';

const Button = ({ className, ...props }) => (
  <button className={cn('base-class', className)} {...props} />
);
```

### 6.2 设计问题

**Q: 设计稿和代码不一致？**

A: 检查清单：

1. 颜色值是否正确（#154DD9）
2. 圆角是否使用 rounded-xl / rounded-2xl
3. 是否使用了玻璃态效果
4. 动画时间是否为 200ms

### 6.3 路由问题复盘（2026-04-09）

**问题现象**：点击“采购管理”后进入了“项目管理”页。  
**根因**：Hash 路由仅匹配 `#/procurement` 精确路径，遇到 `#/procurement/*` 会回落到默认 `#/projects`；同时部分导航激活与跳转配置存在不一致，增加了误判风险。

**修复动作**：

1. 在 `App.tsx` 将采购路由改为兼容 `#/procurement` 与 `#/procurement/*`。
2. 统一侧边栏采购入口激活逻辑，确保 `#/procurement` 与子路径识别一致。
3. 补齐缺失入口的 `href: '#/procurement'`（已完成）。

**防再犯检查清单（每次改导航必查）**：

- [ ] 文案为“采购管理”的导航项必须包含 `href: '#/procurement'`。
- [ ] `readRouteFromHash` 必须覆盖主路径 + 子路径（`startsWith`）两类匹配。
- [ ] 侧栏 `isActive` 条件与路由解析规则保持一致。
- [ ] 提交前执行 `npm run build`，并手工验证“项目/任务/标准详情”三个入口跳转。

### 6.4 页面框架一致性规范（2026-04-09）

**统一原则**：全站页面的侧边栏与页头必须复用公共组件，不允许页面内复制独立实现。

**强制要求**：

- [ ] 侧边栏统一使用 `PersonnelSidebar`（或后续同级公共侧栏组件）。
- [ ] 页头统一使用 `UnifiedHeader`，通过 `title/subtitle/searchPlaceholder` 传入页面差异。
- [ ] 禁止在业务页面中新增 `*-sidebar`、`*-header` 的独立结构和样式副本。
- [ ] 新增页面时先接入公共布局组件，再实现业务内容区域。

---

## 7. 部署指南

### 7.1 本地开发环境

这是你日常使用的环境：

```bash
# 三个终端分别运行
npm run server:dev  # 后端
npm run dev         # 前端
npm run db:studio   # 数据库管理（可选）
```

### 7.2 环境变量

创建 `.env` 文件（已经有 `.env.example` 作为参考）：

```env
# 后端端口
PORT=3001

# 数据库 URL（SQLite 不需要这个）
# DATABASE_URL="file:./dev.db"
```

### 7.3 构建生产版本

```bash
# 1. 构建后端
npm run server:build

# 2. 构建前端
npm run build

# 3. 启动生产服务
npm run server:start
```

---

## 📚 相关文档

- [设计规范](./docs/00-governance/design-specification.md)
- [技术栈文档](./TECHNOLOGY_STACK.md)
- [代码规范](./docs/00-governance/coding-standards.md)
- [项目结构](./PROJECT_STRUCTURE.md)

---

**维护者**: 技术团队  
**下次评审**: 2026-06-16
