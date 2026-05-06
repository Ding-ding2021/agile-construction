import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface TaskProgressProps {
  progress: number
  readonly?: boolean
  onChange?: (value: number) => void
}

export default function TaskProgress({ progress, readonly, onChange }: TaskProgressProps) {
  const [draft, setDraft] = useState(progress)

  // Sync with external changes
  const display = readonly ? progress : draft

  return (
    <Card className="p-4 space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">进度</h4>
      <div className="flex items-center gap-3">
        <Progress value={display} className="flex-1 h-2" />
        {readonly ? (
          <span className="text-sm font-semibold tabular-nums">{progress}%</span>
        ) : (
          <input
            type="number"
            min={0}
            max={100}
            value={draft}
            onChange={e => {
              const v = Math.min(100, Math.max(0, Number(e.target.value) || 0))
              setDraft(v)
              onChange?.(v)
            }}
            className="h-7 w-14 rounded-md border border-input bg-transparent px-2 text-xs text-right tabular-nums focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
          />
        )}
      </div>
    </Card>
  )
}
