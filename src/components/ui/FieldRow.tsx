import { Box, Typography } from '@mui/material'

export interface FieldRowProps {
  label: string
  value: string
  labelSx?: Record<string, unknown>
  valueSx?: Record<string, unknown>
}

export default function FieldRow({ label, value, labelSx, valueSx }: FieldRowProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography sx={{ fontSize: 12, color: 'var(--pm-text-70)', ...labelSx }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, color: 'var(--pm-text-white)', fontWeight: 500, ...valueSx }}>
        {value}
      </Typography>
    </Box>
  )
}
