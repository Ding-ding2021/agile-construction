import { useMemo, useState } from 'react'
import type { TaskTreeNode, TaskTreeNodeStatus, TaskTreeViewModel } from './taskManagement.data'

type TaskAssigneeOption = {
  id: string
  name: string
  disabled: boolean
  statusLabel?: string
}

type TaskTreeViewProps = {
  model: TaskTreeViewModel
  onOpenTask: (taskCode: string) => void
  assigneeOptions?: TaskAssigneeOption[]
  onAssignTask?: (taskCode: string, assigneeName: string) => void
}

type VisibleRow = {
  node: TaskTreeNode
  depth: number
}

type TreeStatusFilter = 'all' | TaskTreeNodeStatus

const TYPE_LABELS: Record<TaskTreeNode['type'], string> = {
  project: '项目',
  work_package: '工作包',
  task: '任务',
}

const STATUS_LABELS: Record<TreeStatusFilter, string> = {
  all: '全部',
  completed: '已完成',
  'in-progress': '进行中',
  delayed: '风险',
  planned: '待开始',
}

const buildVisibleRows = (
  nodes: TaskTreeNode[],
  expandedIds: Set<string>,
  depth = 0
): VisibleRow[] =>
  nodes.flatMap(node => {
    const current: VisibleRow = { node, depth }
    if (!node.children.length || !expandedIds.has(node.id)) {
      return [current]
    }
    return [current, ...buildVisibleRows(node.children, expandedIds, depth + 1)]
  })

const collectDefaultExpandedIds = (nodes: TaskTreeNode[]) => {
  const ids: string[] = []
  const walk = (list: TaskTreeNode[]) => {
    list.forEach(node => {
      if (node.type !== 'task') {
        ids.push(node.id)
      }
      if (node.children.length > 0) {
        walk(node.children)
      }
    })
  }
  walk(nodes)
  return ids
}

const collectNodeMap = (nodes: TaskTreeNode[]) => {
  const nodeMap = new Map<string, TaskTreeNode>()
  const walk = (list: TaskTreeNode[]) => {
    list.forEach(node => {
      nodeMap.set(node.id, node)
      if (node.children.length > 0) {
        walk(node.children)
      }
    })
  }
  walk(nodes)
  return nodeMap
}

const collectParentMap = (nodes: TaskTreeNode[]) => {
  const parentMap = new Map<string, string>()
  const walk = (list: TaskTreeNode[], parentId?: string) => {
    list.forEach(node => {
      if (parentId) {
        parentMap.set(node.id, parentId)
      }
      if (node.children.length > 0) {
        walk(node.children, node.id)
      }
    })
  }
  walk(nodes)
  return parentMap
}

const flattenNodes = (nodes: TaskTreeNode[]): TaskTreeNode[] =>
  nodes.flatMap(node => [node, ...flattenNodes(node.children)])

const filterNodesByStatus = (
  nodes: TaskTreeNode[],
  statusFilter: TreeStatusFilter
): TaskTreeNode[] => {
  if (statusFilter === 'all') {
    return nodes
  }

  const pick = (list: TaskTreeNode[]): TaskTreeNode[] =>
    list
      .map(node => {
        const children = pick(node.children)
        const matched = node.status === statusFilter
        if (!matched && children.length === 0) {
          return null
        }
        return {
          ...node,
          children,
        }
      })
      .filter((node): node is TaskTreeNode => node !== null)

  return pick(nodes)
}

const TaskTreeView = ({
  model,
  onOpenTask,
  assigneeOptions = [],
  onAssignTask,
}: TaskTreeViewProps) => {
  const [statusFilter, setStatusFilter] = useState<TreeStatusFilter>('all')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(collectDefaultExpandedIds(model.nodes))
  )
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(
    model.focusNodeId ?? model.nodes[0]?.id
  )
  const [assigneeDraftByNodeId, setAssigneeDraftByNodeId] = useState<Record<string, string>>({})

  const allNodes = useMemo(() => flattenNodes(model.nodes), [model.nodes])
  const parentMap = useMemo(() => collectParentMap(model.nodes), [model.nodes])

  const filteredNodes = useMemo(
    () => filterNodesByStatus(model.nodes, statusFilter),
    [model.nodes, statusFilter]
  )
  const visibleRows = useMemo(
    () => buildVisibleRows(filteredNodes, expandedIds),
    [filteredNodes, expandedIds]
  )

  const nodeMap = useMemo(() => collectNodeMap(filteredNodes), [filteredNodes])
  const selectedNode =
    selectedNodeId && nodeMap.has(selectedNodeId)
      ? (nodeMap.get(selectedNodeId) ?? null)
      : (visibleRows[0]?.node ?? null)

  const disabledAssigneeNames = useMemo(
    () => new Set(assigneeOptions.filter(option => option.disabled).map(option => option.name)),
    [assigneeOptions]
  )

  const selectedNodeAssigneeDisabled = selectedNode
    ? disabledAssigneeNames.has(selectedNode.owner)
    : false

  const assigneeDraft = selectedNode
    ? (assigneeDraftByNodeId[selectedNode.id] ??
      (selectedNode.owner === '待分配' ? '' : selectedNode.owner))
    : ''

  const statusCounter = useMemo(
    () => ({
      all: allNodes.length,
      completed: allNodes.filter(node => node.status === 'completed').length,
      'in-progress': allNodes.filter(node => node.status === 'in-progress').length,
      delayed: allNodes.filter(node => node.status === 'delayed').length,
      planned: allNodes.filter(node => node.status === 'planned').length,
    }),
    [allNodes]
  )

  const toggleNode = (nodeId: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  const expandAncestors = (nodeId: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      let cursor = parentMap.get(nodeId)
      while (cursor) {
        next.add(cursor)
        cursor = parentMap.get(cursor)
      }
      return next
    })
  }

  const locateFirstRiskNode = () => {
    const delayedNode = allNodes.find(node => node.status === 'delayed' && node.type === 'task')
    if (!delayedNode) {
      return
    }
    setStatusFilter('all')
    setSelectedNodeId(delayedNode.id)
    expandAncestors(delayedNode.id)
  }

  const handleAssign = () => {
    if (!selectedNode?.taskCode || !assigneeDraft.trim()) {
      return
    }

    onAssignTask?.(selectedNode.taskCode, assigneeDraft.trim())
  }

  return (
    <section className="tm-tree-view">
      <div className="tm-tree-header">
        <div className="tm-tree-title-block">
          <span className="tm-tree-eyebrow">模板实例化结构</span>
          <h3>任务树（参考 WBS）</h3>
          <p>支持状态筛选、全部展开/收起、定位风险节点，保持项目级树结构浏览体验。</p>
        </div>
        <div className="tm-tree-summary-pills">
          <span className="tm-tree-summary-pill">
            <strong>{model.summary.projectCount}</strong>
            <span>项目</span>
          </span>
          <span className="tm-tree-summary-pill">
            <strong>{model.summary.workPackageCount}</strong>
            <span>工作包</span>
          </span>
          <span className="tm-tree-summary-pill">
            <strong>{model.summary.taskCount}</strong>
            <span>任务</span>
          </span>
          <span className="tm-tree-summary-pill warning">
            <strong>{model.summary.delayedCount}</strong>
            <span>风险节点</span>
          </span>
          <span className="tm-tree-summary-pill muted">更新于 {model.updatedAt}</span>
        </div>
      </div>

      <div className="tm-tree-controls" role="toolbar" aria-label="任务树控制">
        <div className="tm-tree-filter-group">
          {(Object.keys(STATUS_LABELS) as TreeStatusFilter[]).map(filterKey => (
            <button
              key={filterKey}
              type="button"
              className={`tm-tree-filter-btn ${statusFilter === filterKey ? 'active' : ''}`}
              onClick={() => setStatusFilter(filterKey)}
              aria-pressed={statusFilter === filterKey}
            >
              <span>{STATUS_LABELS[filterKey]}</span>
              <strong>{statusCounter[filterKey]}</strong>
            </button>
          ))}
        </div>

        <div className="tm-tree-action-group">
          <button
            type="button"
            className="tm-tree-ghost-btn"
            onClick={() => setExpandedIds(new Set(collectDefaultExpandedIds(filteredNodes)))}
          >
            全部展开
          </button>
          <button
            type="button"
            className="tm-tree-ghost-btn"
            onClick={() => setExpandedIds(new Set())}
          >
            全部收起
          </button>
          <button
            type="button"
            className="tm-tree-danger-btn"
            onClick={locateFirstRiskNode}
            disabled={statusCounter.delayed === 0}
          >
            定位风险节点
          </button>
        </div>
      </div>

      <div className="tm-tree-layout">
        <div className="card tm-tree-card">
          <div className="tm-tree-table-header">
            <span>编码 / 节点名称</span>
            <span>负责人</span>
            <span>状态</span>
            <span>进度</span>
          </div>
          <div className="tm-tree-table-body">
            {visibleRows.length ? (
              visibleRows.map(({ node, depth }) => {
                const hasChildren = node.children.length > 0
                const isExpanded = expandedIds.has(node.id)
                const isSelected = selectedNode?.id === node.id

                return (
                  <button
                    key={node.id}
                    type="button"
                    className={`tm-tree-row ${isSelected ? 'selected' : ''} ${node.status === 'delayed' ? 'risk' : ''}`}
                    onClick={() => {
                      setSelectedNodeId(node.id)
                      expandAncestors(node.id)
                    }}
                  >
                    <span className="tm-tree-node" style={{ paddingLeft: `${12 + depth * 20}px` }}>
                      {hasChildren ? (
                        <span
                          className={`tm-tree-toggle ${isExpanded ? 'expanded' : ''}`}
                          onClick={event => {
                            event.stopPropagation()
                            toggleNode(node.id)
                          }}
                        >
                          ▸
                        </span>
                      ) : (
                        <span className="tm-tree-toggle spacer" />
                      )}
                      <span className="tm-tree-code">{node.code}</span>
                      <span className="tm-tree-name">{node.name}</span>
                      <span className="tm-tree-type">{TYPE_LABELS[node.type]}</span>
                    </span>
                    <span className="tm-tree-owner">{node.owner}</span>
                    <span className={`tm-tree-status ${node.status}`}>{node.statusLabel}</span>
                    <span className="tm-tree-progress">{node.progress}%</span>
                  </button>
                )
              })
            ) : (
              <div className="tm-tree-empty-panel">当前筛选条件下没有匹配节点</div>
            )}
          </div>
        </div>

        <aside className="card tm-tree-panel">
          {selectedNode ? (
            <>
              <div className="tm-tree-panel-header">
                <div>
                  <span className="tm-tree-eyebrow">节点详情</span>
                  <h4>{selectedNode.name}</h4>
                </div>
                <span className={`tm-tree-status ${selectedNode.status}`}>
                  {selectedNode.statusLabel}
                </span>
              </div>

              <div className="tm-tree-panel-grid">
                <div className="tm-tree-panel-field">
                  <span>节点编码</span>
                  <strong>{selectedNode.code}</strong>
                </div>
                <div className="tm-tree-panel-field">
                  <span>节点类型</span>
                  <strong>{TYPE_LABELS[selectedNode.type]}</strong>
                </div>
                <div className="tm-tree-panel-field">
                  <span>负责人</span>
                  <strong>{selectedNode.owner}</strong>
                </div>
                <div className="tm-tree-panel-field">
                  <span>子节点数</span>
                  <strong>{selectedNode.children.length}</strong>
                </div>
              </div>

              <div className="tm-tree-panel-section">
                <div className="tm-tree-panel-section-head">
                  <span>进度</span>
                  <strong>{selectedNode.progress}%</strong>
                </div>
                <div className="tm-tree-progress-track">
                  <div
                    className={`tm-tree-progress-fill ${selectedNode.status}`}
                    style={{ width: `${selectedNode.progress}%` }}
                  />
                </div>
              </div>

              <div className="tm-tree-panel-section">
                <span className="tm-tree-eyebrow">前置依赖</span>
                <div className="tm-tree-chip-list">
                  {selectedNode.dependencies.length ? (
                    selectedNode.dependencies.map(dependency => (
                      <span key={dependency} className="tm-tree-info-chip">
                        {dependency}
                      </span>
                    ))
                  ) : (
                    <span className="tm-tree-empty-text">无前置依赖</span>
                  )}
                </div>
              </div>

              {selectedNode.taskCode ? (
                <>
                  <div className="tm-tree-panel-section tm-tree-assign-section">
                    <span className="tm-tree-eyebrow">任务派单</span>
                    <div className="tm-tree-assignee-editor">
                      <select
                        value={assigneeDraft}
                        onChange={event => {
                          if (!selectedNode) {
                            return
                          }
                          const nextValue = event.target.value
                          setAssigneeDraftByNodeId(prev => ({
                            ...prev,
                            [selectedNode.id]: nextValue,
                          }))
                        }}
                        aria-label="选择任务负责人"
                      >
                        <option value="">请选择负责人</option>
                        {assigneeOptions.map(option => (
                          <option key={option.id} value={option.name} disabled={option.disabled}>
                            {option.name}
                            {option.statusLabel ? `（${option.statusLabel}）` : ''}
                          </option>
                        ))}
                      </select>
                      <button type="button" onClick={handleAssign} disabled={!assigneeDraft.trim()}>
                        保存派单
                      </button>
                    </div>
                    {selectedNodeAssigneeDisabled ? (
                      <p className="tm-tree-assign-warning">
                        当前负责人已处于不可分配状态，建议尽快重新分配。
                      </p>
                    ) : null}
                    <p className="tm-tree-assign-tip">说明：仅可分配状态人员可参与派单。</p>
                  </div>

                  <button
                    type="button"
                    className="tm-tree-open-btn"
                    onClick={() => {
                      if (selectedNode.taskCode) {
                        onOpenTask(selectedNode.taskCode)
                      }
                    }}
                  >
                    打开任务详情
                  </button>
                </>
              ) : null}
            </>
          ) : (
            <span className="tm-tree-empty-text">请选择一个节点查看详情</span>
          )}
        </aside>
      </div>
    </section>
  )
}

export default TaskTreeView
