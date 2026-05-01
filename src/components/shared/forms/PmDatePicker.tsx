import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker'

export type PmDatePickerProps = DatePickerProps & {
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
 * PmDatePicker — 统一的日期选择器
 *
 * 基于 MUI X DatePicker，预设暗色玻璃态样式，与 PmInput 视觉一致。
 * 直接替换现有 `<input type="date">` / `<TextField type="date">`。
 *
 * @example
 * ```tsx
 * import { PmDatePicker } from '@/components/shared/forms'
 * import dayjs from 'dayjs'
 *
 * <PmDatePicker
 *   label="计划开始"
 *   value={dayjs(plannedStartAt)}
 *   onChange={(newVal) => handleChange(newVal?.format('YYYY-MM-DD'))}
 * />
 * ```
 */
export const PmDatePicker = ({ size = 'md', sx, ...rest }: PmDatePickerProps) => {
  return (
    <DatePicker
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
        '& .MuiFormHelperText-root': {
          fontSize: '11px',
        },
        ...sx,
      }}
    />
  )
}

PmDatePicker.displayName = 'PmDatePicker'
