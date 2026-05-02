import { forwardRef, useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import type { TextFieldProps } from '@mui/material'

export interface PmInputProps extends Omit<TextFieldProps, 'variant'> {
  clearable?: boolean
}

export const PmInput = forwardRef<HTMLDivElement, PmInputProps>(
  ({ clearable, value: controlledValue, onChange, sx, type, ...rest }, ref) => {
    const [internalValue, setInternalValue] = useState('')
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue
    const isDateInput = type === 'date' || type === 'datetime-local'

    const handleClear = () => {
      if (!isControlled) setInternalValue('')
      onChange?.({
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value)
      if (onChange) onChange(e)
    }

    return (
      <TextField
        ref={ref}
        variant="outlined"
        type={type}
        value={value}
        onChange={handleChange}
        slotProps={{
          input: {
            ...(clearable && value && !isDateInput
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClear}
                        edge="end"
                        sx={{ color: 'var(--pm-text-40)' }}
                      >
                        ✕
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : {}),
          },
          inputLabel: { shrink: isDateInput || undefined },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--pm-input-bg)',
            borderRadius: 'var(--pm-radius-sm, 8px)',
            height: isDateInput ? 36 : 'auto',
            '& fieldset': {
              borderColor: 'var(--pm-border)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--pm-border)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--pm-primary)',
            },
          },
          '& .MuiInputBase-input': {
            color: 'var(--pm-text-white)',
            fontSize: 14,
            padding: isDateInput ? '0 12px' : '8.5px 12px',
            '&::-webkit-calendar-picker-indicator': {
              filter: 'invert(0.6)',
              cursor: 'pointer',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'var(--pm-text-40)',
            fontSize: 14,
            '&.MuiInputLabel-shrink': {
              color: 'var(--pm-text-40)',
              fontSize: 12,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'var(--pm-primary)',
          },
          ...sx,
        }}
        {...rest}
      />
    )
  }
)

PmInput.displayName = 'PmInput'
