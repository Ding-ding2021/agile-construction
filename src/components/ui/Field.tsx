import { Box, Typography } from '@mui/material'

export interface FieldProps {
  label: string
  value: string
}

export default function Field({ label, value }: FieldProps) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--pm-text-40)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: 14, color: 'var(--pm-text-white)' }}>{value}</Typography>
    </Box>
  )
}
