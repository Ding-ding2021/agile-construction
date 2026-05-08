import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle, Clock, Plus, Trash2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/services/api'
import type { TaskChecklistItem } from '@/types/task'

interface OperationTaskChecklistProps {
  projectCode: string
  taskId: number
  items: TaskChecklistItem[]
  readonly?: boolean
  onReload?: () => void
}

const RESULT_META: Record<string, { icon: typeof CheckCircle2; className: string; label: string }> =
  {
    pass: { icon: CheckCircle2, className: 'text-green-500', label: '通过' },
    fail: { icon: XCircle, className: 'text-red-500', label: '不通过' },
    pending: { icon: Clock, className: 'text-muted-foreground/40', label: '待检' },
  }

export default function OperationTaskChecklist({
  projectCode,
  taskId,
  items,
  readonly,
  onReload,
}: OperationTaskChecklistProps) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const doneCount = items.filter(i => i.result === 'pass').length

  const handleAdd = async () => {
    if (!newName.trim()) return
    try {
      await api.createChecklistItem(projectCode, taskId, { name: newName.trim() })
      setNewName('')
      setAdding(false)
      onReload?.()
    } catch {
      toast.error('添加失败')
    }
  }

  const handleToggleResult = async (item: TaskChecklistItem) => {
    if (readonly) return
    const nextResult = item.result === 'pass' ? 'fail' : item.result === 'fail' ? 'pending' : 'pass'
    try {
      await api.updateChecklistItem(projectCode, taskId, Number(item.id), {
        result: nextResult,
        inspectedAt: nextResult !== 'pending' ? new Date().toISOString() : undefined,
      })
      onReload?.()
    } catch {
      toast.error('更新失败')
    }
  }

  const handleSaveEdit = async (itemId: string) => {
    if (!editName.trim()) return
    try {
      await api.updateChecklistItem(projectCode, taskId, Number(itemId), { name: editName.trim() })
      setEditingId(null)
      onReload?.()
    } catch {
      toast.error('保存失败')
    }
  }

  const handleDelete = async (itemId: string) => {
    try {
      await api.deleteChecklistItem(projectCode, taskId, Number(itemId))
      onReload?.()
    } catch {
      toast.error('删除失败')
    }
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          检查项 ({doneCount}/{items.length})
        </h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0}%
        </span>
      </div>

      {items.length > 0 && <Progress value={(doneCount / items.length) * 100} className="h-1.5" />}

      <div className="space-y-1">
        {items.map(item => {
          const meta = RESULT_META[item.result ?? 'pending']
          const Icon = meta.icon
          const isEditing = editingId === item.id

          if (isEditing) {
            return (
              <div key={item.id} className="flex items-center gap-2 py-1">
                <Input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="h-7 text-sm"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveEdit(item.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => handleSaveEdit(item.id)}
                >
                  <Save className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setEditingId(null)}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            )
          }

          return (
            <div key={item.id} className="group flex items-center gap-2 py-1">
              {readonly ? (
                <Icon className={`size-4 shrink-0 ${meta.className}`} />
              ) : (
                <button
                  onClick={() => handleToggleResult(item)}
                  className="size-4 shrink-0 cursor-pointer focus:outline-none"
                  title={`点击切换状态（当前：${meta.label}）`}
                >
                  <Icon className={`size-4 ${meta.className}`} />
                </button>
              )}
              <span
                className={`text-sm flex-1 ${item.result === 'pass' ? 'line-through text-muted-foreground' : ''}`}
              >
                {item.name}
              </span>
              {item.clauseId && (
                <Badge variant="outline" className="text-[10px]">
                  条款#{item.clauseId}
                </Badge>
              )}
              <Badge
                className={`text-[10px] ${meta.className.replace('text-', 'bg-').replace('-500', '-500/15 text-')}500`}
              >
                {meta.label}
              </Badge>
              {!readonly && (
                <div className="hidden group-hover:flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      setEditingId(item.id)
                      setEditName(item.name)
                    }}
                  >
                    <Save className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!readonly &&
        (adding ? (
          <div className="flex items-center gap-2">
            <Input
              placeholder="输入检查项名称..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="h-8 text-sm"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') handleAdd()
                if (e.key === 'Escape') {
                  setAdding(false)
                  setNewName('')
                }
              }}
            />
            <Button variant="default" size="sm" className="h-8" onClick={handleAdd}>
              <Plus className="size-3.5 mr-1" />
              添加
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => {
                setAdding(false)
                setNewName('')
              }}
            >
              取消
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-full gap-1"
            onClick={() => setAdding(true)}
          >
            <Plus className="size-3.5" />
            添加检查项
          </Button>
        ))}
    </Card>
  )
}
