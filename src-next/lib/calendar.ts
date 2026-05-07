import { eachDayOfInterval } from 'date-fns'

export interface DayStatus {
  date: string
  isWorkingDay: boolean
  reason: string | null
}

export function isWorkingDay(date: string, exceptions: DayStatus[]): boolean {
  const ex = exceptions.find(e => e.date === date)
  if (ex) return ex.isWorkingDay
  const d = new Date(date)
  const dow = d.getDay()
  return dow !== 0
}

function formatDateLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getWorkingDays(start: string, end: string, exceptions: DayStatus[]): string[] {
  const days = eachDayOfInterval({ start: new Date(start), end: new Date(end) })
  return days
    .filter(d => isWorkingDay(formatDateLocal(d), exceptions))
    .map(d => formatDateLocal(d))
}

export function getNonWorkingDays(start: string, end: string, exceptions: DayStatus[]): { date: string; reason: string | null }[] {
  const days = eachDayOfInterval({ start: new Date(start), end: new Date(end) })
  return days
    .filter(d => !isWorkingDay(formatDateLocal(d), exceptions))
    .map(d => {
      const ex = exceptions.find(e => e.date === formatDateLocal(d))
      return { date: formatDateLocal(d), reason: ex?.reason || null }
    })
}
