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
