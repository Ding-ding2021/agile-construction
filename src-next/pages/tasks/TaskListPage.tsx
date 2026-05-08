import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from '@/services/api'
import { NewTaskDialog } from './components/NewTaskDialog'
import { TaskList } from '@/components/task-list'
import type { TaskItem } from '@/types/task'

interface TaskListPageProps {
  onSelectTask: (task: TaskItem) => void
  refreshTrigger?: number
}

export default function TaskListPage({ onSelectTask, refreshTrigger }: TaskListPageProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const localTasksRef = useRef<TaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTaskMode, setNewTaskMode] = useState<'quick' | 'template'>('quick')
  const [newTaskFields, setNewTaskFields] = useState<Record<string, string>>({
    name: '',
    status: '草稿',
  })
  const [extraFields, setExtraFields] = useState<
    { key: string; label: string; type: 'system' | 'custom' }[]
  >([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const systemFields = [
    {
      key: 'status',
      label: '流程状态',
      type: 'select' as const,
      options: ['草稿', '待分配', '待执行', '执行中'],
    },
    { key: 'assigneeName', label: '负责人', type: 'text' as const },
    {
      key: 'priority',
      label: '优先级',
      type: 'select' as const,
      options: ['low', 'medium', 'high', 'urgent'],
    },
  ]
  const templates: { id: string; name: string }[] = []
  const templateDetails: Record<
    string,
    { name: string; fields: { key: string; label: string; type: string }[] }
  > = {}

  const fetchTasks = useCallback(() => {
    setLoading(true)
    api
      .getAllTasks(1, 200)
      .then(res => setTasks([...localTasksRef.current, ...res.data]))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks, refreshTrigger])

  const handleCreateTask = async () => {
    const code = `TASK-${String(tasks.length + 1).padStart(3, '0')}`
    localTasksRef.current.push({
      ...newTaskFields,
      id: `new-${Date.now()}`,
      code,
      progress: 0,
    } as unknown as TaskItem)
    setShowNewTask(false)
    setNewTaskFields({ name: '', status: '草稿' })
    setTasks([...localTasksRef.current])
  }

  const addExtraField = () => {
    const idx = extraFields.length + 1
    setExtraFields(prev => [
      ...prev,
      { key: `custom_${idx}`, label: `自定义字段${idx}`, type: 'custom' },
    ])
  }

  const addCustomField = (label: string) => {
    const key = `custom_${Date.now()}`
    setExtraFields(prev => [...prev, { key, label, type: 'custom' }])
  }

  const removeExtraField = (key: string) => {
    setExtraFields(prev => prev.filter(f => f.key !== key))
  }

  const availableExtraFields = [
    { key: 'plannedStartAt', label: '计划开始', type: 'system' as const },
    { key: 'plannedEndAt', label: '计划结束', type: 'system' as const },
    { key: 'taskType', label: '任务类型', type: 'system' as const },
    { key: 'assigneeName', label: '负责人', type: 'system' as const },
  ]

  const applyTemplate = (id: string) => {
    setSelectedTemplate(id)
    const tpl = templateDetails[id]
    if (tpl) {
      setNewTaskFields(prev => ({ ...prev, name: tpl.name }))
    }
  }

  return (
    <>
      <TaskList
        tasks={tasks}
        loading={loading}
        onSelectTask={onSelectTask}
        onNewTask={() => setShowNewTask(true)}
      />
      <NewTaskDialog
        open={showNewTask}
        onOpenChange={setShowNewTask}
        mode={newTaskMode}
        onModeChange={setNewTaskMode}
        fields={newTaskFields}
        onFieldsChange={setNewTaskFields}
        selectedTemplate={selectedTemplate}
        onTemplateChange={applyTemplate}
        extraFields={extraFields}
        onAddExtraField={addExtraField}
        onAddCustomField={addCustomField as () => void}
        onRemoveExtraField={removeExtraField}
        systemFields={systemFields as never}
        templates={templates as never}
        templateDetails={templateDetails as never}
        availableExtraFields={availableExtraFields as never}
        onCreate={handleCreateTask}
      />
    </>
  )
}
