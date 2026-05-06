import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useWBSStore } from '@/store/wbsStore'

const VIEW_TABS = [
  { value: 'tree', label: '树视图' },
  { value: 'gantt', label: '甘特图' },
  { value: 'network', label: '网络图' },
] as const

export type ViewTab = (typeof VIEW_TABS)[number]['value']

interface WBSToolbarProps {
  projectCode: string
  activeView: ViewTab
  onViewChange: (v: ViewTab) => void
}

export function WBSToolbar({ projectCode, activeView, onViewChange }: WBSToolbarProps) {
  const addNode = useWBSStore(s => s.addNode)

  return (
    <div className="flex items-center justify-between">
      <ToggleGroup
        type="single"
        value={activeView}
        onValueChange={v => v && onViewChange(v as ViewTab)}
        variant="outline"
        size="sm"
      >
        {VIEW_TABS.map(tab => (
          <ToggleGroupItem
            key={tab.value}
            value={tab.value}
            disabled={tab.value !== 'tree'}
            title={tab.value !== 'tree' ? '将在阶段 2 实现' : undefined}
          >
            {tab.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Button
        size="sm"
        onClick={() => addNode(projectCode, { name: '新建工作包', nodeLevel: 'workPackage' })}
      >
        <Plus className="size-4" />
        新建工作包
      </Button>
    </div>
  )
}
