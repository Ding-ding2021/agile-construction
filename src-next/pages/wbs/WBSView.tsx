import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useWBSStore } from '@/store/wbsStore'
import { WBSToolbar, type ViewTab } from './components/WBSToolbar'
import { WBSTreeTable } from './components/WBSTreeTable'
import { WBSTreeSidePanel } from './components/WBSTreeSidePanel'

export function WBSView() {
  const { projectCode } = useParams<{ projectCode: string }>()
  const { error } = useWBSStore()
  const [activeView, setActiveView] = useState<ViewTab>('tree')

  if (!projectCode) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        缺少项目编码
      </div>
    )
  }

  if (error) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <WBSToolbar
          projectCode={projectCode}
          activeView={activeView}
          onViewChange={setActiveView}
        />
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <WBSToolbar projectCode={projectCode} activeView={activeView} onViewChange={setActiveView} />
      <div className="flex flex-1 min-h-0">
        {activeView === 'tree' && (
          <div className="flex-1 overflow-auto">
            <WBSTreeTable projectCode={projectCode} />
          </div>
        )}
        {activeView === 'gantt' && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            甘特图视图 — 阶段 2 实现
          </div>
        )}
        {activeView === 'network' && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            网络图视图 — 阶段 2 实现
          </div>
        )}
      </div>
      <WBSTreeSidePanel />
    </div>
  )
}
