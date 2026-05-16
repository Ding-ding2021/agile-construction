import dayjs from 'dayjs'

export type SlaStatus = 'normal' | 'warning' | 'overdue'

export function calculateSlaStatus(
  dueDate: string | null,
  status: string,
  actualEndAt: string | null
): SlaStatus {
  if (status === '已完成' || status === '已关闭') {
    return 'normal'
  }

  if (dueDate === null) {
    return 'normal'
  }

  const now = dayjs()
  const due = dayjs(dueDate)

  if (now.isAfter(due)) {
    return 'overdue'
  }

  if (due.diff(now, 'minute') <= 24 * 60) {
    return 'warning'
  }

  return 'normal'
}
