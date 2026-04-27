import type {
  TaskDetail,
  TaskItem,
  TaskRiskLevel,
  TaskSlaStatus,
  TaskStatus,
} from './taskManagement.types'

export const mockTasks: TaskItem[] = [
  {
    name: '施工围挡与临时动线审批',
    code: 'PRJ-001-T-001',
    projectName: '上海南京路旗舰店',
    parentPath: '开店筹备 / 施工准备',
    status: '待分配',
    statusTone: 'neutral',
    owner: '待分配',
    plannedStartAt: '2026-04-06',
    plannedEndAt: '2026-04-08',
    slaStatus: '即将超时',
    slaTone: 'orange',
    riskLevel: '中风险',
    riskTone: 'orange',
    predecessorStatus: '无前置任务',
    remindCount: 2,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 0,
  },
  {
    name: '强弱电综合布线实施',
    code: 'PRJ-001-T-002',
    projectName: '上海南京路旗舰店',
    parentPath: '施工执行 / 水电工程',
    status: '执行中',
    statusTone: 'blue',
    owner: '王强',
    plannedStartAt: '2026-04-03',
    plannedEndAt: '2026-04-12',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '高风险',
    riskTone: 'red',
    predecessorStatus: '前置已完成',
    remindCount: 1,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 45,
  },
  {
    name: '消防喷淋系统联调并提交报告',
    code: 'PRJ-001-T-003',
    projectName: '上海南京路旗舰店',
    parentPath: '施工执行 / 消防工程',
    status: '待提交',
    statusTone: 'orange',
    owner: '赵敏',
    plannedStartAt: '2026-04-01',
    plannedEndAt: '2026-04-07',
    slaStatus: '超时',
    slaTone: 'red',
    riskLevel: '高风险',
    riskTone: 'red',
    predecessorStatus: '前置已完成',
    remindCount: 4,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 88,
  },
  {
    name: '样板区验收问题整改复检',
    code: 'PRJ-001-T-004',
    projectName: '上海南京路旗舰店',
    parentPath: '质量验收 / 分区验收',
    status: '不通过',
    statusTone: 'red',
    owner: '李娜',
    plannedStartAt: '2026-04-02',
    plannedEndAt: '2026-04-06',
    slaStatus: '超时',
    slaTone: 'red',
    riskLevel: '高风险',
    riskTone: 'red',
    predecessorStatus: '前置阻塞',
    remindCount: 3,
    standardBindingStatus: '未绑定',
    isBlocked: true,
    progress: 60,
  },
  {
    name: '门头招牌安装验收',
    code: 'PRJ-002-T-001',
    projectName: '杭州西湖银泰店',
    parentPath: '施工执行 / 外立面工程',
    status: '待验收',
    statusTone: 'neutral',
    owner: '张伟',
    plannedStartAt: '2026-04-04',
    plannedEndAt: '2026-04-09',
    slaStatus: '即将超时',
    slaTone: 'orange',
    riskLevel: '中风险',
    riskTone: 'orange',
    predecessorStatus: '前置已完成',
    remindCount: 2,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 95,
  },
  {
    name: '空调主机吊装及试运行',
    code: 'PRJ-002-T-002',
    projectName: '杭州西湖银泰店',
    parentPath: '施工执行 / 机电安装',
    status: '执行中',
    statusTone: 'blue',
    owner: '孙杰',
    plannedStartAt: '2026-04-05',
    plannedEndAt: '2026-04-15',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '中风险',
    riskTone: 'orange',
    predecessorStatus: '前置进行中',
    remindCount: 0,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 30,
  },
  {
    name: '智能照明回路测试',
    code: 'PRJ-002-T-003',
    projectName: '杭州西湖银泰店',
    parentPath: '施工执行 / 电气工程',
    status: '待执行',
    statusTone: 'neutral',
    owner: '王强',
    plannedStartAt: '2026-04-10',
    plannedEndAt: '2026-04-13',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '低风险',
    riskTone: 'blue',
    predecessorStatus: '前置进行中',
    remindCount: 0,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 0,
  },
  {
    name: '收银区定制柜体安装',
    code: 'PRJ-003-T-001',
    projectName: '北京朝阳大悦城店',
    parentPath: '软装陈列 / 家具安装',
    status: '草稿',
    statusTone: 'neutral',
    owner: '待分配',
    plannedStartAt: '2026-04-14',
    plannedEndAt: '2026-04-20',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '低风险',
    riskTone: 'blue',
    predecessorStatus: '无前置任务',
    remindCount: 0,
    standardBindingStatus: '未绑定',
    isBlocked: false,
    progress: 0,
  },
  {
    name: '品牌VI墙面喷绘复核',
    code: 'PRJ-003-T-002',
    projectName: '北京朝阳大悦城店',
    parentPath: '软装陈列 / 品牌物料',
    status: '已完成',
    statusTone: 'green',
    owner: '李娜',
    plannedStartAt: '2026-03-28',
    plannedEndAt: '2026-04-02',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '低风险',
    riskTone: 'blue',
    predecessorStatus: '前置已完成',
    remindCount: 0,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 100,
  },
  {
    name: '全店安全巡检闭环',
    code: 'PRJ-003-T-003',
    projectName: '北京朝阳大悦城店',
    parentPath: '开业准备 / 安全合规',
    status: '已关闭',
    statusTone: 'green',
    owner: '张质检',
    plannedStartAt: '2026-03-26',
    plannedEndAt: '2026-03-30',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '中风险',
    riskTone: 'orange',
    predecessorStatus: '前置已完成',
    remindCount: 1,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 100,
  },
  {
    name: '门店消防审批资料补正',
    code: 'PRJ-004-T-001',
    projectName: '深圳万象天地店',
    parentPath: '证照办理 / 消防审批',
    status: '待提交',
    statusTone: 'orange',
    owner: '赵敏',
    plannedStartAt: '2026-04-01',
    plannedEndAt: '2026-04-05',
    slaStatus: '超时',
    slaTone: 'red',
    riskLevel: '高风险',
    riskTone: 'red',
    predecessorStatus: '前置已完成',
    remindCount: 5,
    standardBindingStatus: '未绑定',
    isBlocked: true,
    progress: 70,
  },
  {
    name: '试营业人员培训签到与考核',
    code: 'PRJ-004-T-002',
    projectName: '深圳万象天地店',
    parentPath: '开业准备 / 人员培训',
    status: '待验收',
    statusTone: 'neutral',
    owner: '孙杰',
    plannedStartAt: '2026-04-06',
    plannedEndAt: '2026-04-11',
    slaStatus: '即将超时',
    slaTone: 'orange',
    riskLevel: '中风险',
    riskTone: 'orange',
    predecessorStatus: '前置已完成',
    remindCount: 2,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 92,
  },
]

export const groupOptions = [
  { value: 'none', label: '不分组' },
  { value: 'project', label: '按项目' },
  { value: 'status', label: '按状态' },
  { value: 'owner', label: '按负责人' },
]

export const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'planned-end-asc', label: '计划结束时间升序' },
  { value: 'risk-desc', label: '风险等级从高到低' },
  { value: 'remind-desc', label: '催办次数从高到低' },
]

export const statusOptions: TaskStatus[] = [
  '草稿',
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
export const riskOptions: TaskRiskLevel[] = ['高风险', '中风险', '低风险']
export const slaOptions: TaskSlaStatus[] = ['超时', '即将超时', '正常']

const buildTaskDetailFromItem = (task: TaskItem): TaskDetail => {
  const isDone = task.status === '已完成' || task.status === '已关闭'
  const isBlocked = task.predecessorStatus === '前置阻塞' || task.isBlocked
  const ownerName = task.owner === '待分配' ? '' : task.owner

  return {
    ...task,
    taskType: '标准任务',
    assigneeName: ownerName,
    assigneeType: ownerName ? 'internal' : 'external',
    actualStartAt:
      task.status === '草稿' || task.status === '待分配' ? undefined : task.plannedStartAt,
    actualEndAt: isDone ? task.plannedEndAt : undefined,
    blockedReason: isBlocked ? '前置任务未完成，需先解除阻塞后再推进。' : undefined,
    snapshotStatus: task.standardBindingStatus === '已绑定' ? '已生成' : '未生成',
    standardSnapshotId: task.standardBindingStatus === '已绑定' ? `SNAP-${task.code}` : undefined,
    executionStandards: ['按门店施工标准执行并拍照留档。', '关键节点需在当日 18:00 前更新进度。'],
    acceptanceStandards: ['验收资料齐全（照片/记录/签字）。', '不符合项需闭环后方可通过。'],
    checklist: [
      { id: `${task.code}-ck-1`, label: '任务范围确认', done: true },
      { id: `${task.code}-ck-2`, label: '现场执行记录上传', done: task.progress >= 50 },
      { id: `${task.code}-ck-3`, label: '验收结果回传', done: isDone },
    ],
    attachments: [
      {
        id: `${task.code}-att-1`,
        fileName: `${task.code}-执行记录.pdf`,
        fileSizeKb: 680,
        uploader: ownerName || '系统',
      },
    ],
    relations: [
      {
        code: `${task.code}-REL-1`,
        name: `${task.name}（前置）`,
        type: '前置任务',
      },
    ],
    flowLogs: [
      {
        id: `${task.code}-log-1`,
        action: '任务创建',
        operator: '系统',
        detail: '根据项目模板自动生成任务。',
        time: `${task.plannedStartAt} 09:00`,
      },
      {
        id: `${task.code}-log-2`,
        action: `状态更新为${task.status}`,
        operator: ownerName || '系统',
        detail: '任务状态按最新进度自动同步。',
        time: `${task.plannedEndAt} 16:30`,
      },
    ],
  }
}

const taskDetailMap: Record<string, TaskDetail> = Object.fromEntries(
  mockTasks.map(task => [task.code, buildTaskDetailFromItem(task)])
)

export const getTaskDetailByCode = (taskCode: string): TaskDetail | undefined => {
  return taskDetailMap[taskCode]
}

// ─── Task Tree Types & Functions ───────────────────────────────

export type TaskTreeNodeStatus = 'completed' | 'in-progress' | 'delayed' | 'planned'

export interface TaskTreeNode {
  id: string
  code: string
  name: string
  type: 'project' | 'work_package' | 'task'
  status: TaskTreeNodeStatus
  statusLabel: string
  owner: string
  progress: number
  children: TaskTreeNode[]
  dependencies: string[]
  taskCode?: string
}

export interface TaskTreeViewModel {
  nodes: TaskTreeNode[]
  summary: {
    projectCount: number
    workPackageCount: number
    taskCount: number
    delayedCount: number
  }
  updatedAt: string
  focusNodeId?: string
}

export function buildTaskTreeViewModel(tasks: TaskItem[]): TaskTreeViewModel {
  const nodes: TaskTreeNode[] = tasks.map(task => ({
    id: task.code,
    code: task.code,
    name: task.name,
    type: 'task' as const,
    status: mapTaskStatusToTreeStatus(task.status, task.slaStatus),
    statusLabel: task.status,
    owner: task.owner,
    progress: task.progress,
    children: [],
    dependencies: [],
    taskCode: task.code,
  }))

  const delayedCount = nodes.filter(n => n.status === 'delayed').length
  const distinctProjects = new Set(tasks.map(t => t.projectName))

  const now = new Date()
  const updatedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  return {
    nodes,
    summary: {
      projectCount: tasks.length > 0 ? distinctProjects.size : 0,
      workPackageCount: 0,
      taskCount: nodes.length,
      delayedCount,
    },
    updatedAt,
  }
}

function mapTaskStatusToTreeStatus(
  status: TaskItem['status'],
  slaStatus: TaskItem['slaStatus']
): TaskTreeNodeStatus {
  if (status === '已完成' || status === '已关闭') return 'completed'
  if (status === '执行中' || status === '待提交') return 'in-progress'
  if (slaStatus === '超时' || slaStatus === '即将超时') return 'delayed'
  return 'planned'
}

export function getTasksByTemplateId(templateId: string): TaskItem[] {
  if (!templateId) return mockTasks
  const filtered = mockTasks.filter(
    task => task.projectName.includes(templateId) || task.code.includes(templateId)
  )
  return filtered.length > 0 ? filtered : mockTasks
}

export function getTemplateNameById(templateId: string | undefined): string | null {
  if (!templateId) return null
  return `模板-${templateId}`
}

export function getTemplateInstantiationDiagnostics(
  templateId: string | undefined
): { errors: string[]; warnings: string[] } | null {
  if (!templateId) return null
  return { errors: [], warnings: [] }
}
