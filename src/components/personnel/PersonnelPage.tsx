import { useMemo, useState } from 'react'
import { AppSidebar, StatsCards } from '../shared'
import PersonnelHeader from './Header'
import InsightsPanel from './InsightsPanel'
import { personnelUsers, type PersonnelUser } from './personnelUsers'
import { goToPersonnelUser } from '../../config/navigation'

type PersonnelPageProps = {
  onUserOpen?: (userId: string) => void
}

const statusLabelMap: Record<PersonnelUser['personStatus'], string> = {
  onduty: '在岗',
  leave: '请假',
  offboard: '离岗',
  disabled: '禁用',
}

const riskLabelMap: Record<PersonnelUser['riskLevel'], string> = {
  low: '低',
  medium: '中',
  high: '高',
}

const PersonnelPage = ({ onUserOpen }: PersonnelPageProps) => {
  const currentHash =
    typeof window === 'undefined' ? '#/personnel' : window.location.hash || '#/personnel'
  const [isInsightsOpen, setIsInsightsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredUsers = useMemo(() => {
    if (!normalizedQuery) {
      return personnelUsers
    }

    return personnelUsers.filter(user => {
      return [
        user.name,
        user.personCode,
        user.mobile,
        user.role,
        user.orgName,
        user.teamName,
        user.workCity,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    })
  }, [normalizedQuery])

  const stats = useMemo(() => {
    return {
      total: personnelUsers.length,
      onduty: personnelUsers.filter(user => user.personStatus === 'onduty').length,
      assignable: personnelUsers.filter(user => user.availabilityStatus === 'assignable').length,
      highRisk: personnelUsers.filter(user => user.riskLevel === 'high').length,
    }
  }, [])

  const openUserDetail = (userId: string) => {
    if (onUserOpen) {
      onUserOpen(userId)
      return
    }

    goToPersonnelUser(userId)
  }

  return (
    <div className="pm-app">
      <div className="pm-glow pm-glow-left" />
      <div className="pm-glow pm-glow-right" />
      <AppSidebar currentHash={currentHash} />

      <div className="pm-workspace">
        <main className="pm-main">
          <PersonnelHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isInsightsOpen={isInsightsOpen}
            onInsightsToggle={() => setIsInsightsOpen(prev => !prev)}
          />

          <div className="pm-body">
            <StatsCards
              items={[
                { key: 'all', icon: '1.svg', label: '人员总数', value: stats.total, tone: 'blue' },
                {
                  key: 'onduty',
                  icon: '3.svg',
                  label: '在岗人数',
                  value: stats.onduty,
                  tone: 'green',
                },
                {
                  key: 'assignable',
                  icon: '5.svg',
                  label: '可分配',
                  value: stats.assignable,
                  tone: 'purple',
                },
                {
                  key: 'risk',
                  icon: '7.svg',
                  label: '高风险人员',
                  value: stats.highRisk,
                  tone: 'orange',
                },
              ]}
              activeKey="all"
              className="pm-stats-row"
              assetBase="/assets/CodeBubbyAssets/3848_19"
            />

            <section className="pm-table-section personnel-table-shell">
              <div className="personnel-table-toolbar">
                <span>人员列表（{filteredUsers.length}）</span>
              </div>

              <div className="personnel-table-wrapper">
                <table className="personnel-table">
                  <thead>
                    <tr>
                      <th>姓名</th>
                      <th>工号</th>
                      <th>角色</th>
                      <th>组织 / 团队</th>
                      <th>状态</th>
                      <th>可用性</th>
                      <th>风险</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.personCode}</td>
                        <td>{user.role}</td>
                        <td>
                          {user.orgName} / {user.teamName}
                        </td>
                        <td>{statusLabelMap[user.personStatus]}</td>
                        <td>
                          {user.availabilityStatus === 'assignable'
                            ? '可分配'
                            : user.availabilityStatus === 'busy'
                              ? '忙碌'
                              : '不可分配'}
                        </td>
                        <td>{riskLabelMap[user.riskLevel]}</td>
                        <td>
                          <button
                            type="button"
                            className="personnel-link-btn"
                            onClick={() => openUserDetail(user.id)}
                          >
                            查看详情
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 ? (
                  <div className="personnel-empty">未找到匹配人员，请调整关键词</div>
                ) : null}
              </div>
            </section>
          </div>
        </main>

        <InsightsPanel isOpen={isInsightsOpen} onClose={() => setIsInsightsOpen(false)} />
      </div>
    </div>
  )
}

export default PersonnelPage
