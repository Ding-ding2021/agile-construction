export type StatusTone = 'blue' | 'green' | 'orange' | 'red' | 'neutral'

export const STATUS_TONE_COLORS: Record<StatusTone, { bg: string; color: string }> = {
  green: { bg: 'var(--pm-green-15, rgba(0,188,125,0.15))', color: 'var(--pm-green, #00bc7d)' },
  blue: { bg: 'var(--pm-blue-15, rgba(43,127,255,0.15))', color: 'var(--pm-blue-light, #51a2ff)' },
  orange: {
    bg: 'var(--pm-orange-15, rgba(254,154,0,0.15))',
    color: 'var(--pm-orange-light, #ffb900)',
  },
  red: { bg: 'var(--pm-red-15, rgba(255,77,79,0.15))', color: 'var(--pm-red, #FF4D4F)' },
  neutral: {
    bg: 'var(--pm-border, rgba(255,255,255,0.08))',
    color: 'var(--pm-text-70, rgba(255,255,255,0.70))',
  },
}
