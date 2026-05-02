import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import CalendarMonth from '@mui/icons-material/CalendarMonth'

const DARK_PAPER_SX = {
  backgroundColor: '#0F1F4A',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 'var(--pm-radius-sm, 8px)',
  color: 'var(--pm-text-white)',
  '& .MuiPickersDay-root': {
    color: 'var(--pm-text-70)',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: 'var(--pm-element-hover)',
    },
    '&.Mui-selected': {
      backgroundColor: 'var(--pm-primary)',
      color: '#fff',
      '&:hover': {
        backgroundColor: 'var(--pm-primary-light)',
      },
    },
    '&.MuiPickersDay-today': {
      border: '1px solid var(--pm-primary)',
    },
  },
  '& .MuiDayCalendar-weekDayLabel': {
    color: 'var(--pm-text-40)',
    fontSize: 12,
    fontWeight: 500,
  },
  '& .MuiPickersCalendarHeader-root': {
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    '& .MuiPickersCalendarHeader-label': {
      color: 'var(--pm-text-white)',
      fontSize: 14,
      fontWeight: 600,
    },
    '& .MuiPickersArrowSwitcher-button': {
      color: 'var(--pm-text-40)',
    },
  },
  '& .MuiYearCalendar-root': {
    '& .MuiPickersYear-yearButton': {
      color: 'var(--pm-text-70)',
      '&.Mui-selected': {
        backgroundColor: 'var(--pm-primary)',
        color: '#fff',
      },
      '&:hover': {
        backgroundColor: 'var(--pm-element-hover)',
      },
    },
  },
  '& .MuiMonthCalendar-root': {
    '& .MuiPickersMonth-monthButton': {
      color: 'var(--pm-text-70)',
      '&.Mui-selected': {
        backgroundColor: 'var(--pm-primary)',
        color: '#fff',
      },
      '&:hover': {
        backgroundColor: 'var(--pm-element-hover)',
      },
    },
  },
}

export interface PmDatePickerProps extends DatePickerProps {
  readOnly?: boolean
}

export function PmDatePicker({ readOnly, sx, ...rest }: PmDatePickerProps) {
  return (
    <DatePicker
      {...rest}
      readOnly={readOnly}
      slots={{
        openPickerIcon: CalendarMonth,
      }}
      slotProps={{
        textField: {
          variant: 'outlined',
          size: 'small',
          sx: {
            width: '100%',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'var(--pm-input-bg)',
              borderRadius: 'var(--pm-radius-sm, 8px)',
              height: 36,
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
              padding: '0 12px',
              cursor: readOnly ? 'default' : 'pointer',
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
            '& .MuiSvgIcon-root': {
              color: 'var(--pm-text-40)',
              fontSize: 20,
            },
          },
        },
        popper: {
          sx: {
            '& .MuiPaper-root': DARK_PAPER_SX,
          },
        },
        dialog: {
          sx: {
            '& .MuiPickersLayout-root': DARK_PAPER_SX,
          },
        },
        openPickerButton: {
          sx: {
            color: readOnly ? 'var(--pm-text-30)' : 'var(--pm-text-40)',
          },
        },
      }}
    />
  )
}
