/**
 * StatusSelect — 通用状态下拉菜单
 *
 * 替代多按钮模式，统一为带颜色编码的下拉选择。
 * 适用于任何需要状态流转的场景（任务、项目等）。
 *
 * 用法：
 *   <StatusSelect
 *     value={task.status}
 *     options={['待提交', '已暂停']}
 *     tones={{ '待提交': 'orange', '已暂停': 'neutral' }}
 *     onChange={handleStatusChange}
 *   />
 */
import { Select, MenuItem, Chip, Box, type SelectChangeEvent } from '@mui/material'
import { STATUS_TONE_COLORS, type StatusTone } from './toneColors'

export type { StatusTone }
export { STATUS_TONE_COLORS }

const VALUE_NONE = '__none__'

type StatusSelectProps = {
  value: string
  options: string[]
  tones: Record<string, StatusTone>
  onChange: (nextStatus: string) => void
  disabled?: boolean
  /** 当为 true 时，不显示"无操作"占位选项 */
  hideNoop?: boolean
  size?: 'small' | 'medium'
}

export default function StatusSelect({
  value,
  options,
  tones,
  onChange,
  disabled = false,
  hideNoop: _hideNoop = false,
  size = 'small',
}: StatusSelectProps) {
  const currentTone = tones[value] ?? 'neutral'
  const colors = STATUS_TONE_COLORS[currentTone]

  const filtered = options.filter(s => s !== value)

  const handleChange = (e: SelectChangeEvent<string>) => {
    const next = e.target.value
    if (next && next !== VALUE_NONE) {
      onChange(next)
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Select
        value={VALUE_NONE}
        onChange={handleChange}
        disabled={disabled}
        size={size}
        displayEmpty
        renderValue={() => (
          <Chip
            size="small"
            label={value || '未知'}
            sx={{
              backgroundColor: colors.bg,
              color: colors.color,
              fontWeight: 500,
              fontSize: '0.75rem',
              '& .MuiChip-label': { px: 1 },
            }}
          />
        )}
        sx={{
          minWidth: 160,
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '& .MuiSelect-select': { py: 0 },
          '& .MuiSvgIcon-root': { color: colors.color, fontSize: 16 },
        }}
      >
        {filtered.length === 0 && (
          <MenuItem disabled value={VALUE_NONE}>
            <em>无可用操作</em>
          </MenuItem>
        )}
        {filtered.map(status => (
          <MenuItem key={status} value={status}>
            <Chip
              size="small"
              label={status}
              sx={{
                backgroundColor: STATUS_TONE_COLORS[tones[status] ?? 'neutral'].bg,
                color: STATUS_TONE_COLORS[tones[status] ?? 'neutral'].color,
                fontWeight: 400,
                fontSize: '0.8125rem',
                width: '100%',
                justifyContent: 'flex-start',
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}
