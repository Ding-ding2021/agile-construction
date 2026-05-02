import { Autocomplete, TextField, Box, Typography, Avatar } from '@mui/material'

export interface PersonnelOption {
  id: string
  name: string
  avatar?: string
  statusLabel?: string
  disabled?: boolean
}

export interface PmPersonnelSelectProps {
  label?: string
  value: string
  options: PersonnelOption[]
  disabled?: boolean
  onChange: (value: string) => void
}

export function PmPersonnelSelect({
  label,
  value,
  options,
  disabled,
  onChange,
}: PmPersonnelSelectProps) {
  const hasOptions = options.length > 0
  const selectedOption = options.find(o => o.name === value)

  if (!hasOptions) {
    return (
      <TextField
        label={label}
        value={value}
        variant="outlined"
        size="small"
        disabled
        slotProps={{ input: { readOnly: true } }}
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--pm-input-bg)',
            borderRadius: 'var(--pm-radius-sm, 8px)',
            height: 36,
            '& fieldset': { borderColor: 'var(--pm-border)' },
          },
          '& .MuiInputBase-input': {
            color: 'var(--pm-text-white)',
            fontSize: 14,
            padding: '0 12px',
          },
          '& .MuiInputLabel-root': {
            color: 'var(--pm-text-40)',
            fontSize: 14,
            '&.MuiInputLabel-shrink': { color: 'var(--pm-text-40)', fontSize: 12 },
          },
        }}
      />
    )
  }

  return (
    <Autocomplete
      value={selectedOption ?? undefined}
      onChange={(_e, newVal) => onChange(newVal?.name ?? '')}
      options={options}
      disabled={disabled}
      getOptionLabel={opt => opt.name}
      isOptionEqualToValue={(opt, val) => opt.name === val.name}
      disableClearable
      renderOption={(optionProps, option) => (
        <li
          {...optionProps}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 16px',
            minHeight: 44,
            color: option.disabled ? 'var(--pm-text-30)' : 'var(--pm-text-70)',
            fontSize: 13,
            cursor: option.disabled ? 'not-allowed' : 'pointer',
          }}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: 12,
              fontWeight: 700,
              bgcolor: option.disabled ? 'var(--pm-text-30)' : 'var(--pm-primary)',
              flexShrink: 0,
            }}
          >
            {option.name.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: option.disabled ? 'var(--pm-text-70)' : 'var(--pm-text-white)',
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {option.name}
            </Typography>
            {option.statusLabel && (
              <Typography variant="caption" sx={{ color: 'var(--pm-text-40)', fontSize: 11 }}>
                {option.statusLabel}
              </Typography>
            )}
          </Box>
        </li>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          placeholder="选择负责人"
          variant="outlined"
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps?.input,
              startAdornment: value ? (
                <Avatar
                  sx={{
                    width: 22,
                    height: 22,
                    fontSize: 10,
                    fontWeight: 700,
                    bgcolor: 'var(--pm-primary)',
                    ml: 0.5,
                    mr: 0.5,
                  }}
                >
                  {value.charAt(0)}
                </Avatar>
              ) : undefined,
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'var(--pm-input-bg)',
              borderRadius: 'var(--pm-radius-sm, 8px)',
              height: 36,
              '& fieldset': { borderColor: 'var(--pm-border)' },
              '&:hover fieldset': { borderColor: 'var(--pm-border)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--pm-primary)' },
            },
            '& .MuiInputBase-input': {
              color: 'var(--pm-text-white)',
              fontSize: 14,
              padding: '0 12px !important',
            },
            '& .MuiInputLabel-root': {
              color: 'var(--pm-text-40)',
              fontSize: 14,
              '&.MuiInputLabel-shrink': { color: 'var(--pm-text-40)', fontSize: 12 },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: 'var(--pm-primary)' },
            '& .MuiSvgIcon-root': { color: 'var(--pm-text-40)' },
          }}
        />
      )}
    />
  )
}
