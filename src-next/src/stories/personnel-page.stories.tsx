import type { Story } from '@ladle/react'

/**
 * 人物管理页面 - 骨架屏模式
 *
 * 用于快速预览页面布局结构，无需等待 API 数据加载。
 * 推荐在 Ladle 中先看 skeleton 确认布局，再切到 pages--personnel-page 看真实数据。
 */
export const LayoutSkeleton: Story = () => (
  <div className="p-6 space-y-6">
    <div className="grid grid-cols-4 gap-4">
      {['在岗人数', '可分配人数', '资质到期', '超负载'].map(label => (
        <div key={label} className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="h-3 w-16 bg-muted rounded animate-pulse" />
          <div className="h-8 w-12 bg-muted rounded animate-pulse" />
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        </div>
      ))}
    </div>
    <div className="flex gap-3">
      <div className="h-9 w-64 bg-muted rounded-lg animate-pulse" />
      <div className="h-9 w-32 bg-muted rounded-lg animate-pulse" />
    </div>
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="grid grid-cols-6 gap-4 bg-muted/30 p-3 text-xs text-muted-foreground font-medium">
        <span>姓名</span>
        <span>组织</span>
        <span>角色</span>
        <span>状态</span>
        <span>技能</span>
        <span>任务数</span>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-6 gap-4 p-3 border-t border-border">
          {Array.from({ length: 6 }).map((_, j) => (
            <div
              key={j}
              className="h-4 bg-muted rounded animate-pulse"
              style={{ width: j === 5 ? 24 : j === 3 ? 48 : undefined }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
)
