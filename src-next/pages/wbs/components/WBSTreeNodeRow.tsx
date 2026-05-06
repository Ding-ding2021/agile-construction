import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ChevronRight, ChevronDown, Plus } from 'lucide-react'
import { WBS_STATUS_STYLE, WBS_LEVEL_INDENT } from '../constants/wbs-styles'
import { getNodeLevelBadge, WBS_STATUS_LABEL } from '@/lib/wbs-utils'
import type { WBSNode } from '@/types/wbs'

interface WBSTreeNodeRowProps {
  node: WBSNode
  depth: number
  expandedIds: number[]
  selectedId: number | null
  onToggle: (id: number) => void
  onSelect: (id: number) => void
  onAddChild: (parentId: number, level: WBSNode['nodeLevel']) => void
}

export function WBSTreeNodeRow({
  node,
  depth,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
  onAddChild,
}: WBSTreeNodeRowProps) {
  const hasChildren = node.children.length > 0
  const isExpanded = expandedIds.includes(node.id)
  const isSelected = selectedId === node.id

  const indent = depth * WBS_LEVEL_INDENT

  return (
    <>
      <TableRow
        className="cursor-pointer"
        data-state={isSelected ? 'selected' : undefined}
        onClick={() => onSelect(node.id)}
      >
        <TableCell className="py-1.5">
          <div className="flex items-center" style={{ paddingLeft: indent }}>
            {hasChildren ? (
              <button
                onClick={e => {
                  e.stopPropagation()
                  onToggle(node.id)
                }}
                className="size-4 flex items-center justify-center shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="size-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="size-3 text-muted-foreground" />
                )}
              </button>
            ) : (
              <span className="size-4 inline-block shrink-0" />
            )}
          </div>
        </TableCell>
        <TableCell className="py-1.5 text-xs font-mono text-muted-foreground">
          {node.wbsCode}
        </TableCell>
        <TableCell className="py-1.5 text-sm font-medium">{node.name}</TableCell>
        <TableCell className="py-1.5">
          <Badge variant="ghost" className="text-[10px] font-medium">
            {getNodeLevelBadge(node.nodeLevel)}
          </Badge>
        </TableCell>
        <TableCell className="py-1.5">
          <Badge
            variant="ghost"
            className={
              'text-[10px] font-medium ' + (WBS_STATUS_STYLE[node.status] ?? 'bg-zinc-100')
            }
          >
            {WBS_STATUS_LABEL[node.status]}
          </Badge>
        </TableCell>
        <TableCell className="py-1.5">
          <div className="flex items-center gap-1.5">
            <Progress value={node.progress} className="w-10 h-1.5" />
            <span className="text-xs tabular-nums">{node.progress}%</span>
          </div>
        </TableCell>
        <TableCell className="py-1.5 text-xs text-muted-foreground">
          {node.assignee || '-'}
        </TableCell>
        <TableCell className="py-1.5 text-xs text-muted-foreground whitespace-nowrap">
          {node.plannedStart ? node.plannedStart.slice(0, 10) : '—'}
          {' ~ '}
          {node.plannedEnd ? node.plannedEnd.slice(0, 10) : '—'}
        </TableCell>
        <TableCell className="py-1.5">
          <button
            onClick={e => {
              e.stopPropagation()
              onAddChild(node.id, node.nodeLevel)
            }}
            className="size-5 flex items-center justify-center rounded hover:bg-muted transition-colors"
            title="添加子节点"
          >
            <Plus className="size-3 text-muted-foreground" />
          </button>
        </TableCell>
      </TableRow>
      {hasChildren &&
        isExpanded &&
        node.children.map(child => (
          <WBSTreeNodeRow
            key={child.id}
            node={child}
            depth={depth + 1}
            expandedIds={expandedIds}
            selectedId={selectedId}
            onToggle={onToggle}
            onSelect={onSelect}
            onAddChild={onAddChild}
          />
        ))}
    </>
  )
}
