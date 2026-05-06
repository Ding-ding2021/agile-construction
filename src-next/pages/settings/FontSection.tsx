import { useSettings, type ThemeFont } from '@/hooks/useSettings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const fonts: { value: ThemeFont; label: string; sample: string }[] = [
  { value: 'sans', label: '无衬线', sample: '系统默认字体 Inter' },
  { value: 'serif', label: '衬线', sample: '宋体风格衬线字体' },
  { value: 'mono', label: '等宽', sample: '等宽字体用于代码' },
  { value: 'rounded', label: '圆体', sample: '圆润可爱的字体风格' },
]

export function FontSection() {
  const { settings, updateSettings } = useSettings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>字体</CardTitle>
        <CardDescription>选择系统使用的字体</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {fonts.map(font => (
            <button
              key={font.value}
              onClick={() => updateSettings({ font: font.value })}
              className={`flex flex-1 flex-col gap-1 rounded-lg border-2 p-4 text-left transition-all hover:bg-muted/50 min-w-[180px] ${
                settings.font === font.value
                  ? 'border-ring'
                  : 'border-transparent'
              }`}
            >
              <span className="text-sm font-medium">{font.label}</span>
              <span className="text-xs text-muted-foreground">{font.sample}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
