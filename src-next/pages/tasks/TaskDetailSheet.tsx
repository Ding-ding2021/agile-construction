import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { useTaskDetail } from '@/hooks/useTaskDetail'
import TaskDetailContent from './components/TaskDetailContent'
import type { TaskItem } from '@/types/task'

interface TaskDetailSheetProps {
  task: TaskItem | null
  onClose: () => void
}

export default function TaskDetailSheet({ task, onClose }: TaskDetailSheetProps) {
  const navigate = useNavigate()
  const isLocalTask = task ? String(task.id).startsWith('new-') : false
  const { task: detail, loading, assigneeOptions, reload } = useTaskDetail(
    isLocalTask ? null : task?.code ?? null
  )

  const handleOpenPage = () => {
    if (task?.code) {
      onClose()
      navigate(`/tasks/${task.code}`)
    }
  }

  return (
    <Sheet open={!!task} onOpenChange={open => !open && onClose()}>
      <SheetContent className="w-full !max-w-[900px] sm:!max-w-[900px] p-0 flex flex-col" showCloseButton={false}>
        {loading && (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            加载中...
          </div>
        )}

        {(detail || isLocalTask) && (
          isLocalTask ? (
            <div className="flex flex-col p-6 gap-6">
              <SheetHeader>
                <SheetTitle>{task!.name}</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label>编号</Label>
                  <p className="text-sm font-medium">{task!.code}</p>
                </div>
                <div className="space-y-1.5">
                  <Label>状态</Label>
                  <p className="text-sm font-medium">{task!.status}</p>
                </div>
                <div className="space-y-1.5">
                  <Label>负责人</Label>
                  <p className="text-sm font-medium">{task!.assigneeName || '—'}</p>
                </div>
                <div className="space-y-1.5">
                  <Label>优先级</Label>
                  <p className="text-sm font-medium capitalize">{task!.priority || '—'}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                本地创建的任务，保存到服务器后可查看完整详情
              </p>
            </div>
          ) : (
            <TaskDetailContent
              task={detail!}
              mode="sheet"
              onBack={onClose}
              onOpenPage={handleOpenPage}
              assigneeOptions={assigneeOptions}
              onReload={reload}
            />
          )
        )}

        {!loading && !detail && !isLocalTask && task && (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            无法加载任务详情
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
