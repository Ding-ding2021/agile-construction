import type { ProjectItem } from '../../data/projects'
import { serverAdapter, type SettlementSuggestion } from '../api/serverAdapter'

const parseBudgetToWan = (value: string): number => {
  const numeric = Number(value.replace(/[^\d.]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

const buildLocalSuggestions = (projects: ProjectItem[]): SettlementSuggestion[] => {
  return projects
    .filter(project => project.settlementStatus === '草案待确认')
    .map(project => ({
      code: project.code,
      name: project.name,
      budget: `${Math.max(Math.round(parseBudgetToWan(project.budget) * 0.92), 0)}万`,
      acceptanceStatus: project.acceptanceStatus ?? '',
    }))
}

export const settlementRepository = {
  async loadSuggestions(projects: ProjectItem[]): Promise<SettlementSuggestion[]> {
    const localSuggestions = buildLocalSuggestions(projects)

    try {
      const remote = await serverAdapter.getSettlementState()
      return remote.suggestions.length > 0 ? remote.suggestions : localSuggestions
    } catch {
      return localSuggestions
    }
  },
}
