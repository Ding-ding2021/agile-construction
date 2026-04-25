export type AcceptanceStatus = '待验收' | '验收通过' | '验收不通过' | '整改中' | '待复验'
export type AcceptanceRiskLevel = '低' | '中' | '高' | '严重'

export type AcceptanceStandard = {
  id: string
  title: string
  passed: boolean
}

export type AcceptanceAttachment = {
  id: string
  name: string
  type: 'image' | 'file'
}

export type AcceptanceNode = {
  id: string
  projectCode: string
  nodeCode: string
  nodeName: string
  phase: string
  owner: string
  plannedAt: string
  submittedAt?: string
  status: AcceptanceStatus
  riskLevel: AcceptanceRiskLevel
  issueCount: number
  standards: AcceptanceStandard[]
  attachments: AcceptanceAttachment[]
  updatedAt: string
}

const seedNodes: Omit<AcceptanceNode, 'id' | 'projectCode'>[] = [
  {
    nodeCode: 'AC-001',
    nodeName: '隐蔽工程预检',
    phase: '施工实施',
    owner: '王工',
    plannedAt: '2026-04-08',
    submittedAt: '2026-04-07',
    status: '待验收',
    riskLevel: '中',
    issueCount: 1,
    standards: [
      { id: 's1', title: '水电管线走向符合规范', passed: true },
      { id: 's2', title: '防水层闭水试验记录完整', passed: false },
      { id: 's3', title: '隐蔽工程影像资料齐全', passed: true },
    ],
    attachments: [
      { id: 'a1', name: '闭水试验记录.pdf', type: 'file' },
      { id: 'a2', name: '隐蔽工程照片-01.jpg', type: 'image' },
    ],
    updatedAt: '2026-04-06 14:23',
  },
  {
    nodeCode: 'AC-002',
    nodeName: '机电联调验收',
    phase: '施工实施',
    owner: '李工',
    plannedAt: '2026-04-12',
    submittedAt: '2026-04-11',
    status: '整改中',
    riskLevel: '高',
    issueCount: 3,
    standards: [
      { id: 's1', title: '空调系统联调达标', passed: false },
      { id: 's2', title: '照明回路测试通过', passed: true },
      { id: 's3', title: '配电箱标识完整', passed: false },
    ],
    attachments: [
      { id: 'a1', name: '机电联调报告.pdf', type: 'file' },
      { id: 'a2', name: '现场照片-联调.jpg', type: 'image' },
    ],
    updatedAt: '2026-04-06 09:40',
  },
  {
    nodeCode: 'AC-003',
    nodeName: '开业前综合验收',
    phase: '验收交付',
    owner: '张经理',
    plannedAt: '2026-04-15',
    status: '待验收',
    riskLevel: '低',
    issueCount: 0,
    standards: [
      { id: 's1', title: '品牌视觉标准一致', passed: true },
      { id: 's2', title: '消防通道与指示符合要求', passed: true },
      { id: 's3', title: '竣工资料归档完整', passed: true },
    ],
    attachments: [{ id: 'a1', name: '开业前检查清单.xlsx', type: 'file' }],
    updatedAt: '2026-04-05 18:12',
  },
  {
    nodeCode: 'AC-004',
    nodeName: '门店交付确认',
    phase: '结算归档',
    owner: '赵主管',
    plannedAt: '2026-04-20',
    submittedAt: '2026-04-19',
    status: '待复验',
    riskLevel: '严重',
    issueCount: 2,
    standards: [
      { id: 's1', title: '交付资料签字齐全', passed: false },
      { id: 's2', title: '关键资产编号与清单一致', passed: false },
      { id: 's3', title: '整改项闭环完成', passed: true },
    ],
    attachments: [
      { id: 'a1', name: '交付确认单.pdf', type: 'file' },
      { id: 'a2', name: '资产清单照片.jpg', type: 'image' },
    ],
    updatedAt: '2026-04-06 11:08',
  },
]

export const createAcceptanceNodesForProject = (projectCode: string): AcceptanceNode[] =>
  seedNodes.map((node, index) => ({
    ...node,
    id: `${projectCode}-${index + 1}`,
    projectCode,
  }))
