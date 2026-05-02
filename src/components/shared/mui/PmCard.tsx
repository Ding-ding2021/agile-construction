import { Paper } from '@mui/material'
import type { PaperProps } from '@mui/material'
import type { ReactNode } from 'react'

export interface PmCardProps extends Omit<PaperProps, 'variant'> {
  children: ReactNode
}

export function PmCard({ children, sx, ...rest }: PmCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        backgroundColor: 'var(--pm-card)',
        borderColor: 'var(--pm-border)',
        borderRadius: 'var(--pm-radius-xl)',
        padding: 'var(--pm-spacing-lg)',
        boxShadow: 'var(--pm-shadow-md)',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Paper>
  )
}
