import { ThemeColorSection } from './ThemeColorSection'
import { FontSection } from './FontSection'
import { LogoSettings } from './LogoSettings'
import { NavSettings } from './NavSettings'
import { SystemInfo } from './SystemInfo'

export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">系统设置</h2>
        <p className="text-muted-foreground">管理系统的外观、字体和导航偏好</p>
      </div>

      <ThemeColorSection />
      <FontSection />
      <LogoSettings />
      <NavSettings />
      <SystemInfo />
    </div>
  )
}
