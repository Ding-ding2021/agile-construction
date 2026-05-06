import type { Story } from '@ladle/react'
import { Badge } from '@/components/ui/badge'

export const AllVariants: Story = () => (
  <div className="flex flex-wrap gap-4 p-8">
    <Badge variant="default">Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="destructive">Destructive</Badge>
    <Badge variant="ghost">Ghost</Badge>
    <Badge variant="link">Link</Badge>
  </div>
)

export const StatusLabels: Story = () => (
  <div className="flex flex-wrap gap-4 p-8">
    <Badge variant="default">进行中</Badge>
    <Badge variant="secondary">待开始</Badge>
    <Badge variant="outline">已完成</Badge>
    <Badge variant="destructive">已延期</Badge>
  </div>
)
