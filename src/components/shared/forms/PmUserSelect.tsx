import { Autocomplete, TextField, Avatar, Box, Typography } from '@mui/material'
import type { AutocompleteRenderOptionState, AutocompleteValue } from '@mui/material'
import { useMemo } from 'react'

/**
 * 用户选择选项
 *
 * 兼容现有数据模型：
 * - TaskAssigneeOption: { id, name, disabled, statusLabel }
 * - PersonnelUser: { id, name, initial, role, avatarTone }
 * - ProjectTeamMember: { id, userId, name, avatar }
 */
export interface UserSelectOption {
  id: string
  name: string
  avatar?: string
  subtitle?: string
  disabled?: boolean
}

export interface PmUserSelectProps {
  options: UserSelectOption[]
  value?: string | string[]
  onChange: (value: string | string[] | null) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  helperText?: string
  fullWidth?: boolean
  multiple?: boolean
  size?: 'sm' | 'md'
}

/** 从姓名提取 1-2 个字符作为头像回退文字 */
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const sizeConfig = {
  sm: { avatar: 22, inputHeight: 32, fontSize: 12, optionPy: 0.5, optionFontSize: 12 },
  md: { avatar: 28, inputHeight: 36, fontSize: 14, optionPy: 0.75, optionFontSize: 13 },
} as const

export const PmUserSelect = ({
  options,
  value,
  onChange,
  label,
  placeholder = '请选择',
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  multiple = false,
  size = 'md',
}: PmUserSelectProps) => {
  const s = sizeConfig[size]

  const selectedOption = useMemo<AutocompleteValue<UserSelectOption, boolean, false, false>>(() => {
    if (multiple) {
      if (!value || !Array.isArray(value)) return [] as never
      return options.filter(opt => value.includes(opt.id)) as never
    }
    if (!value || typeof value !== 'string') return null as never
    return options.find(opt => opt.id === value) ?? null
  }, [options, value, multiple])

  return (
    <Autocomplete
      options={options}
      multiple={multiple}
      disabled={disabled}
      fullWidth={fullWidth}
      value={selectedOption}
      disableCloseOnSelect={multiple}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      getOptionLabel={opt => opt.name}
      onChange={(_, newVal) => {
        if (multiple) {
          onChange((newVal as UserSelectOption[] | null)?.map(v => v.id) ?? [])
        } else {
          onChange((newVal as UserSelectOption | null)?.id ?? null)
        }
      }}
      renderOption={(props, option, _state: AutocompleteRenderOptionState) => {
        const { key, ...rest } = props
        return (
          <Box
            key={key}
            component="li"
            {...rest}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: s.optionPy,
              fontSize: s.optionFontSize,
              opacity: option.disabled ? 0.4 : 1,
              cursor: option.disabled ? 'not-allowed' : 'pointer',
            }}
          >
            {option.avatar ? (
              <Avatar
                src={option.avatar}
                alt={option.name}
                sx={{ width: s.avatar, height: s.avatar, fontSize: Math.round(s.avatar * 0.45) }}
              />
            ) : (
              <Avatar
                sx={{
                  width: s.avatar,
                  height: s.avatar,
                  fontSize: Math.round(s.avatar * 0.45),
                  fontWeight: 600,
                  bgcolor: '#154DD9',
                }}
              >
                {getInitials(option.name)}
              </Avatar>
            )}
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ color: 'var(--pm-text-white)' }}>
                {option.name}
              </Typography>
              {option.subtitle && (
                <Typography variant="caption" noWrap sx={{ color: 'var(--pm-text-40)' }}>
                  {option.subtitle}
                </Typography>
              )}
            </Box>
            {option.disabled && (
              <Typography
                variant="caption"
                sx={{ color: 'var(--pm-text-30)', ml: 'auto', flexShrink: 0 }}
              >
                不可选
              </Typography>
            )}
          </Box>
        )
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          slotProps={{
            input: {
              ...params.slotProps.input,
              sx: {
                height: 'auto',
                minHeight: s.inputHeight,
                borderRadius: '14px',
                fontSize: s.fontSize,
                flexWrap: multiple ? 'wrap' : undefined,
              },
            },
          }}
        />
      )}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'var(--pm-element)',
          borderRadius: '14px',
          minHeight: s.inputHeight,
          py: multiple ? '2px' : 0,
        },
        '& .MuiAutocomplete-popupIndicator': {
          color: 'var(--pm-text-40)',
        },
        '& .MuiAutocomplete-clearIndicator': {
          color: 'var(--pm-text-40)',
        },
        '& .MuiFormLabel-root': {
          fontSize: s.fontSize,
        },
      }}
    />
  )
}

PmUserSelect.displayName = 'PmUserSelect'
