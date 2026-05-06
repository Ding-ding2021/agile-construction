import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const infoItems = [
  { label: '应用版本', value: '0.1.0' },
  { label: 'UI 框架', value: 'shadcn/ui + Tailwind CSS v4' },
  { label: '构建工具', value: 'Vite 8' },
  { label: '运行环境', value: `${navigator.userAgent.match(/(?<=\()[\w\s]+(?=\))/)?.[0] || navigator.platform}` },
]

export function SystemInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>系统信息</CardTitle>
        <CardDescription>当前系统版本与环境信息</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="divide-y">
          {infoItems.map(item => (
            <div key={item.label} className="flex items-center justify-between py-2.5">
              <dt className="text-sm text-muted-foreground">{item.label}</dt>
              <dd className="text-sm font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
