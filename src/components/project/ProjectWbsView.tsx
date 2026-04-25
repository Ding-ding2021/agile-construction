import { useMemo, useState } from 'react'
import type { ProjectItem } from '../../data/projects'
import { getProjectWbsData, type ProjectWbsNode } from '../../data/projectWbs'
import WbsNodePanel from './WbsNodePanel'
import WbsTreeTable from './WbsTreeTable'
import './project-wbs.css'

type ProjectWbsViewProps = {
  project: ProjectItem
}

const collectNodeMap = (nodes: ProjectWbsNode[]) => {
  const nodeMap = new Map<string, ProjectWbsNode>()
  const visit = (list: ProjectWbsNode[]) => {
    list.forEach(node => {
      nodeMap.set(node.id, node)
      if (node.children.length > 0) {
        visit(node.children)
      }
    })
  }
  visit(nodes)
  return nodeMap
}

const ProjectWbsView = ({ project }: ProjectWbsViewProps) => {
  const wbsData = useMemo(() => getProjectWbsData(project), [project])
  const [selectedNodeIdByProject, setSelectedNodeIdByProject] = useState<Record<string, string>>({})
  const [expandedNodeIdsByProject, setExpandedNodeIdsByProject] = useState<
    Record<string, Set<string>>
  >({})

  const selectedNodeId = selectedNodeIdByProject[project.code] ?? wbsData.focusNodeId
  const expandedNodeIds =
    expandedNodeIdsByProject[project.code] ?? new Set(wbsData.defaultExpandedIds)

  const nodeMap = useMemo(() => collectNodeMap(wbsData.nodes), [wbsData.nodes])

  const selectedNode = useMemo(
    () => nodeMap.get(selectedNodeId) ?? nodeMap.get(wbsData.focusNodeId) ?? null,
    [nodeMap, selectedNodeId, wbsData.focusNodeId]
  )

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeIdByProject(prev => ({
      ...prev,
      [project.code]: nodeId,
    }))
  }

  const handleToggleNode = (nodeId: string) => {
    setExpandedNodeIdsByProject(prev => {
      const current = prev[project.code] ?? new Set(wbsData.defaultExpandedIds)
      const next = new Set(current)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }

      return {
        ...prev,
        [project.code]: next,
      }
    })
  }

  return (
    <section className="wbs-view">
      <div className="wbs-view-header">
        <div className="wbs-view-title-block">
          <span className="wbs-view-eyebrow">项目结构拆解</span>
          <h2>工作分解结构（WBS）</h2>
          <p>{project.name}按工作包、任务与子任务展开，支持按结构层级查看当前分解状态。</p>
        </div>

        <div className="wbs-summary-pills">
          <span className="wbs-summary-pill">
            <strong>{wbsData.summary.workPackageCount}</strong>
            <span>工作包</span>
          </span>
          <span className="wbs-summary-pill">
            <strong>{wbsData.summary.taskCount}</strong>
            <span>任务</span>
          </span>
          <span className="wbs-summary-pill">
            <strong>{wbsData.summary.subtaskCount}</strong>
            <span>子任务</span>
          </span>
          <span className="wbs-summary-pill warning">
            <strong>{wbsData.summary.delayedCount}</strong>
            <span>延误节点</span>
          </span>
          <span className="wbs-summary-pill muted">更新于 {wbsData.updatedAt}</span>
        </div>
      </div>

      <div className="wbs-view-layout">
        <WbsTreeTable
          nodes={wbsData.nodes}
          selectedNodeId={selectedNode?.id ?? ''}
          expandedNodeIds={expandedNodeIds}
          onSelectNode={handleSelectNode}
          onToggleNode={handleToggleNode}
        />
        <WbsNodePanel projectName={project.name} node={selectedNode} />
      </div>
    </section>
  )
}

export default ProjectWbsView
