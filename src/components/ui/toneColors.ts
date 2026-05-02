export type StatusTone = 'blue' | 'green' | 'orange' | 'red' | 'neutral'

export const STATUS_TONE_COLORS: Record<StatusTone, { bg: string; color: string }> = {
  green: { bg: 'var(--pm-green-15, rgba(22,217,36,0.15))', color: 'var(--pm-green, #16d924)' },
  blue: { bg: 'var(--pm-blue-15, rgba(22,139,217,0.15))', color: 'var(--pm-blue-light, #45a9e8)' },
  orange: {
    bg: 'var(--pm-orange-15, rgba(254,154,0,0.15))',
    color: 'var(--pm-orange-light, #ffb900)',
  },
  red: { bg: 'var(--pm-red-15, rgba(217,22,94,0.15))', color: 'var(--pm-red, #d9165e)' },
  neutral: {
    bg: 'var(--pm-border, rgba(255,255,255,0.08))',
    color: 'var(--pm-text-70, rgba(255,255,255,0.70))',
  },
}
