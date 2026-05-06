import { useSettings, type ThemeColor } from '@/hooks/useSettings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const themes: { value: ThemeColor; label: string; color: string }[] = [
  { value: 'neutral', label: '中性', color: 'oklch(0.205 0 0)' },
  { value: 'blue', label: '蓝色', color: 'oklch(0.5 0.2 250)' },
  { value: 'green', label: '绿色', color: 'oklch(0.45 0.18 160)' },
  { value: 'orange', label: '橙色', color: 'oklch(0.55 0.2 50)' },
  { value: 'purple', label: '紫色', color: 'oklch(0.5 0.22 300)' },
  { value: 'stone', label: '石色', color: 'oklch(0.3 0.02 80)' },
]

export function ThemeColorSection() {
  const { settings, updateSettings } = useSettings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>主题色</CardTitle>
        <CardDescription>选择系统的主题配色方案</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {themes.map(theme => (
            <button
              key={theme.value}
              onClick={() => updateSettings({ themeColor: theme.value })}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:bg-muted/50 ${
                settings.themeColor === theme.value
                  ? 'border-ring'
                  : 'border-transparent'
              }`}
            >
              <div
                className="size-10 rounded-full border shadow-sm"
                style={{ backgroundColor: theme.color }}
              />
              <span className="text-xs font-medium">{theme.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
