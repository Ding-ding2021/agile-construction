import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../shared'
import type { ProjectItem } from '../../data/projects'
import {
  createAcceptanceNodesForProject,
  type AcceptanceNode,
  type AcceptanceRiskLevel,
  type AcceptanceStatus,
} from './project-acceptance.data'
import { acceptanceRepository } from '../../services/repositories/acceptanceRepository'
import { taskRepository } from '../../services/repositories/taskRepository'

export type AcceptanceMilestoneSyncPayload = {
  completedCount: number
  inProgressCount: number
  pendingCount: number
  total: number
  passedNodeCount: number
  rectifyingNodeCount: number
  pendingNodeCount: number
  highRiskUnclosedCount: number
}

type ProjectAcceptanceViewProps = {
  project: ProjectItem
  onAppendActivityLog?: (message: string) => void
  onMilestoneSync?: (payload: AcceptanceMilestoneSyncPayload) => void
}

type MilestoneStatus = '未开始' | '进行中' | '已完成'

type AcceptanceMilestone = {
  id: string
  name: string
  phase: string
  owner: string
  plannedAt: string
  status: MilestoneStatus
  updatedAt: string
}

const statusOptions: readonly AcceptanceStatus[] = [
  '待验收',
  '验收通过',
  '验收不通过',
  '整改中',
  '待复验',
]
const riskOptions: readonly AcceptanceRiskLevel[] = ['低', '中', '高', '严重']

const statusClassMap: Record<AcceptanceStatus, string> = {
  待验收: 'pending',
  验收通过: 'passed',
  验收不通过: 'rejected',
  整改中: 'rectifying',
  待复验: 'recheck',
}

const riskClassMap: Record<AcceptanceRiskLevel, string> = {
  低: 'low',
  中: 'medium',
  高: 'high',
  严重: 'critical',
}

const milestoneStatusClassMap: Record<MilestoneStatus, string> = {
  未开始: 'pending',
  进行中: 'active',
  已完成: 'done',
}

const parseProgressPair = (value: string): { done: number; total: number } => {
  const [rawDone = '0', rawTotal = '0'] = value.split('/')
  const done = Number(rawDone)
  const total = Number(rawTotal)

  return {
    done: Number.isFinite(done) ? done : 0,
    total: Number.isFinite(total) ? total : 0,
  }
}

const seedMilestoneNames = [
  '设计方案终审',
  '隐蔽工程验收',
  '机电联调验收',
  '开业前综合验收',
  '门店交付确认',
  '结算归档完成',
] as const
const seedMilestonePhases = [
  '设计深化',
  '施工实施',
  '施工实施',
  '验收交付',
  '验收交付',
  '结算归档',
] as const
const seedMilestoneOwners = ['张伟', '王工', '李工', '张经理', '赵主管', '财务专员'] as const

const createMilestonesForProject = (
  project: Pick<ProjectItem, 'code' | 'milestone' | 'owner'>
): AcceptanceMilestone[] => {
  const progress = parseProgressPair(project.milestone)
  const total = Math.max(progress.total, 4)
  const doneCount = Math.min(progress.done, total)

  return Array.from({ length: total }, (_, index) => {
    const order = index + 1
    const status: MilestoneStatus =
      order <= doneCount ? '已完成' : order === doneCount + 1 ? '进行中' : '未开始'
    const date = `2026-04-${String(6 + index * 3).padStart(2, '0')}`

    return {
      id: `${project.code}-milestone-${order}`,
      name: seedMilestoneNames[index] ?? `里程碑${String(order).padStart(2, '0')}`,
      phase: seedMilestonePhases[index] ?? '验收交付',
      owner: seedMilestoneOwners[index] ?? project.owner,
      plannedAt: date,
      status,
      updatedAt: '初始导入',
    }
  })
}

const isValidDateInput = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value)

const buildMilestoneSyncPayload = (
  milestones: AcceptanceMilestone[],
  nodes: AcceptanceNode[]
): AcceptanceMilestoneSyncPayload => {
  const completedCount = milestones.filter(item => item.status === '已完成').length
  const inProgressCount = milestones.filter(item => item.status === '进行中').length
  const pendingCount = milestones.filter(item => item.status === '未开始').length

  const passedNodeCount = nodes.filter(node => node.status === '验收通过').length
  const rectifyingNodeCount = nodes.filter(
    node => node.status === '整改中' || node.status === '验收不通过'
  ).length
  const pendingNodeCount = nodes.filter(
    node => node.status === '待验收' || node.status === '待复验'
  ).length
  const highRiskUnclosedCount = nodes.filter(
    node => (node.riskLevel === '高' || node.riskLevel === '严重') && node.status !== '验收通过'
  ).length

  return {
    completedCount,
    inProgressCount,
    pendingCount,
    total: milestones.length,
    passedNodeCount,
    rectifyingNodeCount,
    pendingNodeCount,
    highRiskUnclosedCount,
  }
}

import { readLocalState } from '../../services/repositories/acceptanceRepository'

type PersistedAcceptanceState = {
  nodes: AcceptanceNode[]
  milestones: AcceptanceMilestone[]
}

const createInitialAcceptanceState = (
  project: Pick<ProjectItem, 'code' | 'milestone' | 'owner'>
): PersistedAcceptanceState => ({
  nodes: createAcceptanceNodesForProject(project.code),
  milestones: createMilestonesForProject(project),
})

const readAcceptanceState = (
  projectCode: string,
  fallbackProject: Pick<ProjectItem, 'code' | 'milestone' | 'owner'>
): PersistedAcceptanceState => {
  const fallback = createInitialAcceptanceState(fallbackProject)
  const local = readLocalState(projectCode)
  if (!local || !Array.isArray(local.nodes) || !Array.isArray(local.milestones)) {
    return fallback
  }
  return {
    nodes: local.nodes as AcceptanceNode[],
    milestones: local.milestones as AcceptanceMilestone[],
  }
}

const ProjectAcceptanceView = ({
  project,
  onAppendActivityLog,
  onMilestoneSync,
}: ProjectAcceptanceViewProps) => {
  const fallbackProject = {
    code: project.code,
    milestone: project.milestone,
    owner: project.owner,
  }

  const [nodes, setNodes] = useState<AcceptanceNode[]>(
    () => readAcceptanceState(project.code, fallbackProject).nodes
  )
  const [milestones, setMilestones] = useState<AcceptanceMilestone[]>(
    () => readAcceptanceState(project.code, fallbackProject).milestones
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | AcceptanceStatus>('all')
  const [riskFilter, setRiskFilter] = useState<'all' | AcceptanceRiskLevel>('all')
  const [selectedNode, setSelectedNode] = useState<AcceptanceNode | null>(null)
  const [editingMilestone, setEditingMilestone] = useState<AcceptanceMilestone | null>(null)
  const [editingDateValue, setEditingDateValue] = useState('')
  const [editingDateError, setEditingDateError] = useState<string | null>(null)

  const filteredNodes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return nodes.filter(node => {
      const matchSearch =
        normalizedQuery.length === 0 ||
        node.nodeName.toLowerCase().includes(normalizedQuery) ||
        node.nodeCode.toLowerCase().includes(normalizedQuery)
      const matchStatus = statusFilter === 'all' || node.status === statusFilter
      const matchRisk = riskFilter === 'all' || node.riskLevel === riskFilter
      return matchSearch && matchStatus && matchRisk
    })
  }, [nodes, searchQuery, statusFilter, riskFilter])

  const stats = useMemo(() => {
    const pendingCount = nodes.filter(
      node => node.status === '待验收' || node.status === '待复验'
    ).length
    const passedCount = nodes.filter(node => node.status === '验收通过').length
    const rectifyingCount = nodes.filter(
      node => node.status === '整改中' || node.status === '验收不通过'
    ).length
    const highRiskUnclosedCount = nodes.filter(
      node => (node.riskLevel === '高' || node.riskLevel === '严重') && node.status !== '验收通过'
    ).length

    return {
      pendingCount,
      passedCount,
      rectifyingCount,
      highRiskUnclosedCount,
    }
  }, [nodes])

  const milestoneStats = useMemo(
    () => buildMilestoneSyncPayload(milestones, nodes),
    [milestones, nodes]
  )

  useEffect(() => {
    let cancelled = false

    const bootstrapAcceptance = async () => {
      const fallback = readAcceptanceState(project.code, {
        code: project.code,
        milestone: project.milestone,
        owner: project.owner,
      })
      const remoteState = await acceptanceRepository.load(project.code)
      const nextState = remoteState
        ? {
            nodes: remoteState.nodes as AcceptanceNode[],
            milestones: remoteState.milestones as AcceptanceMilestone[],
          }
        : fallback

      if (cancelled) {
        return
      }

      setNodes(nextState.nodes)
      setMilestones(nextState.milestones)
    }

    void bootstrapAcceptance()

    return () => {
      cancelled = true
    }
  }, [project.code, project.milestone, project.owner])

  useEffect(() => {
    onMilestoneSync?.(buildMilestoneSyncPayload(milestones, nodes))
  }, [milestones, nodes, onMilestoneSync])

  useEffect(() => {
    void acceptanceRepository.save(
      project.code,
      {
        nodes,
        milestones,
      },
      milestoneStats
    )
  }, [milestoneStats, milestones, nodes, project.code])

  const updateNodeStatus = (id: string, nextStatus: AcceptanceStatus) => {
    const targetNode = nodes.find(node => node.id === id)
    if (!targetNode || targetNode.status === nextStatus) {
      return
    }

    setNodes(previousNodes =>
      previousNodes.map(node => {
        if (node.id !== id) {
          return node
        }

        return {
          ...node,
          status: nextStatus,
          issueCount: nextStatus === '验收通过' ? 0 : node.issueCount,
          updatedAt: '刚刚',
        }
      })
    )

    setSelectedNode(currentNode => {
      if (!currentNode || currentNode.id !== id) {
        return currentNode
      }

      return {
        ...currentNode,
        status: nextStatus,
        issueCount: nextStatus === '验收通过' ? 0 : currentNode.issueCount,
        updatedAt: '刚刚',
      }
    })

    onAppendActivityLog?.(
      `验收节点「${targetNode.nodeName}」状态由 ${targetNode.status} 更新为 ${nextStatus}`
    )

    if (nextStatus === '整改中' || nextStatus === '验收不通过') {
      void taskRepository
        .createRectificationTaskFromAcceptance({
          projectCode: project.code,
          projectName: project.name,
          nodeCode: targetNode.nodeCode,
          nodeName: targetNode.nodeName,
          owner: targetNode.owner,
          issueCount: targetNode.issueCount,
        })
        .then(result => {
          onAppendActivityLog?.(
            `验收节点「${targetNode.nodeName}」已触发整改任务（${result.taskCode}），任务上下文：${result.contextKey}`
          )
        })
        .catch(() => {
          onAppendActivityLog?.(
            `验收节点「${targetNode.nodeName}」整改任务创建失败，请在任务管理中手动补录。`
          )
        })
    }
  }

  const updateMilestoneStatus = (id: string, nextStatus: MilestoneStatus) => {
    const target = milestones.find(item => item.id === id)
    if (!target || target.status === nextStatus) {
      return
    }

    const nextMilestones = milestones.map(item =>
      item.id === id
        ? {
            ...item,
            status: nextStatus,
            updatedAt: '刚刚',
          }
        : item
    )

    setMilestones(nextMilestones)
    onAppendActivityLog?.(`里程碑「${target.name}」状态由 ${target.status} 更新为 ${nextStatus}`)
  }

  const openMilestoneDateEditor = (milestone: AcceptanceMilestone) => {
    setEditingMilestone(milestone)
    setEditingDateValue(milestone.plannedAt)
    setEditingDateError(null)
  }

  const closeMilestoneDateEditor = () => {
    setEditingMilestone(null)
    setEditingDateValue('')
    setEditingDateError(null)
  }

  const submitMilestoneDateEdit = () => {
    if (!editingMilestone) {
      return
    }

    const nextDate = editingDateValue.trim()
    if (!isValidDateInput(nextDate)) {
      setEditingDateError('日期格式错误，请输入 YYYY-MM-DD')
      return
    }

    const currentMilestone = milestones.find(item => item.id === editingMilestone.id)
    if (!currentMilestone) {
      closeMilestoneDateEditor()
      return
    }

    if (nextDate === currentMilestone.plannedAt) {
      closeMilestoneDateEditor()
      return
    }

    const nextMilestones = milestones.map(item =>
      item.id === currentMilestone.id
        ? {
            ...item,
            plannedAt: nextDate,
            updatedAt: '刚刚',
          }
        : item
    )

    setMilestones(nextMilestones)

    onAppendActivityLog?.(
      `里程碑「${currentMilestone.name}」计划日期由 ${currentMilestone.plannedAt} 调整为 ${nextDate}`
    )
    closeMilestoneDateEditor()
  }

  return (
    <section className="acceptance-view">
      <div className="acceptance-stats-grid">
        <div className="card acceptance-stat-card">
          <div className="acceptance-stat-label">待验收节点</div>
          <div className="acceptance-stat-value">{stats.pendingCount}</div>
        </div>
        <div className="card acceptance-stat-card">
          <div className="acceptance-stat-label">已通过节点</div>
          <div className="acceptance-stat-value success">{stats.passedCount}</div>
        </div>
        <div className="card acceptance-stat-card">
          <div className="acceptance-stat-label">整改中</div>
          <div className="acceptance-stat-value warning">{stats.rectifyingCount}</div>
        </div>
        <div className="card acceptance-stat-card">
          <div className="acceptance-stat-label">高风险未闭环</div>
          <div className="acceptance-stat-value danger">{stats.highRiskUnclosedCount}</div>
        </div>
      </div>

      <div className="card acceptance-milestone-wrap">
        <div className="acceptance-milestone-head">
          <h3>里程碑状态更新</h3>
          <div className="acceptance-milestone-summary">
            <span>已完成 {milestoneStats.completedCount}</span>
            <span>进行中 {milestoneStats.inProgressCount}</span>
            <span>未开始 {milestoneStats.pendingCount}</span>
            <span>总计 {milestoneStats.total}</span>
          </div>
        </div>

        <div className="acceptance-milestone-list">
          {milestones.map(milestone => (
            <div className="acceptance-milestone-item" key={milestone.id}>
              <div className="acceptance-milestone-main">
                <div className="acceptance-milestone-name">{milestone.name}</div>
                <div className="acceptance-milestone-meta">
                  <span>{milestone.phase}</span>
                  <span>责任人：{milestone.owner}</span>
                  <span>计划：{milestone.plannedAt}</span>
                  <span>更新：{milestone.updatedAt}</span>
                </div>
              </div>
              <div className="acceptance-milestone-right">
                <span
                  className={`milestone-status-chip ${milestoneStatusClassMap[milestone.status]}`}
                >
                  {milestone.status}
                </span>
                <div className="acceptance-actions">
                  <button type="button" onClick={() => openMilestoneDateEditor(milestone)}>
                    编辑日期
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMilestoneStatus(milestone.id, '已完成')}
                  >
                    完成
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMilestoneStatus(milestone.id, '进行中')}
                  >
                    进行中
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMilestoneStatus(milestone.id, '未开始')}
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card acceptance-toolbar">
        <div className="acceptance-toolbar-left">
          <div className="acceptance-search">
            <input
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder="搜索节点名称/编码"
            />
          </div>
        </div>

        <div className="acceptance-toolbar-right">
          <select
            value={statusFilter}
            onChange={event => setStatusFilter(event.target.value as 'all' | AcceptanceStatus)}
          >
            <option value="all">全部状态</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={riskFilter}
            onChange={event => setRiskFilter(event.target.value as 'all' | AcceptanceRiskLevel)}
          >
            <option value="all">全部风险</option>
            {riskOptions.map(risk => (
              <option key={risk} value={risk}>
                {risk}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card acceptance-table-wrap">
        <table className="acceptance-table">
          <thead>
            <tr>
              <th>节点名称</th>
              <th>阶段</th>
              <th>责任人</th>
              <th>计划验收</th>
              <th>提交时间</th>
              <th>验收状态</th>
              <th>风险等级</th>
              <th>问题数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredNodes.map(node => (
              <tr key={node.id}>
                <td>
                  <div className="acceptance-node-name">{node.nodeName}</div>
                  <div className="acceptance-node-code">{node.nodeCode}</div>
                </td>
                <td>{node.phase}</td>
                <td>{node.owner}</td>
                <td>{node.plannedAt}</td>
                <td>{node.submittedAt ?? '-'}</td>
                <td>
                  <span className={`acceptance-status-badge status-${statusClassMap[node.status]}`}>
                    {node.status}
                  </span>
                </td>
                <td>
                  <span className={`acceptance-risk-badge risk-${riskClassMap[node.riskLevel]}`}>
                    {node.riskLevel}
                  </span>
                </td>
                <td>{node.issueCount}</td>
                <td>
                  <div className="acceptance-actions">
                    <button type="button" onClick={() => setSelectedNode(node)}>
                      详情
                    </button>
                    <button type="button" onClick={() => updateNodeStatus(node.id, '验收通过')}>
                      通过
                    </button>
                    <button type="button" onClick={() => updateNodeStatus(node.id, '整改中')}>
                      整改
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredNodes.length === 0 && (
              <tr>
                <td colSpan={9}>
                  <EmptyState title="暂无符合条件的节点" compact />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingMilestone && (
        <div className="acceptance-drawer-mask" onClick={closeMilestoneDateEditor}>
          <aside className="acceptance-drawer" onClick={event => event.stopPropagation()}>
            <div className="acceptance-drawer-header">
              <div>
                <h3>编辑里程碑计划日期</h3>
                <p>{editingMilestone.name}</p>
              </div>
              <button type="button" onClick={closeMilestoneDateEditor}>
                关闭
              </button>
            </div>

            <div className="acceptance-drawer-section">
              <h4>计划日期</h4>
              <div className="acceptance-search">
                <input
                  value={editingDateValue}
                  onChange={event => setEditingDateValue(event.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>
              {editingDateError ? <p>{editingDateError}</p> : null}
            </div>

            <div className="acceptance-drawer-footer">
              <button type="button" onClick={closeMilestoneDateEditor}>
                取消
              </button>
              <button type="button" onClick={submitMilestoneDateEdit}>
                保存
              </button>
            </div>
          </aside>
        </div>
      )}

      {selectedNode && (
        <div className="acceptance-drawer-mask" onClick={() => setSelectedNode(null)}>
          <aside className="acceptance-drawer" onClick={event => event.stopPropagation()}>
            <div className="acceptance-drawer-header">
              <div>
                <h3>{selectedNode.nodeName}</h3>
                <p>{selectedNode.nodeCode}</p>
              </div>
              <button type="button" onClick={() => setSelectedNode(null)}>
                关闭
              </button>
            </div>

            <div className="acceptance-drawer-section">
              <h4>基础信息</h4>
              <p>阶段：{selectedNode.phase}</p>
              <p>责任人：{selectedNode.owner}</p>
              <p>计划验收：{selectedNode.plannedAt}</p>
              <p>最近更新：{selectedNode.updatedAt}</p>
            </div>

            <div className="acceptance-drawer-section">
              <h4>验收标准</h4>
              <ul>
                {selectedNode.standards.map(standard => (
                  <li key={standard.id}>
                    <span>{standard.passed ? '通过' : '待整改'}</span>
                    <span>{standard.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="acceptance-drawer-section">
              <h4>附件资料</h4>
              <ul>
                {selectedNode.attachments.map(attachment => (
                  <li key={attachment.id}>{attachment.name}</li>
                ))}
              </ul>
            </div>

            <div className="acceptance-drawer-footer">
              <button type="button" onClick={() => updateNodeStatus(selectedNode.id, '待复验')}>
                提交复验
              </button>
              <button type="button" onClick={() => updateNodeStatus(selectedNode.id, '验收通过')}>
                确认通过
              </button>
              <button type="button" onClick={() => updateNodeStatus(selectedNode.id, '整改中')}>
                驳回整改
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  )
}

export default ProjectAcceptanceView
