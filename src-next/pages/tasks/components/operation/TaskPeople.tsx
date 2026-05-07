import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Label } from '@/components/ui/label'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import type { TaskDetail } from '@/types/task'

function toDate(s: string | undefined): Date | undefined {
  if (!s) return undefined
  const d = new Date(s.slice(0, 16).replace('T', ' ') || s)
  return isNaN(d.getTime()) ? undefined : d
}

function toStr(d: Date | undefined): string {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

type TaskPeopleSaveData = {
  assigneeName?: string
  plannedStartAt?: string
  plannedEndAt?: string
  actualStartAt?: string
  actualEndAt?: string
}

interface TaskPeopleProps {
  task: TaskDetail
  readonly?: boolean
  assigneeOptions?: { id: string; name: string }[]
  onSave?: (code: string, data: TaskPeopleSaveData) => void
}

export default function TaskPeople({ task, readonly, assigneeOptions = [], onSave }: TaskPeopleProps) {
  const [assigneeDraft, setAssigneeDraft] = useState(task.assigneeName ?? '')
  const [startDraft, setStartDraft] = useState(task.plannedStartAt?.slice(0, 16) ?? '')
  const [endDraft, setEndDraft] = useState(task.plannedEndAt?.slice(0, 16) ?? '')

  // Ensure current assignee is always in the options list
  const allOptions = task.assigneeName && !assigneeOptions.some(o => o.name === task.assigneeName)
    ? [{ id: task.assigneeName, name: task.assigneeName }, ...assigneeOptions]
    : assigneeOptions

  const handleDateSave = (type: 'start' | 'end', val: string) => {
    if (type === 'start') {
      setStartDraft(val)
      onSave?.(task.code, { plannedStartAt: val || undefined })
    } else {
      setEndDraft(val)
      onSave?.(task.code, { plannedEndAt: val || undefined })
    }
  }

  const handleActualDateSave = (type: 'actualStart' | 'actualEnd', val: string) => {
    if (type === 'actualStart') {
      onSave?.(task.code, { actualStartAt: val || undefined })
    } else {
      onSave?.(task.code, { actualEndAt: val || undefined })
    }
  }

  return (
    <Card className="p-4 space-y-3">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">负责人 & 时间</h4>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">负责人</Label>
        {readonly ? (
          <span className="text-sm">{task.assigneeName || '—'}</span>
        ) : (
          <NativeSelect
            value={assigneeDraft}
            onChange={e => setAssigneeDraft(e.target.value)}
            size="sm"
          >
            <NativeSelectOption value="未分配">未分配</NativeSelectOption>
            {allOptions.map(opt => (
              <NativeSelectOption key={opt.id} value={opt.name}>{opt.name}</NativeSelectOption>
            ))}
          </NativeSelect>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex-1 space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">计划开始</Label>
          {readonly ? (
            <span className="text-sm">{task.plannedStartAt?.slice(0, 16) || '—'}</span>
          ) : (
            <DateTimePicker
              value={toDate(startDraft)}
              onChange={d => handleDateSave('start', toStr(d))}
              placeholder="开始时间"
            />
          )}
        </div>
        <div className="flex-1 space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">计划结束</Label>
          {readonly ? (
            <span className="text-sm">{task.plannedEndAt?.slice(0, 16) || '—'}</span>
          ) : (
            <DateTimePicker
              value={toDate(endDraft)}
              onChange={d => handleDateSave('end', toStr(d))}
              placeholder="结束时间"
            />
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">实际开始</Label>
          {readonly ? (
            <span className="text-sm">{task.actualStartAt?.slice(0, 16) || '—'}</span>
          ) : (
            <DateTimePicker
              value={toDate(task.actualStartAt)}
              onChange={d => handleActualDateSave('actualStart', toStr(d))}
              placeholder="—"
            />
          )}
        </div>
        <div className="flex-1 space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">实际结束</Label>
          {readonly ? (
            <span className="text-sm">{task.actualEndAt?.slice(0, 16) || '—'}</span>
          ) : (
            <DateTimePicker
              value={toDate(task.actualEndAt)}
              onChange={d => handleActualDateSave('actualEnd', toStr(d))}
              placeholder="—"
            />
          )}
        </div>
      </div>
    </Card>
  )
}
