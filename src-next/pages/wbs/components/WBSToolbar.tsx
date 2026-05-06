import { FolderTree, GanttChartSquare, Network, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWBSStore } from '@/store/wbsStore'

const VIEW_TABS = [
  { id: 'tree', label: '树视图', icon: FolderTree },
  { id: 'gantt', label: '甘特图', icon: GanttChartSquare },
  { id: 'network', label: '网络图', icon: Network },
] as const

export type ViewTab = (typeof VIEW_TABS)[number]['id']

interface WBSToolbarProps {
  projectCode: string
  activeView: ViewTab
  onViewChange: (v: ViewTab) => void
}

export function WBSToolbar({ projectCode, activeView, onViewChange }: WBSToolbarProps) {
  const addNode = useWBSStore(s => s.addNode)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 rounded-lg border p-0.5">
        {VIEW_TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeView === tab.id
          const isDisabled = tab.id !== 'tree'

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onViewChange(tab.id)}
              disabled={isDisabled}
              title={isDisabled ? '将在阶段 2 实现' : undefined}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isActive && 'bg-secondary text-foreground',
                !isActive && 'text-muted-foreground',
                isDisabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <Button size="sm" onClick={() => addNode(projectCode, { name: '新建节点' })}>
        <Plus className="size-4" />
        添加节点
      </Button>
    </div>
  )
}
