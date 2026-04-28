import type {
  TaskAssigneeType,
  TaskDetail,
  TaskItem,
  TaskRiskLevel,
  TaskSlaStatus,
  TaskStatus,
} from './taskManagement.types'

// ─── 真实树形结构的 mock 数据 ─────────────────────────────────
// 使用 parentTaskId 替代 parentPath 字符串，建立 3 层树：
// project_root → work_package → task

const PROJECT_SHANGHAI = 'PRJ-001'
const PROJECT_HANGZHOU = 'PRJ-002'
const PROJECT_BEIJING = 'PRJ-003'
const PROJECT_SHENZHEN = 'PRJ-004'

export const mockTasks: TaskItem[] = [
  // ════════════════════════════════════════════════════════════
  // 项目 A：上海南京路旗舰店
  // ════════════════════════════════════════════════════════════
  {
    id: 'task-001',
    code: 'PRJ-001-T-001',
    name: '施工围挡与临时动线审批',
    projectId: PROJECT_SHANGHAI,
    projectName: '上海南京路旗舰店',
    parentTaskId: 'wp-sh-construction-prep',
    status: '待分配',
    statusTone: 'neutral',
    owner: '待分配',
    assigneeId: '',
    assigneeName: '待分配',
    nodeLevelType: 'task',
    priority: 'high',
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
    taskType: '标准任务',
    sourceType: 'template',
    tags: ['施工', '审批'],
    createdBy: '系统',
    createdAt: '2026-03-20T08:00:00Z',
  },
  {
    id: 'task-002',
    code: 'PRJ-001-T-002',
    name: '强弱电综合布线实施',
    projectId: PROJECT_SHANGHAI,
    projectName: '上海南京路旗舰店',
    parentTaskId: 'wp-sh-electrical',
    status: '执行中',
    statusTone: 'blue',
    owner: '王强',
    assigneeId: 'user-wangqiang',
    assigneeName: '王强',
    nodeLevelType: 'task',
    priority: 'urgent',
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
    taskType: '关键任务',
    sourceType: 'template',
    tags: ['电气', '施工'],
    createdBy: '系统',
    createdAt: '2026-03-20T08:00:00Z',
  },
  {
    id: 'task-003',
    code: 'PRJ-001-T-003',
    name: '消防喷淋系统联调并提交报告',
    projectId: PROJECT_SHANGHAI,
    projectName: '上海南京路旗舰店',
    parentTaskId: 'wp-sh-fire-safety',
    status: '待提交',
    statusTone: 'orange',
    owner: '赵敏',
    assigneeId: 'user-zhaomin',
    assigneeName: '赵敏',
    nodeLevelType: 'task',
    priority: 'urgent',
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
    taskType: '关键任务',
    sourceType: 'template',
    tags: ['消防', '调试'],
    createdBy: '系统',
    createdAt: '2026-03-20T08:00:00Z',
  },
  {
    id: 'task-004',
    code: 'PRJ-001-T-004',
    name: '样板区验收问题整改复检',
    projectId: PROJECT_SHANGHAI,
    projectName: '上海南京路旗舰店',
    parentTaskId: 'wp-sh-quality',
    status: '不通过',
    statusTone: 'red',
    owner: '李娜',
    assigneeId: 'user-lina',
    assigneeName: '李娜',
    nodeLevelType: 'task',
    priority: 'high',
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
    taskType: '标准任务',
    sourceType: 'manual',
    tags: ['验收', '整改'],
    createdBy: '李娜',
    createdAt: '2026-03-25T10:00:00Z',
  },
  // ════════════════════════════════════════════════════════════
  // 项目 B：杭州西湖银泰店
  // ════════════════════════════════════════════════════════════
  {
    id: 'task-005',
    code: 'PRJ-002-T-001',
    name: '门头招牌安装验收',
    projectId: PROJECT_HANGZHOU,
    projectName: '杭州西湖银泰店',
    parentTaskId: 'wp-hz-exterior',
    status: '待验收',
    statusTone: 'neutral',
    owner: '张伟',
    assigneeId: 'user-zhangwei',
    assigneeName: '张伟',
    nodeLevelType: 'task',
    priority: 'medium',
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
    taskType: '标准任务',
    sourceType: 'template',
    tags: ['外立面', '验收'],
    createdBy: '系统',
    createdAt: '2026-03-22T08:00:00Z',
  },
  {
    id: 'task-006',
    code: 'PRJ-002-T-002',
    name: '空调主机吊装及试运行',
    projectId: PROJECT_HANGZHOU,
    projectName: '杭州西湖银泰店',
    parentTaskId: 'wp-hz-mep',
    status: '执行中',
    statusTone: 'blue',
    owner: '孙杰',
    assigneeId: 'user-sunjie',
    assigneeName: '孙杰',
    nodeLevelType: 'task',
    priority: 'high',
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
    taskType: '关键任务',
    sourceType: 'template',
    tags: ['机电', '安装'],
    createdBy: '系统',
    createdAt: '2026-03-22T08:00:00Z',
  },
  {
    id: 'task-007',
    code: 'PRJ-002-T-003',
    name: '智能照明回路测试',
    projectId: PROJECT_HANGZHOU,
    projectName: '杭州西湖银泰店',
    parentTaskId: 'wp-hz-electrical',
    status: '待执行',
    statusTone: 'neutral',
    owner: '王强',
    assigneeId: 'user-wangqiang',
    assigneeName: '王强',
    nodeLevelType: 'task',
    priority: 'low',
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
    taskType: '标准任务',
    sourceType: 'template',
    tags: ['电气', '测试'],
    createdBy: '系统',
    createdAt: '2026-03-22T08:00:00Z',
  },
  // ════════════════════════════════════════════════════════════
  // 项目 C：北京朝阳大悦城店
  // ════════════════════════════════════════════════════════════
  {
    id: 'task-008',
    code: 'PRJ-003-T-001',
    name: '收银区定制柜体安装',
    projectId: PROJECT_BEIJING,
    projectName: '北京朝阳大悦城店',
    parentTaskId: 'wp-bj-furniture',
    status: '草稿',
    statusTone: 'neutral',
    owner: '待分配',
    assigneeId: '',
    assigneeName: '待分配',
    nodeLevelType: 'task',
    priority: 'low',
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
    taskType: '标准任务',
    sourceType: 'template',
    tags: ['家具', '安装'],
    createdBy: '系统',
    createdAt: '2026-03-28T08:00:00Z',
  },
  {
    id: 'task-009',
    code: 'PRJ-003-T-002',
    name: '品牌VI墙面喷绘复核',
    projectId: PROJECT_BEIJING,
    projectName: '北京朝阳大悦城店',
    parentTaskId: 'wp-bj-branding',
    status: '已完成',
    statusTone: 'green',
    owner: '李娜',
    assigneeId: 'user-lina',
    assigneeName: '李娜',
    nodeLevelType: 'task',
    priority: 'medium',
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
    taskType: '标准任务',
    sourceType: 'manual',
    tags: ['VI', '复核'],
    createdBy: '李娜',
    createdAt: '2026-03-25T09:00:00Z',
  },
  {
    id: 'task-010',
    code: 'PRJ-003-T-003',
    name: '全店安全巡检闭环',
    projectId: PROJECT_BEIJING,
    projectName: '北京朝阳大悦城店',
    parentTaskId: null,
    status: '已关闭',
    statusTone: 'green',
    owner: '张质检',
    assigneeId: 'user-zhangzj',
    assigneeName: '张质检',
    nodeLevelType: 'task',
    priority: 'high',
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
    taskType: '标准任务',
    sourceType: 'template',
    tags: ['安全', '巡检'],
    createdBy: '系统',
    createdAt: '2026-03-20T08:00:00Z',
  },
  // ════════════════════════════════════════════════════════════
  // 项目 D：深圳万象天地店
  // ════════════════════════════════════════════════════════════
  {
    id: 'task-011',
    code: 'PRJ-004-T-001',
    name: '门店消防审批资料补正',
    projectId: PROJECT_SHENZHEN,
    projectName: '深圳万象天地店',
    parentTaskId: 'wp-sz-permit',
    status: '待提交',
    statusTone: 'orange',
    owner: '赵敏',
    assigneeId: 'user-zhaomin',
    assigneeName: '赵敏',
    nodeLevelType: 'task',
    priority: 'urgent',
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
    taskType: '标准任务',
    sourceType: 'manual',
    tags: ['消防', '审批', '证照'],
    createdBy: '赵敏',
    createdAt: '2026-03-28T14:00:00Z',
  },
  {
    id: 'task-012',
    code: 'PRJ-004-T-002',
    name: '试营业人员培训签到与考核',
    projectId: PROJECT_SHENZHEN,
    projectName: '深圳万象天地店',
    parentTaskId: 'wp-sz-training',
    status: '待验收',
    statusTone: 'neutral',
    owner: '孙杰',
    assigneeId: 'user-sunjie',
    assigneeName: '孙杰',
    nodeLevelType: 'task',
    priority: 'medium',
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
    taskType: '标准任务',
    sourceType: 'template',
    tags: ['培训', '考核'],
    createdBy: '系统',
    createdAt: '2026-03-25T08:00:00Z',
  },
]

// ─── Work Package 节点（任务树的中间层） ──────────────────────
export const mockWorkPackages: TaskItem[] = [
  {
    id: 'wp-sh-construction-prep',
    code: 'WP-SH-001',
    name: '施工准备',
    projectId: PROJECT_SHANGHAI,
    projectName: '上海南京路旗舰店',
    parentTaskId: PROJECT_SHANGHAI,
    status: '待分配',
    statusTone: 'neutral',
    owner: '项目经理',
    assigneeId: 'user-pm',
    assigneeName: '项目经理',
    nodeLevelType: 'work_package',
    priority: 'high',
    plannedStartAt: '2026-04-01',
    plannedEndAt: '2026-04-15',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '中风险',
    riskTone: 'orange',
    predecessorStatus: '无前置任务',
    remindCount: 0,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 45,
    taskType: '里程碑',
    sourceType: 'template',
    tags: ['施工准备'],
    createdBy: '系统',
    createdAt: '2026-03-20T08:00:00Z',
  },
  {
    id: 'wp-sh-electrical',
    code: 'WP-SH-002',
    name: '水电工程',
    projectId: PROJECT_SHANGHAI,
    projectName: '上海南京路旗舰店',
    parentTaskId: PROJECT_SHANGHAI,
    status: '执行中',
    statusTone: 'blue',
    owner: '王强',
    assigneeId: 'user-wangqiang',
    assigneeName: '王强',
    nodeLevelType: 'work_package',
    priority: 'urgent',
    plannedStartAt: '2026-04-01',
    plannedEndAt: '2026-04-15',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '高风险',
    riskTone: 'red',
    predecessorStatus: '前置已完成',
    remindCount: 0,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 45,
    taskType: '关键任务',
    sourceType: 'template',
    tags: ['水电'],
    createdBy: '系统',
    createdAt: '2026-03-20T08:00:00Z',
  },
  {
    id: 'wp-sh-fire-safety',
    code: 'WP-SH-003',
    name: '消防工程',
    projectId: PROJECT_SHANGHAI,
    projectName: '上海南京路旗舰店',
    parentTaskId: PROJECT_SHANGHAI,
    status: '待提交',
    statusTone: 'orange',
    owner: '赵敏',
    assigneeId: 'user-zhaomin',
    assigneeName: '赵敏',
    nodeLevelType: 'work_package',
    priority: 'urgent',
    plannedStartAt: '2026-04-01',
    plannedEndAt: '2026-04-10',
    slaStatus: '超时',
    slaTone: 'red',
    riskLevel: '高风险',
    riskTone: 'red',
    predecessorStatus: '前置已完成',
    remindCount: 0,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 88,
    taskType: '里程碑',
    sourceType: 'template',
    tags: ['消防'],
    createdBy: '系统',
    createdAt: '2026-03-20T08:00:00Z',
  },
  {
    id: 'wp-sh-quality',
    code: 'WP-SH-004',
    name: '质量验收',
    projectId: PROJECT_SHANGHAI,
    projectName: '上海南京路旗舰店',
    parentTaskId: PROJECT_SHANGHAI,
    status: '不通过',
    statusTone: 'red',
    owner: '李娜',
    assigneeId: 'user-lina',
    assigneeName: '李娜',
    nodeLevelType: 'work_package',
    priority: 'urgent',
    plannedStartAt: '2026-04-01',
    plannedEndAt: '2026-04-10',
    slaStatus: '超时',
    slaTone: 'red',
    riskLevel: '高风险',
    riskTone: 'red',
    predecessorStatus: '前置阻塞',
    remindCount: 0,
    standardBindingStatus: '已绑定',
    isBlocked: true,
    progress: 60,
    taskType: '里程碑',
    sourceType: 'template',
    tags: ['验收'],
    createdBy: '系统',
    createdAt: '2026-03-20T08:00:00Z',
  },
  {
    id: 'wp-hz-exterior',
    code: 'WP-HZ-001',
    name: '外立面工程',
    projectId: PROJECT_HANGZHOU,
    projectName: '杭州西湖银泰店',
    parentTaskId: PROJECT_HANGZHOU,
    status: '待验收',
    statusTone: 'neutral',
    owner: '张伟',
    assigneeId: 'user-zhangwei',
    assigneeName: '张伟',
    nodeLevelType: 'work_package',
    priority: 'high',
    plannedStartAt: '2026-04-01',
    plannedEndAt: '2026-04-12',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '中风险',
    riskTone: 'orange',
    predecessorStatus: '前置已完成',
    remindCount: 0,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 95,
    taskType: '里程碑',
    sourceType: 'template',
    tags: ['外立面'],
    createdBy: '系统',
    createdAt: '2026-03-22T08:00:00Z',
  },
  {
    id: 'wp-hz-mep',
    code: 'WP-HZ-002',
    name: '机电安装',
    projectId: PROJECT_HANGZHOU,
    projectName: '杭州西湖银泰店',
    parentTaskId: PROJECT_HANGZHOU,
    status: '执行中',
    statusTone: 'blue',
    owner: '孙杰',
    assigneeId: 'user-sunjie',
    assigneeName: '孙杰',
    nodeLevelType: 'work_package',
    priority: 'high',
    plannedStartAt: '2026-04-01',
    plannedEndAt: '2026-04-18',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '中风险',
    riskTone: 'orange',
    predecessorStatus: '前置进行中',
    remindCount: 0,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 30,
    taskType: '里程碑',
    sourceType: 'template',
    tags: ['机电'],
    createdBy: '系统',
    createdAt: '2026-03-22T08:00:00Z',
  },
  {
    id: 'wp-hz-electrical',
    code: 'WP-HZ-003',
    name: '电气工程',
    projectId: PROJECT_HANGZHOU,
    projectName: '杭州西湖银泰店',
    parentTaskId: PROJECT_HANGZHOU,
    status: '待执行',
    statusTone: 'neutral',
    owner: '王强',
    assigneeId: 'user-wangqiang',
    assigneeName: '王强',
    nodeLevelType: 'work_package',
    priority: 'medium',
    plannedStartAt: '2026-04-08',
    plannedEndAt: '2026-04-15',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '低风险',
    riskTone: 'blue',
    predecessorStatus: '前置进行中',
    remindCount: 0,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 0,
    taskType: '关键任务',
    sourceType: 'template',
    tags: ['电气'],
    createdBy: '系统',
    createdAt: '2026-03-22T08:00:00Z',
  },
  {
    id: 'wp-bj-furniture',
    code: 'WP-BJ-001',
    name: '家具安装',
    projectId: PROJECT_BEIJING,
    projectName: '北京朝阳大悦城店',
    parentTaskId: PROJECT_BEIJING,
    status: '草稿',
    statusTone: 'neutral',
    owner: '待分配',
    assigneeId: '',
    assigneeName: '待分配',
    nodeLevelType: 'work_package',
    priority: 'low',
    plannedStartAt: '2026-04-10',
    plannedEndAt: '2026-04-22',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '低风险',
    riskTone: 'blue',
    predecessorStatus: '无前置任务',
    remindCount: 0,
    standardBindingStatus: '未绑定',
    isBlocked: false,
    progress: 0,
    taskType: '标准任务',
    sourceType: 'template',
    tags: ['家具'],
    createdBy: '系统',
    createdAt: '2026-03-28T08:00:00Z',
  },
  {
    id: 'wp-bj-branding',
    code: 'WP-BJ-002',
    name: '品牌物料',
    projectId: PROJECT_BEIJING,
    projectName: '北京朝阳大悦城店',
    parentTaskId: PROJECT_BEIJING,
    status: '已完成',
    statusTone: 'green',
    owner: '李娜',
    assigneeId: 'user-lina',
    assigneeName: '李娜',
    nodeLevelType: 'work_package',
    priority: 'medium',
    plannedStartAt: '2026-03-25',
    plannedEndAt: '2026-04-05',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '低风险',
    riskTone: 'blue',
    predecessorStatus: '前置已完成',
    remindCount: 0,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 100,
    taskType: '标准任务',
    sourceType: 'manual',
    tags: ['品牌'],
    createdBy: '系统',
    createdAt: '2026-03-25T08:00:00Z',
  },
  {
    id: 'wp-sz-permit',
    code: 'WP-SZ-001',
    name: '证照办理',
    projectId: PROJECT_SHENZHEN,
    projectName: '深圳万象天地店',
    parentTaskId: PROJECT_SHENZHEN,
    status: '待提交',
    statusTone: 'orange',
    owner: '赵敏',
    assigneeId: 'user-zhaomin',
    assigneeName: '赵敏',
    nodeLevelType: 'work_package',
    priority: 'urgent',
    plannedStartAt: '2026-04-01',
    plannedEndAt: '2026-04-08',
    slaStatus: '超时',
    slaTone: 'red',
    riskLevel: '高风险',
    riskTone: 'red',
    predecessorStatus: '前置已完成',
    remindCount: 0,
    standardBindingStatus: '未绑定',
    isBlocked: true,
    progress: 70,
    taskType: '关键任务',
    sourceType: 'template',
    tags: ['证照'],
    createdBy: '系统',
    createdAt: '2026-03-25T08:00:00Z',
  },
  {
    id: 'wp-sz-training',
    code: 'WP-SZ-002',
    name: '人员培训',
    projectId: PROJECT_SHENZHEN,
    projectName: '深圳万象天地店',
    parentTaskId: PROJECT_SHENZHEN,
    status: '待验收',
    statusTone: 'neutral',
    owner: '孙杰',
    assigneeId: 'user-sunjie',
    assigneeName: '孙杰',
    nodeLevelType: 'work_package',
    priority: 'medium',
    plannedStartAt: '2026-04-03',
    plannedEndAt: '2026-04-14',
    slaStatus: '正常',
    slaTone: 'green',
    riskLevel: '中风险',
    riskTone: 'orange',
    predecessorStatus: '前置已完成',
    remindCount: 0,
    standardBindingStatus: '已绑定',
    isBlocked: false,
    progress: 92,
    taskType: '里程碑',
    sourceType: 'template',
    tags: ['培训'],
    createdBy: '系统',
    createdAt: '2026-03-25T08:00:00Z',
  },
]

// ─── 合并所有节点 ──
export const allMockTaskNodes: TaskItem[] = [...mockTasks, ...mockWorkPackages]

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
  const ownerName = task.owner === '待分配' ? '' : task.owner

  return {
    ...task,
    assigneeType: (ownerName ? 'internal' : 'external') as TaskAssigneeType,
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
        id: `${task.code}-rel-1`,
        fromTaskId: task.parentTaskId ?? task.code,
        toTaskId: task.code,
        relationType: 'finish_start',
        fromTaskName: task.parentTaskId ? undefined : task.name,
        toTaskName: task.name,
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
  allMockTaskNodes.map(task => [task.code, buildTaskDetailFromItem(task)])
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

/**
 * 基于 parentTaskId 构建真实任务树
 * 替代旧的 parentPath 字符串拆分逻辑
 */
export function buildTaskTreeViewModel(tasks: TaskItem[]): TaskTreeViewModel {
  const nodeMap = new Map<string, TaskTreeNode>()
  const rootNodes: TaskTreeNode[] = []

  for (const task of tasks) {
    const treeNode: TaskTreeNode = {
      id: task.id,
      code: task.code,
      name: task.name,
      type: task.nodeLevelType === 'work_package' ? ('work_package' as const) : ('task' as const),
      status: mapTaskStatusToTreeStatus(task.status, task.slaStatus),
      statusLabel: task.status,
      owner: task.assigneeName || task.owner,
      progress: task.progress,
      children: [],
      dependencies: [],
      taskCode: task.code,
    }
    nodeMap.set(task.id, treeNode)
  }

  for (const task of tasks) {
    const treeNode = nodeMap.get(task.id)
    if (!treeNode) continue
    if (task.parentTaskId && nodeMap.has(task.parentTaskId)) {
      const parent = nodeMap.get(task.parentTaskId)!
      parent.children.push(treeNode)
    } else {
      rootNodes.push(treeNode)
    }
  }

  let taskCount = 0
  let workPackageCount = 0
  const delayedCount = tasks.filter(
    t => t.slaStatus === '超时' || t.slaStatus === '即将超时'
  ).length

  const countNodes = (nodes: TaskTreeNode[]) => {
    for (const node of nodes) {
      if (node.type === 'work_package') workPackageCount++
      else taskCount++
      countNodes(node.children)
    }
  }
  countNodes(rootNodes)

  return {
    nodes: rootNodes,
    summary: {
      projectCount: new Set(tasks.map(t => t.projectId)).size,
      workPackageCount,
      taskCount,
      delayedCount,
    },
    updatedAt: new Date().toISOString().slice(0, 10),
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
  // 当未提供模板ID时，返回仅包含真实任务的 mock 数据（仅 mockTasks，不包含工作包）
  if (!templateId) return mockTasks
  const filtered = allMockTaskNodes.filter(
    task => task.projectName.includes(templateId) || task.code.includes(templateId)
  )
  // 未匹配到任何项时，返回仅 mockTasks，避免包含工作包节点
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
