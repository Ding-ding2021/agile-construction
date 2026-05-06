import { useSettings } from '@/hooks/useSettings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export function NavSettings() {
  const { settings, updateSettings } = useSettings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>导航设置</CardTitle>
        <CardDescription>配置侧边导航栏的显示行为</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50">
          <div>
            <Label>侧边栏默认折叠</Label>
            <p className="text-xs text-muted-foreground">启动时侧边栏收起为图标模式</p>
          </div>
          <button
            role="switch"
            aria-checked={settings.sidebarCollapsed}
            onClick={() => updateSettings({ sidebarCollapsed: !settings.sidebarCollapsed })}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              settings.sidebarCollapsed ? 'bg-primary' : 'bg-input'
            }`}
          >
            <span
              className={`pointer-events-none block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                settings.sidebarCollapsed ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50">
          <div>
            <Label>显示导航图标标签</Label>
            <p className="text-xs text-muted-foreground">在导航项旁边显示文字标签</p>
          </div>
          <button
            role="switch"
            aria-checked={settings.sidebarShowIcons}
            onClick={() => updateSettings({ sidebarShowIcons: !settings.sidebarShowIcons })}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              settings.sidebarShowIcons ? 'bg-primary' : 'bg-input'
            }`}
          >
            <span
              className={`pointer-events-none block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                settings.sidebarShowIcons ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
