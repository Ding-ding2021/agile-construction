const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? `请求失败: ${res.status}`)
  }
  return res.json()
}

export const api = {
  getAllTasks: (page = 1, pageSize = 50) =>
    request<{
      data: import('../types/task').TaskItem[]
      pagination: { page: number; pageSize: number; total: number; totalPages: number }
    }>(`/tasks/all?page=${page}&pageSize=${pageSize}`),

  getTasks: (projectCode: string) =>
    request<{ data: import('../types/task').TaskItem[] }>(`/projects/${projectCode}/tasks`),

  getTaskByCode: (projectCode: string, taskCode: string) =>
    request<{ task: import('../types/task').TaskDetail }>(
      `/projects/${projectCode}/tasks/${taskCode}`
    ),

  getTaskDetail: (taskCode: string) =>
    request<import('../types/task').TaskDetail>(`/tasks/${taskCode}`),

  getSubtasks: (taskCode: string) =>
    request<{ data: import('../types/task').TaskSubtaskNode[] }>(`/tasks/${taskCode}/subtasks`),

  getMembers: (projectCode: string) =>
    request<{ id: number; userId: string; name: string; role: string }[]>(
      `/projects/${projectCode}/members`
    ),

  getProjects: () => request<{ data: unknown[] }>('/projects'),

  // -- 任务更新 --
  updateTask: (projectCode: string, taskId: number, payload: Record<string, unknown>) =>
    request<import('../types/task').TaskDetail>(`/projects/${projectCode}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // -- 标签 --
  updateTags: (projectCode: string, taskId: number, tags: string[]) =>
    request<import('../types/task').TaskDetail>(`/projects/${projectCode}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ tags }),
    }),

  // -- 检查项 --
  toggleChecklist: (projectCode: string, taskId: number, itemId: number, done: boolean) =>
    request<unknown>(`/projects/${projectCode}/tasks/${taskId}/checklist/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ done }),
    }),

  // -- 前置任务 --
  addRelation: (projectCode: string, taskId: number, fromTaskId: string, relationType: string) =>
    request<unknown>(`/projects/${projectCode}/tasks/${taskId}/relations`, {
      method: 'POST',
      body: JSON.stringify({ fromTaskId, relationType }),
    }),

  removeRelation: (projectCode: string, taskId: number, relationId: number) =>
    request<unknown>(`/projects/${projectCode}/tasks/${taskId}/relations/${relationId}`, {
      method: 'DELETE',
    }),

  // -- 催办 --
  remindTask: (projectCode: string, taskId: number) =>
    request<unknown>(`/projects/${projectCode}/tasks/${taskId}/remind`, {
      method: 'POST',
    }),

  // -- 额外数据 --
  getChecklist: (projectCode: string, taskId: number) =>
    request<{ data: import('../types/task').TaskChecklistItem[] }>(
      `/projects/${projectCode}/tasks/${taskId}/checklist`
    ),

  getFlowLogs: (projectCode: string, taskId: number) =>
    request<{ data: import('../types/task').TaskFlowLog[] }>(
      `/projects/${projectCode}/tasks/${taskId}/logs`
    ),

  getRelations: (projectCode: string, taskId: number) =>
    request<{ data: import('../types/task').TaskRelation[] }>(
      `/projects/${projectCode}/tasks/${taskId}/relations`
    ),

  getSubmissions: (projectCode: string, taskId: number) =>
    request<{ data: import('../types/task').TaskSubmission[] }>(
      `/projects/${projectCode}/tasks/${taskId}/submissions`
    ),

  // -- 人员管理 --
  getPersonnel: () => request<{ data: import('../types/personnel').PersonItem[] }>('/personnel'),

  getPerson: (id: number) => request<import('../types/personnel').PersonItem>(`/personnel/${id}`),

  createPerson: (data: import('../types/personnel').PersonFormData) =>
    request<import('../types/personnel').PersonItem>('/personnel', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePerson: (id: number, data: Partial<import('../types/personnel').PersonFormData>) =>
    request<import('../types/personnel').PersonItem>(`/personnel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deletePerson: (id: number) =>
    request<{ success: boolean }>(`/personnel/${id}`, { method: 'DELETE' }),

  getOrganizations: () =>
    request<{ data: import('../types/personnel').OrganizationItem[] }>('/organizations'),
}

// ─── WBS ────────────────────────────────────────────────────────

export const wbsApi = {
  getTree: (projectCode: string) =>
    request<import('../types/wbs').WBSNode[]>(`/projects/${projectCode}/wbs`),

  create: (projectCode: string, data: Record<string, unknown>) =>
    request<import('../types/wbs').WBSNode>(`/projects/${projectCode}/wbs`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (projectCode: string, id: number, data: Record<string, unknown>) =>
    request<import('../types/wbs').WBSNode>(`/projects/${projectCode}/wbs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (projectCode: string, id: number) =>
    request<{ deleted: number }>(`/projects/${projectCode}/wbs/${id}`, {
      method: 'DELETE',
    }),
}
