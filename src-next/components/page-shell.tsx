import type { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className={`p-6 space-y-4 ${className ?? ''}`}>{children}</div>
      </div>
    </div>
  )
}
