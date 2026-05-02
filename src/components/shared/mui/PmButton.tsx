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

    const variantSx: Record<string, object> = {
      primary: {
        backgroundColor: 'var(--pm-primary)',
        color: '#fff',
        boxShadow: 'var(--pm-shadow-primary)',
        '&:hover': {
          backgroundColor: 'var(--pm-primary-light)',
          boxShadow: 'var(--pm-shadow-primary)',
        },
        '&:active': {
          backgroundColor: 'var(--pm-primary-dark)',
        },
      },
      secondary: {
        backgroundColor: 'rgba(22, 139, 217, 0.12)',
        color: '#9dccff',
        border: '1px solid rgba(22, 139, 217, 0.4)',
        '&:hover': {
          backgroundColor: 'rgba(22, 139, 217, 0.2)',
          borderColor: 'rgba(22, 139, 217, 0.6)',
        },
      },
      ghost: {
        color: 'var(--pm-text-70)',
        '&:hover': {
          backgroundColor: 'var(--pm-element-hover)',
        },
      },
      danger: {
        backgroundColor: 'var(--pm-red)',
        color: '#fff',
        '&:hover': {
          backgroundColor: 'var(--pm-red-light)',
        },
      },
      icon: {
        minWidth: sizeStyles[size].minWidth,
        width: sizeStyles[size].minWidth,
        height: sizeStyles[size].minWidth,
        padding: 0,
        borderRadius: 'var(--pm-radius-sm, 8px)',
        color: 'var(--pm-text-70)',
        '&:hover': {
          backgroundColor: 'var(--pm-element-hover)',
        },
      },
    }

    return (
      <MuiButton
        ref={ref}
        variant={muiVariant}
        color={color}
        disabled={disabled || loading}
        sx={{
          ...sizeStyles[size],
          borderRadius:
            variant === 'icon' ? 'var(--pm-radius-sm, 8px)' : 'var(--pm-radius-md, 10px)',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'all 0.2s ease',
          ...variantSx[variant],
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
