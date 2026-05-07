import { EmbeddableWBS } from '@/components/embeddable-wbs'

interface TabScopeProps {
  projectCode: string
}

export function TabScope({ projectCode }: TabScopeProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium">范围与任务</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          工作分解结构（WBS），定义项目可交付成果
        </p>
      </div>
      <EmbeddableWBS projectCode={projectCode} />
    </div>
  )
}
