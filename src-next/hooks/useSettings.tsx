import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type ThemeColor = 'neutral' | 'blue' | 'green' | 'orange' | 'purple' | 'stone'
export type ThemeFont = 'sans' | 'serif' | 'mono' | 'rounded'

export interface AppSettings {
  themeColor: ThemeColor
  font: ThemeFont
  logo: string | null
  sidebarCollapsed: boolean
  sidebarShowIcons: boolean
}

const STORAGE_KEY = 'app-settings'

const defaultSettings: AppSettings = {
  themeColor: 'neutral',
  font: 'sans',
  logo: null,
  sidebarCollapsed: false,
  sidebarShowIcons: true,
}

interface SettingsContextType {
  settings: AppSettings
  updateSettings: (partial: Partial<AppSettings>) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) }
    }
  } catch { /* ignore */ }
  return defaultSettings
}

function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch { /* ignore */ }
}

const themeColorMap: Record<ThemeColor, string> = {
  neutral: '',
  blue: 'theme-blue',
  green: 'theme-green',
  orange: 'theme-orange',
  purple: 'theme-purple',
  stone: 'theme-stone',
}

const fontMap: Record<ThemeFont, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  rounded: 'font-rounded',
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  // Apply theme color class
  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      ...Object.values(themeColorMap).filter(Boolean)
    )
    const themeClass = themeColorMap[settings.themeColor]
    if (themeClass) {
      document.documentElement.classList.add(themeClass)
    }
  }, [settings.themeColor])

  // Apply font class
  useEffect(() => {
    document.documentElement.classList.remove(
      ...Object.values(fontMap)
    )
    const fontClass = fontMap[settings.font]
    if (fontClass) {
      document.documentElement.classList.add(fontClass)
    }
  }, [settings.font])

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
