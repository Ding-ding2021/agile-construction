'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { CalendarIcon, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = '选择日期和时间',
  disabled = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined)
      return
    }

    const newDate = new Date(date)
    if (value) {
      newDate.setHours(value.getHours())
      newDate.setMinutes(value.getMinutes())
    } else {
      newDate.setHours(0)
      newDate.setMinutes(0)
    }
    onChange?.(newDate)
  }

  const handleTimeChange = (type: 'hour' | 'minute', val: string) => {
    const currentDate = value ? new Date(value) : new Date()

    if (type === 'hour') {
      currentDate.setHours(parseInt(val))
    } else {
      currentDate.setMinutes(parseInt(val))
    }

    onChange?.(currentDate)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(undefined)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full">
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'flex items-center gap-2 h-7 w-full rounded-md border border-input bg-transparent px-2.5 text-xs font-normal justify-start disabled:pointer-events-none disabled:opacity-50',
            value ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="size-3.5 shrink-0" />
          <span className="flex-1 truncate text-left">
            {value ? format(value, 'yyyy/MM/dd HH:mm', { locale: zhCN }) : placeholder}
          </span>
          {value && (
            <X className="size-3.5 shrink-0 opacity-50 hover:opacity-100" onClick={handleClear} />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={handleDateSelect} initialFocus />
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">时间：</span>
            <Select
              value={value ? value.getHours().toString() : undefined}
              onValueChange={val => handleTimeChange('hour', val ?? '')}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue placeholder="时" />
              </SelectTrigger>
              <SelectContent>
                {hours.map(hour => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">:</span>
            <Select
              value={value ? value.getMinutes().toString() : undefined}
              onValueChange={val => handleTimeChange('minute', val ?? '')}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue placeholder="分" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map(minute => (
                  <SelectItem key={minute} value={minute.toString()}>
                    {minute.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange?.(undefined)
              setOpen(false)
            }}
          >
            清除
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (!value) {
                onChange?.(new Date())
              }
              setOpen(false)
            }}
          >
            确定
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
