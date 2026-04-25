import type {
  ProjectTemplate,
  TaskTemplate,
  TemplateStatus,
  TemplateVersion,
} from './template-contract.types'

export type StandardTemplateKind = 'project' | 'task'

export type StandardIconTone = 'green' | 'purple' | 'blue' | 'cyan' | 'orange'

export interface StandardTemplateListMeta {
  icon: string
  iconTone: StandardIconTone
  viewIcon: string
  copyIcon: string
  usageCount: number
  updatedAt: string
  owner: string
  builtin?: boolean
  category: string
  description: string
}

export interface StandardTemplateCatalogItem {
  id: string
  kind: StandardTemplateKind
  name: string
  version: TemplateVersion
  status: TemplateStatus
  listMeta: StandardTemplateListMeta
  projectTemplate?: ProjectTemplate
  taskTemplate?: TaskTemplate
}

const asVersion = (value: string): TemplateVersion => value as TemplateVersion

const projectTemplates: StandardTemplateCatalogItem[] = [
  {
    id: 'tpl-store-standard-v1',
    kind: 'project',
    name: '标准门店开店项目',
    version: asVersion('1.0.0'),
    status: 'active',
    listMeta: {
      icon: '21.svg',
      iconTone: 'green',
      viewIcon: '22.svg',
      copyIcon: '23.svg',
      usageCount: 45,
      updatedAt: '2026-03-10',
      owner: '系统',
      builtin: true,
      category: '标准店',
      description: '连锁品牌标准店型开店全流程，含选址、设计、施工、开业筹备',
    },
    projectTemplate: {
      templateId: 'project-template-001',
      templateCode: 'PT-STORE-STANDARD',
      templateName: '标准门店开店项目',
      templateVersion: asVersion('1.0.0'),
      status: 'active',
      priority: 90,
      defaultStandardPackageId: 'std-package-store-v1',
      brandScope: ['全品牌通用'],
      storeTypeScope: ['标准店'],
      regionScope: ['全国'],
      projectTypeScope: ['新开店'],
      serviceScope: ['全流程交付'],
      createdBy: '系统',
      updatedBy: '系统',
      publishedAt: '2026-03-10',
      effectiveFrom: '2026-03-10',
      phaseBlueprint: [
        {
          phaseId: 'phase-1',
          phaseCode: 'P1',
          phaseName: '选址评估',
          phaseOrder: 1,
          ownerRole: '项目经理',
          plannedOffsetStartDays: 0,
          plannedOffsetEndDays: 15,
          entryGuards: ['立项通过'],
          exitGuards: ['选址报告确认'],
        },
        {
          phaseId: 'phase-2',
          phaseCode: 'P2',
          phaseName: '租赁洽谈',
          phaseOrder: 2,
          ownerRole: '拓展经理',
          plannedOffsetStartDays: 15,
          plannedOffsetEndDays: 35,
          entryGuards: ['选址确认'],
          exitGuards: ['租约签订'],
        },
        {
          phaseId: 'phase-3',
          phaseCode: 'P3',
          phaseName: '方案设计',
          phaseOrder: 3,
          ownerRole: '设计负责人',
          plannedOffsetStartDays: 35,
          plannedOffsetEndDays: 60,
          entryGuards: ['租约签订'],
          exitGuards: ['设计方案通过'],
        },
        {
          phaseId: 'phase-4',
          phaseCode: 'P4',
          phaseName: '施工装修',
          phaseOrder: 4,
          ownerRole: '工程监理',
          plannedOffsetStartDays: 60,
          plannedOffsetEndDays: 120,
          entryGuards: ['施工许可'],
          exitGuards: ['工程完工'],
        },
      ],
      milestoneBlueprint: [
        {
          milestoneId: 'm1',
          milestoneName: '选址确认',
          milestoneType: 'business',
          linkedTemplateCodes: ['TT-SITE-SURVEY'],
          plannedOffsetDays: 15,
          isKey: true,
          completionRule: '选址评审通过',
        },
        {
          milestoneId: 'm2',
          milestoneName: '租约签订',
          milestoneType: 'business',
          linkedTemplateCodes: ['TT-LEASE-SIGN'],
          plannedOffsetDays: 35,
          isKey: true,
          completionRule: '租约文件归档',
        },
        {
          milestoneId: 'm3',
          milestoneName: '设计方案通过',
          milestoneType: 'delivery',
          linkedTemplateCodes: ['TT-DESIGN-APPROVAL'],
          plannedOffsetDays: 60,
          isKey: true,
          completionRule: '方案评审通过',
        },
      ],
      taskTemplateBinding: [
        { taskTemplateCode: 'TT-SITE-SURVEY', required: true, sortOrder: 1 },
        { taskTemplateCode: 'TT-LEASE-SIGN', required: true, sortOrder: 2 },
        { taskTemplateCode: 'TT-DESIGN-APPROVAL', required: true, sortOrder: 3 },
        { taskTemplateCode: 'TT-CONSTRUCTION', required: true, sortOrder: 4 },
      ],
    },
  },
  {
    id: 'tpl-flagship-fasttrack-v1',
    kind: 'project',
    name: '旗舰店建设项目',
    version: asVersion('1.1.0'),
    status: 'active',
    listMeta: {
      icon: '25.svg',
      iconTone: 'purple',
      viewIcon: '27.svg',
      copyIcon: '28.svg',
      usageCount: 12,
      updatedAt: '2026-03-08',
      owner: '系统',
      builtin: true,
      category: '旗舰店',
      description: '城市核心商圈旗舰店，高端形象展示与体验中心',
    },
    projectTemplate: {
      templateId: 'project-template-002',
      templateCode: 'PT-FLAGSHIP-FASTTRACK',
      templateName: '旗舰店建设项目',
      templateVersion: asVersion('1.1.0'),
      status: 'active',
      priority: 95,
      defaultStandardPackageId: 'std-package-flagship-v1',
      brandScope: ['高端品牌线'],
      storeTypeScope: ['旗舰店'],
      regionScope: ['一线城市'],
      projectTypeScope: ['新开店'],
      serviceScope: ['高规格交付'],
      createdBy: '系统',
      updatedBy: '系统',
      publishedAt: '2026-03-08',
      effectiveFrom: '2026-03-08',
      phaseBlueprint: [
        {
          phaseId: 'phase-f1',
          phaseCode: 'F1',
          phaseName: '概念策划',
          phaseOrder: 1,
          ownerRole: '品牌总监',
          entryGuards: ['项目立项'],
          exitGuards: ['概念评审通过'],
        },
        {
          phaseId: 'phase-f2',
          phaseCode: 'F2',
          phaseName: '深化设计',
          phaseOrder: 2,
          ownerRole: '设计负责人',
          entryGuards: ['概念方案确认'],
          exitGuards: ['施工图交付'],
        },
      ],
      milestoneBlueprint: [
        {
          milestoneId: 'mf1',
          milestoneName: '概念确认',
          milestoneType: 'business',
          linkedTemplateCodes: ['TT-DESIGN-APPROVAL'],
          isKey: true,
          completionRule: '概念评审通过',
        },
      ],
      taskTemplateBinding: [
        { taskTemplateCode: 'TT-DESIGN-APPROVAL', required: true, sortOrder: 1 },
        { taskTemplateCode: 'TT-CONSTRUCTION', required: true, sortOrder: 2 },
      ],
    },
  },
  {
    id: 'tpl-renovation-upgrade-v1',
    kind: 'project',
    name: '老店翻新改造项目',
    version: asVersion('1.0.2'),
    status: 'ready',
    listMeta: {
      icon: '38.svg',
      iconTone: 'purple',
      viewIcon: '40.svg',
      copyIcon: '41.svg',
      usageCount: 22,
      updatedAt: '2026-02-25',
      owner: '李明',
      category: '改造翻新',
      description: '既有门店形象升级与设施更新，最小化停业时间',
    },
    projectTemplate: {
      templateId: 'project-template-003',
      templateCode: 'PT-RENOVATION-UPGRADE',
      templateName: '老店翻新改造项目',
      templateVersion: asVersion('1.0.2'),
      status: 'ready',
      priority: 80,
      brandScope: ['全品牌通用'],
      storeTypeScope: ['街边店', '标准店'],
      regionScope: ['全国'],
      projectTypeScope: ['翻新改造'],
      serviceScope: ['不停业改造'],
      createdBy: '李明',
      updatedBy: '李明',
      effectiveFrom: '2026-02-25',
      phaseBlueprint: [],
      milestoneBlueprint: [],
      taskTemplateBinding: [{ taskTemplateCode: 'TT-CONSTRUCTION', required: true, sortOrder: 1 }],
    },
  },
]

const taskTemplates: StandardTemplateCatalogItem[] = [
  {
    id: 'tt-site-survey-v1',
    kind: 'task',
    name: '选址调研任务模板',
    version: asVersion('1.0.0'),
    status: 'active',
    listMeta: {
      icon: '18.svg',
      iconTone: 'green',
      viewIcon: '19.svg',
      copyIcon: '20.svg',
      usageCount: 31,
      updatedAt: '2026-03-12',
      owner: '陈雨',
      category: '选址调研',
      description: '市场调研、商圈分析、选址评分与评审流程标准化模板',
    },
    taskTemplate: {
      taskTemplateId: 'task-template-001',
      taskTemplateCode: 'TT-SITE-SURVEY',
      taskTemplateName: '选址调研任务模板',
      taskTemplateVersion: asVersion('1.0.0'),
      status: 'active',
      templateLevel: 'work_package',
      businessDomain: '拓展',
      taskType: '调研',
      requiredFlag: true,
      milestoneFlag: true,
      ownerRole: '拓展经理',
      assigneeTypeDefault: 'personnel',
      slaRuleId: 'sla-site-survey-7d',
      standardBinding: {
        defaultStandardPackageId: 'std-package-site-v1',
        defaultExecutionStandardIds: ['std-site-check-001', 'std-site-check-002'],
        defaultAcceptanceStandardIds: ['std-site-accept-001'],
      },
      dependencyBlueprint: [],
      childTemplateRefs: [],
      sortOrder: 1,
      createdBy: '陈雨',
      updatedBy: '陈雨',
      publishedAt: '2026-03-12',
      effectiveFrom: '2026-03-12',
    },
  },
  {
    id: 'tt-lease-sign-v1',
    kind: 'task',
    name: '租约签订任务模板',
    version: asVersion('1.0.0'),
    status: 'active',
    listMeta: {
      icon: '29.svg',
      iconTone: 'blue',
      viewIcon: '30.svg',
      copyIcon: '31.svg',
      usageCount: 38,
      updatedAt: '2026-03-05',
      owner: '系统',
      builtin: true,
      category: '法务签约',
      description: '租赁条款谈判、法务审核与合同归档任务模板',
    },
    taskTemplate: {
      taskTemplateId: 'task-template-002',
      taskTemplateCode: 'TT-LEASE-SIGN',
      taskTemplateName: '租约签订任务模板',
      taskTemplateVersion: asVersion('1.0.0'),
      status: 'active',
      templateLevel: 'task',
      businessDomain: '法务',
      taskType: '签约',
      requiredFlag: true,
      milestoneFlag: true,
      ownerRole: '法务经理',
      assigneeTypeDefault: 'personnel',
      standardBinding: {
        defaultExecutionStandardIds: ['std-lease-exec-001'],
        defaultAcceptanceStandardIds: ['std-lease-accept-001'],
      },
      dependencyBlueprint: [
        {
          relationId: 'dep-lease-001',
          fromTemplateCode: 'TT-SITE-SURVEY',
          toTemplateCode: 'TT-LEASE-SIGN',
          relationType: 'depends_on',
          constraintType: 'FS',
          lagDays: 0,
        },
      ],
      childTemplateRefs: [],
      sortOrder: 2,
      createdBy: '系统',
      updatedBy: '系统',
      publishedAt: '2026-03-05',
      effectiveFrom: '2026-03-05',
    },
  },
  {
    id: 'tt-design-approval-v1',
    kind: 'task',
    name: '设计评审任务模板',
    version: asVersion('1.2.0'),
    status: 'active',
    listMeta: {
      icon: '32.svg',
      iconTone: 'cyan',
      viewIcon: '33.svg',
      copyIcon: '34.svg',
      usageCount: 15,
      updatedAt: '2026-03-01',
      owner: '张伟',
      category: '设计评审',
      description: '方案评审、图纸校验与材料标准确认任务模板',
    },
    taskTemplate: {
      taskTemplateId: 'task-template-003',
      taskTemplateCode: 'TT-DESIGN-APPROVAL',
      taskTemplateName: '设计评审任务模板',
      taskTemplateVersion: asVersion('1.2.0'),
      status: 'active',
      templateLevel: 'work_package',
      businessDomain: '设计',
      taskType: '评审',
      requiredFlag: true,
      milestoneFlag: true,
      ownerRole: '设计负责人',
      assigneeTypeDefault: 'personnel',
      standardBinding: {
        defaultExecutionStandardIds: ['std-design-exec-001'],
        defaultAcceptanceStandardIds: ['std-design-accept-001', 'std-design-accept-002'],
      },
      dependencyBlueprint: [
        {
          relationId: 'dep-design-001',
          fromTemplateCode: 'TT-LEASE-SIGN',
          toTemplateCode: 'TT-DESIGN-APPROVAL',
          relationType: 'depends_on',
          constraintType: 'FS',
          lagDays: 2,
        },
      ],
      childTemplateRefs: [],
      sortOrder: 3,
      createdBy: '张伟',
      updatedBy: '张伟',
      publishedAt: '2026-03-01',
      effectiveFrom: '2026-03-01',
    },
  },
  {
    id: 'tt-construction-v1',
    kind: 'task',
    name: '施工执行任务模板',
    version: asVersion('1.0.1'),
    status: 'ready',
    listMeta: {
      icon: '35.svg',
      iconTone: 'orange',
      viewIcon: '36.svg',
      copyIcon: '37.svg',
      usageCount: 28,
      updatedAt: '2026-02-28',
      owner: '系统',
      builtin: true,
      category: '施工交付',
      description: '施工排产、质量巡检、整改闭环与验收交付模板',
    },
    taskTemplate: {
      taskTemplateId: 'task-template-004',
      taskTemplateCode: 'TT-CONSTRUCTION',
      taskTemplateName: '施工执行任务模板',
      taskTemplateVersion: asVersion('1.0.1'),
      status: 'ready',
      templateLevel: 'stage',
      businessDomain: '工程',
      taskType: '施工',
      requiredFlag: true,
      milestoneFlag: false,
      ownerRole: '工程监理',
      assigneeTypeDefault: 'team',
      standardBinding: {
        defaultExecutionStandardIds: ['std-construction-exec-001'],
        defaultAcceptanceStandardIds: ['std-construction-accept-001'],
      },
      dependencyBlueprint: [
        {
          relationId: 'dep-construction-001',
          fromTemplateCode: 'TT-DESIGN-APPROVAL',
          toTemplateCode: 'TT-CONSTRUCTION',
          relationType: 'depends_on',
          constraintType: 'FS',
          lagDays: 0,
        },
      ],
      childTemplateRefs: [],
      sortOrder: 4,
      createdBy: '系统',
      updatedBy: '系统',
      effectiveFrom: '2026-02-28',
    },
  },
]

const catalog: StandardTemplateCatalogItem[] = [...projectTemplates, ...taskTemplates]

export const getStandardTemplatesByKind = (
  kind: StandardTemplateKind
): StandardTemplateCatalogItem[] => catalog.filter(item => item.kind === kind)

export const getStandardTemplateById = (id: string): StandardTemplateCatalogItem | undefined =>
  catalog.find(item => item.id === id)

export const getStandardTemplateStats = (kind: StandardTemplateKind) => {
  const list = getStandardTemplatesByKind(kind)
  const builtinCount = list.filter(item => item.listMeta.builtin).length
  const customCount = list.length - builtinCount
  const activeCount = list.filter(item => item.status === 'active').length
  const usageTotal = list.reduce((sum, item) => sum + item.listMeta.usageCount, 0)

  return {
    all: list.length,
    builtin: builtinCount,
    custom: customCount,
    active: activeCount,
    usageTotal,
  }
}
