import { useCallback } from 'react'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useWBSStore } from '@/store/wbsStore'
import { WBSTreeNodeRow } from './WBSTreeNodeRow'
import type { WBSNode } from '@/types/wbs'

const COL_COUNT = 9

interface WBSTreeTableProps {
  projectCode: string
}

export function WBSTreeTable({ projectCode }: WBSTreeTableProps) {
  const tree = useWBSStore(s => s.tree)
  const loading = useWBSStore(s => s.loading)
  const expandedIds = useWBSStore(s => s.expandedIds)
  const selectedId = useWBSStore(s => s.selectedId)
  const selectNode = useWBSStore(s => s.selectNode)
  const toggleExpand = useWBSStore(s => s.toggleExpand)
  const addNode = useWBSStore(s => s.addNode)

  const handleAddChild = useCallback(
    (parentId: number, _level: WBSNode['nodeLevel']) => {
      addNode(projectCode, { parentId, name: '新建节点' })
    },
    [projectCode, addNode]
  )

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            工作分解结构 (WBS)
          </h3>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead className="w-24">WBS 编码</TableHead>
                <TableHead>名称</TableHead>
                <TableHead className="w-16">级别</TableHead>
                <TableHead className="w-16">状态</TableHead>
                <TableHead className="w-24">进度</TableHead>
                <TableHead className="w-20">负责人</TableHead>
                <TableHead className="w-40">计划时间</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: COL_COUNT }).map((_, j) => (
                    <TableCell key={j} className="py-2">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center justify-between px-4 pt-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          工作分解结构 (WBS)
        </h3>
      </div>
      <div className="rounded-md border mx-4 mb-4 mt-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead className="w-24">WBS 编码</TableHead>
              <TableHead>名称</TableHead>
              <TableHead className="w-16">级别</TableHead>
              <TableHead className="w-16">状态</TableHead>
              <TableHead className="w-24">进度</TableHead>
              <TableHead className="w-20">负责人</TableHead>
              <TableHead className="w-40">计划时间</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tree.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={COL_COUNT}
                  className="text-center py-6 text-xs text-muted-foreground"
                >
                  暂无 WBS 节点
                </TableCell>
              </TableRow>
            ) : (
              tree.map((node, idx) => (
                <WBSTreeNodeRow
                  key={node.id}
                  node={node}
                  depth={0}
                  isLastChild={idx === tree.length - 1}
                  ancestorHasNext={[]}
                  expandedIds={expandedIds}
                  selectedId={selectedId}
                  onToggle={toggleExpand}
                  onSelect={selectNode}
                  onAddChild={handleAddChild}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
