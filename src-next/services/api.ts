const BASE = '/api'

async function request<T>(path: string, options?: RequestInit, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
    signal,
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
    request<import('../types/project-detail').ProjectMember[]>(`/projects/${projectCode}/members`),

  getMilestones: (projectCode: string) =>
    request<import('../types/project-detail').ProjectMilestone[]>(
      `/projects/${projectCode}/milestones`
    ),

  getProjects: () => request<import('../types/project').ProjectItem[]>('/projects'),

  getProjectDetail: (projectCode: string) =>
    request<import('../types/project-detail').ProjectDetail>(`/projects/${projectCode}`),

  updateProject: (projectCode: string, data: Record<string, unknown>) =>
    request<import('../types/project-detail').ProjectOverview>(`/projects/${projectCode}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

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
  getChecklist: (projectCode: string, taskId: number) =>
    request<{ data: import('../types/task').TaskChecklistItem[] }>(
      `/projects/${projectCode}/tasks/${taskId}/checklist`
    ),

  createChecklistItem: (
    projectCode: string,
    taskId: number,
    data: { name: string; clauseId?: number; result?: string; inspector?: string; remark?: string }
  ) =>
    request<{ data: import('../types/task').TaskChecklistItem }>(
      `/projects/${projectCode}/tasks/${taskId}/checklist`,
      { method: 'POST', body: JSON.stringify(data) }
    ),

  updateChecklistItem: (
    projectCode: string,
    taskId: number,
    itemId: number,
    data: Partial<{
      name: string
      result: string
      inspector: string
      inspectedAt: string
      remark: string
      clauseId: number
    }>
  ) =>
    request<{ data: import('../types/task').TaskChecklistItem }>(
      `/projects/${projectCode}/tasks/${taskId}/checklist/${itemId}`,
      { method: 'PUT', body: JSON.stringify(data) }
    ),

  deleteChecklistItem: (projectCode: string, taskId: number, itemId: number) =>
    request<{ message: string }>(`/projects/${projectCode}/tasks/${taskId}/checklist/${itemId}`, {
      method: 'DELETE',
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

export const calendarsApi = {
  list: () => request<import('../types/calendar').CalendarItem[]>('/calendars'),

  get: (id: number) => request<import('../types/calendar').CalendarDetail>(`/calendars/${id}`),

  create: (data: { name: string; description?: string; isDefault?: boolean }) =>
    request<import('../types/calendar').CalendarItem>('/calendars', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: { name?: string; description?: string; isDefault?: boolean }) =>
    request<import('../types/calendar').CalendarItem>(`/calendars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) => request<{ success: boolean }>(`/calendars/${id}`, { method: 'DELETE' }),

  setExceptions: (
    id: number,
    exceptions: { date: string; isWorkingDay: boolean; reason?: string }[]
  ) =>
    request<import('../types/calendar').CalendarException[]>(`/calendars/${id}/exceptions`, {
      method: 'PUT',
      body: JSON.stringify({ exceptions }),
    }),

  checkPeriod: (from: string, to: string, signal?: AbortSignal) =>
    request<import('../types/calendar').DayStatus[]>(
      `/calendars/check?from=${from}&to=${to}`,
      undefined,
      signal
    ),
}

export function getStandards(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return request<{ data: import('@/types/standard').StandardItem[] }>(`/standards${qs}`)
}

export function getStandard(id: number) {
  return request<import('@/types/standard').StandardItem>(`/standards/${id}`)
}

export function createStandard(data: Record<string, unknown>) {
  return request<import('@/types/standard').StandardItem>('/standards', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateStandard(id: number, data: Record<string, unknown>) {
  return request<import('@/types/standard').StandardItem>(`/standards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteStandard(id: number) {
  return request<{ success: boolean }>(`/standards/${id}`, { method: 'DELETE' })
}

export function getClauses(standardId: number) {
  return request<{ data: import('@/types/standard').StandardClause[] }>(
    `/standards/${standardId}/clauses`
  )
}

export function createClause(standardId: number, data: Record<string, unknown>) {
  return request<import('@/types/standard').StandardClause>(`/standards/${standardId}/clauses`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateClause(standardId: number, clauseId: number, data: Record<string, unknown>) {
  return request<import('@/types/standard').StandardClause>(
    `/standards/${standardId}/clauses/${clauseId}`,
    { method: 'PUT', body: JSON.stringify(data) }
  )
}

export function deleteClause(standardId: number, clauseId: number) {
  return request<{ success: boolean }>(`/standards/${standardId}/clauses/${clauseId}`, {
    method: 'DELETE',
  })
}

export function getRules(standardId: number, clauseId: number) {
  return request<{ data: import('@/types/standard').StandardRule[] }>(
    `/standards/${standardId}/clauses/${clauseId}/rules`
  )
}

export function createRule(standardId: number, clauseId: number, data: Record<string, unknown>) {
  return request<import('@/types/standard').StandardRule>(
    `/standards/${standardId}/clauses/${clauseId}/rules`,
    { method: 'POST', body: JSON.stringify(data) }
  )
}

export function updateRule(
  standardId: number,
  clauseId: number,
  ruleId: number,
  data: Record<string, unknown>
) {
  return request<import('@/types/standard').StandardRule>(
    `/standards/${standardId}/clauses/${clauseId}/rules/${ruleId}`,
    { method: 'PUT', body: JSON.stringify(data) }
  )
}

export function deleteRule(standardId: number, clauseId: number, ruleId: number) {
  return request<{ success: boolean }>(
    `/standards/${standardId}/clauses/${clauseId}/rules/${ruleId}`,
    { method: 'DELETE' }
  )
}

export function instantiateFromTemplate(projectCode: string, templateId: number) {
  return request<{ success: boolean; taskCount: number; taskIds: number[] }>(
    `/projects/${projectCode}/instantiate`,
    {
      method: 'POST',
      body: JSON.stringify({ templateId }),
    }
  )
}

export function getTemplates() {
  return request<{ data: import('@/types/template').ProjectTemplate[] }>('/templates')
}

export function getTemplate(id: number) {
  return request<import('@/types/template').ProjectTemplate>(`/templates/${id}`)
}

export function createTemplate(data: Record<string, unknown>) {
  return request<import('@/types/template').ProjectTemplate>('/templates', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateTemplate(id: number, data: Record<string, unknown>) {
  return request<import('@/types/template').ProjectTemplate>(`/templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteTemplate(id: number) {
  return request<{ success: boolean }>(`/templates/${id}`, { method: 'DELETE' })
}

export function getTemplateBindings(id: number) {
  return request<{ data: import('@/types/template').TaskTemplate[] }>(`/templates/${id}/bindings`)
}

export function addTemplateBinding(id: number, taskTemplateId: string) {
  return request(`/templates/${id}/bindings`, {
    method: 'POST',
    body: JSON.stringify({ taskTemplateId }),
  })
}

export function removeTemplateBinding(id: number, bindingId: string) {
  return request<{ success: boolean }>(`/templates/${id}/bindings/${bindingId}`, {
    method: 'DELETE',
  })
}

export function getTaskTemplates() {
  return request<{ data: import('@/types/template').TaskTemplate[] }>('/task-templates')
}

export function createTaskTemplate(data: Record<string, unknown>) {
  return request<import('@/types/template').TaskTemplate>('/task-templates', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateTaskTemplate(id: number, data: Record<string, unknown>) {
  return request<import('@/types/template').TaskTemplate>(`/task-templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteTaskTemplate(id: number) {
  return request<{ success: boolean }>(`/task-templates/${id}`, { method: 'DELETE' })
}

// ─── 工队管理 ──────────────────────────────────────────────────

export function getCrews() {
  return request<{ data: import('@/types/crew').CrewItem[] }>('/crews')
}

export function getCrew(id: number) {
  return request<import('@/types/crew').CrewItem>(`/crews/${id}`)
}

export function createCrew(data: import('@/types/crew').CrewFormData) {
  return request<import('@/types/crew').CrewItem>('/crews', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateCrew(id: number, data: Partial<import('@/types/crew').CrewFormData>) {
  return request<import('@/types/crew').CrewItem>(`/crews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteCrew(id: number) {
  return request<{ success: boolean }>(`/crews/${id}`, { method: 'DELETE' })
}

export function getCrewMembers(crewId: number) {
  return request<{ data: import('@/types/crew').CrewMemberItem[] }>(`/crews/${crewId}/members`)
}

export function addCrewMember(
  crewId: number,
  data: { personId: number; role: string; joinDate?: string }
) {
  return request<import('@/types/crew').CrewMemberItem>(`/crews/${crewId}/members`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function removeCrewMember(crewId: number, memberId: number) {
  return request<{ success: boolean }>(`/crews/${crewId}/members/${memberId}`, { method: 'DELETE' })
}

export function getCrewCertifications(crewId: number) {
  return request<{ data: import('@/types/crew').CrewCertificationItem[] }>(
    `/crews/${crewId}/certifications`
  )
}

export function createCrewCertification(
  crewId: number,
  data: import('@/types/crew').CrewCertFormData
) {
  return request<import('@/types/crew').CrewCertificationItem>(`/crews/${crewId}/certifications`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateCrewCertification(
  crewId: number,
  certId: number,
  data: Partial<import('@/types/crew').CrewCertFormData>
) {
  return request<import('@/types/crew').CrewCertificationItem>(
    `/crews/${crewId}/certifications/${certId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  )
}

export function deleteCrewCertification(crewId: number, certId: number) {
  return request<{ success: boolean }>(`/crews/${crewId}/certifications/${certId}`, {
    method: 'DELETE',
  })
}
