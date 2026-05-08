import { useState, useEffect } from 'react'
import { TaskList } from '@/components/task-list'
import { api } from '@/services/api'
import TaskDetailSheet from '@/pages/tasks/TaskDetailSheet'
import type { TaskItem } from '@/types/task'

interface TabScopeProps {
  projectCode: string
}

export function TabScope({ projectCode }: TabScopeProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)

  useEffect(() => {
    setLoading(true)
    api
      .getTasks(projectCode)
      .then(res => setTasks(res.data as unknown as TaskItem[]))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [projectCode])

  return (
    <div className="space-y-4">
      <TaskList tasks={tasks} loading={loading} onSelectTask={setSelectedTask} compact />
      <TaskDetailSheet task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  )
}
