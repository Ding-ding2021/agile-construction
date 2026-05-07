import { useParams, useNavigate } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function ProjectDetailPage() {
  const { projectCode } = useParams<{ projectCode: string }>()
  const navigate = useNavigate()

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/projects')}>项目管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{projectCode}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground rounded-md border border-border">
        项目详情页 — PMBOK 8 标签将在后续实现
      </div>
    </div>
  )
}
