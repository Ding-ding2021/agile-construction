import { Request, Response } from 'express'
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
  const calendars = db.prepare(`SELECT ${CALENDAR_COLUMNS} FROM calendars ORDER BY is_default DESC, name ASC`).all()
  res.json(calendars)
}

export function getCalendar(req: Request, res: Response) {
  const db = getDatabase()
  const id = Number(req.params.id)
  const calendar = db.prepare(`SELECT ${CALENDAR_COLUMNS} FROM calendars WHERE id = ?`).get(id) as Record<string, unknown> | undefined
  if (!calendar) throw new ApiError(404, '日历不存在')
  const exceptions = db.prepare(`SELECT ${EXCEPTION_COLUMNS} FROM calendar_exceptions WHERE calendar_id = ? ORDER BY date`).all(id)
  res.json({ ...calendar, exceptions })
}

export function createCalendar(req: Request, res: Response) {
  const db = getDatabase()
  const { name, description, isDefault } = req.body
  if (!name || typeof name !== 'string') throw new ApiError(400, '日历名称不能为空')

  if (isDefault) {
    db.prepare(`UPDATE calendars SET is_default = 0 WHERE is_default = 1`).run()
  }

  const result = db.prepare(`INSERT INTO calendars (name, description, is_default) VALUES (?, ?, ?)`).run(
    name,
    description || null,
    isDefault ? 1 : 0
  )

  const created = db.prepare(`SELECT ${CALENDAR_COLUMNS} FROM calendars WHERE id = ?`).get(result.lastInsertRowid)
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

  db.prepare(`
    UPDATE calendars SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      is_default = COALESCE(?, is_default)
    WHERE id = ?
  `).run(
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
  db.prepare(`DELETE FROM calendar_exceptions WHERE calendar_id = ?`).run(id)
  db.prepare(`DELETE FROM calendars WHERE id = ?`).run(id)
  res.json({ success: true })
}

export function setExceptions(req: Request, res: Response) {
  const db = getDatabase()
  const id = Number(req.params.id)
  const { exceptions } = req.body as { exceptions: { date: string; isWorkingDay: boolean; reason?: string }[] }

  const existing = db.prepare(`SELECT id FROM calendars WHERE id = ?`).get(id)
  if (!existing) throw new ApiError(404, '日历不存在')
  if (!Array.isArray(exceptions)) throw new ApiError(400, 'exceptions 必须是数组')

  const txn = db.transaction(() => {
    db.prepare(`DELETE FROM calendar_exceptions WHERE calendar_id = ?`).run(id)
    const insert = db.prepare(`INSERT INTO calendar_exceptions (calendar_id, date, is_working_day, reason) VALUES (?, ?, ?, ?)`)
    for (const ex of exceptions) {
      insert.run(id, ex.date, ex.isWorkingDay ? 1 : 0, ex.reason || null)
    }
  })
  txn()

  const saved = db.prepare(`SELECT ${EXCEPTION_COLUMNS} FROM calendar_exceptions WHERE calendar_id = ? ORDER BY date`).all(id)
  res.json(saved)
}

export function checkPeriod(req: Request, res: Response) {
  const db = getDatabase()
  const { from, to } = req.query as { from: string; to: string }
  if (!from || !to) throw new ApiError(400, '请指定 from 和 to 参数 (YYYY-MM-DD)')

  const calendar = db.prepare(`SELECT ${CALENDAR_COLUMNS} FROM calendars WHERE is_default = 1 LIMIT 1`).get() as Record<string, unknown> | undefined
  let exceptions: Record<string, unknown>[] = []
  if (calendar) {
    exceptions = db.prepare(`SELECT date, is_working_day as isWorkingDay, reason FROM calendar_exceptions WHERE calendar_id = ? AND date >= ? AND date <= ?`)
      .all(calendar.id, from, to)
  }

  // 生成从 from 到 to 每天的工作状态（不使用 date-fns 避免 ESM 兼容问题）
  const startDate = new Date(from)
  const endDate = new Date(to)
  const exceptionMap = new Map(exceptions.map(e => [e.date as string, e]))

  const result: { date: string; isWorkingDay: boolean; reason: string | null }[] = []
  const current = new Date(startDate)
  while (current <= endDate) {
    const dateStr = current.toISOString().slice(0, 10)
    const ex = exceptionMap.get(dateStr)
    if (ex) {
      result.push({ date: dateStr, isWorkingDay: !!ex.isWorkingDay, reason: (ex.reason as string) || null })
    } else {
      const dow = current.getDay()
      result.push({ date: dateStr, isWorkingDay: dow !== 0, reason: null })
    }
    current.setDate(current.getDate() + 1)
  }

  res.json(result)
}
