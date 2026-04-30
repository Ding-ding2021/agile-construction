/**
 * TaskKanbanView — 看板视图
 *
 * 按任务状态分组展示，每个状态一列，任务卡片可点击查看详情。
 */
import { useMemo } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import type { TaskItem, TaskStatus } from './taskManagement.types'
import { STATUS_TONE_MAP } from './taskManagement.types'
import StatusChip from '../ui/StatusChip'

const STATUS_ORDER: TaskStatus[] = [
  '待分配',
  '待执行',
  '执行中',
  '已暂停',
  '待提交',
  '待验收',
  '不通过',
  '已完成',
  '已关闭',
]

type TaskKanbanViewProps = {
  tasks: TaskItem[]
  onOpenTaskDetail?: (taskCode: string) => void
}

export default function TaskKanbanView({ tasks, onOpenTaskDetail }: TaskKanbanViewProps) {
  const columns = useMemo(() => {
    const groups: Record<string, TaskItem[]> = {}
    for (const s of STATUS_ORDER) groups[s] = []
    for (const t of tasks) {
      if (groups[t.status]) groups[t.status].push(t)
    }
    return STATUS_ORDER.filter(s => groups[s].length > 0).map(status => ({
      status,
      items: groups[status],
      count: groups[status].length,
    }))
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
    <Box sx={{ display: 'flex', gap: 3, p: 3, overflowX: 'auto', minHeight: 400 }}>
      {columns.map(col => (
        <Paper
          key={col.status}
          variant="outlined"
          sx={{
            minWidth: 240,
            maxWidth: 280,
            flexShrink: 0,
            bgcolor: 'var(--pm-element)',
            borderColor: 'var(--pm-border)',
            borderRadius: 'var(--pm-radius-card)',
          }}
        >
          {/* 列标题 */}
          <Box sx={{ p: 2, pb: 1.5, borderBottom: '1px solid var(--pm-border-light)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StatusChip label={col.status} tone={STATUS_TONE_MAP[col.status] ?? 'neutral'} />
              <Typography sx={{ fontSize: 12, color: 'var(--pm-text-40)' }}>{col.count}</Typography>
            </Box>
          </Box>

          {/* 任务卡片 */}
          <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {col.items.map(task => (
              <Paper
                key={task.code}
                variant="outlined"
                onClick={() => onOpenTaskDetail?.(task.code)}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  borderRadius: 'var(--pm-radius-md)',
                  bgcolor: 'var(--pm-card)',
                  borderColor: 'var(--pm-border)',
                  transition: 'all 0.15s',
                  '&:hover': {
                    bgcolor: 'var(--pm-element-hover)',
                    borderColor: 'var(--pm-primary-15)',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    mb: 0.5,
                    color: 'var(--pm-text-white)',
                    lineHeight: 1.3,
                  }}
                >
                  {task.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: 'var(--pm-text-40)',
                    fontFamily: 'monospace',
                    mb: 0.5,
                  }}
                >
                  {task.code}
                </Typography>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography sx={{ fontSize: 11, color: 'var(--pm-text-70)' }}>
                    {task.assigneeName || '—'}
                  </Typography>
                  {task.progress > 0 && (
                    <Typography sx={{ fontSize: 11, color: 'var(--pm-text-40)' }}>
                      {task.progress}%
                    </Typography>
                  )}
                </Box>
                {/* 进度条 */}
                {task.progress > 0 && (
                  <Box
                    sx={{
                      mt: 0.5,
                      height: 3,
                      bgcolor: 'var(--pm-border)',
                      borderRadius: 999,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${task.progress}%`,
                        height: '100%',
                        bgcolor: task.progress >= 100 ? 'var(--pm-green)' : 'var(--pm-blue)',
                        borderRadius: 999,
                      }}
                    />
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </Paper>
      ))}
    </Box>
  )
}
