import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps, Node } from '@xyflow/react'
import type { WBSNode } from '@/types/wbs'
import { WBS_STATUS_STYLE, WBS_STATUS_FALLBACK } from '../constants/wbs-styles'

export type WBSNetworkNodeData = {
  node: WBSNode
  isCritical?: boolean
}

export type WBSNetworkNodeType = Node<WBSNetworkNodeData, 'wbsNode'>

export const WBSNetworkNode = memo(function WBSNetworkNode({
  data,
  selected,
}: NodeProps<WBSNetworkNodeType>) {
  const { node, isCritical } = data
  const statusStyle = WBS_STATUS_STYLE[node.status] || WBS_STATUS_FALLBACK
  const bg = statusStyle.split(' ')[0] || 'bg-zinc-100'

  const handleClass = '!w-2 !h-2 !bg-border hover:!bg-muted-foreground !border-2 !border-background !cursor-crosshair'

  return (
    <div
      className={`px-3 py-2 rounded-lg border-2 text-xs min-w-[140px] transition-shadow ${
        selected
          ? 'border-primary shadow-md'
          : isCritical
            ? 'border-chart-1'
            : 'border-border'
      } ${bg} bg-opacity-20`}
    >
      <Handle type="target" position={Position.Top} className={handleClass} />
      <Handle type="target" position={Position.Left} className={handleClass} />
      <div className="font-medium text-foreground truncate">{node.wbsCode}</div>
      <div className="text-muted-foreground truncate">{node.name}</div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] text-muted-foreground">{node.duration}天</span>
        {isCritical && (
          <span className="text-[10px] text-chart-1 font-medium">关键路径</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className={handleClass} />
      <Handle type="source" position={Position.Right} className={handleClass} />
    </div>
  )
})
