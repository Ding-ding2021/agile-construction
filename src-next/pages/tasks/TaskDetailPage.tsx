import { useParams, useNavigate } from 'react-router-dom'
import { useTaskDetail } from '@/hooks/useTaskDetail'
import TaskDetailContent from './components/TaskDetailContent'
import { Skeleton } from '@/components/ui/skeleton'

export default function TaskDetailPage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { task, loading, error, assigneeOptions, reload } = useTaskDetail(code ?? null)

  const handleBack = () => {
    navigate('/tasks')
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex gap-4 flex-1">
          <Skeleton className="flex-1" />
          <Skeleton className="w-80" />
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <p className="text-sm">{error || '任务不存在'}</p>
        <button
          className="text-sm text-primary underline"
          onClick={handleBack}
        >
          返回任务列表
        </button>
      </div>
    )
  }

  return (
    <TaskDetailContent
      task={task}
      mode="page"
      onBack={handleBack}
      assigneeOptions={assigneeOptions}
      onReload={reload}
    />
  )
}
