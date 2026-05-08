import { useParams, useNavigate } from 'react-router-dom'
import { useTaskDetail } from '@/hooks/useTaskDetail'
import TaskDetailContent from './components/TaskDetailContent'
import { Skeleton } from '@/components/ui/skeleton'

export default function TaskDetailPage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { task, loading, error, reload } = useTaskDetail(code ?? null)

  return <TaskDetailContent task={task} mode="page" onBack={handleBack} onReload={reload} />
}
