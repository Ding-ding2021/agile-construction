import { forwardRef } from 'react'
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectProps as MuiSelectProps,
} from '@mui/material'

export interface PmSelectProps extends Omit<MuiSelectProps, 'variant'> {
  label?: string
  options: { value: string; label: string }[]
}

export const PmSelect = forwardRef<HTMLDivElement, PmSelectProps>(
  ({ label, options, sx, MenuProps, ...rest }, ref) => {
    return (
      <FormControl fullWidth size="small">
        {label && (
          <InputLabel
            sx={{
              color: 'var(--pm-text-40)',
              '&.Mui-focused': { color: 'var(--pm-primary)' },
              '&.MuiInputLabel-shrink': { color: 'var(--pm-text-40)' },
            }}
          >
            {label}
          </InputLabel>
        )}
        <MuiSelect
          ref={ref}
          label={label}
          sx={{
            backgroundColor: 'var(--pm-input-bg)',
            borderRadius: 'var(--pm-radius-sm, 8px)',
            height: 36,
            fontSize: 14,
            color: 'var(--pm-text-white)',
            '& fieldset': {
              borderColor: 'var(--pm-border)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--pm-border)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--pm-primary)',
            },
            '& .MuiSelect-select': {
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiSvgIcon-root': {
              color: 'var(--pm-text-40)',
            },
            ...sx,
          }}
          MenuProps={{
            ...MenuProps,
            slotProps: {
              ...MenuProps?.slotProps,
              paper: {
                ...MenuProps?.slotProps?.paper,
                sx: {
                  backgroundColor: '#0F1F4A',
                  border: '1px solid var(--pm-border)',
                  borderRadius: 'var(--pm-radius-sm, 8px)',
                  mt: 0.5,
                  '& .MuiMenuItem-root': {
                    color: 'var(--pm-text-70)',
                    fontSize: 13,
                    minHeight: 36,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: 'var(--pm-element-hover)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'var(--pm-primary-15)',
                      color: 'var(--pm-text-white)',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'var(--pm-primary-15)',
                    },
                  },
                },
              },
            },
          }}
          {...rest}
        >
          {options.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    )
  }
)

PmSelect.displayName = 'PmSelect'
