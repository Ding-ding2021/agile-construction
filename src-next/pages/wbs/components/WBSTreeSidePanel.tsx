import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Trash2, AlertTriangle } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useWBSStore } from '@/store/wbsStore'
import { WBS_STATUS_STYLE, WBS_STATUS_FALLBACK } from '../constants/wbs-styles'
import { getNodeLevelBadge, WBS_STATUS_LABEL } from '@/lib/wbs-utils'
import { DateTimePicker } from '@/components/ui/date-time-picker'

export function WBSTreeSidePanel() {
  const flatNodes = useWBSStore(s => s.flatNodes)
  const selectedId = useWBSStore(s => s.selectedId)
  const selectNode = useWBSStore(s => s.selectNode)
  const updateNode = useWBSStore(s => s.updateNode)
  const deleteNode = useWBSStore(s => s.deleteNode)

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editing, setEditing] = useState<Record<string, string>>({})

  const selectedNode = flatNodes.find(n => n.id === selectedId)
  const open = selectedId !== null

  const handleFieldChange = useCallback((field: string, value: string) => {
    setEditing(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleSave = useCallback(
    (field: string) => {
      if (!selectedNode || !(field in editing)) return
      updateNode(selectedNode.id, { [field]: editing[field] })
      setEditing(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    },
    [selectedNode, editing, updateNode]
  )

  const handleDelete = useCallback(() => {
    if (!selectedNode) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    deleteNode(selectedNode.id)
    setConfirmDelete(false)
  }, [selectedNode, confirmDelete, deleteNode])

  const editableValue = useCallback(
    (field: string) =>
      editing[field] ?? String(selectedNode?.[field as keyof typeof selectedNode] ?? ''),
    [editing, selectedNode]
  )

  const handleClose = useCallback(() => {
    selectNode(null)
    setConfirmDelete(false)
    setEditing({})
  }, [selectNode])

  return (
    <Sheet
      open={open}
      onOpenChange={o => {
        if (!o) handleClose()
      }}
    >
      <SheetContent side="right" className="sm:max-w-sm p-0">
        {selectedNode && (
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 pt-4 pb-2">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-sm font-semibold">{selectedNode.name}</SheetTitle>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">WBS 编码</label>
                <p className="text-sm font-mono text-foreground/70 mt-0.5">
                  {selectedNode.wbsCode}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">名称</label>
                <Input
                  value={editableValue('name')}
                  onChange={e => handleFieldChange('name', e.target.value)}
                  onBlur={() => handleSave('name')}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Badge variant="ghost" className="text-xs font-medium">
                  {getNodeLevelBadge(selectedNode.nodeLevel)}
                </Badge>
                <Badge
                  variant="ghost"
                  className={
                    'text-xs font-medium ' +
                    (WBS_STATUS_STYLE[selectedNode.status] ?? WBS_STATUS_FALLBACK)
                  }
                >
                  {WBS_STATUS_LABEL[selectedNode.status]}
                </Badge>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">进度</label>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={selectedNode.progress} className="flex-1 h-1.5" />
                  <span className="text-xs tabular-nums">{selectedNode.progress}%</span>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-xs font-medium text-muted-foreground">负责人</label>
                <Input
                  value={editableValue('assignee')}
                  onChange={e => handleFieldChange('assignee', e.target.value)}
                  onBlur={() => handleSave('assignee')}
                  placeholder="未分配"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">工期（天）</label>
                <Input
                  type="number"
                  value={editableValue('duration')}
                  onChange={e => handleFieldChange('duration', e.target.value)}
                  onBlur={() => handleSave('duration')}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">计划开始</label>
                <div className="mt-1">
                  <DateTimePicker
                    value={
                      selectedNode.plannedStart ? new Date(selectedNode.plannedStart) : undefined
                    }
                    onChange={date => handleFieldChange('plannedStart', date?.toISOString() ?? '')}
                    placeholder="选择开始日期"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">计划结束</label>
                <div className="mt-1">
                  <DateTimePicker
                    value={selectedNode.plannedEnd ? new Date(selectedNode.plannedEnd) : undefined}
                    onChange={date => handleFieldChange('plannedEnd', date?.toISOString() ?? '')}
                    placeholder="选择结束日期"
                  />
                </div>
              </div>

              <Separator />

              <div>
                {confirmDelete ? (
                  <div className="rounded-lg bg-destructive/10 p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertTriangle className="size-4" />
                      <span>确认删除此节点及其子节点？</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={handleDelete}
                      >
                        确认删除
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setConfirmDelete(false)}
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="size-3.5 mr-1" />
                    删除节点
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
