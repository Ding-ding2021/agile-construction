import { useMemo, useState } from 'react'
import { AppSidebar, PageHeader, StatsCards } from '../shared'
import './customer-management-page.css'

type CustomerStatus = '合作中' | '洽谈中' | '暂停'
type CustomerLevel = 'S级' | 'A级' | 'B级'
type CustomerViewMode = 'card' | 'list'

type CustomerItem = {
  shortName: string
  name: string
  contact: string
  industry: string
  region: string
  stores: number
  activeProjects: number
  contractAmount: string
  level: CustomerLevel
  status: CustomerStatus
}

const ASSET_BASE = '/assets/CodeBubbyAssets/4203_756'

const customers: CustomerItem[] = [
  {
    shortName: '华',
    name: '华润万家',
    contact: '王志强 · 138-0010-2345',
    industry: '零售连锁',
    region: '华南 · 深圳',
    stores: 42,
    activeProjects: 3,
    contractAmount: '2,480万',
    level: 'S级',
    status: '合作中',
  },
  {
    shortName: '名',
    name: '名创优品',
    contact: '李雅婷 · 139-2233-5678',
    industry: '生活百货',
    region: '华南 · 广州',
    stores: 28,
    activeProjects: 2,
    contractAmount: '1,350万',
    level: 'A级',
    status: '合作中',
  },
  {
    shortName: '百',
    name: '百胜中国',
    contact: '陈浩然 · 137-5566-1234',
    industry: '餐饮连锁',
    region: '华东 · 上海',
    stores: 67,
    activeProjects: 5,
    contractAmount: '4,200万',
    level: 'S级',
    status: '合作中',
  },
  {
    shortName: '屈',
    name: '屈臣氏',
    contact: '张美琪 · 135-4455-9988',
    industry: '美妆护肤',
    region: '华北 · 北京',
    stores: 15,
    activeProjects: 1,
    contractAmount: '680万',
    level: 'B级',
    status: '合作中',
  },
  {
    shortName: '优',
    name: '优衣库',
    contact: '山田太郎 · 136-7788-4321',
    industry: '服装零售',
    region: '华东 · 上海',
    stores: 35,
    activeProjects: 2,
    contractAmount: '1,920万',
    level: 'A级',
    status: '洽谈中',
  },
  {
    shortName: '泡',
    name: '泡泡玛特',
    contact: '刘若曦 · 138-9900-3344',
    industry: '潮玩文创',
    region: '华北 · 北京',
    stores: 12,
    activeProjects: 0,
    contractAmount: '420万',
    level: 'B级',
    status: '暂停',
  },
  {
    shortName: '永',
    name: '永辉超市',
    contact: '黄建国 · 139-1122-8866',
    industry: '零售连锁',
    region: '西南 · 成都',
    stores: 23,
    activeProjects: 1,
    contractAmount: '1,100万',
    level: 'A级',
    status: '合作中',
  },
  {
    shortName: '盒',
    name: '盒马鲜生',
    contact: '赵思远 · 137-3344-7755',
    industry: '新零售',
    region: '华东 · 杭州',
    stores: 18,
    activeProjects: 2,
    contractAmount: '890万',
    level: 'A级',
    status: '合作中',
  },
]

const CustomerManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<CustomerViewMode>('list')
  const currentHash =
    typeof window === 'undefined' ? '#/customers' : window.location.hash || '#/customers'

  const filteredCustomers = useMemo(
    () =>
      customers.filter(item =>
        `${item.name}${item.contact}${item.industry}${item.region}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      ),
    [searchQuery]
  )

  return (
    <div className="pm-app cm-page">
      <div className="cm-glow cm-glow-left" />
      <div className="cm-glow cm-glow-right" />

      <AppSidebar currentHash={currentHash} />

      <div className="pm-workspace">
        <main className="pm-main">
          <PageHeader
            title="客户管理"
            subtitle="Customer Management - 连锁门店品牌客户全生命周期管理"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="搜索客户名称、联系人..."
          />

          <div className="pm-body cm-body">
            <StatsCards
              items={[
                { key: 'total', icon: '1.svg', label: '客户总数', value: 156, tone: 'blue' },
                { key: 'cooperating', icon: '2.svg', label: '合作中', value: 128, tone: 'green' },
                { key: 'new', icon: '3.svg', label: '本月新增', value: 12, tone: 'purple' },
                { key: 'risk', icon: '4.svg', label: '流失风险', value: 6, tone: 'orange' },
              ]}
              className="pm-stats-row"
              classNamePrefix="pm"
              assetBase={ASSET_BASE}
            />

            <section className="pm-table-section" aria-label="客户列表区">
              <div className="pm-table-toolbar cm-table-toolbar">
                <div className="pm-view-toggle" role="group" aria-label="视图切换">
                  <button
                    type="button"
                    className={`pm-view-btn ${viewMode === 'card' ? 'active' : ''}`}
                    onClick={() => setViewMode('card')}
                  >
                    <img src={`${ASSET_BASE}/5.svg`} alt="" />
                    <span>卡片</span>
                  </button>
                  <button
                    type="button"
                    className={`pm-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <img src={`${ASSET_BASE}/6.svg`} alt="" />
                    <span>列表</span>
                  </button>
                </div>

                <div className="pm-toolbar-right">
                  <label className="pm-search-input-wrap cm-search-sm" aria-label="搜索客户">
                    <img src={`${ASSET_BASE}/7.svg`} alt="" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={event => setSearchQuery(event.target.value)}
                      placeholder="搜索客户名称、联系人..."
                    />
                  </label>

                  <button type="button" className="pm-filter-btn">
                    <img src={`${ASSET_BASE}/8.svg`} alt="" />
                    <span>全部地区</span>
                    <img src={`${ASSET_BASE}/9.svg`} alt="" />
                  </button>

                  <button type="button" className="pm-filter-btn">
                    <img src={`${ASSET_BASE}/10.svg`} alt="" />
                    <span>全部行业</span>
                    <img src={`${ASSET_BASE}/9.svg`} alt="" />
                  </button>

                  <button type="button" className="pm-filter-btn">
                    <img src={`${ASSET_BASE}/11.svg`} alt="" />
                    <span>更多筛选</span>
                  </button>

                  <button type="button" className="pm-add-user-btn">
                    <img src={`${ASSET_BASE}/37.svg`} alt="" />
                    <span>新增客户</span>
                  </button>

                  <button type="button" className="pm-filter-btn">
                    <img src={`${ASSET_BASE}/38.svg`} alt="" />
                    <span>操作</span>
                    <img src={`${ASSET_BASE}/9.svg`} alt="" />
                  </button>
                </div>
              </div>

              <section className="pm-table-container cm-table-shell" aria-label="客户数据表">
                <table className="pm-table cm-table">
                  <thead>
                    <tr>
                      <th>客户信息</th>
                      <th>行业 / 地区</th>
                      <th style={{ textAlign: 'center' }}>门店 / 项目</th>
                      <th style={{ textAlign: 'right' }}>合同金额</th>
                      <th style={{ textAlign: 'center' }}>客户级别</th>
                      <th style={{ textAlign: 'center' }}>状态</th>
                      <th style={{ textAlign: 'center' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map(item => (
                      <tr key={item.name}>
                        <td>
                          <div className="cm-customer-meta">
                            <div className="cm-customer-avatar">{item.shortName}</div>
                            <div>
                              <strong>{item.name}</strong>
                              <span>{item.contact}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="cm-dual-cell">
                            <strong>{item.industry}</strong>
                            <span>{item.region}</span>
                          </div>
                        </td>
                        <td className="center">
                          <div className="cm-dual-cell">
                            <strong>{item.stores} 门店</strong>
                            <span>{item.activeProjects} 个进行中</span>
                          </div>
                        </td>
                        <td className="amount">{item.contractAmount}</td>
                        <td className="center">
                          <span className={`cm-level-tag ${item.level}`}>{item.level}</span>
                        </td>
                        <td className="center">
                          <span className={`cm-status-tag ${item.status}`}>{item.status}</span>
                        </td>
                        <td className="center">
                          <button type="button" className="cm-row-action">
                            查看
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <footer className="pm-pagination cm-pagination" aria-label="分页">
                  <div className="pm-pagination-left cm-pagination-left">
                    <span>共 {filteredCustomers.length} 条记录，当前第 1 / 1 页</span>
                    <span className="cm-page-size">
                      每页显示
                      <button type="button">
                        12 条 <img src={`${ASSET_BASE}/31.svg`} alt="" />
                      </button>
                    </span>
                  </div>
                  <div className="pm-pagination-right cm-pagination-right">
                    <button type="button" className="pm-page-btn" aria-label="上一页">
                      <img src={`${ASSET_BASE}/29.svg`} alt="" />
                    </button>
                    <button type="button" className="pm-page-btn active" aria-current="page">
                      1
                    </button>
                    <button type="button" className="pm-page-btn" aria-label="下一页">
                      <img src={`${ASSET_BASE}/30.svg`} alt="" />
                    </button>
                  </div>
                </footer>
              </section>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CustomerManagementPage
