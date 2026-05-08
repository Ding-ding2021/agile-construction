import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WBSGantt } from '@/components/wbs-gantt'
import { useWBSStore } from '@/store/wbsStore'

export function GanttPage() {
  const { projectCode } = useParams<{ projectCode: string }>()
  const navigate = useNavigate()
  const loadTree = useWBSStore(s => s.loadTree)
  const flatNodes = useWBSStore(s => s.flatNodes)

  useEffect(() => {
    if (projectCode) loadTree(projectCode)
  }, [projectCode, loadTree])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/projects/${projectCode}?tab=progress`)}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">甘特图</h1>
          <p className="text-sm text-muted-foreground">
            项目 {projectCode} · {flatNodes.length} 个 WBS 节点
          </p>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <WBSGantt />
      </div>
    </div>
  )
}
