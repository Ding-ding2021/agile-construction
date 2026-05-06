import type { Story } from '@ladle/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Basic: Story = () => (
  <div className="p-8 max-w-sm">
    <Card>
      <CardHeader>
        <CardTitle>项目卡片</CardTitle>
        <CardDescription>上海南京路旗舰店</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          项目状态：执行中 · 进度 12/18 · 预计 2026年6月完工
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-xs text-muted-foreground">负责人：张伟</span>
        <Button size="sm">查看详情</Button>
      </CardFooter>
    </Card>
  </div>
)

export const Sizes: Story = () => (
  <div className="flex flex-col gap-4 p-8 max-w-sm">
    <Card size="sm">
      <CardHeader><CardTitle>小卡片</CardTitle></CardHeader>
      <CardContent>紧凑布局</CardContent>
    </Card>
    <Card size="default">
      <CardHeader><CardTitle>默认卡片</CardTitle></CardHeader>
      <CardContent>标准间距</CardContent>
    </Card>
    <Card size="lg">
      <CardHeader><CardTitle>大卡片</CardTitle></CardHeader>
      <CardContent>宽松间距，大字号</CardContent>
    </Card>
  </div>
)
