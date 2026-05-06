import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import PersonnelDetailContent from './components/PersonnelDetailContent'
import { api } from '@/services/api'
import { getPersonDetail } from './components/personnel-detail-mock'
import type { PersonItem, PersonDetail } from '@/types/personnel'

interface PersonnelDetailSheetProps {
  person: PersonItem | null
  onClose: () => void
}

export default function PersonnelDetailSheet({ person, onClose }: PersonnelDetailSheetProps) {
  const navigate = useNavigate()
  const [detail, setDetail] = useState<PersonDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!person) {
      setDetail(null)
      return
    }

    setLoading(true)

    const mock = getPersonDetail(person.id)
    if (mock) {
      setDetail(mock)
      setLoading(false)
      return
    }

    api
      .getPerson(person.id)
      .then(data => {
        setDetail({
          ...data,
          skills: [],
          certs: [],
          projects: [],
          tasks: [],
          statusChanges: [],
        })
      })
      .catch(() => setDetail(null))
      .finally(() => setLoading(false))
  }, [person])

  const handleOpenPage = () => {
    if (person) {
      onClose()
      navigate(`/personnel/${person.id}`)
    }
  }

  return (
    <Sheet open={!!person} onOpenChange={open => !open && onClose()}>
      <SheetContent
        className="w-full !max-w-[900px] sm:!max-w-[900px] p-0 flex flex-col"
        showCloseButton={false}
      >
        {loading && (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            加载中...
          </div>
        )}

        {!loading && detail && (
          <PersonnelDetailContent
            person={detail}
            loading={false}
            mode="sheet"
            onBack={onClose}
            onOpenPage={handleOpenPage}
          />
        )}

        {!loading && !detail && person && (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            无法加载人员详情
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
