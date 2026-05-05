import type { ReactNode } from 'react'

export interface PmCardHeaderProps {
  icon?: ReactNode
  title: ReactNode
  action?: ReactNode
}

export function PmCardHeader({ icon, title, action }: PmCardHeaderProps) {
  return (
    <div className="flex items-center mb-3" style={{ gap: 'var(--pm-gap-md, 12px)' }}>
      {icon && (
        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-[var(--pm-text-white)]">
          {icon}
        </span>
      )}
      <h2 className="text-[var(--pm-font-md,14px)] font-semibold text-[var(--pm-text-white)] flex-1">
        {title}
      </h2>
      {action && <span className="flex-shrink-0">{action}</span>}
    </div>
  )
}
