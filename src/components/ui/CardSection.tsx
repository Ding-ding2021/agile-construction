import { Paper } from '@mui/material'
import type { ReactNode } from 'react'

export interface CardSectionProps {
  children: ReactNode
  sx?: Record<string, unknown>
}

export default function CardSection({ children, sx }: CardSectionProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        bgcolor: 'var(--pm-card)',
        borderColor: 'var(--pm-border)',
        borderRadius: 'var(--pm-radius-card)',
        ...sx,
      }}
    >
      {children}
    </Paper>
  )
}
