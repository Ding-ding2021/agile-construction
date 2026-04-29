import type { AcceptanceMilestoneSyncPayload } from '../../components/project/ProjectAcceptanceView'

interface AcceptanceStateSnapshot {
  nodes: Array<Record<string, unknown>>
  milestones: Array<Record<string, unknown>>
  summary?: AcceptanceMilestoneSyncPayload
}

const ACCEPTANCE_STORAGE_PREFIX = 'pm-acceptance-state-v1'

const storageKeyOf = (projectCode: string) => `${ACCEPTANCE_STORAGE_PREFIX}:${projectCode}`

export const readLocalState = (projectCode: string): AcceptanceStateSnapshot | null => {
  try {
    const raw = window.localStorage.getItem(storageKeyOf(projectCode))
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as AcceptanceStateSnapshot
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.milestones)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

const persistLocalState = (projectCode: string, payload: AcceptanceStateSnapshot) => {
  try {
    window.localStorage.setItem(storageKeyOf(projectCode), JSON.stringify(payload))
  } catch {
    // ignore storage errors
  }
}

export const acceptanceRepository = {
  async load(projectCode: string): Promise<AcceptanceStateSnapshot | null> {
    return readLocalState(projectCode)
  },

  async save(
    projectCode: string,
    payload: AcceptanceStateSnapshot,
    summary?: AcceptanceMilestoneSyncPayload
  ): Promise<void> {
    const nextPayload = { ...payload, summary }
    persistLocalState(projectCode, nextPayload)
  },
}
