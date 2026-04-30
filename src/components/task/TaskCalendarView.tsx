/**
 * TaskCalendarView — 日历视图
 *
 * 按任务计划结束日期分组展示，每日为一组，按日期排序。
 */
import { useMemo } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import type { TaskItem } from './taskManagement.types'
import { STATUS_TONE_MAP } from './taskManagement.types'
import StatusChip from '../ui/StatusChip'

type TaskCalendarViewProps = {
  tasks: TaskItem[]
  onOpenTaskDetail?: (taskCode: string) => void
}

export default function TaskCalendarView({ tasks, onOpenTaskDetail }: TaskCalendarViewProps) {
  const days = useMemo(() => {
    const map = new Map<string, TaskItem[]>()
    // 按结束日期分组，空日期的归到"未排期"
    for (const t of tasks) {
      const key = t.plannedEndAt || '未排期'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(t)
    }
    // 排序：有日期的按日期排，未排期放最后
    const sorted = Array.from(map.entries()).sort(([a], [b]) => {
      if (a === '未排期') return 1
      if (b === '未排期') return -1
      return a.localeCompare(b)
    })
    return sorted
  }, [tasks])

  if (tasks.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
          color: 'var(--pm-text-40)',
          fontSize: 14,
        }}
      >
        暂无任务数据
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, overflow: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {days.map(([date, items]) => (
          <Paper
            key={date}
            variant="outlined"
            sx={{
              bgcolor: 'var(--pm-card)',
              borderColor: 'var(--pm-border)',
              borderRadius: 'var(--pm-radius-card)',
            }}
          >
            {/* 日期头 */}
            <Box sx={{ p: 2, pb: 1.5, borderBottom: '1px solid var(--pm-border-light)' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'var(--pm-text-white)' }}>
                {date === '未排期' ? '未排期' : date}
                <Typography
                  component="span"
                  sx={{ fontSize: 12, color: 'var(--pm-text-40)', ml: 1 }}
                >
                  {items.length} 个任务
                </Typography>
              </Typography>
            </Box>

            {/* 任务列表 */}
            <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {items.map(task => (
                <Paper
                  key={task.code}
                  variant="outlined"
                  onClick={() => onOpenTaskDetail?.(task.code)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    borderRadius: 'var(--pm-radius-md)',
                    bgcolor: 'var(--pm-element)',
                    borderColor: 'var(--pm-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.15s',
                    '&:hover': {
                      bgcolor: 'var(--pm-element-hover)',
                      borderColor: 'var(--pm-primary-15)',
                    },
                  }}
                >
                  <StatusChip
                    label={task.status}
                    tone={STATUS_TONE_MAP[task.status] ?? 'neutral'}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 500, color: 'var(--pm-text-white)' }}
                    >
                      {task.name}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 11, color: 'var(--pm-text-40)', fontFamily: 'monospace' }}
                    >
                      {task.code}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{ fontSize: 12, color: 'var(--pm-text-70)', whiteSpace: 'nowrap' }}
                  >
                    {task.assigneeName || '—'}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  )
}
