/**
 * TaskCalendarView — 日历视图
 *
 * 基于 react-big-calendar，支持月/周/日/议程四种视图。
 * 任务按计划结束日期展示为日历事件。
 */
import { useMemo, useCallback } from 'react'
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar'
import dayjs from 'dayjs'
import type { TaskItem } from './taskManagement.types'
import { STATUS_TONE_MAP } from './taskManagement.types'

import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dayjsLocalizer(dayjs)

type TaskCalendarViewProps = {
  tasks: TaskItem[]
  onOpenTaskDetail?: (taskCode: string) => void
}

/** 任务 → 日历事件 */
function taskToEvent(task: TaskItem) {
  const end = task.plannedEndAt || task.plannedStartAt || dayjs().add(7, 'day').format('YYYY-MM-DD')
  const start = task.plannedStartAt || end
  return {
    id: task.code,
    title: task.name,
    start: new Date(start),
    end: new Date(end),
    resource: task,
  }
}

const STATUS_TONE_COLORS: Record<string, string> = {
  green: '#00bc7d',
  blue: '#51a2ff',
  orange: '#ffb900',
  red: '#FF4D4F',
  neutral: 'rgba(255,255,255,0.40)',
}

export default function TaskCalendarView({ tasks, onOpenTaskDetail }: TaskCalendarViewProps) {
  const events = useMemo(() => tasks.map(taskToEvent), [tasks])

  const handleSelectEvent = useCallback(
    (event: { resource: TaskItem }) => onOpenTaskDetail?.(event.resource.code),
    [onOpenTaskDetail]
  )

  const eventStyleGetter = useCallback((event: { resource: TaskItem }) => {
    const tone = STATUS_TONE_MAP[event.resource.status] ?? 'neutral'
    return {
      style: {
        backgroundColor: 'var(--pm-primary-15, rgba(21,77,217,0.15))',
        borderLeft: `3px solid ${STATUS_TONE_COLORS[tone]}`,
        borderRadius: '4px',
        color: 'var(--pm-text-white, #fff)',
        fontSize: 12,
        padding: '2px 6px',
        cursor: 'pointer',
      } as React.CSSProperties,
    }
  }, [])

  return (
    <div style={{ height: 'calc(100vh - 320px)', padding: 16 }}>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        popup
        style={{ height: '100%' }}
        className="tm-calendar"
      />
    </div>
  )
}
