import { initDatabase, getDatabase, closeDatabase } from './store/sqlite'

initDatabase()
const db = getDatabase()

db.prepare(`DELETE FROM calendar_exceptions`).run()
db.prepare(`DELETE FROM calendars`).run()

const now = new Date().toISOString()
const calResult = db.prepare(`INSERT INTO calendars (name, description, is_default, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`).run(
  '中国建筑通用日历',
  '周一至周六工作，周日休息。含法定节假日。仅供参考，请按实际年度更新。',
  1,
  now,
  now
)
const calendarId = calResult.lastInsertRowid

const insertEx = db.prepare(`INSERT INTO calendar_exceptions (calendar_id, date, is_working_day, reason) VALUES (?, ?, ?, ?)`)

const holidays: { date: string; reason: string }[] = [
  { date: '2026-01-01', reason: '元旦' },
  { date: '2026-01-02', reason: '元旦' },
  { date: '2026-01-03', reason: '元旦' },
  { date: '2026-02-17', reason: '春节' },
  { date: '2026-02-18', reason: '春节' },
  { date: '2026-02-19', reason: '春节' },
  { date: '2026-02-20', reason: '春节' },
  { date: '2026-02-21', reason: '春节' },
  { date: '2026-02-22', reason: '春节' },
  { date: '2026-02-23', reason: '春节' },
  { date: '2026-04-04', reason: '清明' },
  { date: '2026-04-05', reason: '清明' },
  { date: '2026-04-06', reason: '清明' },
  { date: '2026-05-01', reason: '劳动节' },
  { date: '2026-05-02', reason: '劳动节' },
  { date: '2026-05-03', reason: '劳动节' },
  { date: '2026-06-19', reason: '端午' },
  { date: '2026-06-20', reason: '端午' },
  { date: '2026-06-21', reason: '端午' },
  { date: '2026-09-27', reason: '中秋' },
  { date: '2026-09-28', reason: '中秋' },
  { date: '2026-09-29', reason: '中秋' },
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

console.log(`日历已创建: ID=${calendarId}, 名称=中国建筑通用日历, 节假日=${holidays.length} 天`)
closeDatabase()
