export type PersonStatus = 1 | 2 | 3 | 4
export type AvailabilityStatus = 1 | 2 | 3
export type EmploymentType = 1 | 2 | 3

export const PERSON_STATUS_LABEL: Record<PersonStatus, string> = {
  1: '在岗',
  2: '请假',
  3: '离岗',
  4: '禁用',
}

export const AVAILABILITY_LABEL: Record<AvailabilityStatus, string> = {
  1: '可分配',
  2: '忙碌',
  3: '不可分配',
}

export const EMPLOYMENT_LABEL: Record<EmploymentType, string> = {
  1: '内部',
  2: '外包',
  3: '供应商',
}

export interface PersonItem {
  id: number
  personCode: string
  name: string
  mobile: string
  email: string | null
  avatarUrl: string | null
  orgId: number
  orgName?: string
  title: string | null
  employmentType: EmploymentType
  personStatus: PersonStatus
  availabilityStatus: AvailabilityStatus
  workCity: string | null
  currentTaskCount: number
  criticalTaskCount: number
  riskLevel: number
  remark: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface OrganizationItem {
  id: number
  orgCode: string
  orgName: string
  orgType: number
  status: number
  contactName: string | null
  contactMobile: string | null
  createdAt: string
  updatedAt: string
}

export interface PersonFormData {
  name: string
  mobile: string
  email?: string
  orgId: number
  title?: string
  employmentType: EmploymentType
  personStatus: PersonStatus
  availabilityStatus: AvailabilityStatus
  workCity?: string
  remark?: string
}

export interface PersonSkill {
  name: string
  level: string
}

export interface PersonCert {
  name: string
  certNo: string
  expireAt: string
  status: 'valid' | 'expiring' | 'expired'
}

export interface PersonProject {
  id: number
  name: string
  role: string
  status: string
  progress: string
}

export interface PersonTaskItem {
  title: string
  priority: string
  status: string
  project: string
  due: string
}

export interface PersonStatusChange {
  type: string
  title: string
  operator: string
  at: string
  note?: string
}

export interface PersonDetail extends PersonItem {
  avatarOrgName?: string
  skills: PersonSkill[]
  certs: PersonCert[]
  projects: PersonProject[]
  tasks: PersonTaskItem[]
  statusChanges: PersonStatusChange[]
}
