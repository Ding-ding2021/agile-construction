import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Cancel from '@mui/icons-material/Cancel'

export interface ReviewDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (result: 'pass' | 'reject', comment: string) => void
  isReviewing?: boolean
}

export default function ReviewDialog({ open, onClose, onSubmit, isReviewing }: ReviewDialogProps) {
  const [result, setResult] = useState<'pass' | 'reject'>('pass')
  const [comment, setComment] = useState('')

  const handleClose = () => {
    setResult('pass')
    setComment('')
    onClose()
  }

  const handleSubmit = () => {
    onSubmit(result, comment)
    setComment('')
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>审核</DialogTitle>
      <DialogContent>
        {/* 通过/驳回切换 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button
            variant={result === 'pass' ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            startIcon={<CheckCircle />}
            onClick={() => setResult('pass')}
          >
            验收通过
          </Button>
          <Button
            variant={result === 'reject' ? 'contained' : 'outlined'}
            color="error"
            size="small"
            startIcon={<Cancel />}
            onClick={() => setResult('reject')}
          >
            驳回整改
          </Button>
        </Box>
        <TextField
          label={result === 'pass' ? '审核意见（选填）' : '驳回原因（必填）'}
          value={comment}
          onChange={e => setComment(e.target.value)}
          fullWidth
          multiline
          rows={3}
          size="small"
          placeholder={result === 'pass' ? '可选填写审核意见...' : '请填写驳回原因...'}
          error={result === 'reject' && !comment.trim()}
          helperText={result === 'reject' && !comment.trim() ? '驳回必须填写原因' : ''}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button
          variant="contained"
          color={result === 'pass' ? 'primary' : 'error'}
          disabled={(result === 'reject' && !comment.trim()) || !!isReviewing}
          onClick={handleSubmit}
        >
          确认{result === 'pass' ? '通过' : '驳回'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
