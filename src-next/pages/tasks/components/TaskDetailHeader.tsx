import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X, ExternalLink, Heart, Bookmark, MessageSquare, MoreHorizontal } from 'lucide-react'
import type { TaskDetail } from '@/types/task'

interface TaskDetailHeaderProps {
  task: TaskDetail
  mode: 'sheet' | 'page'
  onBack: () => void
  onPrev?: () => void
  onNext?: () => void
  onOpenPage?: () => void
}

export default function TaskDetailHeader({ task, mode, onBack, onPrev, onNext, onOpenPage }: TaskDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 shrink-0">
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={onPrev}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={onNext}>
          <ChevronRight className="size-4" />
        </Button>
        <h2 className="text-sm font-semibold ml-1">任务详情</h2>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Heart className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bookmark className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MessageSquare className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreHorizontal className="size-4" />
        </Button>
        {mode === 'sheet' && onOpenPage && (
          <Button variant="ghost" size="icon" onClick={onOpenPage} className="text-muted-foreground">
            <ExternalLink className="size-4" />
          </Button>
        )}
        <div className="w-px h-5 bg-border/50 mx-1" />
        <Button variant="ghost" size="icon" onClick={onBack} className="text-muted-foreground">
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
