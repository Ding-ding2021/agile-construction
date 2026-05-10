import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from '@/components/ui/combobox'

interface TagPickerProps {
  value: string[]
  onChange: (value: string[]) => void
  options?: string[]
  placeholder?: string
}

const DEFAULT_OPTIONS = [
  '土建',
  '电气',
  '给排水',
  '消防',
  '暖通',
  '装修',
  '弱电',
  '景观',
  '结构',
  '幕墙',
]

export default function TagPicker({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  placeholder = '添加标签...',
}: TagPickerProps) {
  return (
    <Combobox value={value} onValueChange={v => onChange(v as string[])} multiple>
      <ComboboxChips>
        {value.map(tag => (
          <ComboboxChip key={tag}>{tag}</ComboboxChip>
        ))}
        <ComboboxChipsInput placeholder={placeholder} />
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxList>
          {options
            .filter(o => !value.includes(o))
            .map(opt => (
              <ComboboxItem key={opt} value={opt}>
                {opt}
              </ComboboxItem>
            ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
