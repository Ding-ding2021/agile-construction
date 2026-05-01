import { useState, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material'
import CloudUpload from '@mui/icons-material/CloudUpload'

export interface ColumnMapping {
  sourceColumn: string
  targetField: string
}

export interface ImportDialogProps {
  open: boolean
  onClose: () => void
  onImport: (data: Record<string, string>[], mapping: ColumnMapping[]) => void
}

const TARGET_FIELDS = [
  { value: 'name', label: '任务名称' },
  { value: 'code', label: '任务编号' },
  { value: 'assigneeName', label: '负责人' },
  { value: 'plannedStartAt', label: '计划开始' },
  { value: 'plannedEndAt', label: '计划结束' },
  { value: 'priority', label: '优先级' },
  { value: 'taskType', label: '任务类型' },
]

const IMPORT_FIELDS = [
  { key: 'name', label: '任务名称', defaultMapping: 'name' },
  { key: 'assignee', label: '负责人', defaultMapping: 'assigneeName' },
  { key: 'deadline', label: '截止日期', defaultMapping: 'plannedEndAt' },
  { key: 'cost_center', label: '成本中心', defaultMapping: '' },
]

export default function ImportDialog({ open, onClose, onImport }: ImportDialogProps) {
  const [fileName, setFileName] = useState('')
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(Boolean)
      if (lines.length < 2) return
      const headers = lines[0].split(',').map(h => h.trim())
      const rows = lines.slice(1, 6).map(line => {
        const vals = line.split(',').map(v => v.trim())
        const row: Record<string, string> = {}
        headers.forEach((h, i) => {
          row[h] = vals[i] ?? ''
        })
        return row
      })
      setPreviewRows(rows)
      // 默认映射：headers 中能找到的
      const autoMapping: Record<string, string> = {}
      const knownFieldByLabel: Record<string, string> = {
        任务名称: 'name',
        task_name: 'name',
        name: 'name',
        负责人: 'assigneeName',
        assignee: 'assigneeName',
        截止日期: 'plannedEndAt',
        deadline: 'plannedEndAt',
        due_date: 'plannedEndAt',
        计划开始: 'plannedStartAt',
        start_date: 'plannedStartAt',
        任务编号: 'code',
        code: 'code',
      }
      headers.forEach(h => {
        autoMapping[h] = knownFieldByLabel[h] || knownFieldByLabel[h.toLowerCase()] || ''
      })
      setMapping(autoMapping)
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const totalRows = previewRows.length * 7 // 模拟总数

  const handleImport = () => {
    const mappings: ColumnMapping[] = IMPORT_FIELDS.filter(f => mapping[f.key]).map(f => ({
      sourceColumn: f.key,
      targetField: mapping[f.key],
    }))
    onImport(previewRows, mappings)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>导入任务</DialogTitle>
      <DialogContent>
        {!fileName ? (
          <Box
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: '2px dashed var(--pm-border)',
              borderRadius: 'var(--pm-radius-card)',
              p: 5,
              textAlign: 'center',
              cursor: 'pointer',
              mb: 2,
              '&:hover': { borderColor: 'rgba(43,127,255,0.3)' },
            }}
          >
            <CloudUpload sx={{ fontSize: 40, color: 'var(--pm-text-40)', mb: 1 }} />
            <Typography sx={{ fontSize: 13, color: 'var(--pm-text-70)' }}>
              拖拽文件到此处，或点击选择
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'var(--pm-text-40)', mt: 0.5 }}>
              支持 CSV、Excel (.xlsx)，最大 10MB
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              hidden
              onChange={e => handleFile(e.target.files?.[0])}
            />
          </Box>
        ) : (
          <>
            <Typography sx={{ fontSize: 13, color: 'var(--pm-text-white)', mb: 2 }}>
              已选择: {fileName}
            </Typography>
            {/* 列映射表 */}
            <Box sx={{ width: '100%', fontSize: 12, mb: 2 }}>
              <Box sx={{ display: 'flex', py: 0.75, color: 'var(--pm-text-40)', fontWeight: 600 }}>
                <Box sx={{ flex: 1 }}>文件列</Box>
                <Box sx={{ width: 60, textAlign: 'center' }} />
                <Box sx={{ flex: 1 }}>系统字段</Box>
              </Box>
              {IMPORT_FIELDS.map(f => (
                <Box
                  key={f.key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 0.75,
                    borderTop: '1px solid var(--pm-border-light)',
                  }}
                >
                  <Box sx={{ flex: 1, color: 'var(--pm-text-white)' }}>{f.label}</Box>
                  <Box sx={{ width: 60, textAlign: 'center', color: 'var(--pm-text-40)' }}>→</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      component="span"
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.25,
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 500,
                        bgcolor: mapping[f.key] ? 'var(--pm-green-15)' : 'var(--pm-border)',
                        color: mapping[f.key] ? 'var(--pm-green)' : 'var(--pm-text-40)',
                      }}
                    >
                      {mapping[f.key]
                        ? TARGET_FIELDS.find(t => t.value === mapping[f.key])?.label ||
                          mapping[f.key]
                        : '不导入'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setFileName('')
            setMapping({})
            setPreviewRows([])
          }}
        >
          取消
        </Button>
        <Button variant="contained" disabled={!fileName} onClick={handleImport}>
          导入{totalRows > 0 ? ` ${totalRows} 条任务` : ''}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
