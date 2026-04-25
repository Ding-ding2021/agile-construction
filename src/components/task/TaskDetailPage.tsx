import { useState, type ChangeEvent } from 'react'
import type { TaskDetail, TaskRiskLevel, TaskStatus } from './taskManagement.types'
import { resolveAvailableStatusOptions, isTaskReadonlyStatus } from './taskManagement.types'

// MUI Components
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  Stack,
  styled,
} from '@mui/material'

// MUI Icons
import {
  ArrowBack,
  Notifications,
  PlayArrow,
  CloudUpload,
  Delete,
  InsertDriveFile,
  Close,
  Save,
  CheckCircle,
  Cancel,
} from '@mui/icons-material'

export type TaskAssigneeOption = {
  id: string
  name: string
  disabled: boolean
  statusLabel?: string
}

export type TaskDispatchRecommendation = {
  assigneeName: string
  reason: string
  score: number
}

type TaskDetailPageProps = {
  taskDetail: TaskDetail
  onBack: () => void
  mode?: 'page' | 'drawer'
  onRemind?: () => void
  onAdvance?: () => void
  onMarkSubmissionReady?: () => void
  onRejectWithRectification?: () => void
  onAcceptDispatch?: () => void
  onRejectDispatch?: () => void
  assigneeOptions?: TaskAssigneeOption[]
  onAssign?: (
    taskCode: string,
    assigneeName: string,
    meta?: { source: 'manual' | 'recommendation'; reason?: string }
  ) => void
  onInlineUpdate?: (
    taskCode: string,
    payload: { plannedStartAt?: string; plannedEndAt?: string; riskLevel?: TaskRiskLevel }
  ) => void
  onStatusChange?: (taskCode: string, nextStatus: TaskStatus) => void
  onUploadAttachments?: (taskCode: string, files: File[]) => void
  onRemoveAttachment?: (taskCode: string, attachmentId: string) => void
}

// 表单字段组件 - 只读
const FormField = ({
  label,
  value,
  multiline = false,
}: {
  label: string
  value: string
  multiline?: boolean
}) => (
  <TextField
    label={label}
    value={value}
    fullWidth
    variant="outlined"
    size="small"
    multiline={multiline}
    rows={multiline ? 3 : 1}
    slotProps={{ input: { readOnly: true } }}
    sx={{
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
      },
      '& .MuiInputBase-input': {
        color: 'rgba(255, 255, 255, 0.90)',
      },
    }}
  />
)

// 状态标签组件
const StatusChip = styled(Chip)<{ statustone?: string }>(({ statustone }) => {
  const colors: Record<string, { bg: string; color: string }> = {
    green: { bg: 'rgba(0, 188, 125, 0.15)', color: '#00D492' },
    blue: { bg: 'rgba(43, 127, 255, 0.15)', color: '#51A2FF' },
    orange: { bg: 'rgba(254, 154, 0, 0.15)', color: '#FFB900' },
    red: { bg: 'rgba(255, 77, 79, 0.15)', color: '#FF7875' },
    neutral: { bg: 'rgba(255, 255, 255, 0.08)', color: 'rgba(255, 255, 255, 0.70)' },
  }
  const colorSet = colors[statustone || 'neutral']
  return {
    backgroundColor: colorSet.bg,
    color: colorSet.color,
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 28,
  }
})

const TaskDetailPage = ({
  taskDetail,
  onBack,
  mode = 'page',
  onRemind,
  onAdvance,
  onMarkSubmissionReady,
  onRejectWithRectification,
  onAcceptDispatch,
  onRejectDispatch,
  assigneeOptions = [],
  onAssign,
  onInlineUpdate,
  onStatusChange,
  onUploadAttachments,
  onRemoveAttachment,
}: TaskDetailPageProps) => {
  const isDrawer = mode === 'drawer'
  const isReadonly = isTaskReadonlyStatus(taskDetail.status)

  // 编辑状态
  const [assigneeDraft, setAssigneeDraft] = useState(taskDetail.assigneeName ?? '')
  const [plannedStartAt, setPlannedStartAt] = useState(taskDetail.plannedStartAt)
  const [plannedEndAt, setPlannedEndAt] = useState(taskDetail.plannedEndAt)
  const [riskLevel, setRiskLevel] = useState<TaskRiskLevel>(taskDetail.riskLevel)
  const [statusDraft, setStatusDraft] = useState<TaskStatus>(taskDetail.status)

  const hasChanges =
    assigneeDraft !== (taskDetail.assigneeName ?? '') ||
    plannedStartAt !== taskDetail.plannedStartAt ||
    plannedEndAt !== taskDetail.plannedEndAt ||
    riskLevel !== taskDetail.riskLevel

  const getStatusTone = (status: TaskStatus): string => {
    const toneMap: Record<TaskStatus, string> = {
      待创建: 'neutral',
      待分配: 'neutral',
      待执行: 'neutral',
      执行中: 'blue',
      待提交: 'orange',
      待验收: 'orange',
      不通过: 'red',
      已完成: 'green',
      已关闭: 'green',
    }
    return toneMap[status] || 'neutral'
  }

  const handleSave = () => {
    if (assigneeDraft !== (taskDetail.assigneeName ?? '')) {
      onAssign?.(taskDetail.code, assigneeDraft)
    }
    onInlineUpdate?.(taskDetail.code, { plannedStartAt, plannedEndAt, riskLevel })
  }

  const handleStatusChange = () => {
    if (statusDraft !== taskDetail.status) {
      onStatusChange?.(taskDetail.code, statusDraft)
    }
  }

  const handleAttachmentUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (!fileList || fileList.length === 0 || isReadonly) return
    onUploadAttachments?.(taskDetail.code, Array.from(fileList))
    event.target.value = ''
  }

  const formatFileSize = (kb: number) => {
    if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`
    return `${kb} KB`
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#051338' }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 0, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isDrawer && (
              <IconButton onClick={onBack} size="small">
                <ArrowBack />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {taskDetail.name}
            </Typography>
            <StatusChip
              size="small"
              label={taskDetail.status}
              statustone={getStatusTone(taskDetail.status)}
            />
            {isReadonly && <Chip size="small" label="归档" variant="outlined" />}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Notifications />}
              onClick={onRemind}
              disabled={isReadonly}
            >
              催办
            </Button>
            {taskDetail.status === '待执行' && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={onAcceptDispatch}
                  disabled={isReadonly}
                >
                  接单
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={onRejectDispatch}
                  disabled={isReadonly}
                >
                  拒单
                </Button>
              </>
            )}
            {taskDetail.status === '待提交' && (
              <Button
                variant="outlined"
                size="small"
                onClick={onMarkSubmissionReady}
                disabled={isReadonly}
              >
                标记完成
              </Button>
            )}
            {taskDetail.status === '待验收' && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={onRejectWithRectification}
                disabled={isReadonly}
              >
                驳回
              </Button>
            )}
            <Button
              variant="contained"
              size="small"
              startIcon={<PlayArrow />}
              onClick={onAdvance}
              disabled={isReadonly}
            >
              流转
            </Button>
            {isDrawer && (
              <IconButton onClick={onBack} size="small">
                <Close />
              </IconButton>
            )}
          </Box>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: 'block', fontFamily: 'monospace' }}
        >
          {taskDetail.code} · {taskDetail.taskType}
        </Typography>
      </Paper>

      {/* Form Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        <Stack spacing={2.5} sx={{ maxWidth: 720, mx: 'auto' }}>
          {/* 基本信息组 */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2B7FFF', mb: 1 }}>
            基本信息
          </Typography>

          <FormField label="任务名称" value={taskDetail.name} />
          <FormField label="任务编码" value={taskDetail.code} />
          <FormField label="任务类型" value={taskDetail.taskType} />
          <FormField label="项目路径" value={taskDetail.parentPath} />

          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

          {/* 执行信息组 */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2B7FFF', mb: 1 }}>
            执行信息
          </Typography>

          {/* 负责人 - 可编辑 */}
          <FormControl fullWidth size="small">
            <InputLabel>负责人</InputLabel>
            <Select
              value={assigneeDraft}
              label="负责人"
              disabled={isReadonly}
              onChange={e => setAssigneeDraft(e.target.value)}
            >
              <MenuItem value="">
                <em>未分配</em>
              </MenuItem>
              {assigneeOptions.map(opt => (
                <MenuItem key={opt.id} value={opt.name} disabled={opt.disabled}>
                  {opt.name} {opt.statusLabel && `(${opt.statusLabel})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 执行方 */}
          <FormField
            label="执行方"
            value={taskDetail.assigneeType === 'internal' ? '内部团队' : '外部供应商'}
          />

          {/* 计划时间 - 可编辑 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="计划开始"
              type="date"
              size="small"
              fullWidth
              value={plannedStartAt}
              disabled={isReadonly}
              onChange={e => setPlannedStartAt(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="计划结束"
              type="date"
              size="small"
              fullWidth
              value={plannedEndAt}
              disabled={isReadonly}
              onChange={e => setPlannedEndAt(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          {/* 实际时间 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormField label="实际开始" value={taskDetail.actualStartAt ?? '--'} />
            <FormField label="实际结束" value={taskDetail.actualEndAt ?? '--'} />
          </Box>

          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

          {/* 状态信息组 */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2B7FFF', mb: 1 }}>
            状态信息
          </Typography>

          {/* 任务状态 - 可编辑 */}
          <FormControl fullWidth size="small">
            <InputLabel>任务状态</InputLabel>
            <Select
              value={statusDraft}
              label="任务状态"
              disabled={isReadonly}
              onChange={e => setStatusDraft(e.target.value as TaskStatus)}
            >
              {resolveAvailableStatusOptions(taskDetail.status).map(s => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {statusDraft !== taskDetail.status && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleStatusChange}
              sx={{ alignSelf: 'flex-start' }}
            >
              应用状态变更
            </Button>
          )}

          {/* 风险等级 - 可编辑 */}
          <FormControl fullWidth size="small">
            <InputLabel>风险等级</InputLabel>
            <Select
              value={riskLevel}
              label="风险等级"
              disabled={isReadonly}
              onChange={e => setRiskLevel(e.target.value as TaskRiskLevel)}
            >
              {['低风险', '中风险', '高风险'].map(r => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* SLA */}
          <FormField label="SLA状态" value={taskDetail.slaStatus} />
          <FormField label="前置任务状态" value={taskDetail.predecessorStatus} />
          {taskDetail.blockedReason && (
            <FormField label="阻塞原因" value={taskDetail.blockedReason} />
          )}
          <FormField label="催办次数" value={`${taskDetail.remindCount} 次`} />

          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

          {/* 标准信息组 */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2B7FFF', mb: 1 }}>
            标准与规范
          </Typography>

          <FormField label="标准绑定状态" value={taskDetail.standardBindingStatus} />
          <FormField label="标准快照状态" value={taskDetail.snapshotStatus ?? '未生成'} />
          {taskDetail.standardSnapshotId && (
            <FormField label="快照ID" value={taskDetail.standardSnapshotId} />
          )}

          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

          {/* 执行标准 */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2B7FFF', mb: 1 }}>
            执行标准
          </Typography>
          <TextField
            value={taskDetail.executionStandards.join('\n')}
            multiline
            rows={4}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
            sx={{
              '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.03)' },
              '& .MuiInputBase-input': {
                color: 'rgba(255, 255, 255, 0.90)',
                whiteSpace: 'pre-wrap',
              },
            }}
          />

          {/* 验收标准 */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2B7FFF', mb: 1, mt: 2 }}>
            验收标准
          </Typography>
          <TextField
            value={taskDetail.acceptanceStandards.join('\n')}
            multiline
            rows={4}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
            sx={{
              '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.03)' },
              '& .MuiInputBase-input': {
                color: 'rgba(255, 255, 255, 0.90)',
                whiteSpace: 'pre-wrap',
              },
            }}
          />

          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

          {/* 检查项 */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2B7FFF', mb: 1 }}>
            检查项 ({taskDetail.checklist.filter(i => i.done).length}/{taskDetail.checklist.length})
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'transparent' }}>
            <Stack spacing={1}>
              {taskDetail.checklist.map(item => (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.done ? (
                    <CheckCircle fontSize="small" sx={{ color: '#00BC7D' }} />
                  ) : (
                    <Cancel fontSize="small" sx={{ color: 'rgba(255,255,255,0.3)' }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: item.done ? 'line-through' : 'none',
                      color: item.done ? 'text.secondary' : 'text.primary',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

          {/* 附件 */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2B7FFF', mb: 1 }}>
            附件 ({taskDetail.attachments.length})
          </Typography>

          <Button
            component="label"
            variant="outlined"
            size="small"
            startIcon={<CloudUpload />}
            disabled={isReadonly}
            sx={{ alignSelf: 'flex-start' }}
          >
            上传附件
            <input type="file" multiple hidden onChange={handleAttachmentUpload} />
          </Button>

          <Stack spacing={1}>
            {taskDetail.attachments.map(att => (
              <Paper
                key={att.id}
                variant="outlined"
                sx={{
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  bgcolor: 'rgba(255,255,255,0.03)',
                }}
              >
                <InsertDriveFile fontSize="small" sx={{ color: '#2B7FFF' }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {att.fileName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {att.uploader} · {formatFileSize(att.fileSizeKb)}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  color="error"
                  disabled={isReadonly}
                  onClick={() => onRemoveAttachment?.(taskDetail.code, att.id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Paper>
            ))}
          </Stack>

          {/* 关联任务 */}
          {taskDetail.relations.length > 0 && (
            <>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2B7FFF', mb: 1 }}>
                关联任务 ({taskDetail.relations.length})
              </Typography>
              <Paper variant="outlined" sx={{ bgcolor: 'transparent' }}>
                <Stack spacing={0}>
                  {taskDetail.relations.map(rel => (
                    <Box
                      key={rel.code}
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <Box>
                        <Typography variant="body2">{rel.name}</Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontFamily: 'monospace' }}
                        >
                          {rel.code}
                        </Typography>
                      </Box>
                      <Chip size="small" label={rel.type} variant="outlined" />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </>
          )}

          {/* 日志 */}
          {taskDetail.flowLogs.length > 0 && (
            <>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2B7FFF', mb: 1 }}>
                流转日志 ({taskDetail.flowLogs.length})
              </Typography>
              <Paper variant="outlined" sx={{ bgcolor: 'transparent' }}>
                <Stack spacing={0}>
                  {taskDetail.flowLogs.map((log, idx) => (
                    <Box
                      key={log.id}
                      sx={{
                        p: 1.5,
                        bgcolor: idx === 0 ? 'rgba(21, 77, 217, 0.10)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {log.action}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {log.time}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {log.operator} · {log.detail}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </>
          )}

          {/* 保存按钮 */}
          {hasChanges && !isReadonly && (
            <Box sx={{ position: 'sticky', bottom: 16, pt: 2, pb: 2 }}>
              <Paper sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setAssigneeDraft(taskDetail.assigneeName ?? '')
                    setPlannedStartAt(taskDetail.plannedStartAt)
                    setPlannedEndAt(taskDetail.plannedEndAt)
                    setRiskLevel(taskDetail.riskLevel)
                  }}
                >
                  重置
                </Button>
                <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
                  保存修改
                </Button>
              </Paper>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default TaskDetailPage
