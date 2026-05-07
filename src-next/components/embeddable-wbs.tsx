import { useState, useEffect } from 'react'
import { useWBSStore } from '@/store/wbsStore'
import { WBSTreeTable } from '@/pages/wbs/components/WBSTreeTable'
import { WBSGanttSvar } from '@/pages/wbs/components/WBSGanttSvar'
import { WBSTreeSidePanel } from '@/pages/wbs/components/WBSTreeSidePanel'
import { cn } from '@/lib/utils'

type WBSEmbeddedView = 'tree' | 'gantt'

const VIEW_OPTIONS: { value: WBSEmbeddedView; label: string }[] = [
  { value: 'tree', label: 'WBS 树' },
  { value: 'gantt', label: '甘特图' },
]

interface EmbeddableWBSProps {
  projectCode: string
  defaultView?: WBSEmbeddedView
  showHeader?: boolean
}

export function EmbeddableWBS({
  projectCode,
  defaultView = 'tree',
  showHeader = true,
}: EmbeddableWBSProps) {
  const [view, setView] = useState<WBSEmbeddedView>(defaultView)
  const loadTree = useWBSStore(s => s.loadTree)

  useEffect(() => {
    loadTree(projectCode)
  }, [projectCode, loadTree])

  return (
    <div className="flex flex-col min-h-0">
      {showHeader && (
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 w-fit mb-3">
          {VIEW_OPTIONS.map(opt => {
            const isActive = view === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setView(opt.value)}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
      <div className="flex-1 min-h-0">
        {view === 'tree' && <WBSTreeTable projectCode={projectCode} />}
        {view === 'gantt' && (
          <div className="h-[400px]">
            <WBSGanttSvar />
          </div>
        )}
      </div>
      <WBSTreeSidePanel />
    </div>
  )
}
