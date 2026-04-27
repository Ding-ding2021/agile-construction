import { forwardRef, useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import type { TextFieldProps } from '@mui/material'

export interface PmInputProps extends Omit<TextFieldProps, 'variant'> {
  clearable?: boolean
}

export const PmInput = forwardRef<HTMLDivElement, PmInputProps>(
  ({ clearable, value: controlledValue, onChange, ...rest }, ref) => {
    const [internalValue, setInternalValue] = useState('')
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

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
        value={value}
        onChange={handleChange}
        slotProps={{
          input: {
            ...(clearable && value
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
        }}
        {...rest}
      />
    )
  }
)

PmInput.displayName = 'PmInput'
