import { forwardRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface PmSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface PmSelectProps {
  label?: string
  options: PmSelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const PmSelect = forwardRef<HTMLButtonElement, PmSelectProps>(
  ({ label, options, value, defaultValue, onChange, placeholder, disabled, className }, ref) => {
    return (
      <div className={cn('w-full', className)}>
        {label && <Label className="text-xs text-[var(--pm-text-40)] mb-1 block">{label}</Label>}
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger
            ref={ref}
            className={cn(
              'h-9 bg-[var(--pm-input-bg)] border-[var(--pm-border)] text-[var(--pm-text-white)] rounded-[var(--pm-radius-sm,8px)]',
              'text-[14px]',
              'focus:border-[var(--pm-primary)] focus:ring-[var(--pm-primary)]'
            )}
          >
            <SelectValue placeholder={placeholder ?? '请选择'} />
          </SelectTrigger>
          <SelectContent className="bg-[#0F1F4A] border-[var(--pm-border)] rounded-[var(--pm-radius-sm,8px)]">
            {options.map(opt => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="text-[var(--pm-text-70)] text-[13px] hover:!bg-[var(--pm-element-hover)] data-[selected]:bg-[var(--pm-primary-15)] data-[selected]:text-[var(--pm-text-white)]"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
)

PmSelect.displayName = 'PmSelect'
