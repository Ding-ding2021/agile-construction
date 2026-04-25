import type { ProjectStatus } from '../../domain/projectStatusMachine'

export type SystemRole = 'admin' | 'pm' | 'executor' | 'finance' | 'auditor'

export type WorkflowAction =
  | 'project.read'
  | 'project.write'
  | 'project.transition'
  | 'task.read'
  | 'task.write'
  | 'acceptance.read'
  | 'acceptance.write'
  | 'settlement.read'
  | 'settlement.write'
  | 'audit.read'
  | 'audit.write'

export type PermissionMatrix = Record<SystemRole, WorkflowAction[]>

export const ROLE_PERMISSION_MATRIX: PermissionMatrix = {
  admin: [
    'project.read',
    'project.write',
    'project.transition',
    'task.read',
    'task.write',
    'acceptance.read',
    'acceptance.write',
    'settlement.read',
    'settlement.write',
    'audit.read',
    'audit.write',
  ],
  pm: [
    'project.read',
    'project.write',
    'project.transition',
    'task.read',
    'task.write',
    'acceptance.read',
    'acceptance.write',
    'settlement.read',
    'audit.read',
    'audit.write',
  ],
  executor: ['project.read', 'task.read', 'task.write', 'acceptance.read', 'audit.write'],
  finance: ['project.read', 'settlement.read', 'settlement.write', 'audit.read', 'audit.write'],
  auditor: ['project.read', 'task.read', 'acceptance.read', 'settlement.read', 'audit.read'],
}

export type TransitionContract = {
  from: ProjectStatus
  to: ProjectStatus
  requiredChecks: string[]
  requiresReason: boolean
}

export const PROJECT_TRANSITION_CONTRACTS: TransitionContract[] = [
  { from: '待立项', to: '待确认', requiredChecks: ['hasContainer'], requiresReason: false },
  { from: '待确认', to: '待拆解', requiredChecks: ['hasApproval'], requiresReason: false },
  {
    from: '待拆解',
    to: '执行中',
    requiredChecks: ['hasContainer', 'hasMilestones', 'hasTaskTree', 'hasStandardBinding'],
    requiresReason: false,
  },
  { from: '执行中', to: '待验收', requiredChecks: ['keyTasksCompleted'], requiresReason: false },
  { from: '待验收', to: '待结算', requiredChecks: ['acceptancePassed'], requiresReason: false },
  { from: '待验收', to: '整改中', requiredChecks: ['hasAcceptanceFeedback'], requiresReason: true },
  { from: '整改中', to: '待验收', requiredChecks: ['rectificationClosed'], requiresReason: false },
  { from: '待结算', to: '已归档', requiredChecks: ['settlementCompleted'], requiresReason: false },
]

export const canRolePerform = (role: SystemRole, action: WorkflowAction): boolean => {
  return ROLE_PERMISSION_MATRIX[role].includes(action)
}
