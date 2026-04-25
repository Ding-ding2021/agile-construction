/**
 * 项目团队管理类型定义
 * 用于项目详情页 - 团队管理标签页
 */

/**
 * 项目团队成员
 */
export type ProjectTeamMember = {
  id: string
  userId: string // 关联 personnel 模块
  name: string
  department: string
  title: string
  email: string
  phone: string
  skills: string[]
  currentLoad: {
    projectCount: number
    taskCount: number
    workHours: number // 本周工时
  }
  roleAssignments: Array<{
    roleId: string
    roleLabel: string
    permissions: ('view' | 'edit' | 'approve')[]
  }>
  source: 'human' | 'digital'
  availability: 'online' | 'busy' | 'offline'
  avatar?: string
}

/**
 * 团队统计数据
 */
export type ProjectTeamStats = {
  totalMembers: number
  onlineCount: number
  digitalCount: number
  roleCoverage: number // 0-100
  collaborationScore: number // 0-100
}

/**
 * 协作流程类型
 */
export type CollaborationWorkflowType = 'approval' | 'notification' | 'meeting'

/**
 * 协作流程
 */
export type CollaborationWorkflow = {
  id: string
  type: CollaborationWorkflowType
  name: string
  description: string
  triggers: string[]
  participants: string[]
  isActive: boolean
}

/**
 * 项目角色定义
 */
export type ProjectRole = {
  id: string
  label: string
  description: string
  permissions: ('view' | 'edit' | 'approve')[]
  memberCount: number
  color: string
}

/**
 * 技能标签
 */
export type SkillTag = {
  id: string
  label: string
  category: 'technical' | 'soft' | 'domain'
  level: 'beginner' | 'intermediate' | 'expert'
}
