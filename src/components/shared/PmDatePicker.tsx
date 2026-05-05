import { PmInput } from './PmInput'
import type { PmInputProps } from './PmInput'

type PmDatePickerProps = PmInputProps

export function PmDatePicker({ className, ...rest }: PmDatePickerProps) {
  return <PmInput type="date" className={className} {...rest} />
}
