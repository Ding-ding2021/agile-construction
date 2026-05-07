export interface ProjectItem {
  id: number
  code: string
  name: string
  brand: string
  status: string
  parentStatus: string | null
  statusTone: string | null
  stage: string
  progress: number
  budget: string | null
  teamSize: number | null
  description: string | null
  owner: string | null
  riskLevel: string | null
  riskCount: number
  plannedOpenDate: string | null
  actualOpenDate: string | null
  createdAt: string
  updatedAt: string
}
