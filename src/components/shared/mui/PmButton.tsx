import { forwardRef } from 'react'
import { Button as MuiButton, CircularProgress } from '@mui/material'
import type { ButtonProps as MuiButtonProps } from '@mui/material'

export interface PmButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
  size?: 'sm' | 'md'
  loading?: boolean
}

const variantMap: Record<NonNullable<PmButtonProps['variant']>, MuiButtonProps['variant']> = {
  primary: 'contained',
  secondary: 'outlined',
  ghost: 'text',
  danger: 'contained',
  icon: 'text',
}

const sizeStyles: Record<NonNullable<PmButtonProps['size']>, React.CSSProperties> = {
  sm: { height: 28, minWidth: 28, fontSize: 11, padding: '0 10px' },
  md: { height: 32, minWidth: 32, fontSize: 12, padding: '0 12px' },
}

export const PmButton = forwardRef<HTMLButtonElement, PmButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, sx, ...rest }, ref) => {
    const muiVariant = variantMap[variant]
    const color =
      variant === 'danger'
        ? 'error'
        : variant === 'secondary' || variant === 'ghost' || variant === 'icon'
          ? undefined
          : 'primary'

    return (
      <MuiButton
        ref={ref}
        variant={muiVariant}
        color={color}
        disabled={disabled || loading}
        sx={{
          ...sizeStyles[size],
          borderRadius: variant === 'icon' ? '10px' : '14px',
          minWidth: variant === 'icon' ? sizeStyles[size].minWidth : undefined,
          p: variant === 'icon' ? 0 : undefined,
          ...sx,
        }}
        {...rest}
      >
        {loading ? <CircularProgress size={14} color="inherit" sx={{ mr: 0.5 }} /> : null}
        {children}
      </MuiButton>
    )
  }
)

PmButton.displayName = 'PmButton'
