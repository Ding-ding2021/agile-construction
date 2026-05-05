import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface PmCardProps {
  children: ReactNode
  className?: string
}

export function PmCard({ children, className }: PmCardProps) {
  return (
    <Card
      className={cn(
        'rounded-[var(--pm-radius-xl,16px)] p-[var(--pm-spacing-lg,16px)] shadow-[var(--pm-shadow-md)]',
        className
      )}
    >
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  )
}
