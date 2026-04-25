export type PersonnelStatus = 'onduty' | 'leave' | 'offboard' | 'disabled'
export type PersonnelAvailabilityStatus = 'assignable' | 'busy' | 'unavailable'

export type PersonnelUser = {
  id: string
  name: string
  personCode: string
  mobile: string
  email?: string
  initial: string
  role: string
  roleTone: 'manager' | 'lead' | 'engineer' | 'observer' | 'external'
  orgName: string
  teamName: string
  title?: string
  employmentType: 'internal' | 'outsource' | 'vendor'
  workCity: string
  personStatus: PersonnelStatus
  availabilityStatus: PersonnelAvailabilityStatus
  skills: string[]
  skillProfiles: PersonnelSkill[]
  certs: PersonnelCert[]
  currentTaskCount: number
  criticalTaskCount: number
  riskLevel: 'low' | 'medium' | 'high'
  lastActiveAt: string
  actionIcon: string
  avatarTone: 'default' | 'gray' | 'orange'
}

export const resolveAvailabilityStatusByPersonStatus = (
  status: PersonnelStatus
): PersonnelAvailabilityStatus => {
  if (status === 'onduty') {
    return 'assignable'
  }

  return 'unavailable'
}

export type DetailItemTone = 'blue' | 'green' | 'orange' | 'red' | 'purple'

export type PersonnelSkill = {
  name: string
  level: '初级' | '中级' | '高级'
}

export type PersonnelCert = {
  name: string
  expireAt: string
  status: 'valid' | 'expiring' | 'expired'
}

export type PersonnelDetailProject = {
  name: string
  role: string
  joinedAt: string
  progress: string
  status: string
  tone: Extract<DetailItemTone, 'blue' | 'green'>
}

export type PersonnelDetailTask = {
  priority: 'P0' | 'P1'
  priorityTone: Extract<DetailItemTone, 'red' | 'orange'>
  status: '进行中' | '待开始' | '阻塞' | '已完成'
  statusTone: 'blue' | 'red' | 'neutral'
  title: string
  project: string
  due: string
}

export type PersonnelDetailActivity = {
  tone: DetailItemTone
  text: string
  meta: string
  icon: string
}

export type PersonnelStatusChange = {
  type: 'leave' | 'return' | 'offboard' | 'replacement'
  title: string
  operator: string
  at: string
  note?: string
}

export type PersonnelDetailStats = {
  completedTasks: number
  riskCount: number
  uploadCount: number
  onTimeRate: string
  joinedDays: number
}

export type PersonnelUserDetailData = {
  projects: PersonnelDetailProject[]
  tasks: PersonnelDetailTask[]
  activities: PersonnelDetailActivity[]
  statusChanges: PersonnelStatusChange[]
  stats: PersonnelDetailStats
}

export const personnelUsers: PersonnelUser[] = [
  {
    id: 'U1001',
    name: '张伟',
    personCode: 'EMP-2021-0042',
    mobile: '138****1234',
    email: 'zhangwei@01co.com',
    initial: 'ZW',
    role: '项目经理',
    roleTone: 'manager',
    orgName: '华东大区',
    teamName: '项目一部',
    title: '高级项目经理',
    employmentType: 'internal',
    workCity: '上海',
    personStatus: 'onduty',
    availabilityStatus: 'assignable',
    skills: ['进度管理', '成本管控', 'BIM'],
    skillProfiles: [
      { name: '进度管理', level: '高级' },
      { name: '成本管控', level: '高级' },
      { name: 'BIM', level: '中级' },
    ],
    certs: [
      { name: '一级建造师', expireAt: '2027-10-18', status: 'valid' },
      { name: 'PMP', expireAt: '2026-12-30', status: 'valid' },
    ],
    currentTaskCount: 4,
    criticalTaskCount: 2,
    riskLevel: 'low',
    lastActiveAt: '2026-03-03 09:45',
    actionIcon: '31.svg',
    avatarTone: 'default',
  },
  {
    id: 'U1002',
    name: '李娜',
    personCode: 'EMP-1002',
    mobile: '13800002222',
    email: 'lina@01co.com',
    initial: '李',
    role: '项目经理',
    roleTone: 'manager',
    orgName: '华东大区',
    teamName: '项目二部',
    title: '项目经理',
    employmentType: 'internal',
    workCity: '苏州',
    personStatus: 'onduty',
    availabilityStatus: 'busy',
    skills: ['合同管理', '沟通协调'],
    skillProfiles: [
      { name: '合同管理', level: '高级' },
      { name: '沟通协调', level: '中级' },
    ],
    certs: [
      { name: '二级建造师', expireAt: '2026-11-18', status: 'valid' },
      { name: '安全员C证', expireAt: '2026-04-20', status: 'expiring' },
    ],
    currentTaskCount: 5,
    criticalTaskCount: 2,
    riskLevel: 'medium',
    lastActiveAt: '2026-04-07 08:48',
    actionIcon: '31.svg',
    avatarTone: 'default',
  },
  {
    id: 'U1003',
    name: '王强',
    personCode: 'EMP-1021',
    mobile: '13800003333',
    email: 'wangqiang@01co.com',
    initial: '王',
    role: '专业负责人',
    roleTone: 'lead',
    orgName: '工程技术中心',
    teamName: '结构组',
    title: '结构负责人',
    employmentType: 'internal',
    workCity: '天津',
    personStatus: 'onduty',
    availabilityStatus: 'busy',
    skills: ['结构设计', '抗震评估', '现场复核'],
    skillProfiles: [
      { name: '结构设计', level: '高级' },
      { name: '抗震评估', level: '高级' },
      { name: '现场复核', level: '中级' },
    ],
    certs: [
      { name: '一级结构工程师', expireAt: '2028-05-12', status: 'valid' },
      { name: '注册监理工程师', expireAt: '2026-04-15', status: 'expiring' },
    ],
    currentTaskCount: 6,
    criticalTaskCount: 3,
    riskLevel: 'high',
    lastActiveAt: '2026-04-06 22:03',
    actionIcon: '31.svg',
    avatarTone: 'default',
  },
  {
    id: 'U1004',
    name: '赵敏',
    personCode: 'EMP-1068',
    mobile: '13800004444',
    email: 'zhaomin@01co.com',
    initial: '赵',
    role: '工程师',
    roleTone: 'engineer',
    orgName: '安全质量中心',
    teamName: '质量组',
    title: '质检工程师',
    employmentType: 'internal',
    workCity: '南京',
    personStatus: 'leave',
    availabilityStatus: 'unavailable',
    skills: ['质量巡检', '风险排查'],
    skillProfiles: [
      { name: '质量巡检', level: '中级' },
      { name: '风险排查', level: '中级' },
    ],
    certs: [
      { name: '质量员证', expireAt: '2027-01-08', status: 'valid' },
      { name: '高空作业证', expireAt: '2026-03-20', status: 'expired' },
    ],
    currentTaskCount: 2,
    criticalTaskCount: 0,
    riskLevel: 'medium',
    lastActiveAt: '2026-04-01 18:25',
    actionIcon: '31.svg',
    avatarTone: 'default',
  },
  {
    id: 'U1005',
    name: '孙杰',
    personCode: 'EMP-1082',
    mobile: '13800005555',
    email: 'sunjie@01co.com',
    initial: '孙',
    role: '工程师',
    roleTone: 'engineer',
    orgName: '华南大区',
    teamName: '机电组',
    title: '机电工程师',
    employmentType: 'internal',
    workCity: '广州',
    personStatus: 'offboard',
    availabilityStatus: 'unavailable',
    skills: ['机电施工'],
    skillProfiles: [{ name: '机电施工', level: '中级' }],
    certs: [{ name: '低压电工证', expireAt: '2026-12-01', status: 'valid' }],
    currentTaskCount: 0,
    criticalTaskCount: 0,
    riskLevel: 'low',
    lastActiveAt: '2026-03-19 11:17',
    actionIcon: '31.svg',
    avatarTone: 'gray',
  },
  {
    id: 'U1006',
    name: '陈雨',
    personCode: 'EMP-1120',
    mobile: '13800006666',
    email: 'chenyu@01co.com',
    initial: '陈',
    role: '只读观察者',
    roleTone: 'observer',
    orgName: '运营管理中心',
    teamName: '管理层',
    title: '运营分析师',
    employmentType: 'internal',
    workCity: '上海',
    personStatus: 'disabled',
    availabilityStatus: 'unavailable',
    skills: ['经营分析', '审计复盘'],
    skillProfiles: [
      { name: '经营分析', level: '高级' },
      { name: '审计复盘', level: '中级' },
    ],
    certs: [{ name: '数据分析师认证', expireAt: '2027-06-30', status: 'valid' }],
    currentTaskCount: 1,
    criticalTaskCount: 0,
    riskLevel: 'medium',
    lastActiveAt: '2026-03-27 09:40',
    actionIcon: '31.svg',
    avatarTone: 'gray',
  },
  {
    id: 'U1007',
    name: '吴芳（外部）',
    personCode: 'EXT-2011',
    mobile: '13900007777',
    email: 'wufang@partner.com',
    initial: '吴',
    role: '外部协作方',
    roleTone: 'external',
    orgName: '合作伙伴组织',
    teamName: '远大幕墙',
    title: '外协负责人',
    employmentType: 'vendor',
    workCity: '深圳',
    personStatus: 'onduty',
    availabilityStatus: 'assignable',
    skills: ['幕墙深化', '现场配合'],
    skillProfiles: [
      { name: '幕墙深化', level: '高级' },
      { name: '现场配合', level: '中级' },
    ],
    certs: [
      { name: '高压电工证', expireAt: '2026-04-14', status: 'expiring' },
      { name: '特种作业操作证', expireAt: '2025-12-30', status: 'expired' },
    ],
    currentTaskCount: 1,
    criticalTaskCount: 1,
    riskLevel: 'high',
    lastActiveAt: '2026-04-06 15:09',
    actionIcon: '31.svg',
    avatarTone: 'orange',
  },
]

const defaultDetailData: PersonnelUserDetailData = {
  projects: [
    {
      name: '上海南京路旗舰店',
      role: '项目经理',
      joinedAt: '加入于 2023-09-15',
      progress: '12/18',
      status: '进行中',
      tone: 'blue',
    },
    {
      name: '北京朝阳大悦城店',
      role: '项目经理',
      joinedAt: '加入于 2024-02-20',
      progress: '3/8',
      status: '进行中',
      tone: 'blue',
    },
    {
      name: '深圳前海智慧城市试点',
      role: '项目经理',
      joinedAt: '加入于 2023-03-15',
      progress: '25/25',
      status: '已完成',
      tone: 'green',
    },
  ],
  tasks: [
    {
      priority: 'P0',
      priorityTone: 'red',
      status: '进行中',
      statusTone: 'blue',
      title: '审核吊顶施工方案',
      project: '上海南京路旗舰店',
      due: '2026-03-08',
    },
    {
      priority: 'P1',
      priorityTone: 'orange',
      status: '待开始',
      statusTone: 'neutral',
      title: '编制月度进度汇报',
      project: '上海南京路旗舰店',
      due: '2026-03-10',
    },
    {
      priority: 'P1',
      priorityTone: 'orange',
      status: '进行中',
      statusTone: 'blue',
      title: '协调机电施工冲突',
      project: '北京朝阳大悦城店',
      due: '2026-03-06',
    },
    {
      priority: 'P0',
      priorityTone: 'red',
      status: '阻塞',
      statusTone: 'red',
      title: '供应商合同会签',
      project: '北京朝阳大悦城店',
      due: '2026-03-04',
    },
  ],
  activities: [
    {
      tone: 'blue',
      text: '完成任务「消防系统调试验收」',
      meta: '上海南京路旗舰店 · 11:20',
      icon: '25.svg',
    },
    {
      tone: 'green',
      text: '添加 吴芳 为外部协作方',
      meta: '上海南京路旗舰店 · 14:30',
      icon: '26.svg',
    },
    {
      tone: 'blue',
      text: '创建任务「收银区地面铺贴」',
      meta: '上海南京路旗舰店 · 10:00',
      icon: '27.svg',
    },
    {
      tone: 'orange',
      text: '记录风险「石材供应商交货延迟」',
      meta: '上海南京路旗舰店 · 16:20',
      icon: '28.svg',
    },
    {
      tone: 'purple',
      text: '上传「第三次进度汇报.pptx」',
      meta: '上海南京路旗舰店 · 15:45',
      icon: '29.svg',
    },
  ],
  statusChanges: [
    {
      type: 'replacement',
      title: '项目二阶段临时替补',
      operator: '系统调度',
      at: '2026-04-08 09:20',
      note: '替补对象：李娜，预计 3 天',
    },
    { type: 'return', title: '请假结束恢复在岗', operator: '人事管理员', at: '2026-03-22 10:15' },
    {
      type: 'leave',
      title: '年假审批通过',
      operator: '直属主管',
      at: '2026-03-15 18:00',
      note: '请假区间：03-18 至 03-21',
    },
  ],
  stats: {
    completedTasks: 156,
    riskCount: 23,
    uploadCount: 47,
    onTimeRate: '92%',
    joinedDays: 1722,
  },
}

const personnelDetailDataMap: Record<string, PersonnelUserDetailData> = {
  U1001: defaultDetailData,
  U1002: {
    projects: [
      {
        name: '苏州园区商业综合体',
        role: '项目经理',
        joinedAt: '加入于 2024-01-12',
        progress: '8/14',
        status: '进行中',
        tone: 'blue',
      },
      {
        name: '杭州滨江示范店',
        role: '项目经理',
        joinedAt: '加入于 2025-02-05',
        progress: '7/7',
        status: '已完成',
        tone: 'green',
      },
    ],
    tasks: [
      {
        priority: 'P0',
        priorityTone: 'red',
        status: '进行中',
        statusTone: 'blue',
        title: '确认消防设备进场计划',
        project: '苏州园区商业综合体',
        due: '2026-04-12',
      },
      {
        priority: 'P1',
        priorityTone: 'orange',
        status: '待开始',
        statusTone: 'neutral',
        title: '输出周报模板',
        project: '苏州园区商业综合体',
        due: '2026-04-14',
      },
    ],
    activities: [
      {
        tone: 'green',
        text: '完成任务「灯光调试验收」',
        meta: '杭州滨江示范店 · 09:40',
        icon: '26.svg',
      },
      {
        tone: 'blue',
        text: '创建任务「材料到场检查」',
        meta: '苏州园区商业综合体 · 13:20',
        icon: '27.svg',
      },
      {
        tone: 'orange',
        text: '记录风险「机电图纸冲突」',
        meta: '苏州园区商业综合体 · 18:10',
        icon: '28.svg',
      },
    ],
    statusChanges: [
      {
        type: 'leave',
        title: '调休申请通过',
        operator: '人事管理员',
        at: '2026-04-03 17:30',
        note: '调休半天，已同步项目日程',
      },
      { type: 'return', title: '调休结束恢复在岗', operator: '系统自动', at: '2026-04-04 13:30' },
    ],
    stats: {
      completedTasks: 124,
      riskCount: 18,
      uploadCount: 31,
      onTimeRate: '89%',
      joinedDays: 980,
    },
  },
  U1003: {
    projects: [
      {
        name: '天津滨海智慧仓',
        role: '结构负责人',
        joinedAt: '加入于 2023-10-02',
        progress: '21/26',
        status: '进行中',
        tone: 'blue',
      },
      {
        name: '重庆中庭改造',
        role: '结构负责人',
        joinedAt: '加入于 2024-11-08',
        progress: '10/10',
        status: '已完成',
        tone: 'green',
      },
    ],
    tasks: [
      {
        priority: 'P0',
        priorityTone: 'red',
        status: '阻塞',
        statusTone: 'red',
        title: '复核支撑体系变更单',
        project: '天津滨海智慧仓',
        due: '2026-04-10',
      },
      {
        priority: 'P1',
        priorityTone: 'orange',
        status: '进行中',
        statusTone: 'blue',
        title: '输出结构校核报告',
        project: '天津滨海智慧仓',
        due: '2026-04-15',
      },
      {
        priority: 'P1',
        priorityTone: 'orange',
        status: '待开始',
        statusTone: 'neutral',
        title: 'BIM碰撞复盘会议',
        project: '天津滨海智慧仓',
        due: '2026-04-18',
      },
    ],
    activities: [
      {
        tone: 'purple',
        text: '上传「结构优化建议v3」',
        meta: '天津滨海智慧仓 · 08:15',
        icon: '29.svg',
      },
      {
        tone: 'blue',
        text: '创建任务「节点详图复核」',
        meta: '天津滨海智慧仓 · 11:00',
        icon: '27.svg',
      },
    ],
    statusChanges: [
      {
        type: 'replacement',
        title: '关键任务替补安排',
        operator: '项目总监',
        at: '2026-04-07 16:00',
        note: '替补对象：周洋（结构组）',
      },
      {
        type: 'leave',
        title: '病假审批通过',
        operator: '人事管理员',
        at: '2026-03-29 09:12',
        note: '时长 2 天',
      },
    ],
    stats: {
      completedTasks: 188,
      riskCount: 29,
      uploadCount: 56,
      onTimeRate: '86%',
      joinedDays: 1120,
    },
  },
}

export const getPersonnelUserById = (userId: string) =>
  personnelUsers.find(user => user.id === userId) ?? personnelUsers[0]

export const getPersonnelUserDetailDataById = (userId: string): PersonnelUserDetailData =>
  personnelDetailDataMap[userId] ?? defaultDetailData
