import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PmInputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  clearable?: boolean
  onClear?: () => void
}

export const PmInput = forwardRef<HTMLInputElement, PmInputProps>(
  ({ className, clearable, onClear, value, onChange, type, style, ...rest }, ref) => {
    const isDateInput = type === 'date' || type === 'datetime-local'
    const hasValue = !!value

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          className={cn(
            'text-[14px]',
            'placeholder:text-[var(--pm-text-30)]',
            isDateInput && 'h-9 [&::-webkit-calendar-picker-indicator]:invert-[0.6]',
            hasValue && clearable && 'pr-8',
            className
          )}
          style={{
            backgroundColor: 'var(--pm-input-bg)',
            borderColor: 'var(--pm-border)',
            color: 'var(--pm-text-white)',
            borderRadius: 'var(--pm-radius-sm, 8px)',
            ...style,
          }}
          {...rest}
        />
        {hasValue && clearable && !isDateInput && (
          <button
            type="button"
            onClick={() => onClear?.()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--pm-text-40)] hover:text-[var(--pm-text-70)]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )
  }
)

PmInput.displayName = 'PmInput'
