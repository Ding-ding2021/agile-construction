import { useRef } from 'react'
import { useSettings } from '@/hooks/useSettings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function LogoSettings() {
  const { settings, updateSettings } = useSettings()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      updateSettings({ logo: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    updateSettings({ logo: null })
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo</CardTitle>
        <CardDescription>上传替换系统 Logo（推荐 28×28 或比例一致的图片）</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border bg-muted">
          {settings.logo ? (
            <img src={settings.logo} alt="Logo" className="size-10 object-contain" />
          ) : (
            <span className="text-xs text-muted-foreground">默认</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="max-w-60"
            />
            {settings.logo && (
              <Button variant="outline" size="sm" onClick={handleRemove}>
                重置
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">支持 PNG、JPG、SVG 格式</p>
        </div>
      </CardContent>
    </Card>
  )
}
