import { Button } from '@/components/ui/button'
import type { ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PmButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
type PmButtonSize = 'xs' | 'sm' | 'md' | 'lg'

interface PmButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: PmButtonVariant
  size?: PmButtonSize
  loading?: boolean
}

const sizeClasses: Record<PmButtonSize, string> = {
  xs: 'h-6 px-2 text-[11px]',
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-8 px-3 text-sm',
  lg: 'h-9 px-4 text-sm',
}

function PmButton({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className,
  children,
  style,
  ...rest
}: PmButtonProps) {
  const baseStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: 'var(--pm-text-white)',
    border: '1px solid transparent',
    ...(variant === 'primary' && {
      backgroundColor: 'var(--pm-primary)',
      color: '#fff',
      boxShadow: 'var(--pm-shadow-primary)',
    }),
    ...(variant === 'secondary' && {
      backgroundColor: 'var(--pm-blue-15)',
      color: '#fff',
      border: '1px solid var(--pm-blue-25)',
    }),
    ...(variant === 'ghost' && {
      color: 'var(--pm-text-70)',
    }),
    ...(variant === 'danger' && {
      backgroundColor: 'var(--pm-red)',
      color: '#fff',
    }),
    ...(variant === 'icon' && {
      color: 'var(--pm-text-70)',
      borderRadius: 'var(--pm-radius-sm, 8px)',
      border: 'none',
    }),
    ...style,
  }

  return (
    <Button
      variant="ghost"
      disabled={disabled || loading}
      className={cn(
        'font-medium rounded-[var(--pm-radius-md,10px)] transition-all duration-200',
        sizeClasses[size],
        variant === 'icon' && 'w-8 p-0 min-w-0',
        variant === 'secondary' && 'hover:bg-[var(--pm-blue-25)]',
        variant === 'primary' &&
          'hover:bg-[var(--pm-primary-light)] active:bg-[var(--pm-primary-dark)]',
        variant === 'danger' && 'hover:bg-[var(--pm-red-light)]',
        variant === 'ghost' && 'hover:bg-[var(--pm-element-hover)]',
        className
      )}
      style={baseStyle}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </Button>
  )
}

PmButton.displayName = 'PmButton'

export { PmButton }
export type { PmButtonProps, PmButtonVariant, PmButtonSize }
