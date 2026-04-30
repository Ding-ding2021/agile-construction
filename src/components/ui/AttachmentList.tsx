import { Box, Paper, Typography, IconButton, Button } from '@mui/material'
import InsertDriveFile from '@mui/icons-material/InsertDriveFile'
import Delete from '@mui/icons-material/Delete'
import CloudUpload from '@mui/icons-material/CloudUpload'

export interface AttachmentItem {
  id: string
  fileName: string
  fileSizeKb: number
  uploader: string
}

export interface AttachmentListProps {
  attachments: AttachmentItem[]
  readonly?: boolean
  onUpload?: (files: File[]) => void
  onDelete?: (attachmentId: string) => void
}

function formatFileSize(kb: number) {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`
  return `${kb} KB`
}

export default function AttachmentList({
  attachments,
  readonly,
  onUpload,
  onDelete,
}: AttachmentListProps) {
  return (
    <Box>
      {/* 上传按钮 */}
      {!readonly && onUpload && (
        <Button
          component="label"
          variant="outlined"
          size="small"
          startIcon={<CloudUpload />}
          sx={{ mb: 1.5 }}
        >
          上传附件
          <input
            type="file"
            multiple
            hidden
            onChange={e => {
              const files = e.target.files
              if (files?.length) onUpload(Array.from(files))
              e.target.value = ''
            }}
          />
        </Button>
      )}

      {/* 附件列表 */}
      {attachments.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'var(--pm-text-70)' }}>
          暂无附件
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {attachments.map(att => (
            <Paper
              key={att.id}
              variant="outlined"
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: 'var(--pm-input)',
                borderColor: 'var(--pm-border)',
              }}
            >
              <InsertDriveFile fontSize="small" sx={{ color: 'var(--pm-blue)' }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ color: 'var(--pm-text-white)' }}>
                  {att.fileName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--pm-text-40)' }}>
                  {att.uploader} · {formatFileSize(att.fileSizeKb)}
                </Typography>
              </Box>
              {!readonly && onDelete && (
                <IconButton size="small" color="error" onClick={() => onDelete(att.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  )
}
