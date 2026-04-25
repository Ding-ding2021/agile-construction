import { useMemo, useState } from 'react'

type AssigneeSource = 'human' | 'digital'

type MemberCandidate = {
  id: string
  name: string
  title: string
  department: string
  source: AssigneeSource
  availability: '空闲' | '忙碌'
  capabilities: string[]
  version?: string
}

type ProjectRoleDefinition = {
  id:
    | 'project-manager'
    | 'customer-service'
    | 'account-manager'
    | 'cost-engineer'
    | 'supervisor'
    | 'designer'
    | 'assistant'
  label: string
  duty: string
  assignmentMode: 'single' | 'multiple'
  minRequired: number
  allowedSources: AssigneeSource[]
  capabilityTags: string[]
}

type AiSuggestion = {
  candidateId: string
  score: number
  reason: string
  risk: string
}

const roleDefinitions: ProjectRoleDefinition[] = [
  {
    id: 'project-manager',
    label: '项目经理',
    duty: '负责项目总体统筹、进度与风险管理，组织关键决策与跨团队协调。',
    assignmentMode: 'single',
    minRequired: 1,
    allowedSources: ['human'],
    capabilityTags: ['统筹管理', '风险处理', '跨部门协同'],
  },
  {
    id: 'customer-service',
    label: '客户服务',
    duty: '负责客户沟通、问题受理与回访跟进，保障服务体验。',
    assignmentMode: 'multiple',
    minRequired: 1,
    allowedSources: ['human', 'digital'],
    capabilityTags: ['沟通协调', '流程跟进', '资料整理'],
  },
  {
    id: 'account-manager',
    label: '客户经理',
    duty: '负责客户关系经营、需求澄清与商务协同。',
    assignmentMode: 'single',
    minRequired: 1,
    allowedSources: ['human'],
    capabilityTags: ['沟通协调', '跨部门协同', '风险处理'],
  },
  {
    id: 'cost-engineer',
    label: '预算工程师',
    duty: '负责预算测算、成本核对与变更成本评估。',
    assignmentMode: 'multiple',
    minRequired: 0,
    allowedSources: ['human', 'digital'],
    capabilityTags: ['资料整理', '标准作业', '流程跟进'],
  },
  {
    id: 'supervisor',
    label: '监理',
    duty: '负责过程巡检、质量监督与问题闭环跟踪。',
    assignmentMode: 'multiple',
    minRequired: 0,
    allowedSources: ['human', 'digital'],
    capabilityTags: ['质量巡检', '巡检复核', '风险处理'],
  },
  {
    id: 'designer',
    label: '设计师',
    duty: '负责设计方案输出、设计变更评审与现场设计支持。',
    assignmentMode: 'multiple',
    minRequired: 0,
    allowedSources: ['human'],
    capabilityTags: ['资料整理', '沟通协调', '流程跟进'],
  },
  {
    id: 'assistant',
    label: '助理',
    duty: '负责事务协同、材料整理与流程推进，支撑项目高效执行。',
    assignmentMode: 'multiple',
    minRequired: 0,
    allowedSources: ['human', 'digital'],
    capabilityTags: ['资料整理', '流程跟进', '标准作业'],
  },
]

const candidates: MemberCandidate[] = [
  {
    id: 'h1',
    name: '张伟',
    title: '项目经理',
    department: '工程管理部',
    source: 'human',
    availability: '空闲',
    capabilities: ['统筹管理', '风险处理', '跨部门协同'],
  },
  {
    id: 'h2',
    name: '李雯',
    title: '客户服务',
    department: '客户成功部',
    source: 'human',
    availability: '空闲',
    capabilities: ['沟通协调', '流程跟进', '资料整理'],
  },
  {
    id: 'h3',
    name: '王珂',
    title: '客户经理',
    department: '客户经营部',
    source: 'human',
    availability: '忙碌',
    capabilities: ['沟通协调', '跨部门协同', '风险处理'],
  },
  {
    id: 'h4',
    name: '赵敏',
    title: '预算工程师',
    department: '成本管理部',
    source: 'human',
    availability: '空闲',
    capabilities: ['资料整理', '标准作业', '流程跟进'],
  },
  {
    id: 'h5',
    name: '陈工',
    title: '监理',
    department: '工程监督部',
    source: 'human',
    availability: '忙碌',
    capabilities: ['质量巡检', '巡检复核', '风险处理'],
  },
  {
    id: 'h6',
    name: '刘菲',
    title: '设计师',
    department: '设计中心',
    source: 'human',
    availability: '空闲',
    capabilities: ['资料整理', '沟通协调', '流程跟进'],
  },
  {
    id: 'h7',
    name: '周宁',
    title: '助理',
    department: '项目支持组',
    source: 'human',
    availability: '空闲',
    capabilities: ['资料整理', '流程跟进', '标准作业'],
  },
  {
    id: 'd1',
    name: '客服Agent-A',
    title: '数字员工 / 客服助手',
    department: '数字员工中心',
    source: 'digital',
    availability: '空闲',
    version: 'v1.6.2',
    capabilities: ['沟通协调', '流程跟进', '资料整理'],
  },
  {
    id: 'd2',
    name: '监理Agent-B',
    title: '数字员工 / 巡检监理',
    department: '数字员工中心',
    source: 'digital',
    availability: '空闲',
    version: 'v2.1.0',
    capabilities: ['质量巡检', '巡检复核', '标准作业'],
  },
  {
    id: 'd3',
    name: '助理Agent-C',
    title: '数字员工 / 协同助理',
    department: '数字员工中心',
    source: 'digital',
    availability: '忙碌',
    version: 'v1.3.8',
    capabilities: ['资料整理', '流程跟进', '标准作业'],
  },
]

const initialAssignments: Record<ProjectRoleDefinition['id'], string[]> = {
  'project-manager': ['h1'],
  'customer-service': ['h2', 'd1'],
  'account-manager': ['h3'],
  'cost-engineer': ['h4'],
  supervisor: ['h5', 'd2'],
  designer: ['h6'],
  assistant: ['h7', 'd3'],
}

const candidateMap = new Map(candidates.map(candidate => [candidate.id, candidate]))
const roleMap = new Map(roleDefinitions.map(role => [role.id, role]))

const ProjectMembersView = () => {
  const [editing, setEditing] = useState(false)
  const [assignments, setAssignments] =
    useState<Record<ProjectRoleDefinition['id'], string[]>>(initialAssignments)
  const [activeRoleId, setActiveRoleId] = useState<ProjectRoleDefinition['id'] | null>(null)
  const [draftSelection, setDraftSelection] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const [sourceFilter, setSourceFilter] = useState<'all' | AssigneeSource>('all')
  const [editorError, setEditorError] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<
    Partial<Record<ProjectRoleDefinition['id'], AiSuggestion[]>>
  >({})
  const [activeAiRoleId, setActiveAiRoleId] = useState<ProjectRoleDefinition['id'] | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<ProjectRoleDefinition['id']>(
    roleDefinitions[0].id
  )

  const stats = useMemo(() => {
    const configuredCount = roleDefinitions.filter(
      role => (assignments[role.id] ?? []).length >= role.minRequired
    ).length
    const uniqueAssigned = new Set(Object.values(assignments).flat())
    let digitalCount = 0

    uniqueAssigned.forEach(candidateId => {
      const candidate = candidateMap.get(candidateId)
      if (!candidate) {
        return
      }
      if (candidate.source === 'digital') {
        digitalCount += 1
      }
    })

    return {
      configuredCount,
      memberCount: candidates.filter(candidate => candidate.source === 'human').length,
      digitalCount,
      relationCount: Object.values(assignments).flat().length,
    }
  }, [assignments])

  const activeRole = activeRoleId ? (roleMap.get(activeRoleId) ?? null) : null
  const selectedRole = roleMap.get(selectedRoleId) ?? null

  const filteredCandidates = useMemo(() => {
    if (!activeRole) {
      return []
    }

    const normalizedKeyword = keyword.trim().toLowerCase()

    return candidates
      .filter(candidate => activeRole.allowedSources.includes(candidate.source))
      .filter(candidate => sourceFilter === 'all' || candidate.source === sourceFilter)
      .filter(candidate => {
        if (normalizedKeyword.length === 0) {
          return true
        }
        return (
          candidate.name.toLowerCase().includes(normalizedKeyword) ||
          candidate.title.toLowerCase().includes(normalizedKeyword) ||
          candidate.department.toLowerCase().includes(normalizedKeyword)
        )
      })
  }, [activeRole, keyword, sourceFilter])

  const openEditor = (roleId: ProjectRoleDefinition['id']) => {
    if (!editing) {
      return
    }
    setEditorError('')
    setKeyword('')
    setSourceFilter('all')
    setActiveRoleId(roleId)
    setDraftSelection(assignments[roleId] ?? [])
  }

  const closeEditor = () => {
    setActiveRoleId(null)
    setDraftSelection([])
    setEditorError('')
  }

  const toggleDraftSelection = (candidateId: string) => {
    if (!activeRole) {
      return
    }

    if (activeRole.assignmentMode === 'single') {
      setDraftSelection([candidateId])
      return
    }

    setDraftSelection(current =>
      current.includes(candidateId)
        ? current.filter(item => item !== candidateId)
        : [...current, candidateId]
    )
  }

  const saveDraftSelection = () => {
    if (!activeRole) {
      return
    }

    if (draftSelection.length < activeRole.minRequired) {
      setEditorError(`至少需要指派 ${activeRole.minRequired} 人`)
      return
    }

    setAssignments(current => ({
      ...current,
      [activeRole.id]: draftSelection,
    }))
    closeEditor()
  }

  const buildAiSuggestions = (role: ProjectRoleDefinition): AiSuggestion[] => {
    const currentSet = new Set(assignments[role.id] ?? [])

    return candidates
      .filter(candidate => role.allowedSources.includes(candidate.source))
      .filter(candidate => !currentSet.has(candidate.id))
      .map(candidate => {
        const matchedTags = role.capabilityTags.filter(tag => candidate.capabilities.includes(tag))
        const capabilityScore = matchedTags.length * 12
        const availabilityScore = candidate.availability === '空闲' ? 16 : 5
        const digitalBoost = candidate.source === 'digital' && role.id !== 'project-manager' ? 8 : 0
        const score = Math.min(98, 52 + capabilityScore + availabilityScore + digitalBoost)
        const reason =
          matchedTags.length > 0
            ? `匹配能力：${matchedTags.join('、')}`
            : `岗位适配：${candidate.title}可承担${role.label}职责`

        let risk =
          candidate.availability === '忙碌' ? '当前负载偏高，建议作为备选' : '风险较低，可直接承担'
        if (candidate.source === 'digital') {
          risk = role.id === 'project-manager' ? '关键决策需人工复核' : '涉及异常场景时需人工兜底'
        }

        return {
          candidateId: candidate.id,
          score,
          reason,
          risk,
        }
      })
      .sort((left, right) => right.score - left.score)
      .slice(0, 3)
  }

  const requestAiSuggestion = (roleId: ProjectRoleDefinition['id']) => {
    const role = roleMap.get(roleId)
    if (!role) {
      return
    }

    setAiSuggestions(current => ({
      ...current,
      [roleId]: buildAiSuggestions(role),
    }))
    setActiveAiRoleId(roleId)
  }

  const applyAiSuggestion = (roleId: ProjectRoleDefinition['id'], candidateId: string) => {
    if (!editing) {
      return
    }

    const role = roleMap.get(roleId)
    if (!role) {
      return
    }

    setAssignments(current => {
      const currentRoleAssignments = current[roleId] ?? []
      if (role.assignmentMode === 'single') {
        return {
          ...current,
          [roleId]: [candidateId],
        }
      }

      if (currentRoleAssignments.includes(candidateId)) {
        return current
      }

      return {
        ...current,
        [roleId]: [...currentRoleAssignments, candidateId],
      }
    })
  }

  const getRoleAssignees = (roleId: ProjectRoleDefinition['id']) =>
    (assignments[roleId] ?? [])
      .map(candidateId => candidateMap.get(candidateId))
      .filter(Boolean) as MemberCandidate[]

  return (
    <section className="project-members-view">
      <div className="project-members-head">
        <div>
          <h2>项目角色指派</h2>
          <p>仅处理项目级角色分配，任务关联操作在其他页面完成</p>
        </div>
        <button
          type="button"
          className="project-members-edit-btn"
          onClick={() => setEditing(current => !current)}
        >
          {editing ? '完成编辑' : '编辑角色'}
        </button>
      </div>

      <div className="project-members-stats role-stats">
        <article className="project-members-stat-card">
          <p>已配置角色</p>
          <strong>
            {stats.configuredCount}/{roleDefinitions.length}
          </strong>
        </article>
        <article className="project-members-stat-card">
          <p>成员数量</p>
          <strong>{stats.memberCount}</strong>
        </article>
        <article className="project-members-stat-card">
          <p>已接入数字员工</p>
          <strong>{stats.digitalCount}</strong>
        </article>
        <article className="project-members-stat-card">
          <p>角色关系总数</p>
          <strong>{stats.relationCount}</strong>
        </article>
      </div>

      <div className="project-role-layout">
        <aside className="project-role-list-panel">
          <h3>角色列表</h3>
          <div className="project-role-list">
            {roleDefinitions.map(role => {
              const assignedCount = (assignments[role.id] ?? []).length
              const isActive = selectedRoleId === role.id

              return (
                <article
                  key={role.id}
                  className={`project-role-list-item ${isActive ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="project-role-list-main"
                    onClick={() => setSelectedRoleId(role.id)}
                  >
                    <div>
                      <strong>{role.label}</strong>
                      <p>{role.assignmentMode === 'single' ? '单人角色' : '多人角色'}</p>
                    </div>
                    <span>
                      {assignedCount}/{Math.max(role.minRequired, 1)}
                    </span>
                  </button>
                  <div className="project-role-list-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoleId(role.id)
                        requestAiSuggestion(role.id)
                      }}
                    >
                      AI建议
                    </button>
                    <button
                      type="button"
                      disabled={!editing}
                      onClick={() => {
                        setSelectedRoleId(role.id)
                        openEditor(role.id)
                      }}
                    >
                      编辑
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </aside>

        {selectedRole ? (
          <section className="project-role-detail-panel">
            <header className="project-role-card-head">
              <div>
                <h3>{selectedRole.label}</h3>
                <p>{selectedRole.assignmentMode === 'single' ? '单人角色' : '多人角色'}</p>
              </div>
              <span className="project-role-min-rule">最低 {selectedRole.minRequired} 人</span>
            </header>

            <div className="project-role-info-sections">
              <section className="project-role-section">
                <h4>成员信息</h4>
                <div className="project-role-personnel-list">
                  {getRoleAssignees(selectedRole.id).length > 0 ? (
                    getRoleAssignees(selectedRole.id).map(assignee => (
                      <article key={assignee.id} className="project-role-personnel-card">
                        <div className="project-role-candidate-title">
                          <strong>{assignee.name}</strong>
                          {assignee.source === 'digital' ? (
                            <span className="source-tag digital">数字员工</span>
                          ) : null}
                        </div>
                        <p>
                          {assignee.title} · {assignee.department}
                          {assignee.version ? ` · ${assignee.version}` : ''}
                        </p>
                        <span
                          className={`availability ${assignee.availability === '空闲' ? 'idle' : 'busy'}`}
                        >
                          {assignee.availability}
                        </span>
                      </article>
                    ))
                  ) : (
                    <div className="project-role-empty">当前未指派</div>
                  )}
                </div>
              </section>

              <section className="project-role-section">
                <h4>岗位职责</h4>
                <div className="project-role-duty">
                  <p>{selectedRole.duty}</p>
                </div>
              </section>
            </div>

            {activeAiRoleId === selectedRole.id && (
              <div className="project-ai-panel">
                <h4>AI推荐人选</h4>
                {(aiSuggestions[selectedRole.id] ?? []).length === 0 ? (
                  <div className="project-role-empty">暂无可推荐对象</div>
                ) : (
                  (aiSuggestions[selectedRole.id] ?? []).map(recommendation => {
                    const candidate = candidateMap.get(recommendation.candidateId)
                    if (!candidate) {
                      return null
                    }

                    return (
                      <div key={recommendation.candidateId} className="project-ai-item">
                        <div>
                          <div className="project-ai-item-title">
                            <span>{candidate.name}</span>
                            <span className="score">{recommendation.score}分</span>
                          </div>
                          <p>{recommendation.reason}</p>
                          <small>{recommendation.risk}</small>
                        </div>
                        <button
                          type="button"
                          disabled={!editing}
                          onClick={() =>
                            applyAiSuggestion(selectedRole.id, recommendation.candidateId)
                          }
                        >
                          采纳
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </section>
        ) : null}
      </div>

      {activeRole && (
        <div className="project-role-editor-mask" onClick={closeEditor}>
          <aside className="project-role-editor" onClick={event => event.stopPropagation()}>
            <header className="project-role-editor-head">
              <div>
                <h3>{activeRole.label}指派</h3>
                <p>{activeRole.duty}</p>
              </div>
              <button type="button" onClick={closeEditor}>
                关闭
              </button>
            </header>

            <div className="project-role-editor-filters">
              <input
                value={keyword}
                onChange={event => setKeyword(event.target.value)}
                placeholder="搜索姓名、岗位、部门"
              />
              <select
                value={sourceFilter}
                onChange={event => setSourceFilter(event.target.value as 'all' | AssigneeSource)}
              >
                <option value="all">全部来源</option>
                <option value="human">真人成员</option>
                <option value="digital">数字员工</option>
              </select>
            </div>

            <div className="project-role-candidate-list">
              {filteredCandidates.map(candidate => {
                const selected = draftSelection.includes(candidate.id)

                return (
                  <button
                    key={candidate.id}
                    type="button"
                    className={`project-role-candidate-item ${selected ? 'selected' : ''}`}
                    onClick={() => toggleDraftSelection(candidate.id)}
                  >
                    <div className="project-role-candidate-main">
                      <div className="project-role-candidate-title">
                        <strong>{candidate.name}</strong>
                        {candidate.source === 'digital' ? (
                          <span className="source-tag digital">数字员工</span>
                        ) : null}
                      </div>
                      <p>
                        {candidate.title} · {candidate.department}
                        {candidate.version ? ` · ${candidate.version}` : ''}
                      </p>
                    </div>
                    <span
                      className={`availability ${candidate.availability === '空闲' ? 'idle' : 'busy'}`}
                    >
                      {candidate.availability}
                    </span>
                  </button>
                )
              })}

              {filteredCandidates.length === 0 && (
                <div className="project-role-empty">暂无符合条件的成员</div>
              )}
            </div>

            {editorError && <div className="project-role-editor-error">{editorError}</div>}

            <footer className="project-role-editor-footer">
              <button type="button" onClick={closeEditor}>
                取消
              </button>
              <button type="button" onClick={saveDraftSelection}>
                保存角色指派
              </button>
            </footer>
          </aside>
        </div>
      )}
    </section>
  )
}

export default ProjectMembersView
