import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import type { DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker'

export type PmDateTimePickerProps = DateTimePickerProps & {
  size?: 'sm' | 'md'
}

const sizeSx: Record<string, Record<string, string>> = {
  sm: {
    '--pm-picker-height': '32px',
    '--pm-picker-font': '12px',
  },
  md: {
    '--pm-picker-height': '36px',
    '--pm-picker-font': '14px',
  },
}

/**
 * PmDateTimePicker — 统一的日期时间选择器
 *
 * 基于 MUI X DateTimePicker，预设暗色玻璃态样式。
 *
 * @example
 * ```tsx
 * <PmDateTimePicker
 *   label="计划开始"
 *   value={dayjs(value)}
 *   onChange={(newVal) => handleChange(newVal?.format('YYYY-MM-DD HH:mm'))}
 * />
 * ```
 */
export const PmDateTimePicker = ({ size = 'md', sx, ...rest }: PmDateTimePickerProps) => {
  return (
    <DateTimePicker
      {...rest}
      sx={{
        ...sizeSx[size],
        '& .MuiOutlinedInput-root': {
          height: 'var(--pm-picker-height)',
          borderRadius: '14px',
          backgroundColor: 'var(--pm-element)',
          fontSize: 'var(--pm-picker-font)',
        },
        '& .MuiInputBase-input': {
          fontSize: 'var(--pm-picker-font)',
          py: 0,
        },
        '& .MuiFormLabel-root': {
          fontSize: 'var(--pm-picker-font)',
        },
        '& .MuiSvgIcon-root': {
          fontSize: 'calc(var(--pm-picker-font) + 4px)',
        },
        ...sx,
      }}
    />
  )
}

PmDateTimePicker.displayName = 'PmDateTimePicker'
