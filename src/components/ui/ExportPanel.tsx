import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material'

export interface ExportField {
  key: string
  label: string
}

export interface ExportConfig {
  fields: string[]
  format: 'csv' | 'json'
  scope: 'all' | 'filtered'
}

export interface ExportPanelProps {
  open: boolean
  onClose: () => void
  onExport: (config: ExportConfig) => void
  availableFields: ExportField[]
  filteredCount?: number
  totalCount?: number
}

const DEFAULT_FIELDS: ExportField[] = [
  { key: 'code', label: '编号' },
  { key: 'name', label: '任务名称' },
  { key: 'status', label: '状态' },
  { key: 'assigneeName', label: '负责人' },
  { key: 'plannedStartAt', label: '计划开始' },
  { key: 'plannedEndAt', label: '计划结束' },
  { key: 'actualStartAt', label: '实际开始' },
  { key: 'actualEndAt', label: '实际结束' },
  { key: 'progress', label: '进度' },
  { key: 'slaStatus', label: 'SLA 状态' },
  { key: 'riskLevel', label: '风险等级' },
  { key: 'tags', label: '标签' },
]

export default function ExportPanel({
  open,
  onClose,
  onExport,
  availableFields = DEFAULT_FIELDS,
  filteredCount = 0,
  totalCount = 0,
}: ExportPanelProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(availableFields.map(f => f.key)))
  const [format, setFormat] = useState<'csv' | 'json'>('csv')
  const [scope, setScope] = useState<'all' | 'filtered'>('filtered')

  const toggleField = (key: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>导出任务</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 3 }}>
          {/* 字段选择 */}
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--pm-text-40)',
                mb: 1.5,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              导出字段
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
              {availableFields.map(f => (
                <Box
                  key={f.key}
                  onClick={() => toggleField(f.key)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 0.75,
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'var(--pm-element-hover)' },
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={selected.has(f.key)}
                    sx={{ p: 0, '&.Mui-checked': { color: 'var(--pm-primary)' } }}
                  />
                  <Typography sx={{ fontSize: 13, color: 'var(--pm-text-white)' }}>
                    {f.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* 格式 + 范围 */}
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--pm-text-40)',
                mb: 1.5,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              格式
            </Typography>
            <RadioGroup value={format} onChange={e => setFormat(e.target.value as 'csv' | 'json')}>
              <FormControlLabel
                value="csv"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: 13 }}>CSV</Typography>}
              />
              <FormControlLabel
                value="json"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: 13 }}>JSON</Typography>}
              />
            </RadioGroup>

            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--pm-text-40)',
                mb: 1.5,
                mt: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              范围
            </Typography>
            <RadioGroup
              value={scope}
              onChange={e => setScope(e.target.value as 'all' | 'filtered')}
            >
              <FormControlLabel
                value="filtered"
                control={<Radio size="small" />}
                label={
                  <Typography sx={{ fontSize: 13 }}>当前筛选结果（{filteredCount} 条）</Typography>
                }
              />
              <FormControlLabel
                value="all"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: 13 }}>全部任务（{totalCount} 条）</Typography>}
              />
            </RadioGroup>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => onExport({ fields: Array.from(selected), format, scope })}
            >
              导出
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
      </DialogActions>
    </Dialog>
  )
}
