import { useState, useEffect, useCallback } from 'react'
import { api } from '@/services/api'
import type { TaskDetail, TaskChecklistItem, TaskFlowLog, TaskRelation, TaskSubmission } from '@/types/task'

export interface MemberOption {
  id: string
  name: string
}

export interface ExtraData {
  checklist: TaskChecklistItem[]
  flowLogs: TaskFlowLog[]
  relations: TaskRelation[]
  submissions: TaskSubmission[]
}

async function loadExtra(projectCode: string, taskId: number): Promise<ExtraData> {
  const [checklist, logs, relations, submissions] = await Promise.all([
    api.getChecklist(projectCode, taskId).then(r => r.data).catch(() => [] as TaskChecklistItem[]),
    api.getFlowLogs(projectCode, taskId).then(r => r.data).catch(() => [] as TaskFlowLog[]),
    api.getRelations(projectCode, taskId).then(r => r.data).catch(() => [] as TaskRelation[]),
    api.getSubmissions(projectCode, taskId).then(r => r.data).catch(() => [] as TaskSubmission[]),
  ])
  return { checklist, flowLogs: logs, relations, submissions }
}

export function useTaskDetail(taskCode: string | null) {
  const [task, setTask] = useState<TaskDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assigneeOptions, setAssigneeOptions] = useState<MemberOption[]>([])

  const load = useCallback(async (code: string) => {
    setLoading(true)
    setError(null)

    try {
      const data = await api.getTaskDetail(code)
      setTask(data)

      const pc = data.projectCode
      const tid = data.id as unknown as number

      if (pc && tid) {
        // Load extra data in parallel
        loadExtra(pc, tid).then(extra => {
          setTask(prev => prev && prev.code === code ? {
            ...prev,
            ...extra,
          } : prev)
        }).catch(() => {})

        // Fetch project members
        api.getMembers(pc).then(members => {
          setAssigneeOptions(members.map(m => ({ id: m.userId || String(m.id), name: m.name })))
        }).catch(() => {})
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!taskCode) {
      setTask(null)
      setAssigneeOptions([])
      return
    }
    load(taskCode)
  }, [taskCode, load])

  return { task, loading, error, setTask, assigneeOptions, reload: () => taskCode && load(taskCode) }
}
