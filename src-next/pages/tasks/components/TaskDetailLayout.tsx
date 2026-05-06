import type { ReactNode } from 'react'

interface TaskDetailLayoutProps {
  header: ReactNode
  leftPanel: ReactNode
  rightPanel?: ReactNode
}

export default function TaskDetailLayout({ header, leftPanel, rightPanel }: TaskDetailLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {header}
      <div className="flex flex-1 gap-0 overflow-hidden">
        <div className="flex-1 min-w-0 overflow-auto border-r border-border/50">
          <div className="p-5 space-y-6 max-w-4xl">
            {leftPanel}
          </div>
        </div>
        {rightPanel && (
          <div className="w-80 shrink-0 overflow-auto">
            <div className="p-4 space-y-4 sticky top-0">
              {rightPanel}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
