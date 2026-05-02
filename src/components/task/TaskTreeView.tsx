/**
 * TaskTreeView — WBS 表格风格的任务树视图
 *
 * 使用 MUI X TreeView (SimpleTreeView + TreeItem)，
 * 每个节点渲染为 WBS 表格行（编码 / 名称 / 负责人 / 状态 / 进度）。
 * 纯表格视图，点击行打开任务详情。
 */
import { useMemo, useState } from 'react'
import { Box, Chip, Typography, LinearProgress, Button } from '@mui/material'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import type { TaskTreeNode, TaskTreeNodeStatus, TaskTreeViewModel } from './taskManagement.data'

type TaskTreeViewProps = {
  model: TaskTreeViewModel
  onOpenTask: (taskCode: string) => void
}

type TreeStatusFilter = 'all' | TaskTreeNodeStatus

const STATUS_LABELS: Record<TreeStatusFilter, string> = {
  all: '全部',
  completed: '已完成',
  'in-progress': '进行中',
  delayed: '风险',
  planned: '待开始',
}

const TYPE_LABELS: Record<string, string> = {
  project: '项目',
  work_package: '工作包',
  task: '任务',
}

const STATUS_TONE: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
  completed: 'success',
  'in-progress': 'info',
  delayed: 'error',
  planned: 'default',
}

const PROGRESS_COLOR: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
  completed: 'success',
  'in-progress': 'info',
  delayed: 'error',
  planned: 'info',
}

const flattenNodes = (nodes: TaskTreeNode[]): TaskTreeNode[] =>
  nodes.flatMap(node => [node, ...flattenNodes(node.children)])

const filterNodesByStatus = (
  nodes: TaskTreeNode[],
  statusFilter: TreeStatusFilter
): TaskTreeNode[] => {
  if (statusFilter === 'all') return nodes

  const pick = (list: TaskTreeNode[]): TaskTreeNode[] =>
    list
      .map(node => {
        const children = pick(node.children)
        const matched = node.status === statusFilter
        if (!matched && children.length === 0) return null
        return { ...node, children }
      })
      .filter((node): node is TaskTreeNode => node !== null)

  return pick(nodes)
}

/** 将 TaskTreeNode 树递归渲染为 TreeItem 列表 */
function renderTreeItems(
  nodes: TaskTreeNode[],
  onOpenTask: (code: string) => void
): React.ReactNode[] {
  return nodes.map(node => {
    const progColor = PROGRESS_COLOR[node.status] ?? 'info'
    const hasChildren = node.children.length > 0

    return (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 140px 100px 100px',
              alignItems: 'center',
              gap: 1,
              py: 0.5,
              width: '100%',
            }}
          >
            {/* 编码 / 名称 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: 'var(--pm-text-40)',
                  fontSize: 11,
                  whiteSpace: 'nowrap',
                }}
              >
                {node.code}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--pm-text-white)',
                  fontWeight: 500,
                  fontSize: 13,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {node.name}
              </Typography>
              <Chip
                label={TYPE_LABELS[node.type] ?? node.type}
                size="small"
                variant="outlined"
                sx={{ height: 18, fontSize: 10, flexShrink: 0, borderColor: 'var(--pm-border)' }}
              />
            </Box>

            {/* 负责人 */}
            <Typography
              variant="caption"
              sx={{ color: 'var(--pm-text-70)', fontSize: 12, textAlign: 'center' }}
            >
              {node.owner || '—'}
            </Typography>

            {/* 状态 */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Chip
                label={node.statusLabel}
                size="small"
                color={STATUS_TONE[node.status] ?? 'default'}
                variant="outlined"
                sx={{ height: 20, fontSize: 10, minWidth: 48 }}
              />
            </Box>

            {/* 进度 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={node.progress}
                color={progColor}
                sx={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'var(--pm-border)',
                  '& .MuiLinearProgress-bar': { borderRadius: 2 },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: 'var(--pm-text-40)',
                  fontSize: 11,
                  minWidth: 30,
                  textAlign: 'right',
                }}
              >
                {node.progress}%
              </Typography>
            </Box>
          </Box>
        }
        onClick={() => {
          if (node.taskCode) onOpenTask(node.taskCode)
        }}
      >
        {hasChildren ? renderTreeItems(node.children, onOpenTask) : undefined}
      </TreeItem>
    )
  })
}

const TaskTreeView = ({ model, onOpenTask }: TaskTreeViewProps) => {
  const [statusFilter, setStatusFilter] = useState<TreeStatusFilter>('all')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    // 默认展开所有非 task 级别节点
    const ids = new Set<string>()
    const walk = (list: TaskTreeNode[]) => {
      list.forEach(n => {
        if (n.type !== 'task') ids.add(n.id)
        if (n.children.length > 0) walk(n.children)
      })
    }
    walk(model.nodes)
    return ids
  })

  const allNodes = useMemo(() => flattenNodes(model.nodes), [model.nodes])
  const filteredNodes = useMemo(
    () => filterNodesByStatus(model.nodes, statusFilter),
    [model.nodes, statusFilter]
  )

  const statusCounter = useMemo(
    () => ({
      all: allNodes.length,
      completed: allNodes.filter(n => n.status === 'completed').length,
      'in-progress': allNodes.filter(n => n.status === 'in-progress').length,
      delayed: allNodes.filter(n => n.status === 'delayed').length,
      planned: allNodes.filter(n => n.status === 'planned').length,
    }),
    [allNodes]
  )

  const locateFirstRiskNode = () => {
    const delayed = allNodes.find(n => n.status === 'delayed')
    if (!delayed) return
    setStatusFilter('all')
    // 展开所有节点
    const ids = new Set<string>()
    const walk = (list: TaskTreeNode[]) => {
      list.forEach(n => {
        if (n.children.length > 0) {
          ids.add(n.id)
          walk(n.children)
        }
      })
    }
    walk(filteredNodes)
    setExpandedItems(ids)
  }

  const handleExpandedItemsChange = (_event: React.SyntheticEvent | null, itemIds: string[]) => {
    setExpandedItems(new Set(itemIds))
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* ── 统计 + 控制栏 ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {(Object.keys(STATUS_LABELS) as TreeStatusFilter[]).map(key => (
            <Button
              key={key}
              size="small"
              variant={statusFilter === key ? 'contained' : 'outlined'}
              onClick={() => setStatusFilter(key)}
              sx={{
                borderRadius: 20,
                fontSize: 12,
                minWidth: 'auto',
                px: 1.5,
                py: 0.3,
              }}
            >
              {STATUS_LABELS[key]} ({statusCounter[key]})
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              const ids = new Set<string>()
              const walk = (list: TaskTreeNode[]) => {
                list.forEach(n => {
                  if (n.type !== 'task') ids.add(n.id)
                  if (n.children.length > 0) walk(n.children)
                })
              }
              walk(filteredNodes)
              setExpandedItems(ids)
            }}
            sx={{ fontSize: 12, textTransform: 'none' }}
          >
            全部展开
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => setExpandedItems(new Set())}
            sx={{ fontSize: 12, textTransform: 'none' }}
          >
            全部收起
          </Button>
          <Button
            size="small"
            variant="text"
            color="warning"
            disabled={statusCounter.delayed === 0}
            onClick={locateFirstRiskNode}
            sx={{ fontSize: 12, textTransform: 'none' }}
          >
            定位风险节点
          </Button>
        </Box>
      </Box>

      {/* ── 表头 ── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 140px 100px 100px',
          gap: 1,
          px: 1,
          py: 0.8,
          borderBottom: '1px solid var(--pm-border-light)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'var(--pm-text-40)', fontWeight: 600 }}>
          编码 / 节点名称
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'var(--pm-text-40)', fontWeight: 600, textAlign: 'center' }}
        >
          负责人
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'var(--pm-text-40)', fontWeight: 600, textAlign: 'center' }}
        >
          状态
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'var(--pm-text-40)', fontWeight: 600, textAlign: 'center' }}
        >
          进度
        </Typography>
      </Box>

      {/* ── 树视图 ── */}
      {filteredNodes.length > 0 ? (
        <SimpleTreeView
          expandedItems={Array.from(expandedItems)}
          onExpandedItemsChange={handleExpandedItemsChange}
          sx={{
            '& .MuiTreeItem-content': {
              py: 0.3,
              px: 0.5,
              borderRadius: 1,
              borderBottom: '1px solid var(--pm-border-light)',
              '&:hover': { bgcolor: 'var(--pm-element-hover)' },
              '&.Mui-focused': { bgcolor: 'var(--pm-primary-15)' },
            },
            '& .MuiTreeItem-label': { py: 0 },
            '& .MuiTreeItem-iconContainer': { mx: 0.5 },
          }}
        >
          {renderTreeItems(filteredNodes, onOpenTask)}
        </SimpleTreeView>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6, color: 'var(--pm-text-40)' }}>
          当前筛选条件下没有匹配的节点
        </Box>
      )}
    </Box>
  )
}

export default TaskTreeView
