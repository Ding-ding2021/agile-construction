import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

export interface SubmitDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (description: string) => void
  isSubmitting?: boolean
}

export default function SubmitDialog({ open, onClose, onSubmit, isSubmitting }: SubmitDialogProps) {
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    onSubmit(description)
    setDescription('')
  }

  const handleClose = () => {
    setDescription('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>提交验收</DialogTitle>
      <DialogContent>
        <TextField
          label="提交说明"
          value={description}
          onChange={e => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          size="small"
          sx={{ mt: 1 }}
          placeholder="请描述完成情况..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
          确认提交
        </Button>
      </DialogActions>
    </Dialog>
  )
}
