/**
 * TaskDetailPage — 任务详情页面组件
 *
 * 支持两种渲染模式：独立页面(mode='page')和侧栏抽屉(mode='drawer')。
 * 核心功能包括：编辑任务属性（负责人、计划时间、风险等级）、
 * 状态流转、附件管理、检查项追踪、流转日志查看。
 */
import { useState, type ChangeEvent } from 'react'
import type { TaskDetail, TaskPriority, TaskRiskLevel, TaskStatus } from './taskManagement.types'
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
  AccountTree,
  LocalOffer,
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

// ─── 设计令牌（映射到 src/index.css 中定义的 --pm-* CSS 变量） ──────
// MUI sx prop 直接使用 var() 函数引用全局 CSS 变量，确保视觉一致性
const t = (name: string) => `var(--pm-${name})`
const COLORS = {
  primary: t('primary'),
  bg: t('bg'),
  card: t('card'),
  border: t('border'),
  inputBg: t('element'),
  textWhite: t('text-white'),
  text70: t('text-70'),
  blue: t('blue'),
  green: t('green'),
  orange: t('orange'),
  red: t('red'),
  purple: t('purple'),
  priorityUrgent: t('red'),
  priorityHigh: t('orange'),
  priorityMedium: t('blue'),
  priorityLow: t('text-40'),
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  urgent: { label: '紧急', color: COLORS.priorityUrgent, bg: 'var(--pm-red-15)' },
  high: { label: '高', color: COLORS.priorityHigh, bg: 'var(--pm-orange-15)' },
  medium: { label: '中', color: COLORS.priorityMedium, bg: 'var(--pm-blue-15)' },
  low: { label: '低', color: COLORS.priorityLow, bg: 'var(--pm-text-14)' },
}

const NODE_TYPE_LABEL: Record<string, string> = {
  project_root: '项目根节点',
  work_package: '工作包',
  task: '任务',
  subtask: '子任务',
}

// ─── 共享子组件 ───────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: COLORS.blue, mb: 1.5 }}>
    {children}
  </Typography>
)

const CardSection = ({ children }: { children: React.ReactNode }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2.5,
      bgcolor: COLORS.card,
      borderColor: COLORS.border,
      borderRadius: '16px',
    }}
  >
    {children}
  </Paper>
)

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
      '& .MuiOutlinedInput-root': { backgroundColor: COLORS.inputBg },
      '& .MuiInputBase-input': { color: COLORS.textWhite },
    }}
  />
)

const StatusChip = styled(Chip)<{ statustone?: string }>(({ statustone }) => {
  const colors: Record<string, { bg: string; color: string }> = {
    green: { bg: 'var(--pm-green-15)', color: 'var(--pm-green)' },
    blue: { bg: 'var(--pm-blue-15)', color: 'var(--pm-blue-light)' },
    orange: { bg: 'var(--pm-orange-15)', color: 'var(--pm-orange-gold)' },
    red: { bg: 'var(--pm-red-15)', color: 'var(--pm-red)' },
    neutral: { bg: 'var(--pm-border)', color: 'var(--pm-text-70)' },
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

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
    <Typography variant="body2" sx={{ color: COLORS.text70 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ color: COLORS.textWhite, fontWeight: 500 }}>
      {value}
    </Typography>
  </Box>
)

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

  // 检测草稿态是否有未保存的变更，用于控制"保存/重置"按钮的显示
  const hasChanges =
    assigneeDraft !== (taskDetail.assigneeName ?? '') ||
    plannedStartAt !== taskDetail.plannedStartAt ||
    plannedEndAt !== taskDetail.plannedEndAt ||
    riskLevel !== taskDetail.riskLevel

  const getStatusTone = (status: TaskStatus): string => {
    const toneMap: Record<TaskStatus, string> = {
      草稿: 'neutral',
      待分配: 'neutral',
      待执行: 'neutral',
      执行中: 'blue',
      已暂停: 'orange',
      待提交: 'orange',
      待验收: 'orange',
      不通过: 'red',
      已完成: 'green',
      已关闭: 'green',
    }
    return toneMap[status] || 'neutral'
  }

  // 保存编辑：先处理负责人变更（如果指定了接单人），再更新计划时间和风险等级
  const handleSave = () => {
    if (assigneeDraft !== (taskDetail.assigneeName ?? '')) {
      onAssign?.(taskDetail.code, assigneeDraft)
    }
    onInlineUpdate?.(taskDetail.code, { plannedStartAt, plannedEndAt, riskLevel })
  }

  // 状态变更：仅当用户选择了不同于当前状态的新状态时才触发
  const handleStatusChange = () => {
    if (statusDraft !== taskDetail.status) {
      onStatusChange?.(taskDetail.code, statusDraft)
    }
  }

  // 附件上传：过滤空文件列表并清空 input 值，避免重复上传同一文件
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

  const priority = PRIORITY_CONFIG[taskDetail.priority]

  const statusActions = () => {
    // 任务状态流转：根据当前状态显示对应的操作按钮
    switch (taskDetail.status) {
      case '待分配':
        return null // 待分配状态无特定操作按钮
      case '待执行':
        return (
          <>
            <Button
              variant="contained"
              sx={{ bgcolor: COLORS.green }}
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
        )
      case '执行中':
      case '已暂停':
        // 执行中/已暂停 → 标记完成
        return (
          <Button
            variant="outlined"
            size="small"
            onClick={onMarkSubmissionReady}
            disabled={isReadonly}
          >
            标记完成
          </Button>
        )
      case '待提交':
        return (
          <Button
            variant="outlined"
            size="small"
            onClick={onMarkSubmissionReady}
            disabled={isReadonly}
          >
            提交验收
          </Button>
        )
      case '待验收':
        return (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onRejectWithRectification}
            disabled={isReadonly}
          >
            驳回整改
          </Button>
        )
      case '不通过':
        return (
          <Button variant="contained" size="small" onClick={onAdvance} disabled={isReadonly}>
            重新执行
          </Button>
        )
      default:
        return null // 已完成/已关闭/草稿等状态无特定操作按钮
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: COLORS.bg }}>
      {/* ── Header ── */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 0, flexShrink: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
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
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              size="small"
              label={priority.label}
              sx={{
                bgcolor: priority.bg,
                color: priority.color,
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 24,
              }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<Notifications />}
              onClick={onRemind}
              disabled={isReadonly}
            >
              催办
            </Button>
            {statusActions()}
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
          {taskDetail.code} · {taskDetail.projectName} ·{' '}
          {NODE_TYPE_LABEL[taskDetail.nodeLevelType] ?? taskDetail.nodeLevelType}
        </Typography>
      </Paper>

      {/* ── Body ── */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        <Stack spacing={2.5} sx={{ maxWidth: 720, mx: 'auto' }}>
          {/* ── Tags ── */}
          {taskDetail.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {taskDetail.tags.map(tag => (
                <Chip
                  key={tag}
                  icon={<LocalOffer sx={{ fontSize: 14 }} />}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: COLORS.border, color: COLORS.text70, height: 24 }}
                />
              ))}
            </Box>
          )}

          {/* ── Tree Context ── */}
          <CardSection>
            <SectionTitle>树形上下文</SectionTitle>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountTree sx={{ color: COLORS.blue, fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: COLORS.text70 }}>
                  项目：
                  <strong style={{ color: COLORS.textWhite }}>{taskDetail.projectName}</strong>
                </Typography>
              </Box>
              {taskDetail.parentTaskId && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                  <Typography variant="body2" sx={{ color: COLORS.text70 }}>
                    父任务 ID：
                    <strong style={{ color: COLORS.textWhite }}>{taskDetail.parentTaskId}</strong>
                  </Typography>
                </Box>
              )}
              <InfoRow
                label="节点层级"
                value={NODE_TYPE_LABEL[taskDetail.nodeLevelType] ?? taskDetail.nodeLevelType}
              />
              <InfoRow label="任务类型" value={taskDetail.taskType} />
              <InfoRow
                label="来源方式"
                value={
                  taskDetail.sourceType === 'manual'
                    ? '手动创建'
                    : taskDetail.sourceType === 'template'
                      ? '模板生成'
                      : taskDetail.sourceType === 'wbs'
                        ? 'WBS 分解'
                        : '标准派生'
                }
              />
            </Stack>
          </CardSection>

          {/* ── 执行信息 ── */}
          <CardSection>
            <SectionTitle>执行信息</SectionTitle>
            <Stack spacing={2}>
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
              <FormField
                label="执行方"
                value={taskDetail.assigneeType === 'internal' ? '内部团队' : '外部供应商'}
              />
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormField label="实际开始" value={taskDetail.actualStartAt ?? '--'} />
                <FormField label="实际结束" value={taskDetail.actualEndAt ?? '--'} />
              </Box>
              <InfoRow label="优先级" value={priority.label} />
              <InfoRow label="进度" value={`${taskDetail.progress}%`} />
            </Stack>
          </CardSection>

          {/* ── 状态与风险 ── */}
          <CardSection>
            <SectionTitle>状态与风险</SectionTitle>
            <Stack spacing={2}>
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
              <InfoRow label="SLA 状态" value={taskDetail.slaStatus} />
              <InfoRow label="前置任务状态" value={taskDetail.predecessorStatus} />
              <InfoRow label="催办次数" value={`${taskDetail.remindCount} 次`} />
              {taskDetail.blockedReason && (
                <TextField
                  label="阻塞原因"
                  value={taskDetail.blockedReason}
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  slotProps={{ input: { readOnly: true } }}
                  sx={{
                    '& .MuiOutlinedInput-root': { backgroundColor: 'var(--pm-red-15)' },
                    '& .MuiInputBase-input': { color: 'var(--pm-red)' },
                  }}
                />
              )}
            </Stack>
          </CardSection>

          {/* ── 标准与规范 ── */}
          <CardSection>
            <SectionTitle>标准与规范</SectionTitle>
            <Stack spacing={2}>
              <InfoRow label="标准绑定" value={taskDetail.standardBindingStatus} />
              <InfoRow label="标准快照" value={taskDetail.snapshotStatus ?? '未生成'} />
              {taskDetail.standardSnapshotId && (
                <InfoRow label="快照 ID" value={taskDetail.standardSnapshotId} />
              )}
              <Typography variant="body2" sx={{ color: COLORS.blue, fontWeight: 500, mt: 1 }}>
                执行标准
              </Typography>
              <TextField
                value={taskDetail.executionStandards.join('\n')}
                multiline
                rows={3}
                fullWidth
                slotProps={{ input: { readOnly: true } }}
                sx={{
                  '& .MuiOutlinedInput-root': { backgroundColor: COLORS.inputBg },
                  '& .MuiInputBase-input': { color: COLORS.textWhite, whiteSpace: 'pre-wrap' },
                }}
              />
              <Typography variant="body2" sx={{ color: COLORS.blue, fontWeight: 500, mt: 1 }}>
                验收标准
              </Typography>
              <TextField
                value={taskDetail.acceptanceStandards.join('\n')}
                multiline
                rows={3}
                fullWidth
                slotProps={{ input: { readOnly: true } }}
                sx={{
                  '& .MuiOutlinedInput-root': { backgroundColor: COLORS.inputBg },
                  '& .MuiInputBase-input': { color: COLORS.textWhite, whiteSpace: 'pre-wrap' },
                }}
              />
            </Stack>
          </CardSection>

          {/* ── 检查项 ── */}
          <CardSection>
            <SectionTitle>
              检查项 ({taskDetail.checklist.filter(i => i.done).length}/
              {taskDetail.checklist.length})
            </SectionTitle>
            <Stack spacing={1}>
              {taskDetail.checklist.length > 0 ? (
                taskDetail.checklist.map(item => (
                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.done ? (
                      <CheckCircle fontSize="small" sx={{ color: COLORS.green }} />
                    ) : (
                      <Cancel fontSize="small" sx={{ color: 'var(--pm-text-30)' }} />
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
                ))
              ) : (
                <Typography variant="body2" sx={{ color: COLORS.text70 }}>
                  暂无检查项
                </Typography>
              )}
            </Stack>
          </CardSection>

          {/* ── 附件 ── */}
          <CardSection>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <SectionTitle>附件 ({taskDetail.attachments.length})</SectionTitle>
              <Button
                component="label"
                variant="outlined"
                size="small"
                startIcon={<CloudUpload />}
                disabled={isReadonly}
              >
                上传附件
                <input type="file" multiple hidden onChange={handleAttachmentUpload} />
              </Button>
            </Box>
            <Stack spacing={1}>
              {taskDetail.attachments.length > 0 ? (
                taskDetail.attachments.map(att => (
                  <Paper
                    key={att.id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      bgcolor: COLORS.inputBg,
                    }}
                  >
                    <InsertDriveFile fontSize="small" sx={{ color: COLORS.blue }} />
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
                ))
              ) : (
                <Typography variant="body2" sx={{ color: COLORS.text70 }}>
                  暂无附件
                </Typography>
              )}
            </Stack>
          </CardSection>

          {/* ── 关联任务 ── */}
          {taskDetail.relations.length > 0 && (
            <CardSection>
              <SectionTitle>关联任务 ({taskDetail.relations.length})</SectionTitle>
              <Stack spacing={0}>
                {taskDetail.relations.map(rel => (
                  <Box
                    key={rel.id}
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--pm-border-light)',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box>
                      <Typography variant="body2">
                        {rel.toTaskName ?? rel.fromTaskName ?? rel.id}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontFamily: 'monospace' }}
                      >
                        {rel.fromTaskId} → {rel.toTaskId}
                      </Typography>
                    </Box>
                    <Chip size="small" label={rel.relationType} variant="outlined" />
                  </Box>
                ))}
              </Stack>
            </CardSection>
          )}

          {/* ── 流转日志 ── */}
          {taskDetail.flowLogs.length > 0 && (
            <CardSection>
              <SectionTitle>流转日志 ({taskDetail.flowLogs.length})</SectionTitle>
              <Stack spacing={0}>
                {taskDetail.flowLogs.map((log, idx) => (
                  <Box
                    key={log.id}
                    sx={{
                      p: 1.5,
                      bgcolor: idx === 0 ? 'var(--pm-primary-15)' : 'transparent',
                      borderBottom: '1px solid var(--pm-border-light)',
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
            </CardSection>
          )}

          {/* ── 保存按钮 ── */}
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
