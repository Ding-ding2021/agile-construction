---
id: DOC-PROJECT-PLAN-
number: PRJ-005
domain: project
category: plan
title: 项目日历系统实施计划
owner: docs-maintainer
status: archived
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs: []
---

# 项目日历系统实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** 建立可复用的项目日历系统，支持中国建筑行业工作历（含法定节假日、调休），集成到甘特图替代硬编码周末判断。

**Architecture:**

- Prisma schema 定义 Calendar + CalendarException 模型
- local-api raw SQL Controller（与现有 wbs/task 模式一致）
- 前端 calendar.ts 提供可复用工具函数 + 轻量缓存
- 甘特图仅替换 3 行核心代码（weekendDays → nonWorkingDays from API）

**Tech Stack:** Express + better-sqlite3 + Prisma (schema only), React 18.3, date-fns

---

## Task 0: Prisma Schema + 数据库迁移

**Files:**

- Modify: `prisma/schema.prisma`
- Run: `prisma db push`

- [ ] **Step 1: 在 schema.prisma 末尾追加 Calendar 模型**

```prisma
// ─── 项目日历表 ───
model Calendar {
  id          Int                 @id @default(autoincrement())
  name        String
  description String?
  isDefault   Boolean             @default(false) @map("is_default")
  createdAt   DateTime            @default(now()) @map("created_at")
  updatedAt   DateTime            @updatedAt @map("updated_at")
  exceptions  CalendarException[]

  @@map("calendars")
}

model CalendarException {
  id           Int      @id @default(autoincrement())
  calendarId   Int      @map("calendar_id")
  date         String   // YYYY-MM-DD
  isWorkingDay Boolean  @map("is_working_day")
  reason       String?
  calendar     Calendar @relation(fields: [calendarId], references: [id], onDelete: Cascade)

  @@unique([calendarId, date])
  @@index([calendarId])
  @@map("calendar_exceptions")
}
```

- [ ] **Step 2: 运行数据库迁移**

Run: `cd local-api && npx prisma db push` 或 `npx prisma db push`（从项目根目录）
Verify: 数据库中已存在 `calendars` 和 `calendar_exceptions` 表

---

## Task 1: 后端 Controller + Routes

**Files:**

- Create: `local-api/controllers/calendar.ts`
- Create: `local-api/routes/calendar.ts`
- Modify: `local-api/routes/index.ts`

- [ ] **Step 1: 创建 Controller**

`local-api/controllers/calendar.ts`:

```typescript
import { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const CALENDAR_COLUMNS = [
  'id',
  'name',
  'description',
  'is_default as isDefault',
  'created_at as createdAt',
  'updated_at as updatedAt',
].join(', ')

const EXCEPTION_COLUMNS = [
  'id',
  'calendar_id as calendarId',
  'date',
  'is_working_day as isWorkingDay',
  'reason',
].join(', ')

export function listCalendars(req: Request, res: Response) {
  const db = getDatabase()
  const calendars = db
    .prepare(`SELECT ${CALENDAR_COLUMNS} FROM calendars ORDER BY is_default DESC, name ASC`)
    .all()
  res.json(calendars)
}

export function getCalendar(req: Request, res: Response) {
  const db = getDatabase()
  const id = Number(req.params.id)
  const calendar = db.prepare(`SELECT ${CALENDAR_COLUMNS} FROM calendars WHERE id = ?`).get(id) as
    | Record<string, unknown>
    | undefined
  if (!calendar) throw new ApiError(404, '日历不存在')
  const exceptions = db
    .prepare(
      `SELECT ${EXCEPTION_COLUMNS} FROM calendar_exceptions WHERE calendar_id = ? ORDER BY date`
    )
    .all(id)
  res.json({ ...calendar, exceptions })
}

export function createCalendar(req: Request, res: Response) {
  const db = getDatabase()
  const { name, description, isDefault } = req.body
  if (!name || typeof name !== 'string') throw new ApiError(400, '日历名称不能为空')

  if (isDefault) {
    db.prepare(`UPDATE calendars SET is_default = 0 WHERE is_default = 1`).run()
  }

  const result = db
    .prepare(`INSERT INTO calendars (name, description, is_default) VALUES (?, ?, ?)`)
    .run(name, description || null, isDefault ? 1 : 0)

  const created = db
    .prepare(`SELECT ${CALENDAR_COLUMNS} FROM calendars WHERE id = ?`)
    .get(result.lastInsertRowid)
  res.status(201).json(created)
}

export function updateCalendar(req: Request, res: Response) {
  const db = getDatabase()
  const id = Number(req.params.id)
  const { name, description, isDefault } = req.body

  const existing = db.prepare(`SELECT id FROM calendars WHERE id = ?`).get(id)
  if (!existing) throw new ApiError(404, '日历不存在')

  if (isDefault) {
    db.prepare(`UPDATE calendars SET is_default = 0 WHERE is_default = 1 AND id != ?`).run(id)
  }

  db.prepare(
    `
    UPDATE calendars SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      is_default = COALESCE(?, is_default)
    WHERE id = ?
  `
  ).run(
    name ?? null,
    description !== undefined ? description : null,
    isDefault !== undefined ? (isDefault ? 1 : 0) : null,
    id
  )

  const updated = db.prepare(`SELECT ${CALENDAR_COLUMNS} FROM calendars WHERE id = ?`).get(id)
  res.json(updated)
}

export function deleteCalendar(req: Request, res: Response) {
  const db = getDatabase()
  const id = Number(req.params.id)
  const existing = db.prepare(`SELECT id FROM calendars WHERE id = ?`).get(id)
  if (!existing) throw new ApiError(404, '日历不存在')
  // CalendarException 级联删除
  db.prepare(`DELETE FROM calendar_exceptions WHERE calendar_id = ?`).run(id)
  db.prepare(`DELETE FROM calendars WHERE id = ?`).run(id)
  res.json({ success: true })
}

export function setExceptions(req: Request, res: Response) {
  const db = getDatabase()
  const id = Number(req.params.id)
  const { exceptions } = req.body as {
    exceptions: { date: string; isWorkingDay: boolean; reason?: string }[]
  }

  const existing = db.prepare(`SELECT id FROM calendars WHERE id = ?`).get(id)
  if (!existing) throw new ApiError(404, '日历不存在')

  if (!Array.isArray(exceptions)) throw new ApiError(400, 'exceptions 必须是数组')

  const txn = db.transaction(() => {
    db.prepare(`DELETE FROM calendar_exceptions WHERE calendar_id = ?`).run(id)
    const insert = db.prepare(
      `INSERT INTO calendar_exceptions (calendar_id, date, is_working_day, reason) VALUES (?, ?, ?, ?)`
    )
    for (const ex of exceptions) {
      insert.run(id, ex.date, ex.isWorkingDay ? 1 : 0, ex.reason || null)
    }
  })
  txn()

  const saved = db
    .prepare(
      `SELECT ${EXCEPTION_COLUMNS} FROM calendar_exceptions WHERE calendar_id = ? ORDER BY date`
    )
    .all(id)
  res.json(saved)
}

export function checkPeriod(req: Request, res: Response) {
  const db = getDatabase()
  const { from, to } = req.query as { from: string; to: string }
  if (!from || !to) throw new ApiError(400, '请指定 from 和 to 参数 (YYYY-MM-DD)')

  // 找默认日历的例外
  const calendar = db
    .prepare(`SELECT ${CALENDAR_COLUMNS} FROM calendars WHERE is_default = 1 LIMIT 1`)
    .get() as Record<string, unknown> | undefined
  let exceptions: Record<string, unknown>[] = []
  if (calendar) {
    exceptions = db
      .prepare(
        `SELECT date, is_working_day as isWorkingDay, reason FROM calendar_exceptions WHERE calendar_id = ? AND date >= ? AND date <= ?`
      )
      .all(calendar.id, from, to)
  }

  // 生成从 from 到 to 每天的工作状态
  const { eachDayOfInterval } = require('date-fns')
  const dates = eachDayOfInterval({ start: new Date(from), end: new Date(to) })
  const exceptionMap = new Map(exceptions.map(e => [e.date, e]))

  const result = dates.map(d => {
    const dateStr = d.toISOString().slice(0, 10)
    const ex = exceptionMap.get(dateStr)
    if (ex) {
      return { date: dateStr, isWorkingDay: !!ex.isWorkingDay, reason: ex.reason || null }
    }
    const dow = d.getDay()
    return { date: dateStr, isWorkingDay: dow !== 0, reason: null }
  })

  res.json(result)
}
```

- [ ] **Step 2: 创建路由文件**

`local-api/routes/calendar.ts`:

```typescript
import { Router } from 'express'
import * as calendarCtrl from '../controllers/calendar'

const router = Router()

router.get('/', calendarCtrl.listCalendars)
router.get('/:id', calendarCtrl.getCalendar)
router.post('/', calendarCtrl.createCalendar)
router.put('/:id', calendarCtrl.updateCalendar)
router.delete('/:id', calendarCtrl.deleteCalendar)
router.put('/:id/exceptions', calendarCtrl.setExceptions)
router.post('/check', calendarCtrl.checkPeriod)
router.get('/check', calendarCtrl.checkPeriod)

export default router
```

- [ ] **Step 3: 注册路由**

In `local-api/routes/index.ts`, add before `export default router`:

```typescript
import calendarRoutes from './calendar'
// ...
router.use('/calendars', calendarRoutes)
```

- [ ] **Step 4: 重启 API 服务器验证**

If dev server is running, it should auto-restart (tsx watch).
Verify: `curl http://localhost:3100/api/calendars` 返回 `[]`

---

## Task 2: 种子日历数据

**Files:**

- Create: `local-api/seed-calendar.ts`

- [ ] **Step 1: 创建种子日历脚本**

`local-api/seed-calendar.ts`:

```typescript
import { initDatabase, getDatabase, closeDatabase } from './store/sqlite'

initDatabase()
const db = getDatabase()

// 删除旧数据
db.prepare(`DELETE FROM calendar_exceptions`).run()
db.prepare(`DELETE FROM calendars`).run()

// 创建默认日历
const calResult = db
  .prepare(`INSERT INTO calendars (name, description, is_default) VALUES (?, ?, ?)`)
  .run(
    '中国建筑通用日历',
    '周一至周六工作，周日休息。含法定节假日。仅供参考，请按实际年度更新。',
    1
  )
const calendarId = calResult.lastInsertRowid

const insertEx = db.prepare(
  `INSERT INTO calendar_exceptions (calendar_id, date, is_working_day, reason) VALUES (?, ?, ?, ?)`
)

const holidays: { date: string; reason: string }[] = [
  // 2026 年法定节假日
  { date: '2026-01-01', reason: '元旦' },
  { date: '2026-01-02', reason: '元旦' },
  { date: '2026-01-03', reason: '元旦' },
  // 春节（2月17日除夕-2月23日初六）
  { date: '2026-02-17', reason: '春节' },
  { date: '2026-02-18', reason: '春节' },
  { date: '2026-02-19', reason: '春节' },
  { date: '2026-02-20', reason: '春节' },
  { date: '2026-02-21', reason: '春节' },
  { date: '2026-02-22', reason: '春节' },
  { date: '2026-02-23', reason: '春节' },
  // 清明节
  { date: '2026-04-04', reason: '清明' },
  { date: '2026-04-05', reason: '清明' },
  { date: '2026-04-06', reason: '清明' },
  // 劳动节
  { date: '2026-05-01', reason: '劳动节' },
  { date: '2026-05-02', reason: '劳动节' },
  { date: '2026-05-03', reason: '劳动节' },
  // 端午节
  { date: '2026-06-19', reason: '端午' },
  { date: '2026-06-20', reason: '端午' },
  { date: '2026-06-21', reason: '端午' },
  // 中秋节
  { date: '2026-09-27', reason: '中秋' },
  { date: '2026-09-28', reason: '中秋' },
  { date: '2026-09-29', reason: '中秋' },
  // 国庆节
  { date: '2026-10-01', reason: '国庆' },
  { date: '2026-10-02', reason: '国庆' },
  { date: '2026-10-03', reason: '国庆' },
  { date: '2026-10-04', reason: '国庆' },
  { date: '2026-10-05', reason: '国庆' },
  { date: '2026-10-06', reason: '国庆' },
  { date: '2026-10-07', reason: '国庆' },
]

for (const h of holidays) {
  insertEx.run(calendarId, h.date, 0, h.reason)
}

console.log(`日历已创建: ID=${calendarId}, 节假日=${holidays.length} 天`)
closeDatabase()
```

- [ ] **Step 2: 运行种子脚本**

Run: `npx tsx local-api/seed-calendar.ts`
Verify: `curl http://localhost:3100/api/calendars` 返回有数据的日历

---

## Task 3: 前端类型 + API 服务 + 工具函数

**Files:**

- Create: `src-next/types/calendar.ts`
- Modify: `src-next/services/api.ts`
- Create: `src-next/lib/calendar.ts`
- Test: `src-next/lib/__tests__/calendar.test.ts`

- [ ] **Step 1: 类型定义**

`src-next/types/calendar.ts`:

```typescript
export interface CalendarItem {
  id: number
  name: string
  description: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CalendarException {
  id: number
  calendarId: number
  date: string
  isWorkingDay: boolean
  reason: string | null
}

export interface CalendarDetail extends CalendarItem {
  exceptions: CalendarException[]
}

export interface DayStatus {
  date: string
  isWorkingDay: boolean
  reason: string | null
}
```

- [ ] **Step 2: API 服务层**

Add to `src-next/services/api.ts`:

```typescript
import type { CalendarItem, CalendarDetail, DayStatus } from '@/types/calendar'
// ... inside the existing api definition

export const calendarsApi = {
  list: () => request<CalendarItem[]>('/calendars'),

  get: (id: number) => request<CalendarDetail>(`/calendars/${id}`),

  create: (data: { name: string; description?: string; isDefault?: boolean }) =>
    request<CalendarItem>('/calendars', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: { name?: string; description?: string; isDefault?: boolean }) =>
    request<CalendarItem>(`/calendars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) => request<{ success: boolean }>(`/calendars/${id}`, { method: 'DELETE' }),

  setExceptions: (
    id: number,
    exceptions: { date: string; isWorkingDay: boolean; reason?: string }[]
  ) =>
    request<CalendarException[]>(`/calendars/${id}/exceptions`, {
      method: 'PUT',
      body: JSON.stringify({ exceptions }),
    }),

  checkPeriod: (from: string, to: string) =>
    request<DayStatus[]>(`/calendars/check?from=${from}&to=${to}`),
}
```

- [ ] **Step 3: 日历工具函数**

`src-next/lib/calendar.ts`:

```typescript
import { eachDayOfInterval, isWeekend } from 'date-fns'
import { calendarsApi } from '@/services/api'
import type { DayStatus } from '@/types/calendar'

let cachedNonWorkingDays: { from: string; to: string; data: DayStatus[] } | null = null

function isWeekendOnly(d: Date): boolean {
  return d.getDay() === 0 || d.getDay() === 6
}

export function isWorkingDay(date: string, exceptions: DayStatus[]): boolean {
  const ex = exceptions.find(e => e.date === date)
  if (ex) return ex.isWorkingDay
  return !isWeekendOnly(new Date(date))
}

export function getWorkingDays(start: string, end: string, exceptions: DayStatus[]): string[] {
  const days = eachDayOfInterval({ start: new Date(start), end: new Date(end) })
  return days
    .filter(d => isWorkingDay(d.toISOString().slice(0, 10), exceptions))
    .map(d => d.toISOString().slice(0, 10))
}

export function getNonWorkingDays(
  start: string,
  end: string,
  exceptions: DayStatus[]
): { date: string; reason: string | null }[] {
  const days = eachDayOfInterval({ start: new Date(start), end: new Date(end) })
  return days
    .filter(d => !isWorkingDay(d.toISOString().slice(0, 10), exceptions))
    .map(d => {
      const ex = exceptions.find(e => e.date === d.toISOString().slice(0, 10))
      return { date: d.toISOString().slice(0, 10), reason: ex?.reason || null }
    })
}

export async function loadNonWorkingDays(from: string, to: string): Promise<DayStatus[]> {
  if (
    cachedNonWorkingDays &&
    cachedNonWorkingDays.from === from &&
    cachedNonWorkingDays.to === to
  ) {
    return cachedNonWorkingDays.data
  }
  const data = await calendarsApi.checkPeriod(from, to)
  const nonWorkingDays = data.filter(d => !d.isWorkingDay)
  cachedNonWorkingDays = { from, to, data }
  return nonWorkingDays
}
```

- [ ] **Step 4: 编写测试**

`src-next/lib/__tests__/calendar.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { isWorkingDay, getWorkingDays, getNonWorkingDays } from '../calendar'
import type { DayStatus } from '@/types/calendar'

const HOLIDAYS_2026: DayStatus[] = [
  { date: '2026-01-01', isWorkingDay: false, reason: '元旦' },
  { date: '2026-05-01', isWorkingDay: false, reason: '劳动节' },
  { date: '2026-05-04', isWorkingDay: true, reason: '调休' },
]

describe('isWorkingDay', () => {
  it('普通周一为工作日', () => {
    expect(isWorkingDay('2026-05-11', HOLIDAYS_2026)).toBe(true)
  })
  it('普通周日为非工作日（周末规则）', () => {
    expect(isWorkingDay('2026-05-10', HOLIDAYS_2026)).toBe(false)
  })
  it('法定假日为非工作日', () => {
    expect(isWorkingDay('2026-05-01', HOLIDAYS_2026)).toBe(false)
  })
  it('调休上班日为工作日', () => {
    expect(isWorkingDay('2026-05-04', HOLIDAYS_2026)).toBe(true)
  })
  it('空例外列表退回到周末规则', () => {
    expect(isWorkingDay('2026-05-10', [])).toBe(false)
    expect(isWorkingDay('2026-05-11', [])).toBe(true)
  })
})

describe('getWorkingDays', () => {
  it('区间内返回工作日列表（排除假期）', () => {
    const days = getWorkingDays('2026-04-30', '2026-05-03', HOLIDAYS_2026)
    expect(days).toContain('2026-04-30')
    expect(days).not.toContain('2026-05-01')
    expect(days).not.toContain('2026-05-02')
    expect(days).not.toContain('2026-05-03')
  })
})

describe('getNonWorkingDays', () => {
  it('区间内返回非工作日列表（含假期）', () => {
    const days = getNonWorkingDays('2026-04-30', '2026-05-02', HOLIDAYS_2026)
    const dates = days.map(d => d.date)
    expect(dates).toContain('2026-05-01')
    // 5月2日（周六）也是非工作日
    expect(dates).toContain('2026-05-02')
  })
  it('非工作日包含 reason', () => {
    const days = getNonWorkingDays('2026-05-01', '2026-05-01', HOLIDAYS_2026)
    expect(days[0].reason).toBe('劳动节')
  })
})
```

- [ ] **Step 5: 运行测试**

Run: `npx vitest run src-next/lib/__tests__/calendar.test.ts`
Expected: ALL PASS

---

## Task 4: 甘特图集成（替换硬编码周末）

**Files:**

- Modify: `src-next/pages/wbs/components/WBSGanttChart.tsx`

- [ ] **Step 1: 替换 weekendDays 计算为 API 驱动的非工作日**

Import the new functions at the top of `WBSGanttChart.tsx`:

```typescript
import { loadNonWorkingDays } from '@/lib/calendar'
```

Add a new state and useEffect to load calendar data. Replace `weekendDays` with `nonWorkingDays`:

```typescript
// Add inside the component function, after other hooks:
const [nonWorkingDaySet, setNonWorkingDaySet] = useState<Set<string>>(new Set())

useEffect(() => {
  const from = range.start.toISOString().slice(0, 10)
  const to = range.end.toISOString().slice(0, 10)
  loadNonWorkingDays(from, to)
    .then(days => {
      setNonWorkingDaySet(new Set(days.map(d => d.date)))
    })
    .catch(() => {
      // Fallback: use weekend-only rules if API fails
      setNonWorkingDaySet(new Set())
    })
}, [range.start, range.end])
```

Replace `weekendDays` computation with:

```typescript
const nonWorkingCols = useMemo(() => {
  if (zoom !== 'day' || nonWorkingDaySet.size === 0) return []
  const days = eachDayOfInterval({ start: range.start, end: range.end })
  return days
    .map((d, i) => {
      const dateStr = d.toISOString().slice(0, 10)
      return {
        index: i,
        isNonWorking: nonWorkingDaySet.has(dateStr) || d.getDay() === 0 || d.getDay() === 6,
      }
    })
    .filter(d => d.isNonWorking)
}, [range, zoom, nonWorkingDaySet])
```

Add `useState` import if not already present.

Replace the JSX references from `weekendDays` to `nonWorkingCols`:

```tsx
{
  nonWorkingCols.map(wd => (
    <div
      key={wd.index}
      className="absolute inset-y-0 bg-muted/30 pointer-events-none"
      style={{ left: wd.index * dayWidth, width: dayWidth }}
    />
  ))
}
```

- [ ] **Step 2: 转换日期范围的 date-fns 调用统一时区**

In the weekend fallback calculation (todayOffset and weekendDays), ensure date strings use `toISOString().slice(0, 10)` for consistency.

- [ ] **Step 3: 验证 build**

Run: `npm run build`
Expected: No new errors

---

## Task 5: 最终验证

- [ ] **Step 1: 运行全部测试**

Run: `npx vitest run src-next/lib/__tests__/`
Expected: ALL PASS

- [ ] **Step 2: lint**

Run: `npm run lint`
Expected: 0 errors

- [ ] **Step 3: build**

Run: `npm run build`
Expected: 无新增错误
