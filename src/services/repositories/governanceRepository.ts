// ─── Governance settings localStorage repository ───────────────

export type GovernanceSettings = {
  personnelBusyThreshold: number
  supplierBusyThreshold: number
}

const STORAGE_KEY = 'pm-resource-governance-v1'

const DEFAULT_SETTINGS: GovernanceSettings = {
  personnelBusyThreshold: 5,
  supplierBusyThreshold: 4,
}

export const readGovernanceSettings = (): GovernanceSettings => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS

    const parsed = JSON.parse(raw) as Partial<GovernanceSettings>
    return {
      personnelBusyThreshold: Math.max(
        1,
        Number(parsed.personnelBusyThreshold) || DEFAULT_SETTINGS.personnelBusyThreshold
      ),
      supplierBusyThreshold: Math.max(
        1,
        Number(parsed.supplierBusyThreshold) || DEFAULT_SETTINGS.supplierBusyThreshold
      ),
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export const saveGovernanceSettings = (settings: GovernanceSettings): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore storage errors
  }
}
