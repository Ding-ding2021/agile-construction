import { useParams } from 'react-router-dom'

export default function ProjectDetailPage() {
  const { projectCode } = useParams<{ projectCode: string }>()

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground rounded-md border border-border">
        项目详情页 — PMBOK 8 标签将在后续实现
      </div>
    </div>
  )
}
