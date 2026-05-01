import { Chip } from '@mui/material'
import type { StatusTone } from './toneColors'

export interface StatusChipProps {
  label: string
  tone: StatusTone
  size?: 'small' | 'medium'
  className?: string
}

const TONE_STYLES: Record<StatusTone, { bg: string; color: string }> = {
  green: { bg: 'var(--pm-green-15)', color: 'var(--pm-green)' },
  blue: { bg: 'var(--pm-blue-15)', color: 'var(--pm-blue-light)' },
  orange: { bg: 'var(--pm-orange-15)', color: 'var(--pm-orange-light)' },
  red: { bg: 'var(--pm-red-15)', color: 'var(--pm-red)' },
  neutral: { bg: 'var(--pm-border)', color: 'var(--pm-text-70)' },
}

export default function StatusChip({ label, tone, size = 'small', className }: StatusChipProps) {
  const colors = TONE_STYLES[tone] ?? TONE_STYLES.neutral
  return (
    <Chip
      label={label}
      size={size}
      className={className}
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.8125rem',
        height: size === 'small' ? 28 : 32,
      }}
    />
  )
}
