import { useMemo, useState } from 'react'
import { AppSidebar, PageHeader } from '../shared'
import { personnelRepository } from '../../services/repositories/personnelRepository'
import { supplierRepository } from '../../services/repositories/supplierRepository'
import {
  readGovernanceSettings,
  saveGovernanceSettings,
} from '../../services/repositories/governanceRepository'
import type { GovernanceSettings } from '../../services/repositories/governanceRepository'
import type { PersonnelAvailabilityStatus, PersonnelUser } from '../personnel/personnelUsers'
import type {
  SupplierAvailabilityStatus,
  SupplierItem,
  SupplierQualificationStatus,
  SupplierStatus,
} from './supplier.types'
import './resource-pool-page.css'

type ResourceDomain = '人员资源' | '供应商资源'
type PersonnelResourceType = '全部' | '资源方' | '工队'
type SupplierStatusFilter = '全部' | SupplierStatus

type ResourceDraft = {
  currentTaskCount: number
  availabilityStatus: PersonnelAvailabilityStatus
  certHealth: '齐全' | '临期' | '需补齐'
}

type SupplierDraft = {
  currentTaskCount: number
  availabilityStatus: SupplierAvailabilityStatus
  qualificationStatus: SupplierQualificationStatus
}

const employmentTypeLabel: Record<PersonnelUser['employmentType'], '资源方' | '工队' | '供应商'> = {
  internal: '资源方',
  outsource: '工队',
  vendor: '供应商',
}

const availabilityLabel: Record<PersonnelAvailabilityStatus, string> = {
  assignable: '可分配',
  busy: '忙碌',
  unavailable: '不可分配',
}

const supplierAvailabilityLabel: Record<SupplierAvailabilityStatus, string> = {
  assignable: '可分配',
  busy: '忙碌',
  unavailable: '不可分配',
}

const certHealthByUser = (user: PersonnelUser): ResourceDraft['certHealth'] => {
  if (user.certs.some(cert => cert.status === 'expired')) {
    return '需补齐'
  }
  if (user.certs.some(cert => cert.status === 'expiring')) {
    return '临期'
  }
  return '齐全'
}

const buildDraftByUsers = (users: PersonnelUser[]): Record<string, ResourceDraft> =>
  users.reduce<Record<string, ResourceDraft>>((acc, user) => {
    acc[user.id] = {
      currentTaskCount: user.currentTaskCount,
      availabilityStatus: user.availabilityStatus,
      certHealth: certHealthByUser(user),
    }
    return acc
  }, {})

const buildDraftBySuppliers = (items: SupplierItem[]): Record<string, SupplierDraft> =>
  items.reduce<Record<string, SupplierDraft>>((acc, item) => {
    acc[item.id] = {
      currentTaskCount: item.currentTaskCount,
      availabilityStatus: item.availabilityStatus,
      qualificationStatus: item.qualificationStatus,
    }
    return acc
  }, {})

const mapCertHealthToStatus = (
  health: ResourceDraft['certHealth']
): PersonnelUser['certs'][number]['status'] => {
  if (health === '需补齐') {
    return 'expired'
  }

  if (health === '临期') {
    return 'expiring'
  }

  return 'valid'
}

const ResourcePoolPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [resourceDomain, setResourceDomain] = useState<ResourceDomain>('人员资源')
  const [personnelType, setPersonnelType] = useState<PersonnelResourceType>('全部')
  const [supplierStatus, setSupplierStatus] = useState<SupplierStatusFilter>('全部')
  const [usersState, setUsersState] = useState<PersonnelUser[]>(() =>
    personnelRepository.loadUsers()
  )
  const currentHash =
    typeof window === 'undefined' ? '#/resources' : window.location.hash || '#/resources'
  const [suppliersState, setSuppliersState] = useState<SupplierItem[]>(() =>
    supplierRepository.loadSuppliers()
  )
  const [draftMap, setDraftMap] = useState<Record<string, ResourceDraft>>(() =>
    buildDraftByUsers(personnelRepository.loadUsers())
  )
  const [supplierDraftMap, setSupplierDraftMap] = useState<Record<string, SupplierDraft>>(() =>
    buildDraftBySuppliers(supplierRepository.loadSuppliers())
  )
  const [governanceSettings, setGovernanceSettings] = useState<GovernanceSettings>(() =>
    readGovernanceSettings()
  )
  const [feedback, setFeedback] = useState<string | null>(null)

  const personnelList = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()

    return usersState
      .filter(user => user.employmentType !== 'vendor')
      .filter(user =>
        personnelType === '全部' ? true : employmentTypeLabel[user.employmentType] === personnelType
      )
      .filter(user => {
        if (!keyword) {
          return true
        }

        return `${user.name}${user.personCode}${user.orgName}${user.teamName}${user.skills.join('')}`
          .toLowerCase()
          .includes(keyword)
      })
      .sort((a, b) => b.currentTaskCount - a.currentTaskCount)
  }, [personnelType, searchQuery, usersState])

  const supplierList = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()

    return suppliersState
      .filter(item => (supplierStatus === '全部' ? true : item.status === supplierStatus))
      .filter(item => {
        if (!keyword) {
          return true
        }

        return `${item.name}${item.code}${item.category}${item.contact}${item.city}${item.serviceAreas.join('')}`
          .toLowerCase()
          .includes(keyword)
      })
      .sort((a, b) => b.currentTaskCount - a.currentTaskCount)
  }, [searchQuery, supplierStatus, suppliersState])

  const stats = useMemo(() => {
    if (resourceDomain === '供应商资源') {
      const total = suppliersState.length
      const assignable = suppliersState.filter(
        item => item.availabilityStatus === 'assignable'
      ).length
      const certRisk = suppliersState.filter(item => item.qualificationStatus !== '齐全').length
      const heavyLoad = suppliersState.filter(
        item => item.currentTaskCount >= governanceSettings.supplierBusyThreshold
      ).length
      return { total, assignable, certRisk, heavyLoad }
    }

    const users = usersState.filter(user => user.employmentType !== 'vendor')
    const total = users.length
    const assignable = users.filter(user => user.availabilityStatus === 'assignable').length
    const certRisk = users.filter(user => certHealthByUser(user) !== '齐全').length
    const heavyLoad = users.filter(
      user =>
        user.currentTaskCount >= governanceSettings.personnelBusyThreshold ||
        user.criticalTaskCount >= 2
    ).length
    return { total, assignable, certRisk, heavyLoad }
  }, [
    governanceSettings.personnelBusyThreshold,
    governanceSettings.supplierBusyThreshold,
    resourceDomain,
    suppliersState,
    usersState,
  ])

  const updateDraft = (userId: string, patch: Partial<ResourceDraft>) => {
    setDraftMap(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        ...patch,
      },
    }))
  }

  const updateSupplierDraft = (supplierId: string, patch: Partial<SupplierDraft>) => {
    setSupplierDraftMap(prev => ({
      ...prev,
      [supplierId]: {
        ...prev[supplierId],
        ...patch,
      },
    }))
  }

  const handleSaveUser = (userId: string) => {
    const draft = draftMap[userId]
    if (!draft) {
      return
    }

    const nextUsers = usersState.map(user => {
      if (user.id !== userId) {
        return user
      }

      const nextCurrentTaskCount = Math.max(0, Number(draft.currentTaskCount) || 0)
      const certStatus = mapCertHealthToStatus(draft.certHealth)

      return {
        ...user,
        currentTaskCount: nextCurrentTaskCount,
        availabilityStatus: draft.availabilityStatus,
        certs: user.certs.map(cert => ({
          ...cert,
          status: certStatus,
        })),
      }
    })

    setUsersState(nextUsers)
    personnelRepository.saveUsers(nextUsers)
    setFeedback(`已更新资源 ${userId} 的负载、可分配状态与资质状态。`)
  }

  const handleSaveSupplier = (supplierId: string) => {
    const draft = supplierDraftMap[supplierId]
    if (!draft) {
      return
    }

    const nextSuppliers = suppliersState.map(item => {
      if (item.id !== supplierId) {
        return item
      }

      return {
        ...item,
        currentTaskCount: Math.max(0, Number(draft.currentTaskCount) || 0),
        availabilityStatus: draft.availabilityStatus,
        qualificationStatus: draft.qualificationStatus,
      }
    })

    setSuppliersState(nextSuppliers)
    supplierRepository.saveSuppliers(nextSuppliers)
    setFeedback(`已更新供应商 ${supplierId} 的负载、可分配状态与资质状态。`)
  }

  const handleSaveGovernanceSettings = () => {
    const nextSettings: GovernanceSettings = {
      personnelBusyThreshold: Math.max(1, Number(governanceSettings.personnelBusyThreshold) || 5),
      supplierBusyThreshold: Math.max(1, Number(governanceSettings.supplierBusyThreshold) || 4),
    }

    setGovernanceSettings(nextSettings)
    saveGovernanceSettings(nextSettings)

    setFeedback(
      `已保存治理规则：人员高负载阈值 ${nextSettings.personnelBusyThreshold}，供应商高负载阈值 ${nextSettings.supplierBusyThreshold}。`
    )
  }

  return (
    <div className="rp-page">
      <div className="rp-glow rp-glow-left" />
      <div className="rp-glow rp-glow-right" />

      <AppSidebar currentHash={currentHash} />

      <main className="rp-main">
        <PageHeader
          title="资源池主数据"
          subtitle="Resource Pool Master Data"
          extraTitleContent={
            <span className="rp-permission-tip">当前为管理员维护视图（角色权限能力后续接入）</span>
          }
        />

        <section className="rp-stats" aria-label="资源池统计">
          <article>
            <p>资源总量</p>
            <strong>{stats.total}</strong>
          </article>
          <article>
            <p>可分配</p>
            <strong>{stats.assignable}</strong>
          </article>
          <article>
            <p>资质风险</p>
            <strong>{stats.certRisk}</strong>
          </article>
          <article>
            <p>高负载</p>
            <strong>{stats.heavyLoad}</strong>
          </article>
        </section>

        <section className="rp-toolbar" aria-label="资源池筛选">
          <label>
            <span>搜索资源</span>
            <input
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder={
                resourceDomain === '人员资源' ? '姓名/编码/组织/技能' : '名称/编码/分类/服务区域'
              }
              aria-label="搜索资源"
            />
          </label>

          <label>
            <span>资源域</span>
            <select
              value={resourceDomain}
              onChange={event => setResourceDomain(event.target.value as ResourceDomain)}
              aria-label="资源域筛选"
            >
              <option value="人员资源">人员资源</option>
              <option value="供应商资源">供应商资源</option>
            </select>
          </label>

          {resourceDomain === '人员资源' ? (
            <label>
              <span>人员类型</span>
              <select
                value={personnelType}
                onChange={event => setPersonnelType(event.target.value as PersonnelResourceType)}
                aria-label="人员类型筛选"
              >
                <option value="全部">全部</option>
                <option value="资源方">资源方</option>
                <option value="工队">工队</option>
              </select>
            </label>
          ) : (
            <label>
              <span>供应商状态</span>
              <select
                value={supplierStatus}
                onChange={event => setSupplierStatus(event.target.value as SupplierStatusFilter)}
                aria-label="供应商状态筛选"
              >
                <option value="全部">全部</option>
                <option value="合作中">合作中</option>
                <option value="待审核">待审核</option>
                <option value="已暂停">已暂停</option>
                <option value="已过期">已过期</option>
              </select>
            </label>
          )}
        </section>

        <section className="rp-toolbar" aria-label="治理规则配置">
          <label>
            <span>人员高负载阈值</span>
            <input
              type="number"
              min={1}
              value={governanceSettings.personnelBusyThreshold}
              onChange={event =>
                setGovernanceSettings(prev => ({
                  ...prev,
                  personnelBusyThreshold: Number(event.target.value),
                }))
              }
              aria-label="人员高负载阈值"
            />
          </label>
          <label>
            <span>供应商高负载阈值</span>
            <input
              type="number"
              min={1}
              value={governanceSettings.supplierBusyThreshold}
              onChange={event =>
                setGovernanceSettings(prev => ({
                  ...prev,
                  supplierBusyThreshold: Number(event.target.value),
                }))
              }
              aria-label="供应商高负载阈值"
            />
          </label>
          <button type="button" onClick={handleSaveGovernanceSettings}>
            保存治理规则
          </button>
        </section>

        {feedback ? <p className="rp-feedback">{feedback}</p> : null}

        <section className="rp-table-wrap" aria-label="资源池列表">
          {resourceDomain === '人员资源' ? (
            <table className="rp-table">
              <thead>
                <tr>
                  <th>资源档案</th>
                  <th>类型</th>
                  <th>技能/资质</th>
                  <th>负载维护</th>
                  <th>可分配状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {personnelList.map(user => {
                  const draft = draftMap[user.id]
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="rp-user-cell">
                          <strong>{user.name}</strong>
                          <span>{user.personCode}</span>
                          <span>
                            {user.orgName} / {user.teamName}
                          </span>
                        </div>
                      </td>
                      <td>{employmentTypeLabel[user.employmentType]}</td>
                      <td>
                        <div className="rp-skill-cell">
                          <p>{user.skills.slice(0, 3).join('、')}</p>
                          <select
                            value={draft?.certHealth ?? '齐全'}
                            onChange={event =>
                              updateDraft(user.id, {
                                certHealth: event.target.value as ResourceDraft['certHealth'],
                              })
                            }
                            aria-label={`${user.name}资质状态`}
                          >
                            <option value="齐全">资质齐全</option>
                            <option value="临期">资质临期</option>
                            <option value="需补齐">资质需补齐</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <label className="rp-load-editor">
                          <span>在手任务</span>
                          <input
                            type="number"
                            min={0}
                            value={draft?.currentTaskCount ?? user.currentTaskCount}
                            onChange={event =>
                              updateDraft(user.id, { currentTaskCount: Number(event.target.value) })
                            }
                            aria-label={`${user.name}在手任务数量`}
                          />
                        </label>
                      </td>
                      <td>
                        <select
                          value={draft?.availabilityStatus ?? user.availabilityStatus}
                          onChange={event =>
                            updateDraft(user.id, {
                              availabilityStatus: event.target.value as PersonnelAvailabilityStatus,
                            })
                          }
                          aria-label={`${user.name}可分配状态`}
                        >
                          <option value="assignable">{availabilityLabel.assignable}</option>
                          <option value="busy">{availabilityLabel.busy}</option>
                          <option value="unavailable">{availabilityLabel.unavailable}</option>
                        </select>
                      </td>
                      <td>
                        <button type="button" onClick={() => handleSaveUser(user.id)}>
                          保存
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <table className="rp-table">
              <thead>
                <tr>
                  <th>供应商档案</th>
                  <th>类别/状态</th>
                  <th>服务区域/资质</th>
                  <th>负载维护</th>
                  <th>可分配状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {supplierList.map(item => {
                  const draft = supplierDraftMap[item.id]
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="rp-user-cell">
                          <strong>{item.name}</strong>
                          <span>{item.code}</span>
                          <span>
                            {item.contact} / {item.city}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="rp-skill-cell">
                          <p>{item.category}</p>
                          <p>{item.status}</p>
                        </div>
                      </td>
                      <td>
                        <div className="rp-skill-cell">
                          <p>{item.serviceAreas.join('、')}</p>
                          <select
                            value={draft?.qualificationStatus ?? item.qualificationStatus}
                            onChange={event =>
                              updateSupplierDraft(item.id, {
                                qualificationStatus: event.target
                                  .value as SupplierQualificationStatus,
                              })
                            }
                            aria-label={`${item.name}资质状态`}
                          >
                            <option value="齐全">资质齐全</option>
                            <option value="临期">资质临期</option>
                            <option value="需补齐">资质需补齐</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <label className="rp-load-editor">
                          <span>在手任务</span>
                          <input
                            type="number"
                            min={0}
                            value={draft?.currentTaskCount ?? item.currentTaskCount}
                            onChange={event =>
                              updateSupplierDraft(item.id, {
                                currentTaskCount: Number(event.target.value),
                              })
                            }
                            aria-label={`${item.name}在手任务数量`}
                          />
                        </label>
                      </td>
                      <td>
                        <select
                          value={draft?.availabilityStatus ?? item.availabilityStatus}
                          onChange={event =>
                            updateSupplierDraft(item.id, {
                              availabilityStatus: event.target.value as SupplierAvailabilityStatus,
                            })
                          }
                          aria-label={`${item.name}可分配状态`}
                        >
                          <option value="assignable">{supplierAvailabilityLabel.assignable}</option>
                          <option value="busy">{supplierAvailabilityLabel.busy}</option>
                          <option value="unavailable">
                            {supplierAvailabilityLabel.unavailable}
                          </option>
                        </select>
                      </td>
                      <td>
                        <button type="button" onClick={() => handleSaveSupplier(item.id)}>
                          保存
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  )
}

export default ResourcePoolPage
