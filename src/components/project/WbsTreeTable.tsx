import type { ProjectWbsNode } from '../../data/projectWbs'

type WbsTreeTableProps = {
  nodes: ProjectWbsNode[]
  selectedNodeId: string
  expandedNodeIds: Set<string>
  onSelectNode: (nodeId: string) => void
  onToggleNode: (nodeId: string) => void
}

type VisibleNodeRow = {
  node: ProjectWbsNode
  depth: number
}

const TYPE_LABELS: Record<ProjectWbsNode['type'], string> = {
  project: '项目',
  work_package: '工作包',
  task: '任务',
  subtask: '子任务',
}

const buildVisibleRows = (
  inputNodes: ProjectWbsNode[],
  expandedNodeIds: Set<string>,
  depth = 0
): VisibleNodeRow[] =>
  inputNodes.flatMap(node => {
    const row: VisibleNodeRow = { node, depth }
    if (!node.children.length || !expandedNodeIds.has(node.id)) {
      return [row]
    }
    return [row, ...buildVisibleRows(node.children, expandedNodeIds, depth + 1)]
  })

const WbsTreeTable = ({
  nodes,
  selectedNodeId,
  expandedNodeIds,
  onSelectNode,
  onToggleNode,
}: WbsTreeTableProps) => {
  const visibleRows = buildVisibleRows(nodes, expandedNodeIds)

  return (
    <div className="card wbs-tree-card">
      <div className="wbs-tree-header">
        <span>WBS编码 / 节点名称</span>
        <span>负责人</span>
        <span>状态</span>
        <span>进度</span>
      </div>

      <div className="wbs-tree-body">
        {visibleRows.map(({ node, depth }) => {
          const hasChildren = node.children.length > 0
          const isExpanded = expandedNodeIds.has(node.id)
          const isSelected = selectedNodeId === node.id

          return (
            <button
              key={node.id}
              type="button"
              className={`wbs-tree-row ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectNode(node.id)}
            >
              <span className="wbs-tree-node" style={{ paddingLeft: `${12 + depth * 20}px` }}>
                {hasChildren ? (
                  <span
                    className={`wbs-tree-toggle ${isExpanded ? 'expanded' : ''}`}
                    onClick={event => {
                      event.stopPropagation()
                      onToggleNode(node.id)
                    }}
                  >
                    ▸
                  </span>
                ) : (
                  <span className="wbs-tree-toggle spacer" />
                )}
                <span className="wbs-tree-code">{node.wbsCode}</span>
                <span className="wbs-tree-name">{node.name}</span>
                <span className="wbs-tree-type">{TYPE_LABELS[node.type]}</span>
              </span>
              <span className="wbs-tree-owner">{node.owner}</span>
              <span className={`wbs-tree-status ${node.status}`}>{node.statusLabel}</span>
              <span className="wbs-tree-progress">{node.progress}%</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default WbsTreeTable
