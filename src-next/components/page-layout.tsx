import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className={cn('p-4 md:p-8 space-y-4 md:space-y-8', className)}>{children}</div>
      </div>
    </div>
  )
}
