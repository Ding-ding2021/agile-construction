---
id: DOC-PROJECT-PLAN-WBS--1
number: PRJ-007
domain: project
category: plan
title: WBS 框架阶段 1 实施计划
owner: docs-maintainer
status: archived
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs: []
---

# WBS 框架阶段 1 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.
>
> **评估状态**：已通过产品/技术/UI 三方评审并修订完成。

**Goal:** 在 shadcn 新栈实现 WBS 树核心视图，支持工作包/任务/子任务三级分解、WBS 编码自动生成、父子进度汇总。

**Architecture:** 后端 local-api 新增 wbs_nodes 表和 CRUD 接口（使用 `getDatabase()` + raw SQL，保持与现有控制器一致）；前端基于 shadcn `Table` 组件体系构建树形视图，Zustand store 统一管理 WBS 数据，视图切换 Tab 预留甘特/网络图入口。

**Tech Stack:** local-api (Express + better-sqlite3), src-next (React 19 + shadcn/ui + Zustand + Tailwind CSS v4)

**路由决策:** 阶段 1 使用独立路由 `/projects/:projectCode/wbs`；项目详情页 8 标签容器建立后，WBS 嵌入「范围与任务」标签（独立路由保留为直链入口）。

**模型桥接策略:** WBSNode 是任务分解的结构骨架（计划层），Task 模型是任务执行的实体（执行层）。阶段 1 聚焦 WBSNode 结构管理，阶段 2 实现 WBSNode → Task 的实例化桥接。状态枚举保持独立（WBSNode 用 `pending/in_progress/completed/blocked`，Task 用中文枚举）。

---

### Task 1: 后端 — 建表 + 种子数据

**Files:**

- Create: `local-api/migrations/004_create_wbs_nodes.sql`
- Create: `local-api/seeders/002_wbs_seed.sql`
- Modify: `local-api/store/schema.sql` — 注册 WBS 表
- Modify: `local-api/seed.ts` — 调用 WBS 种子

- [ ] **Step 1: 创建迁移 SQL `local-api/migrations/004_create_wbs_nodes.sql`**

```sql
CREATE TABLE IF NOT EXISTS wbs_nodes (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  project_code  TEXT NOT NULL,
  wbs_code      TEXT NOT NULL,
  name          TEXT NOT NULL,
  node_level    TEXT NOT NULL DEFAULT 'task' CHECK(node_level IN ('workPackage', 'task', 'subtask')),
  status        TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'blocked')),
  progress      INTEGER NOT NULL DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
  planned_start TEXT,
  planned_end   TEXT,
  duration      INTEGER NOT NULL DEFAULT 0,
  assignee      TEXT,
  parent_id     INTEGER,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  dependencies  TEXT,  -- JSON array of { targetId, type: 'FS'|'SS'|'FF'|'SF' }, for stage 2
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (parent_id) REFERENCES wbs_nodes(id) ON DELETE CASCADE
);

CREATE INDEX idx_wbs_project ON wbs_nodes(project_code);
CREATE INDEX idx_wbs_parent ON wbs_nodes(parent_id);
CREATE INDEX idx_wbs_project_parent ON wbs_nodes(project_code, parent_id);
```

- [ ] **Step 2: 创建种子 SQL `local-api/seeders/002_wbs_seed.sql`**

```sql
-- WBS 种子数据（项目 CY：朝阳旗舰店）
-- 先插入父节点，使用 last_insert_rowid() 获取 id 供子节点引用
INSERT INTO wbs_nodes (project_code, wbs_code, name, node_level, status, progress, planned_start, planned_end, duration, assignee, sort_order)
VALUES ('CY', 'CY-01', '店面装修', 'workPackage', 'in_progress', 45, '2026-05-01', '2026-06-30', 60, '张伟', 0);

INSERT INTO wbs_nodes (project_code, wbs_code, name, node_level, status, progress, planned_start, planned_end, duration, assignee, parent_id, sort_order)
VALUES
  ('CY', 'CY-01.01', '地面铺装', 'task', 'completed', 100, '2026-05-01', '2026-05-20', 20, '李工', last_insert_rowid(), 0),
  ('CY', 'CY-01.02', '墙面施工', 'subtask', 'pending', 0, '2026-05-21', '2026-06-15', 25, '王工', last_insert_rowid(), 1);

INSERT INTO wbs_nodes (project_code, wbs_code, name, node_level, status, progress, planned_start, planned_end, duration, assignee, sort_order)
VALUES ('CY', 'CY-02', '设备采购安装', 'workPackage', 'in_progress', 30, '2026-06-01', '2026-07-31', 60, '赵总', 1);
```

- [ ] **Step 3: 注册迁移到 `local-api/store/schema.sql`**

在文件末尾添加：`.read migrations/004_create_wbs_nodes.sql`

- [ ] **Step 4: 在 `local-api/seed.ts` 末尾添加种子调用**

```typescript
// WBS 种子
const wbsSeed = fs.readFileSync(path.join(__dirname, 'seeders/002_wbs_seed.sql'), 'utf-8')
db.exec(wbsSeed)
console.log('  - WBS nodes seeded')
```

- [ ] **Step 5: 验证迁移+种子**

Run: `cd local-api && npm run db:reset` (或手动 `rm store/prisma.db && node setup.js`)
Expected: 4 条 WBS 节点数据入库

- [ ] **Step 6: Commit**

```bash
git add local-api/migrations/004_create_wbs_nodes.sql local-api/seeders/002_wbs_seed.sql local-api/store/schema.sql local-api/seed.ts
git commit -m "feat(db): add wbs_nodes table and seed data"
```

---

### Task 2: 后端 — WBS CRUD API

**Files:**

- Create: `local-api/controllers/wbs.ts`
- Create: `local-api/routes/wbs.ts`
- Modify: `local-api/routes/index.ts`

- [ ] **Step 1: 创建控制器 `local-api/controllers/wbs.ts`**

```typescript
import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const WBS_COLUMNS = [
  'id',
  'project_code as projectCode',
  'wbs_code as wbsCode',
  'name',
  'node_level as nodeLevel',
  'status',
  'progress',
  'planned_start as plannedStart',
  'planned_end as plannedEnd',
  'duration',
  'assignee',
  'parent_id as parentId',
  'sort_order as sortOrder',
  'dependencies',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

export function getWBSTree(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const { projectCode } = req.params
  const rows = db
    .prepare(`SELECT ${WBS_COLUMNS} FROM wbs_nodes WHERE project_code = ? ORDER BY sort_order ASC`)
    .all(projectCode)
  res.json(rows)
}

export function createWBSNode(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const { projectCode, name, nodeLevel, parentId } = req.body

  // 校验 nodeLevel
  const validLevels = ['workPackage', 'task', 'subtask']
  if (!validLevels.includes(nodeLevel)) {
    throw new ApiError('Invalid nodeLevel', 'VALIDATION_ERROR', 400)
  }

  // 生成 WBS 编码
  let parentCode: string | null = null
  if (parentId) {
    const parent = db.prepare('SELECT wbs_code FROM wbs_nodes WHERE id = ?').get(parentId) as
      | { wbs_code: string }
      | undefined
    if (!parent) throw new ApiError('Parent not found', 'NOT_FOUND', 404)
    parentCode = parent.wbs_code
  }
  const maxSeq = db
    .prepare(
      parentCode
        ? `SELECT MAX(CAST(SUBSTR(wbs_code, LENGTH(?) + 2) AS INTEGER)) as max_seq FROM wbs_nodes WHERE parent_id = ?`
        : `SELECT MAX(CAST(SUBSTR(wbs_code, LENGTH(?) + 2) AS INTEGER)) as max_seq FROM wbs_nodes WHERE parent_id IS NULL AND project_code = ?`
    )
    .get(parentCode || projectCode, parentId || projectCode) as { max_seq: number | null }
  const nextSeq = (maxSeq.max_seq || 0) + 1
  const paddedSeq = String(nextSeq).padStart(2, '0')
  const wbsCode = parentCode ? `${parentCode}.${paddedSeq}` : `${projectCode}-${paddedSeq}`

  const now = new Date().toISOString()
  const result = db
    .prepare(
      `
    INSERT INTO wbs_nodes (project_code, wbs_code, name, node_level, parent_id, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `
    )
    .run(projectCode, wbsCode, name, nodeLevel, parentId || null, nextSeq, now, now)

  const node = db
    .prepare(`SELECT ${WBS_COLUMNS} FROM wbs_nodes WHERE id = ?`)
    .get(result.lastInsertRowid)
  res.status(201).json(node)
}

export function updateWBSNode(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const { id } = req.params
  const data = req.body

  const existing = db.prepare('SELECT id FROM wbs_nodes WHERE id = ?').get(id)
  if (!existing) throw new ApiError('WBS node not found', 'NOT_FOUND', 404)

  const fields: string[] = []
  const values: unknown[] = []
  const allowed = [
    'name',
    'status',
    'progress',
    'planned_start',
    'planned_end',
    'duration',
    'assignee',
    'dependencies',
  ]
  for (const key of allowed) {
    if (data[key] !== undefined) {
      // Convert camelCase to snake_case for DB
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      fields.push(`${dbKey} = ?`)
      values.push(data[key])
    }
  }

  if (fields.length > 0) {
    fields.push('updated_at = ?')
    values.push(new Date().toISOString())
    values.push(id)
    db.prepare(`UPDATE wbs_nodes SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  }

  const node = db.prepare(`SELECT ${WBS_COLUMNS} FROM wbs_nodes WHERE id = ?`).get(id)
  res.json(node)
}

export function deleteWBSNode(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const { id } = req.params

  const existing = db.prepare('SELECT id FROM wbs_nodes WHERE id = ?').get(id)
  if (!existing) throw new ApiError('WBS node not found', 'NOT_FOUND', 404)

  // SQLite ON DELETE CASCADE handles children
  const { count } = db.prepare('SELECT COUNT(*) as count FROM wbs_nodes WHERE id = ?').get(id) as {
    count: number
  }
  // Re-read to check if children were cascaded
  const deleted = db.prepare('DELETE FROM wbs_nodes WHERE id = ?').run(id)
  res.json({ deleted: deleted.changes })
}
```

- [ ] **Step 2: 创建路由 `local-api/routes/wbs.ts`**

```typescript
import { Router } from 'express'
import * as wbsCtrl from '../controllers/wbs'

const router = Router()

router.get('/', wbsCtrl.getWBSTree)
router.post('/', wbsCtrl.createWBSNode)
router.put('/:id', wbsCtrl.updateWBSNode)
router.delete('/:id', wbsCtrl.deleteWBSNode)

export default router
```

- [ ] **Step 3: 注册到 `local-api/routes/index.ts`**

```typescript
import wbsRoutes from './wbs'

// 在 personnel 行附近添加
router.use('/projects/:code/wbs', wbsRoutes)
```

- [ ] **Step 4: 验证 API**

```bash
curl http://localhost:3100/api/projects/CY/wbs
curl -X POST http://localhost:3100/api/projects/CY/wbs \
  -H "Content-Type: application/json" \
  -d '{"name":"验收交付","nodeLevel":"workPackage"}'
```

Expected: GET 返回数组，POST 返回新节点含 `wbsCode: "CY-02"`

- [ ] **Step 5: Commit**

```bash
git add local-api/controllers/wbs.ts local-api/routes/wbs.ts local-api/routes/index.ts
git commit -m "feat(api): add WBS CRUD with nested project routes"
```

---

### Task 3: 前端 — WBS 类型 + 工具函数

**Files:**

- Create: `src-next/types/wbs.ts`
- Create: `src-next/lib/wbs-utils.ts`

- [ ] **Step 1: 创建类型定义 `src-next/types/wbs.ts`**

```typescript
export type WBSNodeLevel = 'workPackage' | 'task' | 'subtask'

export type WBSStatus = 'pending' | 'in_progress' | 'completed' | 'blocked'

export interface WBSNode {
  id: number
  projectCode: string
  wbsCode: string
  name: string
  nodeLevel: WBSNodeLevel
  status: WBSStatus
  progress: number
  plannedStart: string | null
  plannedEnd: string | null
  duration: number
  assignee: string | null
  parentId: number | null
  sortOrder: number
  dependencies: string | null
  children: WBSNode[]
}
```

- [ ] **Step 2: 创建工具函数 `src-next/lib/wbs-utils.ts`**

```typescript
import type { WBSNode } from '@/types/wbs'

export function buildWBSTree(nodes: WBSNode[]): WBSNode[] {
  const map = new Map<number, WBSNode>()
  const roots: WBSNode[] = []

  nodes.forEach(n => map.set(n.id, { ...n, children: [] }))
  nodes.forEach(n => {
    const node = map.get(n.id)!
    if (n.parentId != null && map.has(n.parentId)) {
      map.get(n.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

export function calculateParentProgress(node: WBSNode): number {
  if (node.children.length === 0) return node.progress
  const activeChildren = node.children.filter(c => c.status !== 'blocked')
  if (activeChildren.length === 0) return node.progress
  const sum = activeChildren.reduce((acc, c) => acc + calculateParentProgress(c), 0)
  return Math.round(sum / activeChildren.length)
}

export function getNodeLevelBadge(level: WBSNode['nodeLevel']): string {
  const map = { workPackage: '工作包', task: '任务', subtask: '子任务' }
  return map[level]
}

export const WBS_STATUS_LABEL: Record<WBSNode['status'], string> = {
  pending: '待开始',
  in_progress: '进行中',
  completed: '已完成',
  blocked: '阻塞',
}
```

- [ ] **Step 3: Commit**

```bash
git add src-next/types/wbs.ts src-next/lib/wbs-utils.ts
git commit -m "feat(types): add WBS types and utility functions"
```

---

### Task 4: 前端 — API 层 + Zustand Store

**Files:**

- Modify: `src-next/services/api.ts` — 添加 WBS API 方法
- Create: `src-next/store/wbsStore.ts`

- [ ] **Step 1: 在 `src-next/services/api.ts` 添加 WBS API**

```typescript
export const wbsApi = {
  getTree: (projectCode: string) => request<WBSNode[]>(`/projects/${projectCode}/wbs`),
  create: (projectCode: string, data: Record<string, unknown>) =>
    request<WBSNode>(`/projects/${projectCode}/wbs`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (projectCode: string, id: number, data: Record<string, unknown>) =>
    request<WBSNode>(`/projects/${projectCode}/wbs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (projectCode: string, id: number) =>
    request<{ deleted: number }>(`/projects/${projectCode}/wbs/${id}`, { method: 'DELETE' }),
}
```

- [ ] **Step 2: 创建 Store `src-next/store/wbsStore.ts`**

```typescript
import { create } from 'zustand'
import { wbsApi } from '@/services/api'
import { buildWBSTree } from '@/lib/wbs-utils'
import type { WBSNode } from '@/types/wbs'

interface WBSState {
  flatNodes: WBSNode[]
  tree: WBSNode[]
  selectedId: number | null
  expandedIds: number[]
  loading: boolean
  error: string | null

  loadTree: (projectCode: string) => Promise<void>
  selectNode: (id: number | null) => void
  toggleExpand: (id: number) => void
  expandAll: () => void
  collapseAll: () => void
  addNode: (projectCode: string, data: Record<string, unknown>) => Promise<void>
  updateNode: (id: number, data: Record<string, unknown>) => Promise<void>
  deleteNode: (id: number) => Promise<void>
  recalcProgress: (node: WBSNode) => WBSNode
}

export const useWBSStore = create<WBSState>((set, get) => ({
  flatNodes: [],
  tree: [],
  selectedId: null,
  expandedIds: [],
  loading: false,
  error: null,

  loadTree: async projectCode => {
    set({ loading: true, error: null })
    try {
      const flatNodes = await wbsApi.getTree(projectCode)
      const tree = buildWBSTree(flatNodes)
      set({ flatNodes, tree, loading: false })
    } catch (e) {
      set({ error: e instanceof Error ? e.message : '加载 WBS 失败', loading: false })
    }
  },

  selectNode: id => set({ selectedId: id }),

  toggleExpand: id => {
    const expanded = [...get().expandedIds]
    const idx = expanded.indexOf(id)
    idx >= 0 ? expanded.splice(idx, 1) : expanded.push(id)
    set({ expandedIds: expanded })
  },

  expandAll: () => {
    set({ expandedIds: get().flatNodes.map(n => n.id) })
  },

  collapseAll: () => set({ expandedIds: [] }),

  addNode: async (projectCode, data) => {
    await wbsApi.create(projectCode, data)
    await get().loadTree(projectCode)
  },

  updateNode: async (id, data) => {
    const pc = get().flatNodes.find(n => n.id === id)?.projectCode
    if (!pc) return
    await wbsApi.update(pc, id, data)
    await get().loadTree(pc)
  },

  deleteNode: async id => {
    const pc = get().flatNodes.find(n => n.id === id)?.projectCode
    if (!pc) return
    await wbsApi.delete(pc, id)
    set({ selectedId: null })
    await get().loadTree(pc)
  },

  recalcProgress: node => {
    if (node.children.length === 0) return node
    const active = node.children.filter(c => c.status !== 'blocked')
    if (active.length === 0) return { ...node, progress: node.progress }
    const sum = active.reduce((acc, c) => acc + get().recalcProgress(c).progress, 0)
    return { ...node, progress: Math.round(sum / active.length) }
  },
}))
```

- [ ] **Step 3: Commit**

```bash
git add src-next/services/api.ts src-next/store/wbsStore.ts
git commit -m "feat(store): add WBS API layer and Zustand store"
```

---

### Task 5: 前端 — WBSTreeTable + WBSTreeNodeRow 组件

**Files:**

- Create: `src-next/pages/wbs/constants/wbs-styles.ts`
- Create: `src-next/pages/wbs/components/WBSTreeNodeRow.tsx`
- Create: `src-next/pages/wbs/components/WBSTreeTable.tsx`

- [ ] **Step 1: 创建样式常量 `src-next/pages/wbs/constants/wbs-styles.ts`**

```typescript
import type { WBSStatus } from '@/types/wbs'

export const WBS_STATUS_STYLE: Record<WBSStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  blocked: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

export const WBS_LEVEL_INDENT = 24
```

- [ ] **Step 2: 创建 WBSTreeNodeRow 组件**

```typescript
// src-next/pages/wbs/components/WBSTreeNodeRow.tsx
import { Fragment } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { WBS_STATUS_STYLE, WBS_LEVEL_INDENT } from '../constants/wbs-styles'
import type { WBSNode } from '@/types/wbs'

interface WBSTreeNodeRowProps {
  node: WBSNode
  depth: number
  expandedIds: number[]
  selectedId: number | null
  onToggle: (id: number) => void
  onSelect: (id: number) => void
  onAddChild: (parentId: number, level: WBSNode['nodeLevel']) => void
}

export function WBSTreeNodeRow({
  node,
  depth,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
  onAddChild,
}: WBSTreeNodeRowProps) {
  const isExpanded = expandedIds.includes(node.id)
  const isSelected = selectedId === node.id
  const hasChildren = node.children.length > 0

  return (
    <Fragment>
      <TableRow
        className={cn(
          'cursor-pointer transition-colors hover:bg-muted/50',
          isSelected && 'bg-muted'
        )}
        onClick={() => onSelect(node.id)}
      >
        <TableCell
          className="py-2.5"
          style={{ paddingLeft: `${12 + depth * WBS_LEVEL_INDENT}px` }}
        >
          <div className="flex items-center gap-2 text-sm">
            {hasChildren ? (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onToggle(node.id) }}
                className="text-muted-foreground hover:text-foreground shrink-0"
                aria-label={isExpanded ? '折叠' : '展开'}
              >
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            ) : (
              <span className="w-3.5 shrink-0" />
            )}
            <span className="font-mono text-xs text-muted-foreground/70">{node.wbsCode}</span>
            <span className={cn(node.nodeLevel === 'workPackage' && 'font-medium')}>{node.name}</span>
          </div>
        </TableCell>
        <TableCell className="py-2.5">
          <Badge variant="secondary" className={cn('text-xs font-normal', WBS_STATUS_STYLE[node.status])}>
            {node.status === 'pending' ? '待开始' : node.status === 'in_progress' ? '进行中' : node.status === 'completed' ? '已完成' : '阻塞'}
          </Badge>
        </TableCell>
        <TableCell className="py-2.5">
          <div className="flex items-center gap-2">
            <Progress value={node.progress} className="h-1.5 w-16" />
            <span className="text-xs text-muted-foreground tabular-nums">{node.progress}%</span>
          </div>
        </TableCell>
        <TableCell className="py-2.5 text-sm text-muted-foreground">
          {node.assignee || '-'}
        </TableCell>
        <TableCell className="py-2.5 text-sm text-muted-foreground">
          {node.plannedStart && node.plannedEnd
            ? `${node.plannedStart.slice(5)}~${node.plannedEnd.slice(5)}`
            : '-'}
        </TableCell>
        <TableCell className="py-2.5">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onAddChild(node.id, node.nodeLevel === 'subtask' ? 'subtask' : 'task') }}
              className="text-xs text-muted-foreground hover:text-foreground px-1"
              title="添加子节点"
            >
              +
            </button>
          </div>
        </TableCell>
      </TableRow>
      {hasChildren && isExpanded && (
        node.children.map(child => (
          <WBSTreeNodeRow
            key={child.id}
            node={child}
            depth={depth + 1}
            expandedIds={expandedIds}
            selectedId={selectedId}
            onToggle={onToggle}
            onSelect={onSelect}
            onAddChild={onAddChild}
          />
        ))
      )}
    </Fragment>
  )
}
```

- [ ] **Step 3: 创建 WBSTreeTable 组件**

```typescript
// src-next/pages/wbs/components/WBSTreeTable.tsx
import { useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWBSStore } from '@/store/wbsStore'
import { WBSTreeNodeRow } from './WBSTreeNodeRow'
import type { WBSNode } from '@/types/wbs'

const COL_WIDTHS = [32, 0, 90, 120, 64]

export function WBSTreeTable({ projectCode }: { projectCode: string }) {
  const { tree, expandedIds, selectedId, loading, error, loadTree, toggleExpand, selectNode, addNode } = useWBSStore()

  const handleAddChild = useCallback((parentId: number, level: WBSNode['nodeLevel']) => {
    const name = prompt('输入节点名称：')
    if (!name) return
    addNode(projectCode, { name, nodeLevel: level === 'subtask' ? 'subtask' : 'task', parentId })
  }, [projectCode, addNode])

  if (loading) {
    return (
      <Card className="p-4">
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={() => loadTree(projectCode)}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />重试
          </Button>
        </div>
      </Card>
    )
  }

  const isEmpty = tree.length === 0

  return (
    <Card className="p-4">
      <div className="rounded-md border">
        <Table>
          <colgroup>
            {COL_WIDTHS.map((w, i) => (
              <col key={i} style={{ width: w ? `${w}px` : undefined }} />
            ))}
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead style={{ paddingLeft: 12 }}>任务</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>进度</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>计划</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                  暂无 WBS 节点。点击上方「新建工作包」开始分解项目。
                </TableCell>
              </TableRow>
            ) : (
              tree.map(node => (
                <WBSTreeNodeRow
                  key={node.id}
                  node={node}
                  depth={0}
                  expandedIds={expandedIds}
                  selectedId={selectedId}
                  onToggle={toggleExpand}
                  onSelect={selectNode}
                  onAddChild={handleAddChild}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
```

- [ ] **Step 4: 验证编译**

Run: `cd src-next && npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: 0 errors (或仅既有问题)

- [ ] **Step 5: Commit**

```bash
git add src-next/pages/wbs/constants/wbs-styles.ts src-next/pages/wbs/components/WBSTreeNodeRow.tsx src-next/pages/wbs/components/WBSTreeTable.tsx
git commit -m "feat(ui): add WBSTreeTable with shadcn Table and WBSTreeNodeRow"
```

---

### Task 6: 前端 — WBSToolbar + WBSTreeSidePanel 组件

**Files:**

- Create: `src-next/pages/wbs/components/WBSToolbar.tsx`
- Create: `src-next/pages/wbs/components/WBSTreeSidePanel.tsx`

- [ ] **Step 1: 创建 WBSToolbar 组件**

```typescript
// src-next/pages/wbs/components/WBSToolbar.tsx
import { FolderTree, GanttChartSquare, Network, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWBSStore } from '@/store/wbsStore'

const VIEW_TABS = [
  { id: 'tree', label: '树视图', icon: FolderTree },
  { id: 'gantt', label: '甘特图', icon: GanttChartSquare },
  { id: 'network', label: '网络图', icon: Network },
] as const

export type ViewTab = (typeof VIEW_TABS)[number]['id']

interface WBSToolbarProps {
  projectCode: string
  activeView: ViewTab
  onViewChange: (v: ViewTab) => void
}

export function WBSToolbar({ projectCode, activeView, onViewChange }: WBSToolbarProps) {
  const { expandAll, collapseAll, addNode } = useWBSStore()

  const handleAddWorkPackage = () => {
    const name = prompt('输入工作包名称：')
    if (!name) return
    addNode(projectCode, { name, nodeLevel: 'workPackage' })
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-1">
        {VIEW_TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onViewChange(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
              activeView === tab.id
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:text-foreground',
              tab.id !== 'tree' && 'opacity-50 cursor-not-allowed'
            )}
            disabled={tab.id !== 'tree'}
            title={tab.id !== 'tree' ? '将在阶段 2 实现' : undefined}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={expandAll}>展开全部</Button>
        <Button variant="ghost" size="sm" onClick={collapseAll}>折叠全部</Button>
        <Button size="sm" onClick={handleAddWorkPackage}>
          <Plus className="h-4 w-4 mr-1" />新建工作包
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建 WBSTreeSidePanel 组件**

```typescript
// src-next/pages/wbs/components/WBSTreeSidePanel.tsx
import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Trash2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWBSStore } from '@/store/wbsStore'
import { WBS_STATUS_STYLE } from '../constants/wbs-styles'
import { getNodeLevelBadge, WBS_STATUS_LABEL } from '@/lib/wbs-utils'

export function WBSTreeSidePanel({ projectCode }: { projectCode: string }) {
  const { flatNodes, selectedId, updateNode, deleteNode } = useWBSStore()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const node = flatNodes.find(n => n.id === selectedId)

  const handleFieldBlur = useCallback((field: string, value: string | number) => {
    if (!node) return
    updateNode(node.id, { [field]: value })
  }, [node, updateNode])

  const handleDelete = useCallback(async () => {
    if (!node) return
    await deleteNode(node.id)
    setShowDeleteConfirm(false)
  }, [node, deleteNode])

  if (!node) {
    return (
      <aside className="w-72 border-l border-border shrink-0 hidden lg:block">
        <div className="p-4 text-center text-sm text-muted-foreground mt-8">
          选择一个节点查看详情
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-72 border-l border-border shrink-0 overflow-y-auto hidden lg:block">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm truncate">{node.name}</h3>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-muted-foreground hover:text-destructive transition-colors"
            aria-label="删除节点"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span>确认删除此节点及其子节点？</span>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" className="flex-1" onClick={handleDelete}>
                确认删除
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                取消
              </Button>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-3 text-sm">
          <Field label="WBS 编码">
            <span className="font-mono text-xs text-muted-foreground/70">{node.wbsCode}</span>
          </Field>
          <Field label="层级">
            <Badge variant="outline" className="text-xs">{getNodeLevelBadge(node.nodeLevel)}</Badge>
          </Field>
          <Field label="状态">
            <Badge variant="secondary" className={cn('text-xs font-normal', WBS_STATUS_STYLE[node.status])}>
              {WBS_STATUS_LABEL[node.status]}
            </Badge>
          </Field>
          <Field label="进度">
            <Progress value={node.progress} className="h-1.5" />
            <span className="text-xs text-muted-foreground ml-2">{node.progress}%</span>
          </Field>
          <Field label="负责人">
            <Input
              className="h-8 text-sm"
              defaultValue={node.assignee || ''}
              onBlur={e => handleFieldBlur('assignee', e.target.value)}
              placeholder="输入负责人"
            />
          </Field>
          <Field label="工期（天）">
            <Input
              type="number"
              className="h-8 text-sm"
              defaultValue={node.duration}
              min={0}
              onBlur={e => handleFieldBlur('duration', parseInt(e.target.value) || 0)}
            />
          </Field>
          <Field label="计划开始">
            <Input
              type="date"
              className="h-8 text-sm"
              defaultValue={node.plannedStart || ''}
              onBlur={e => handleFieldBlur('planned_start', e.target.value)}
            />
          </Field>
          <Field label="计划结束">
            <Input
              type="date"
              className="h-8 text-sm"
              defaultValue={node.plannedEnd || ''}
              onBlur={e => handleFieldBlur('planned_end', e.target.value)}
            />
          </Field>
        </div>
      </div>
    </aside>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground block mb-1">{label}</label>
      <div className="flex items-center">{children}</div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src-next/pages/wbs/components/WBSToolbar.tsx src-next/pages/wbs/components/WBSTreeSidePanel.tsx
git commit -m "feat(ui): add WBSToolbar with view tabs and WBSTreeSidePanel"
```

---

### Task 7: 前端 — WBSView 主页面 + 路由注册

**Files:**

- Create: `src-next/pages/wbs/WBSView.tsx`
- Modify: `src-next/App.tsx` — 注册路由

- [ ] **Step 1: 创建 WBSView 主页面**

```typescript
// src-next/pages/wbs/WBSView.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useWBSStore } from '@/store/wbsStore'
import { WBSToolbar, type ViewTab } from './components/WBSToolbar'
import { WBSTreeTable } from './components/WBSTreeTable'
import { WBSTreeSidePanel } from './components/WBSTreeSidePanel'

export function WBSView() {
  const { projectCode } = useParams<{ projectCode: string }>()
  const { loadTree } = useWBSStore()
  const [activeView, setActiveView] = useState<ViewTab>('tree')

  useEffect(() => {
    if (projectCode) loadTree(projectCode)
  }, [projectCode])

  if (!projectCode) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        缺少项目编码
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <WBSToolbar projectCode={projectCode} activeView={activeView} onViewChange={setActiveView} />
      <div className="flex flex-1 min-h-0">
        {activeView === 'tree' && (
          <>
            <div className="flex-1 overflow-auto">
              <WBSTreeTable projectCode={projectCode} />
            </div>
            <WBSTreeSidePanel projectCode={projectCode} />
          </>
        )}
        {activeView === 'gantt' && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            甘特图视图 — 阶段 2 实现
          </div>
        )}
        {activeView === 'network' && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            网络图视图 — 阶段 2 实现
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 在 `src-next/App.tsx` 注册路由**

在 routes 数组中找到 projects 相关路由，添加：

```typescript
{
  path: '/projects/:projectCode/wbs',
  element: <WBSView />,
}
```

- [ ] **Step 3: 验证编译**

Run: `cd src-next && npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src-next/pages/wbs/WBSView.tsx src-next/App.tsx
git commit -m "feat(page): add WBSView with routing"
```

---

### Task 8: 测试 — 工具函数 + API

**Files:**

- Create: `src-next/src/__tests__/wbs-utils.test.ts`

- [ ] **Step 1: 编写 WBS 工具函数测试**

```typescript
// src-next/src/__tests__/wbs-utils.test.ts
import { describe, it, expect } from 'vitest'
import { buildWBSTree, calculateParentProgress } from '@/lib/wbs-utils'
import type { WBSNode } from '@/types/wbs'

const makeNode = (overrides: Partial<WBSNode>): WBSNode => ({
  id: 0,
  projectCode: 'CY',
  wbsCode: '',
  name: '',
  nodeLevel: 'task',
  status: 'pending',
  progress: 0,
  plannedStart: null,
  plannedEnd: null,
  duration: 0,
  assignee: null,
  parentId: null,
  sortOrder: 0,
  dependencies: null,
  children: [],
  ...overrides,
})

describe('buildWBSTree', () => {
  it('should build tree from flat nodes', () => {
    const nodes = [
      makeNode({ id: 1, parentId: null }),
      makeNode({ id: 2, parentId: 1 }),
      makeNode({ id: 3, parentId: 1 }),
    ]
    const tree = buildWBSTree(nodes)
    expect(tree).toHaveLength(1)
    expect(tree[0].children).toHaveLength(2)
  })

  it('should return empty array for empty input', () => {
    expect(buildWBSTree([])).toEqual([])
  })

  it('should handle orphan nodes as roots', () => {
    const nodes = [
      makeNode({ id: 1, parentId: null }),
      makeNode({ id: 2, parentId: 99 }), // orphan
    ]
    const tree = buildWBSTree(nodes)
    expect(tree).toHaveLength(2)
  })
})

describe('calculateParentProgress', () => {
  it('should return leaf node progress directly', () => {
    const node = makeNode({ progress: 50 })
    expect(calculateParentProgress(node)).toBe(50)
  })

  it('should calculate average of children', () => {
    const node = makeNode({
      progress: 0,
      children: [makeNode({ progress: 100 }), makeNode({ progress: 50 })],
    })
    expect(calculateParentProgress(node)).toBe(75)
  })

  it('should exclude blocked children from calculation', () => {
    const node = makeNode({
      progress: 0,
      children: [makeNode({ progress: 100 }), makeNode({ progress: 0, status: 'blocked' })],
    })
    expect(calculateParentProgress(node)).toBe(100)
  })
})
```

- [ ] **Step 2: 运行测试**

Run: `npm run test:run -w src-next`
Expected: 5 测试通过

- [ ] **Step 3: Commit**

```bash
git add src-next/src/__tests__/wbs-utils.test.ts
git commit -m "test: add WBS utility function tests"
```
