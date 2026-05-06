import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, ArrowRight, X } from 'lucide-react'
import type { TaskRelation } from '@/types/task'

const RELATION_LABELS: Record<string, string> = {
  finish_start: '完成-开始', start_start: '开始-开始',
  finish_finish: '完成-完成', start_finish: '开始-完成',
}

interface TaskRelationsProps {
  relations: TaskRelation[]
  readonly?: boolean
  onAdd?: (fromTaskId: string, relationType: TaskRelation['relationType']) => void
  onRemove?: (relationId: string) => void
}

export default function TaskRelations({ relations, readonly, onAdd, onRemove }: TaskRelationsProps) {
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [relType, setRelType] = useState<TaskRelation['relationType']>('finish_start')

  const handleAdd = () => {
    if (search.trim()) {
      onAdd?.(search.trim(), relType)
      setShowAdd(false)
      setSearch('')
    }
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          前置任务 ({relations.length})
        </h3>
        {!readonly && (
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setShowAdd(true)}>
            <Plus className="size-3" />
            添加前置
          </Button>
        )}
      </div>

      {relations.length === 0 && (
        <p className="text-xs text-muted-foreground py-2 text-center">暂无前置任务</p>
      )}

      <div className="space-y-1">
        {relations.map(rel => (
          <div key={rel.id} className="flex items-center justify-between py-1.5 border-b last:border-b-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm truncate">{rel.fromTaskName ?? rel.fromTaskId}</span>
              <Badge variant="outline" className="text-[10px] shrink-0">
                {RELATION_LABELS[rel.relationType] ?? rel.relationType}
              </Badge>
              <ArrowRight className="size-3 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground truncate">{rel.toTaskName ?? rel.toTaskId}</span>
            </div>
            {!readonly && (
              <Button variant="ghost" size="icon" className="size-6 shrink-0" onClick={() => onRemove?.(rel.id)}>
                <Trash2 className="size-3 text-muted-foreground hover:text-red-500" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Simple modal overlay instead of shadcn Dialog */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowAdd(false)}>
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-5 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">添加前置任务</h3>
              <Button variant="ghost" size="icon" className="size-6" onClick={() => setShowAdd(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              选择前置任务编码和依赖关系类型。前置任务需要先完成后，当前任务才能开始。
            </p>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">前置任务编码</label>
              <Input
                placeholder="例如 PRJ-001-T-001"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">依赖类型</label>
              <Select value={relType} onValueChange={v => setRelType(v as TaskRelation['relationType'])}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RELATION_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>取消</Button>
              <Button size="sm" disabled={!search.trim()} onClick={handleAdd}>添加</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
