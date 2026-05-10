import { useParams } from 'react-router-dom'
import { useTaskDetail } from '@/hooks/useTaskDetail'
import TaskDetailContent from './components/TaskDetailContent'

export default function TaskDetailPage() {
  const { code } = useParams<{ code: string }>()
  const { task, reload } = useTaskDetail(code ?? null)

  return (
    <TaskDetailContent
      task={task!}
      mode="page"
      onBack={() => window.history.back()}
      onReload={reload}
    />
  )
}
