import { Typography } from '@mui/material'
import type { ReactNode } from 'react'

export interface SectionTitleProps {
  children: ReactNode
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <Typography
      sx={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--pm-blue-light)',
        mb: 3,
      }}
    >
      {children}
    </Typography>
  )
}
