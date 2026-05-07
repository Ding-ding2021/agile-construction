import { Fragment } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ChevronRight, ChevronDown, Plus, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WBS_STATUS_STYLE, WBS_LEVEL_STYLE } from '../constants/wbs-styles'
import { getNodeLevelBadge, WBS_STATUS_LABEL } from '@/lib/wbs-utils'
import type { WBSNode } from '@/types/wbs'

interface WBSTreeNodeRowProps {
  node: WBSNode
  depth: number
  isLastChild: boolean
  ancestorHasNext: boolean[]
  expandedIds: number[]
  selectedId: number | null
  onToggle: (id: number) => void
  onSelect: (id: number) => void
  onAddChild: (parentId: number, level: WBSNode['nodeLevel']) => void
}

function TreeLines({
  ancestorHasNext,
  isLastChild,
}: {
  ancestorHasNext: boolean[]
  isLastChild: boolean
}) {
  return (
    <div className="flex items-end h-full">
      {ancestorHasNext.map((hasNext, i) => (
        <div key={i} className="w-7 shrink-0 relative h-9">
          <div
            className={cn('absolute left-3 top-0 w-px bg-border/50', hasNext ? 'bottom-0' : 'h-0')}
          />
        </div>
      ))}
      {/* Current level connector */}
      <div className="w-7 shrink-0 relative h-9">
        <div className={cn('absolute left-3 w-3.5', isLastChild ? 'top-0 h-1/2' : 'top-0 h-full')}>
          <div className="absolute left-0 bottom-1/2 w-full h-px bg-border" />
          {!isLastChild && <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />}
        </div>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 size-1.5 rounded-full border border-border bg-background" />
      </div>
    </div>
  )
}

export function WBSTreeNodeRow({
  node,
  depth,
  isLastChild,
  ancestorHasNext,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
  onAddChild,
}: WBSTreeNodeRowProps) {
  const hasChildren = node.children.length > 0
  const isExpanded = expandedIds.includes(node.id)
  const isSelected = selectedId === node.id
  const levelStyle = WBS_LEVEL_STYLE[node.nodeLevel]

  return (
    <Fragment>
      <TableRow
        className={cn('cursor-pointer transition-colors group', isSelected && 'bg-muted/50')}
        data-state={isSelected ? 'selected' : undefined}
        onClick={() => onSelect(node.id)}
      >
        <TableCell className="py-2">
          <div className="flex items-center gap-1">
            <TreeLines ancestorHasNext={ancestorHasNext} isLastChild={isLastChild} />
            <div className="size-5 flex items-center justify-center shrink-0">
              {hasChildren ? (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    onToggle(node.id)
                  }}
                  className="size-4 flex items-center justify-center rounded hover:bg-muted"
                >
                  {isExpanded ? (
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                  )}
                </button>
              ) : (
                <Circle className="size-1.5 fill-muted-foreground/30 text-muted-foreground/30" />
              )}
            </div>
          </div>
        </TableCell>
        <TableCell className="py-2 text-xs font-mono text-muted-foreground/60">
          {node.wbsCode}
        </TableCell>
        <TableCell className={cn('py-2 text-sm', levelStyle.nameStyle)}>{node.name}</TableCell>
        <TableCell className="py-2">
          <Badge variant="ghost" className="text-xs font-medium">
            {getNodeLevelBadge(node.nodeLevel)}
          </Badge>
        </TableCell>
        <TableCell className="py-2">
          <Badge
            variant="ghost"
            className={cn(
              'text-xs font-medium',
              WBS_STATUS_STYLE[node.status] ??
                'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
            )}
          >
            {WBS_STATUS_LABEL[node.status]}
          </Badge>
        </TableCell>
        <TableCell className="py-2">
          <div className="flex items-center gap-2">
            <Progress value={node.progress} className="w-16 h-1.5" />
            <span className="text-xs tabular-nums text-muted-foreground">{node.progress}%</span>
          </div>
        </TableCell>
        <TableCell className="py-2 text-xs text-muted-foreground">{node.assignee || '-'}</TableCell>
        <TableCell className="py-2 text-xs text-muted-foreground/60 whitespace-nowrap">
          {node.plannedStart ? node.plannedStart.slice(5) : '—'}
          {'~'}
          {node.plannedEnd ? node.plannedEnd.slice(5) : '—'}
        </TableCell>
        <TableCell className="py-2">
          <button
            onClick={e => {
              e.stopPropagation()
              onAddChild(node.id, node.nodeLevel)
            }}
            className="size-6 flex items-center justify-center rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
            title="添加子节点"
          >
            <Plus className="size-3.5 text-muted-foreground" />
          </button>
        </TableCell>
      </TableRow>
      {hasChildren &&
        isExpanded &&
        node.children.map((child, idx) => {
          const isLast = idx === node.children.length - 1
          return (
            <WBSTreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              ancestorHasNext={[...ancestorHasNext, !isLast]}
              expandedIds={expandedIds}
              selectedId={selectedId}
              isLastChild={isLast}
              onToggle={onToggle}
              onSelect={onSelect}
              onAddChild={onAddChild}
            />
          )
        })}
    </Fragment>
  )
}
