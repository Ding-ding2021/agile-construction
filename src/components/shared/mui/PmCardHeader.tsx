import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export interface PmCardHeaderProps {
  icon?: ReactNode
  title: ReactNode
  action?: ReactNode
}

export function PmCardHeader({ icon, title, action }: PmCardHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--pm-gap-md)',
        mb: 'var(--pm-spacing-md)',
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'var(--pm-text-white)',
          }}
        >
          {icon}
        </Box>
      )}
      <Typography
        component="h2"
        sx={{
          fontSize: 'var(--pm-font-md)',
          fontWeight: 600,
          color: 'var(--pm-text-white)',
          flex: 1,
        }}
      >
        {title}
      </Typography>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  )
}
