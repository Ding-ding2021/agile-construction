import { Autocomplete, TextField, Box } from '@mui/material'

export interface PmTagOption {
  id: string; label: string; disabled?: boolean
}

export interface PmTagSelectProps {
  options: PmTagOption[]; value?: string[]; onChange: (value: string[]) => void
  label?: string; placeholder?: string; disabled?: boolean; error?: boolean
  helperText?: string; fullWidth?: boolean; size?: 'sm' | 'md'
}

const s = { sm: { h: 32, f: 12 }, md: { h: 36, f: 14 } } as const

export const PmTagSelect = ({
  options, value = [], onChange, label, placeholder = '请选择',
  disabled = false, error = false, helperText, fullWidth = true, size = 'md',
}: PmTagSelectProps) => {
  const cfg = s[size]
  const sel = options.filter(o => value.includes(o.id))
  return (
    <Autocomplete multiple options={options} value={sel} disabled={disabled}
      fullWidth={fullWidth} disableCloseOnSelect
      isOptionEqualToValue={(o, v) => o.id === v.id}
      getOptionLabel={o => o.label}
      onChange={(_, n) => onChange(n.map(v => v.id))}
      renderOption={(p, o) => { const { key, ...r } = p; return <Box key={key} component='li' {...r} sx={{ px: 1.5, py: 0.5, fontSize: cfg.f }}>{o.label}</Box> }}
      renderInput={p => <TextField {...p} label={label} placeholder={placeholder} error={error} helperText={helperText}
        slotProps={{ input: { ...p.slotProps.input, sx: { minHeight: cfg.h, borderRadius: '14px', fontSize: cfg.f, flexWrap: 'wrap', py: '2px' } } }} />}
      sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'var(--pm-element)', borderRadius: '14px', minHeight: cfg.h },
        '& .MuiAutocomplete-popupIndicator': { color: 'var(--pm-text-40)' },
        '& .MuiAutocomplete-clearIndicator': { color: 'var(--pm-text-40)' },
        '& .MuiFormLabel-root': { fontSize: cfg.f } }}
    />
  )
}
PmTagSelect.displayName = 'PmTagSelect'
