import { calendarsApi } from '@/services/api'
import type { DayStatus } from './calendar'

let cachedNonWorkingDays: { from: string; to: string; data: DayStatus[] } | null = null

export async function loadNonWorkingDays(from: string, to: string, signal?: AbortSignal): Promise<DayStatus[]> {
  if (cachedNonWorkingDays && cachedNonWorkingDays.from === from && cachedNonWorkingDays.to === to) {
    return cachedNonWorkingDays.data
  }
  const data = await calendarsApi.checkPeriod(from, to, signal)
  const nonWorking = data.filter(d => !d.isWorkingDay)
  cachedNonWorkingDays = { from, to, data }
  return nonWorking
}
