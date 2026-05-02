/**
 * TaskDetailPage — 任务详情页面组件
 *
 * 支持两种渲染模式：独立页面(mode='page')和侧栏抽屉(mode='drawer')。
 * 核心功能包括：编辑任务属性（负责人、计划时间、风险等级）、
 * 状态流转、附件管理、检查项追踪、流转日志查看。
 */
import { useState, type SyntheticEvent } from 'react'
import dayjs from 'dayjs'
import type {
  TaskDetail,
  TaskPriority,
  TaskRelation,
  TaskRiskLevel,
  TaskStatus,
} from './taskManagement.types'
import { isTaskReadonlyStatus, STATUS_TONE_MAP } from './taskManagement.types'
import { getAvailableNextStatuses } from './taskStateMachine.guards'
import type { TaskItem } from './taskManagement.types'
import {
  StatusChip,
  CardSection,
  SectionTitle,
  Field,
  FieldRow,
  SubmitDialog,
  ReviewDialog,
  AttachmentList,
} from '../ui'
import StatusSelect, { type StatusTone } from '../ui/StatusSelect'

// 规范封装组件
import { PmButton, PmInput, PmSelect, PmCard, PmDatePicker, PmPersonnelSelect } from '../shared/mui'

// MUI Components
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Stack,
  Tabs,
  Tab,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  TextField,
  Autocomplete,
} from '@mui/material'

// MUI Icons
import {
  Notifications,
  Close,
  Save,
  CheckCircle,
  Cancel,
  CloudUpload,
  LocalOffer,
  NavigateBefore,
  NavigateNext,
  VisibilityOutlined,
  StarBorder,
  ChatBubbleOutlineOutlined,
  MoreHoriz,
  WarningAmber,
  Add,
  Delete,
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
  currentIndex?: number
  totalCount?: number
  onPrev?: () => void
  onNext?: () => void
  onRemind?: () => void
  onWatch?: () => void
  onFavorite?: () => void
  onComment?: () => void
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
  onCreateSubmission?: (taskCode: string, payload: { description?: string }) => void
  onAddRelation?: (
    taskCode: string,
    relation: {
      fromTaskId: string
      toTaskId: string
      relationType: 'finish_start' | 'start_start' | 'finish_finish' | 'start_finish'
    }
  ) => void
  onRemoveRelation?: (taskCode: string, relationId: string) => void
  onBindStandard?: (taskCode: string, catalogItemId: string) => void
  bindableTemplates?: {
    id: string
    name: string
    executionCount: number
    acceptanceCount: number
  }[]
  /** 全量任务列表，用于状态守卫的前置任务校验 */
  allTasks?: TaskItem[]
  onTagsChange?: (taskCode: string, tags: string[]) => void
  onReviewSubmission?: (
    taskCode: string,
    payload: {
      submissionId: string
      result: 'pass' | 'reject'
      comment?: string
    }
  ) => void
}

// ─── 设计令牌（映射到 src/index.css 中定义的 --pm-* CSS 变量） ──────
// MUI sx prop 直接使用 var() 函数引用全局 CSS 变量，确保视觉一致性
const t = (name: string) => `var(--pm-${name})`
const COLORS = {
  primary: t('primary'),
  bg: t('bg'),
  card: t('card'),
  border: t('border'),
  borderLight: t('border-light'),
  textWhite: t('text-white'),
  text70: t('text-70'),
  text40: t('text-40'),
  blue: t('blue'),
  blueLight: t('blue-light'),
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

const RELATION_TYPE_LABELS: Record<string, string> = {
  finish_start: ' finish→start ',
  start_start: ' start→start ',
  finish_finish: ' finish→finish ',
  start_finish: ' start→finish ',
}

const RELATION_TYPE_OPTIONS: { value: TaskRelation['relationType']; label: string }[] = [
  { value: 'finish_start', label: '完成-开始 (FS)' },
  { value: 'start_start', label: '开始-开始 (SS)' },
  { value: 'finish_finish', label: '完成-完成 (FF)' },
  { value: 'start_finish', label: '开始-完成 (SF)' },
]

const NODE_TYPE_LABEL: Record<string, string> = {
  project_root: '项目根节点',
  work_package: '工作包',
  task: '任务',
  subtask: '子任务',
}

// ─── 局部子组件 ───────────────────────────────────────────────
// FormField 是 TextField 的只读封装，仅在详情页使用，暂不提取

const FormField = ({
  label,
  value,
  multiline = false,
}: {
  label: string
  value: string
  multiline?: boolean
}) => (
  <PmInput
    label={label}
    value={value}
    fullWidth
    multiline={multiline}
    rows={multiline ? 3 : 1}
    slotProps={{ input: { readOnly: true } }}
    sx={{
      '& .MuiInputBase-input': { color: COLORS.textWhite },
    }}
  />
)

const TaskDetailPage = ({
  taskDetail,
  onBack,
  mode: _mode = 'page',
  currentIndex,
  totalCount,
  onPrev,
  onNext,
  onRemind,
  onWatch,
  onFavorite,
  onComment,
  assigneeOptions = [],
  onAssign,
  onInlineUpdate,
  onStatusChange,
  onUploadAttachments,
  onRemoveAttachment,
  onCreateSubmission,
  onReviewSubmission,
  onAddRelation,
  onRemoveRelation,
  onBindStandard,
  bindableTemplates = [],
  allTasks = [],
  onTagsChange,
}: TaskDetailPageProps) => {
  const isReadonly = isTaskReadonlyStatus(taskDetail.status)

  // 编辑状态
  const [assigneeDraft, setAssigneeDraft] = useState(taskDetail.assigneeName ?? '')
  const [plannedStartAt, setPlannedStartAt] = useState(
    taskDetail.plannedStartAt ? dayjs(taskDetail.plannedStartAt) : null
  )
  const [plannedEndAt, setPlannedEndAt] = useState(
    taskDetail.plannedEndAt ? dayjs(taskDetail.plannedEndAt) : null
  )
  const [riskLevel, setRiskLevel] = useState<TaskRiskLevel>(taskDetail.riskLevel)
  const [actualStartDate, setActualStartDate] = useState<dayjs.Dayjs | null>(
    taskDetail.actualStartAt ? dayjs(taskDetail.actualStartAt) : null
  )
  const [actualEndDate, setActualEndDate] = useState<dayjs.Dayjs | null>(
    taskDetail.actualEndAt ? dayjs(taskDetail.actualEndAt) : null
  )
  const [activeTab, setActiveTab] = useState(0)

  // Dialog 状态
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showAddRelation, setShowAddRelation] = useState(false)
  const [relationSearch, setRelationSearch] = useState('')
  const [relationType, setRelationType] = useState<TaskRelation['relationType']>('finish_start')
  const [showBindStandard, setShowBindStandard] = useState(false)

  const handleTabChange = (_e: SyntheticEvent, v: number) => setActiveTab(v)

  // 检测草稿态是否有未保存的变更，用于控制"保存/重置"按钮的显示
  const plannedStartStr = plannedStartAt?.format('YYYY-MM-DDTHH:mm:ss') ?? ''
  const plannedEndStr = plannedEndAt?.format('YYYY-MM-DDTHH:mm:ss') ?? ''
  const hasChanges =
    assigneeDraft !== (taskDetail.assigneeName ?? '') ||
    plannedStartStr !== (taskDetail.plannedStartAt ?? '') ||
    plannedEndStr !== (taskDetail.plannedEndAt ?? '') ||
    riskLevel !== taskDetail.riskLevel

  const handleStatusSelect = (nextStatus: string) => {
    const next = nextStatus as TaskStatus
    if (taskDetail.status === '待提交' && next === '待验收') {
      setShowSubmitDialog(true)
      return
    }
    if (next === '待验收' || next === '不通过') {
      if (taskDetail.status === '待验收') {
        setShowReviewDialog(true)
        return
      }
    }
    onStatusChange?.(taskDetail.code, next)
  }

  // 保存编辑：先处理负责人变更（如果指定了接单人），再更新计划时间和风险等级
  const handleSave = () => {
    if (assigneeDraft !== (taskDetail.assigneeName ?? '')) {
      onAssign?.(taskDetail.code, assigneeDraft)
    }
    onInlineUpdate?.(taskDetail.code, {
      plannedStartAt: plannedStartStr || undefined,
      plannedEndAt: plannedEndStr || undefined,
      riskLevel,
    })
  }

  const priority = PRIORITY_CONFIG[taskDetail.priority]

  const progressColor: StatusTone =
    taskDetail.progress >= 100
      ? 'green'
      : taskDetail.progress >= 60
        ? 'blue'
        : taskDetail.progress >= 30
          ? 'orange'
          : 'red'

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: COLORS.bg }}>
      {/* ── 导航栏 ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: COLORS.borderLight,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={onPrev} sx={{ color: COLORS.text70 }}>
            <NavigateBefore fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onNext} sx={{ color: COLORS.text70 }}>
            <NavigateNext fontSize="small" />
          </IconButton>
          {totalCount !== undefined && (
            <Typography sx={{ fontSize: 11, color: COLORS.text40, ml: 1 }}>
              {(currentIndex ?? 0) + 1} / {totalCount}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={onWatch} sx={{ color: COLORS.text70 }} title="关注">
            <VisibilityOutlined fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onFavorite} sx={{ color: COLORS.text70 }} title="收藏">
            <StarBorder fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onComment} sx={{ color: COLORS.text70 }} title="评论">
            <ChatBubbleOutlineOutlined fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: COLORS.text70 }} title="更多">
            <MoreHoriz fontSize="small" />
          </IconButton>
          <Box sx={{ width: 1, height: 20, bgcolor: COLORS.borderLight, mx: 0.5 }} />
          <IconButton size="small" onClick={onBack} sx={{ color: COLORS.text70 }} title="关闭">
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* ── 标题区 ── */}
      <Box sx={{ px: 3, pt: 1.5, pb: 1, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>{taskDetail.name}</Typography>
          <StatusChip
            label={taskDetail.status}
            tone={STATUS_TONE_MAP[taskDetail.status] ?? 'neutral'}
          />
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
        </Box>
        <Typography
          sx={{ fontSize: 12, color: COLORS.text40, fontFamily: 'monospace', display: 'block' }}
        >
          {taskDetail.code} · {taskDetail.projectName} ·{' '}
          {NODE_TYPE_LABEL[taskDetail.nodeLevelType] ?? taskDetail.nodeLevelType}
        </Typography>
      </Box>

      {/* ── Tabs ── */}
      <Box
        sx={{
          bgcolor: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid',
          borderColor: COLORS.border,
          borderRadius: '8px 8px 0 0',
          flexShrink: 0,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              py: 0.5,
              fontSize: 12,
              fontWeight: 500,
              color: COLORS.text40,
              '&.Mui-selected': { color: '#fff' },
            },
          }}
        >
          <Tab label="基本信息" />
          <Tab label="流程" />
          <Tab label="资料" />
          <Tab label="历史" />
          <Tab label="关联" />
        </Tabs>
      </Box>

      {/* ── Tab Content ── */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 6 }}>
        <Stack spacing={6} sx={{ maxWidth: 720, mx: 'auto' }}>
          {/* ═══ Tab 1: 基本信息 ═══ */}
          {activeTab === 0 && (
            <>
              <CardSection>
                <SectionTitle>基本信息</SectionTitle>
                {/* Tags */}
                <Box sx={{ mb: 1.5 }}>
                  {!isReadonly ? (
                    <Autocomplete
                      multiple
                      freeSolo
                      options={[]}
                      value={taskDetail.tags}
                      onChange={(_e, newValue) => {
                        onTagsChange?.(taskDetail.code, newValue as string[])
                      }}
                      slotProps={{
                        chip: {
                          icon: <LocalOffer sx={{ fontSize: 14 }} />,
                          size: 'small',
                          variant: 'outlined',
                          sx: {
                            borderColor: COLORS.border,
                            color: COLORS.text70,
                            height: 24,
                            '& .MuiChip-deleteIcon': { color: COLORS.text40 },
                          },
                        },
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder="添加标签..."
                          variant="outlined"
                          sx={{
                            minWidth: 200,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'var(--pm-input-bg)',
                              borderRadius: 'var(--pm-radius-sm, 8px)',
                              py: 0,
                              '& fieldset': { borderColor: 'var(--pm-border)' },
                              '&:hover fieldset': { borderColor: 'var(--pm-border)' },
                              '&.Mui-focused fieldset': { borderColor: 'var(--pm-primary)' },
                            },
                            '& .MuiInputBase-input': {
                              color: 'var(--pm-text-white)',
                              fontSize: 14,
                              py: 1.2,
                            },
                            '& .MuiAutocomplete-tag': {
                              mb: 0,
                              mt: 0,
                            },
                          }}
                        />
                      )}
                    />
                  ) : (
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
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                  <Field label="任务编号" value={taskDetail.code} />
                  <Field label="所属项目" value={taskDetail.projectName} />
                  <Field
                    label="节点层级"
                    value={NODE_TYPE_LABEL[taskDetail.nodeLevelType] ?? taskDetail.nodeLevelType}
                  />
                  <Field label="任务类型" value={taskDetail.taskType} />
                  <Field
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
                  <Field label="优先级" value={priority.label} />
                  {taskDetail.milestoneFlag && <Field label="里程碑节点" value="是" />}
                  {taskDetail.isRectification && (
                    <>
                      <Field label="整改任务" value="是" />
                      {taskDetail.rectificationReason && (
                        <Field label="整改原因" value={taskDetail.rectificationReason} />
                      )}
                      {taskDetail.reopenCount > 0 && (
                        <Field label="重开次数" value={`${taskDetail.reopenCount} 次`} />
                      )}
                    </>
                  )}
                </Box>
              </CardSection>

              {taskDetail.derivedFromTaskId && (
                <CardSection>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: COLORS.blue,
                      cursor: 'pointer',
                      '&:hover': { color: COLORS.blueLight },
                    }}
                    onClick={onBack}
                  >
                    <Typography variant="body2" sx={{ color: COLORS.text40, fontSize: 12 }}>
                      派生来源：
                    </Typography>
                    <Typography variant="body2" sx={{ textDecoration: 'underline', fontSize: 12 }}>
                      {taskDetail.derivedFromTaskId}
                    </Typography>
                  </Box>
                </CardSection>
              )}

              <CardSection>
                <SectionTitle>执行人 & 时间</SectionTitle>
                <Stack spacing={4}>
                  <PmPersonnelSelect
                    label="负责人"
                    value={assigneeDraft}
                    disabled={isReadonly}
                    onChange={setAssigneeDraft}
                    options={[
                      { id: '', name: '未分配', disabled: false },
                      ...assigneeOptions.map(opt => ({
                        id: opt.id,
                        name: opt.name,
                        statusLabel: opt.statusLabel,
                        disabled: opt.disabled,
                      })),
                    ]}
                  />
                  <FormField
                    label="执行方"
                    value={taskDetail.assigneeType === 'internal' ? '内部团队' : '外部供应商'}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <PmDatePicker
                      label="计划开始"
                      value={plannedStartAt}
                      disabled={isReadonly}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(v: any) => setPlannedStartAt(v as dayjs.Dayjs | null)}
                    />
                    <PmDatePicker
                      label="计划结束"
                      value={plannedEndAt}
                      disabled={isReadonly}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(v: any) => setPlannedEndAt(v as dayjs.Dayjs | null)}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <PmDatePicker
                      label="实际开始"
                      value={actualStartDate}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(v: any) => setActualStartDate(v as dayjs.Dayjs | null)}
                    />
                    <PmDatePicker
                      label="实际结束"
                      value={actualEndDate}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(v: any) => setActualEndDate(v as dayjs.Dayjs | null)}
                    />
                  </Box>
                  {taskDetail.parentTaskId && (
                    <FieldRow label="父任务 ID" value={taskDetail.parentTaskId} />
                  )}
                </Stack>
              </CardSection>
            </>
          )}

          {/* ═══ Tab 2: 流程 ═══ */}
          {activeTab === 1 && (
            <>
              {/* 状态操作区 */}
              <PmCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ color: COLORS.text70, fontWeight: 500 }}>
                    状态
                  </Typography>
                  <StatusSelect
                    value={taskDetail.status}
                    options={(() => {
                      const nextStatuses = getAvailableNextStatuses(taskDetail, allTasks)
                      return nextStatuses.filter(s => s.allowed).map(s => s.status)
                    })()}
                    tones={STATUS_TONE_MAP}
                    onChange={handleStatusSelect}
                    disabled={isReadonly}
                  />
                  {(() => {
                    const blockedStatuses = getAvailableNextStatuses(taskDetail, allTasks).filter(
                      s => !s.allowed
                    )
                    return (
                      blockedStatuses.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {blockedStatuses.map(s => (
                            <Typography
                              key={s.status}
                              variant="caption"
                              sx={{ color: COLORS.orange, display: 'block', fontSize: 11 }}
                            >
                              ⚠ {s.status}：{s.reason}
                            </Typography>
                          ))}
                        </Box>
                      )
                    )
                  })()}
                  <PmButton
                    variant="secondary"
                    size="sm"
                    startIcon={<Notifications />}
                    onClick={onRemind}
                    disabled={isReadonly}
                  >
                    催办
                  </PmButton>
                </Box>
              </PmCard>

              <CardSection>
                <SectionTitle>进度</SectionTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={taskDetail.progress}
                      sx={{
                        height: 6,
                        borderRadius: 999,
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 999,
                          bgcolor:
                            progressColor === 'green'
                              ? 'var(--pm-green)'
                              : progressColor === 'orange'
                                ? 'var(--pm-orange)'
                                : progressColor === 'red'
                                  ? 'var(--pm-red)'
                                  : 'var(--pm-blue)',
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.textWhite }}>
                    {taskDetail.progress}%
                  </Typography>
                </Box>
              </CardSection>

              <CardSection>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <SectionTitle>标准与规范</SectionTitle>
                  {taskDetail.standardBindingStatus === '未绑定' &&
                    !isReadonly &&
                    bindableTemplates &&
                    bindableTemplates.length > 0 && (
                      <PmButton
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowBindStandard(true)}
                      >
                        绑定标准
                      </PmButton>
                    )}
                </Box>
                <Stack spacing={2}>
                  <FieldRow label="标准绑定" value={taskDetail.standardBindingStatus} />
                  <FieldRow label="标准快照" value={taskDetail.snapshotStatus ?? '未生成'} />
                  {taskDetail.standardSnapshotId && (
                    <FieldRow label="快照 ID" value={taskDetail.standardSnapshotId} />
                  )}
                  <Typography variant="body2" sx={{ color: COLORS.blue, fontWeight: 500, mt: 1 }}>
                    执行标准
                  </Typography>
                  <PmInput
                    value={taskDetail.executionStandards.join('\n')}
                    multiline
                    rows={2}
                    fullWidth
                    slotProps={{ input: { readOnly: true } }}
                    sx={{
                      '& .MuiInputBase-input': { color: COLORS.textWhite },
                    }}
                  />
                  <Typography variant="body2" sx={{ color: COLORS.blue, fontWeight: 500, mt: 1 }}>
                    验收标准
                  </Typography>
                  <PmInput
                    value={taskDetail.acceptanceStandards.join('\n')}
                    multiline
                    rows={2}
                    fullWidth
                    slotProps={{ input: { readOnly: true } }}
                    sx={{
                      '& .MuiInputBase-input': { color: COLORS.textWhite },
                    }}
                  />
                </Stack>
              </CardSection>

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

              <CardSection>
                <SectionTitle>风险与SLA</SectionTitle>
                <Stack spacing={4}>
                  <PmSelect
                    label="风险等级"
                    value={riskLevel}
                    disabled={isReadonly}
                    onChange={e => setRiskLevel(e.target.value as TaskRiskLevel)}
                    options={['低风险', '中风险', '高风险'].map(r => ({ value: r, label: r }))}
                  />
                  <FieldRow label="SLA 状态" value={taskDetail.slaStatus} />
                  <FieldRow label="催办次数" value={`${taskDetail.remindCount} 次`} />
                  {taskDetail.blockedReason && (
                    <PmCard
                      sx={{
                        bgcolor: 'rgba(255,77,79,0.06)',
                        borderColor: 'rgba(255,77,79,0.15)',
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <WarningAmber sx={{ color: COLORS.red, fontSize: 18, mt: 0.3 }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: COLORS.red, fontWeight: 500, display: 'block' }}
                        >
                          阻塞原因
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.textWhite }}>
                          {taskDetail.blockedReason}
                        </Typography>
                      </Box>
                    </PmCard>
                  )}
                </Stack>
              </CardSection>
            </>
          )}

          {/* ═══ Tab 3: 资料 ═══ */}
          {activeTab === 2 && (
            <>
              <CardSection>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1.5,
                  }}
                >
                  <SectionTitle>提交记录</SectionTitle>
                </Box>
                {taskDetail.submissions?.length > 0 ? (
                  <Stack spacing={1.5}>
                    {taskDetail.submissions.map(sub => (
                      <PmCard key={sub.id} sx={{ bgcolor: 'var(--pm-input)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {sub.submissionType === 'normal'
                              ? '常规提交'
                              : sub.submissionType === 'rectification'
                                ? '整改提交'
                                : '补充提交'}
                          </Typography>
                          <Chip
                            size="small"
                            label={
                              sub.status === 'accepted'
                                ? '已通过'
                                : sub.status === 'rejected'
                                  ? '已驳回'
                                  : '待审核'
                            }
                            color={
                              sub.status === 'accepted'
                                ? 'success'
                                : sub.status === 'rejected'
                                  ? 'error'
                                  : 'default'
                            }
                            variant="outlined"
                          />
                        </Box>
                        {sub.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mb: 0.5 }}
                          >
                            {sub.description}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {sub.submittedBy} · {sub.submittedAt}
                        </Typography>
                        {sub.reviewResult && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block' }}
                          >
                            审核：{sub.reviewedBy} · {sub.reviewResult === 'pass' ? '通过' : '驳回'}
                            {sub.reviewComment && ` (${sub.reviewComment})`}
                          </Typography>
                        )}
                      </PmCard>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ color: COLORS.text70 }}>
                    暂无提交记录
                  </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <PmButton
                    variant="secondary"
                    size="sm"
                    startIcon={<CloudUpload />}
                    disabled={isReadonly}
                  >
                    上传资料
                  </PmButton>
                  <PmButton
                    variant="primary"
                    size="sm"
                    onClick={() => setShowSubmitDialog(true)}
                    disabled={isReadonly}
                  >
                    提交验收
                  </PmButton>
                </Box>
              </CardSection>

              <CardSection>
                <SectionTitle>附件 ({taskDetail.attachments.length})</SectionTitle>
                <AttachmentList
                  attachments={taskDetail.attachments}
                  readonly={isReadonly}
                  onUpload={files => onUploadAttachments?.(taskDetail.code, files)}
                  onDelete={id => onRemoveAttachment?.(taskDetail.code, id)}
                />
              </CardSection>
            </>
          )}

          {/* ═══ Tab 4: 历史 ═══ */}
          {activeTab === 3 && (
            <CardSection>
              <SectionTitle>操作日志 ({taskDetail.flowLogs.length})</SectionTitle>
              <Stack spacing={0}>
                {taskDetail.flowLogs.length > 0 ? (
                  taskDetail.flowLogs.map((log, idx) => (
                    <Box
                      key={log.id}
                      sx={{
                        display: 'flex',
                        gap: 1.5,
                        py: 1.5,
                        borderBottom:
                          idx < taskDetail.flowLogs.length - 1
                            ? '1px solid var(--pm-border-light)'
                            : 'none',
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          mt: 0.5,
                          flexShrink: 0,
                          bgcolor: idx === 0 ? 'var(--pm-blue)' : 'var(--pm-text-40)',
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {log.action}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {log.operator} · {log.time}
                          {log.detail ? ` · ${log.detail}` : ''}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: COLORS.text70 }}>
                    暂无操作日志
                  </Typography>
                )}
              </Stack>
            </CardSection>
          )}

          {/* ═══ Tab 5: 关联 ═══ */}
          {activeTab === 4 && (
            <CardSection>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <SectionTitle>前置任务 ({taskDetail.relations.length})</SectionTitle>
                {!isReadonly && (
                  <PmButton
                    variant="secondary"
                    size="sm"
                    startIcon={<Add />}
                    onClick={() => setShowAddRelation(true)}
                  >
                    添加前置
                  </PmButton>
                )}
              </Box>
              <Stack spacing={0}>
                {taskDetail.relations.length > 0 ? (
                  taskDetail.relations.map(rel => (
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
                          {rel.fromTaskName ?? rel.fromTaskId}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontFamily: 'monospace', fontSize: 11 }}
                        >
                          {rel.fromTaskId}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                          <Chip
                            size="small"
                            label={RELATION_TYPE_LABELS[rel.relationType] ?? rel.relationType}
                            variant="outlined"
                            sx={{ fontSize: 10 }}
                          />
                          <Chip
                            size="small"
                            label={`→ ${rel.toTaskName ?? rel.toTaskId}`}
                            variant="outlined"
                            sx={{
                              fontSize: 10,
                              borderColor: 'var(--pm-blue-15)',
                              color: 'var(--pm-blue)',
                            }}
                          />
                        </Box>
                      </Box>
                      {!isReadonly && (
                        <Tooltip title="删除依赖">
                          <IconButton
                            size="small"
                            onClick={() => onRemoveRelation?.(taskDetail.code, rel.id)}
                            sx={{ color: COLORS.text40, '&:hover': { color: COLORS.red } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: COLORS.text70, py: 2, textAlign: 'center' }}
                  >
                    暂无前置任务
                  </Typography>
                )}
              </Stack>
            </CardSection>
          )}

          {/* ── 保存按钮 ── */}
          {hasChanges && !isReadonly && (
            <Box sx={{ position: 'sticky', bottom: 16, pt: 2, pb: 2 }}>
              <PmCard sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <PmButton
                  variant="ghost"
                  onClick={() => {
                    setAssigneeDraft(taskDetail.assigneeName ?? '')
                    setPlannedStartAt(
                      taskDetail.plannedStartAt ? dayjs(taskDetail.plannedStartAt) : null
                    )
                    setPlannedEndAt(taskDetail.plannedEndAt ? dayjs(taskDetail.plannedEndAt) : null)
                    setRiskLevel(taskDetail.riskLevel)
                  }}
                >
                  重置
                </PmButton>
                <PmButton variant="primary" startIcon={<Save />} onClick={handleSave}>
                  保存修改
                </PmButton>
              </PmCard>
            </Box>
          )}
        </Stack>
      </Box>

      {/* ── 绑定标准 Dialog ── */}
      <Dialog
        open={showBindStandard}
        onClose={() => setShowBindStandard(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: COLORS.card, borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ color: COLORS.textWhite, fontSize: 16, fontWeight: 600 }}>
          选择标准模板
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ color: COLORS.text70 }}>
              选择一个任务模板，将其执行标准和验收标准绑定到当前任务。绑定后将生成标准快照。
            </Typography>
            {bindableTemplates.map(tpl => (
              <PmCard
                key={tpl.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: 'var(--pm-primary)', bgcolor: 'var(--pm-primary-15)' },
                }}
                onClick={() => {
                  onBindStandard?.(taskDetail.code, tpl.id)
                  setShowBindStandard(false)
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: COLORS.textWhite, fontWeight: 600, mb: 0.5 }}
                >
                  {tpl.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="caption" sx={{ color: COLORS.text70 }}>
                    执行标准：{tpl.executionCount} 项
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.text70 }}>
                    验收标准：{tpl.acceptanceCount} 项
                  </Typography>
                </Box>
              </PmCard>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <PmButton variant="ghost" onClick={() => setShowBindStandard(false)}>
            取消
          </PmButton>
        </DialogActions>
      </Dialog>

      {/* ── 添加前置任务 Dialog ── */}
      <Dialog
        open={showAddRelation}
        onClose={() => setShowAddRelation(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: COLORS.card, borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ color: COLORS.textWhite, fontSize: 16, fontWeight: 600 }}>
          添加前置任务
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ color: COLORS.text70 }}>
              选择当前任务的依赖关系。前置任务需要先完成后，当前任务才能开始。
            </Typography>
            <PmInput
              label="前置任务编码"
              placeholder="例如 PRJ-001-T-001"
              value={relationSearch}
              onChange={e => setRelationSearch(e.target.value)}
              fullWidth
            />
            <PmSelect
              label="依赖类型"
              value={relationType}
              onChange={e => setRelationType(e.target.value as TaskRelation['relationType'])}
              options={RELATION_TYPE_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <PmButton variant="ghost" onClick={() => setShowAddRelation(false)}>
            取消
          </PmButton>
          <PmButton
            variant="primary"
            disabled={!relationSearch.trim()}
            onClick={() => {
              onAddRelation?.(taskDetail.code, {
                fromTaskId: relationSearch.trim(),
                toTaskId: taskDetail.code,
                relationType: relationType,
              })
              setShowAddRelation(false)
              setRelationSearch('')
              setRelationType('finish_start')
            }}
          >
            添加
          </PmButton>
        </DialogActions>
      </Dialog>

      {/* ── 提交验收 Dialog ── */}
      <SubmitDialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onSubmit={description => {
          onCreateSubmission?.(taskDetail.code, { description: description || undefined })
          setShowSubmitDialog(false)
        }}
      />

      {/* ── 审核 Dialog ── */}
      <ReviewDialog
        open={showReviewDialog}
        onClose={() => setShowReviewDialog(false)}
        onSubmit={(result, comment) => {
          const subId = taskDetail.submissions?.[0]?.id
          if (subId) {
            onReviewSubmission?.(taskDetail.code, {
              submissionId: subId,
              result,
              comment: comment.trim() || undefined,
            })
          }
          setShowReviewDialog(false)
        }}
      />
    </Box>
  )
}

export default TaskDetailPage
