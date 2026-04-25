import { useState, useCallback } from 'react'

const STORAGE_KEY = 'pm-sidebar-collapsed'

const readCollapsed = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

const writeCollapsed = (value: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEY, String(value))
  } catch {
    // ignore
  }
}

export const useSidebarCollapsed = (controlled?: boolean) => {
  const [internalCollapsed, setInternalCollapsed] = useState(readCollapsed)

  const collapsed = controlled !== undefined ? controlled : internalCollapsed

  const toggle = useCallback(() => {
    const next = !internalCollapsed
    setInternalCollapsed(next)
    writeCollapsed(next)
    return next
  }, [internalCollapsed])

  return { collapsed, toggle }
}
