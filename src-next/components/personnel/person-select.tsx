import { useState, useEffect, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/services/api'
import type { PersonItem } from '@/types/personnel'

interface PersonSelectProps {
  value?: number
  onChange: (personId: number, personName: string) => void
  placeholder?: string
  filterAvailable?: boolean
  orgId?: number
}

export function PersonSelect({
  value,
  onChange,
  placeholder = '选择人员',
  filterAvailable = false,
  orgId,
}: PersonSelectProps) {
  const [persons, setPersons] = useState<PersonItem[]>([])

  useEffect(() => {
    api
      .getPersonnel()
      .then(res => {
        setPersons(res.data)
      })
      .catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    let list = persons
    if (filterAvailable) {
      list = list.filter(p => p.personStatus === 1 && p.availabilityStatus === 1)
    }
    if (orgId) {
      list = list.filter(p => p.orgId === orgId)
    }
    return list
  }, [persons, filterAvailable, orgId])

  const selectedPerson = persons.find(p => p.id === value)

  return (
    <Select
      value={value ? String(value) : null}
      onValueChange={v => {
        if (!v) return
        const person = persons.find(p => p.id === Number(v))
        onChange(Number(v), person?.name ?? '')
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>
          {selectedPerson ? `${selectedPerson.name} (${selectedPerson.personCode})` : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {filtered.length === 0 && (
          <SelectItem value="-" disabled>
            无可用人员
          </SelectItem>
        )}
        {filtered.map(person => (
          <SelectItem key={person.id} value={String(person.id)}>
            <span className="font-medium">{person.name}</span>
            <span className="text-muted-foreground ml-2 text-xs">{person.personCode}</span>
            <span
              className={`ml-2 text-xs ${
                person.personStatus === 1
                  ? 'text-emerald-400'
                  : person.personStatus === 2
                    ? 'text-amber-400'
                    : 'text-red-400'
              }`}
            >
              {person.personStatus === 1 ? '在岗' : person.personStatus === 2 ? '请假' : '离岗'}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
