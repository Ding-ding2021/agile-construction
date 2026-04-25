/**
 * 模板数据契约类型基线（V1）
 * 适用：标准管理（项目模板/任务模板）→ 任务中心（实例化）→ 项目管理（只读消费）
 */

export type TemplateStatus = 'draft' | 'reviewing' | 'ready' | 'active' | 'inactive' | 'deprecated'

export type TemplateLevel = 'project_root' | 'stage' | 'work_package' | 'task'

export type RelationType = 'depends_on'

export type ConstraintType = 'FS'

export type TemplateSourceLevel =
  | 'national'
  | 'industry'
  | 'regional'
  | 'enterprise'
  | 'brand'
  | 'supplier'
  | 'project'

export type TemplateVersion = `${number}.${number}.${number}`

export interface TemplateScopes {
  brandScope: string[]
  storeTypeScope: string[]
  regionScope: string[]
  projectTypeScope: string[]
  serviceScope: string[]
}

export interface TemplateMeta {
  createdBy: string
  updatedBy: string
  publishedAt?: string
  effectiveFrom?: string
  effectiveTo?: string
}

export interface PhaseBlueprint {
  phaseId: string
  phaseCode: string
  phaseName: string
  phaseOrder: number
  ownerRole: string
  plannedOffsetStartDays?: number
  plannedOffsetEndDays?: number
  entryGuards: string[]
  exitGuards: string[]
}

export interface MilestoneBlueprint {
  milestoneId: string
  milestoneName: string
  milestoneType: string
  linkedTemplateCodes: string[]
  plannedOffsetDays?: number
  isKey: boolean
  completionRule: string
}

export interface DependencyBlueprint {
  relationId: string
  fromTemplateCode: string
  toTemplateCode: string
  relationType: RelationType
  constraintType: ConstraintType
  lagDays: number
}

export interface TaskTemplateChildRef {
  childTemplateCode: string
  sortOrder: number
}

export interface StandardBinding {
  defaultStandardPackageId?: string
  defaultExecutionStandardIds: string[]
  defaultAcceptanceStandardIds: string[]
  defaultExecutionChecklistTemplateId?: string
  defaultAcceptanceChecklistTemplateId?: string
}

export interface ProjectTemplateBinding {
  taskTemplateCode: string
  required: boolean
  sortOrder: number
}

export interface ProjectTemplate extends TemplateScopes, TemplateMeta {
  templateId: string
  templateCode: string
  templateName: string
  templateVersion: TemplateVersion
  status: TemplateStatus
  priority: number
  defaultStandardPackageId?: string
  phaseBlueprint: PhaseBlueprint[]
  milestoneBlueprint: MilestoneBlueprint[]
  taskTemplateBinding: ProjectTemplateBinding[]
}

export interface TaskTemplate extends TemplateMeta {
  taskTemplateId: string
  taskTemplateCode: string
  taskTemplateName: string
  taskTemplateVersion: TemplateVersion
  status: TemplateStatus
  templateLevel: TemplateLevel
  businessDomain: string
  taskType: string
  requiredFlag: boolean
  milestoneFlag: boolean
  ownerRole: string
  assigneeTypeDefault: string
  slaRuleId?: string
  standardBinding: StandardBinding
  dependencyBlueprint: DependencyBlueprint[]
  childTemplateRefs: TaskTemplateChildRef[]
  parentTemplateCode?: string
  sortOrder: number
}

export interface TemplateRelationshipConstraints {
  singleParentOnly: true
  allowMultipleChildren: true
  forbidSelfDependency: true
  forbidCyclicDependency: true
  relationType: RelationType
  constraintType: ConstraintType
}

export interface TemplateMatchInput {
  brand: string
  storeType: string
  region: string
  projectType: string
  serviceType?: string
  plannedStartDate?: string
  plannedEndDate?: string
  plannedOpenDate?: string
}

export interface ResolvedTemplateBundle {
  projectTemplateResolved: ProjectTemplate
  taskTemplateResolved: TaskTemplate[]
  standardPackageResolved?: {
    packageId: string
    packageVersion: string
  }
  validationWarnings: string[]
}

export interface TaskTreeNodeInstance {
  instanceId: string
  templateCode: string
  templateVersion: TemplateVersion
  parentInstanceId?: string
  level: TemplateLevel
  name: string
  ownerRole: string
  assignee?: string
  plannedStartDate?: string
  plannedEndDate?: string
  standardSnapshotId?: string
  executionStandardIds: string[]
  acceptanceStandardIds: string[]
  children: TaskTreeNodeInstance[]
}

export interface TaskRelationInstance {
  relationId: string
  fromInstanceId: string
  toInstanceId: string
  relationType: RelationType
  constraintType: ConstraintType
  lagDays: number
}

export interface TemplateInstantiationInput {
  projectInstanceId: string
  matchInput: TemplateMatchInput
  resolvedBundle: ResolvedTemplateBundle
}

export interface TemplateInstantiationOutput {
  projectInstanceId: string
  phaseInstances: Array<{
    phaseId: string
    phaseName: string
    phaseOrder: number
  }>
  milestoneInstances: Array<{
    milestoneId: string
    milestoneName: string
    isKey: boolean
  }>
  taskTreeInstances: TaskTreeNodeInstance[]
  taskRelationInstances: TaskRelationInstance[]
  snapshotSummary: {
    standardPackageId?: string
    standardPackageVersion?: string
    snapshotCount: number
  }
}

export type TemplateAuditEvent =
  | {
      type: 'template_instance_created'
      projectInstanceId: string
      templateCode: string
      templateVersion: TemplateVersion
      timestamp: string
    }
  | {
      type: 'template_override_applied'
      projectInstanceId: string
      taskInstanceId: string
      overrideReason: string
      timestamp: string
    }
  | {
      type: 'standard_snapshot_created'
      projectInstanceId: string
      taskInstanceId: string
      snapshotId: string
      timestamp: string
    }
  | {
      type: 'template_mismatch_detected'
      projectInstanceId: string
      details: string
      timestamp: string
    }

export interface ProjectTemplateReadModel {
  templateName: string
  templateVersion: TemplateVersion
  standardPackageId?: string
  standardPackageVersion?: string
  snapshotSummary?: string
}
