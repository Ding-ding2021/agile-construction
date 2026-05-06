import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import PersonnelDetailContent from './components/PersonnelDetailContent'
import { getPersonDetail } from './components/personnel-detail-mock'
import type { PersonDetail } from '@/types/personnel'

export default function PersonnelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [person, setPerson] = useState<PersonDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)

    const personId = Number(id)
    // 优先 mock 数据，后续接入真实 API
    const mock = getPersonDetail(personId)
    if (mock) {
      setPerson(mock)
      setLoading(false)
      return
    }

    // 尝试 API
    api
      .getPerson(personId)
      .then(data => {
        // 扩展为 PersonDetail（带空数组）
        setPerson({
          ...data,
          skills: [],
          certs: [],
          projects: [],
          tasks: [],
          statusChanges: [],
        })
      })
      .catch(() => {
        // fallback: 从列表缓存读取
        setPerson(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  return <PersonnelDetailContent person={person} loading={loading} />
}
