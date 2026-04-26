// ─── Order domain localStorage repository ──────────────────────

const ORDER_STATE_STORAGE_KEY = 'pm-order-state-v1'
const ORDER_LOG_STORAGE_KEY = 'pm-order-flow-logs-v1'

export const readOrders = (): unknown[] | null => {
  try {
    const raw = window.localStorage.getItem(ORDER_STATE_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown[]
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

export const saveOrders = (orders: unknown[]): void => {
  try {
    window.localStorage.setItem(ORDER_STATE_STORAGE_KEY, JSON.stringify(orders))
  } catch {
    // ignore storage errors
  }
}

export const readFlowLogs = (): Record<string, unknown[]> => {
  try {
    const raw = window.localStorage.getItem(ORDER_LOG_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown[]>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export const saveFlowLogs = (logs: Record<string, unknown[]>): void => {
  try {
    window.localStorage.setItem(ORDER_LOG_STORAGE_KEY, JSON.stringify(logs))
  } catch {
    // ignore storage errors
  }
}
