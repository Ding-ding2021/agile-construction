export type CrewStatus = 'active' | 'inactive'

export const CREW_STATUS_LABEL: Record<CrewStatus, string> = {
  active: '启用',
  inactive: '停用',
}

export const CREW_RATING_OPTIONS = ['优秀', '良好', '一般']

export const CERT_TYPE_OPTIONS = ['资质证书', '安全许可证', '营业执照']

export const CERT_STATUS_LABEL: Record<string, string> = {
  valid: '有效',
  expiring: '即将到期',
  expired: '已过期',
}

export const MEMBER_ROLE_OPTIONS = ['队长', '副队长', '队员']

export interface CrewItem {
  id: number
  name: string
  code: string
  leaderName: string | null
  leaderPhone: string | null
  memberCount: number
  rating: string | null
  status: CrewStatus
  speciality: string | null
  workCities: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CrewFormData {
  name: string
  leaderName?: string
  leaderPhone?: string
  rating?: string
  status?: CrewStatus
  speciality?: string
  workCities?: string
}

export interface CrewMemberItem {
  id: number
  crewId: number
  personId: number
  personName: string
  role: string
  joinDate: string | null
  createdAt: string
}

export interface CrewCertificationItem {
  id: number
  crewId: number
  certType: string
  certName: string
  certNumber: string | null
  issueDate: string | null
  expireDate: string | null
  status: string
  fileUrl: string | null
  createdAt: string
}

export interface CrewCertFormData {
  certType: string
  certName: string
  certNumber?: string
  issueDate?: string
  expireDate?: string
  status?: string
  fileUrl?: string
}
