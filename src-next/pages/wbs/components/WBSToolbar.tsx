import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWBSStore } from '@/store/wbsStore'

export type ViewTab = 'tree' | 'gantt' | 'network'

const VIEW_TABS: { value: ViewTab; label: string }[] = [
  { value: 'tree', label: '树视图' },
  { value: 'gantt', label: '甘特图' },
  { value: 'network', label: '网络图' },
]

interface WBSToolbarProps {
  projectCode: string
  activeView: ViewTab
  onViewChange: (v: ViewTab) => void
}

export function WBSToolbar({ projectCode, activeView, onViewChange }: WBSToolbarProps) {
  const addNode = useWBSStore(s => s.addNode)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
        {VIEW_TABS.map(tab => {
          const isActive = activeView === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => onViewChange(tab.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <Button size="sm" onClick={() => addNode(projectCode, { name: '新建工作包', nodeLevel: 'workPackage' })}>
        <Plus className="size-4" />
        新建工作包
      </Button>
    </div>
  )
}
