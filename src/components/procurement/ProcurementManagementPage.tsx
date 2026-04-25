import { useMemo, useState } from 'react'
import { AppSidebar, PageHeader, StatsCards } from '../shared'
import { supplierRepository } from '../../services/repositories/supplierRepository'
import './procurement-management.css'

const ASSET_BASE = '/assets/CodeBubbyAssets/4102_1613'

const topTabs = [
  { key: 'supplier', label: '供应商管理', icon: '1.svg', active: true },
  { key: 'product', label: '产品管理', icon: '2.svg', active: false },
  { key: 'service', label: '服务管理', icon: '3.svg', active: false },
] as const

type ProcurementManagementPageProps = {
  initialSearchQuery?: string
  onOpenSupplier?: (supplierId: string, searchQuery?: string) => void
}

const ProcurementManagementPage = ({
  initialSearchQuery,
  onOpenSupplier,
}: ProcurementManagementPageProps) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery ?? '')
  const suppliers = useMemo(() => supplierRepository.loadSuppliers(), [])
  const currentHash =
    typeof window === 'undefined' ? '#/procurement' : window.location.hash || '#/procurement'

  const filteredSuppliers = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()
    if (!keyword) {
      return suppliers
    }

    return suppliers.filter(item =>
      `${item.name}${item.code}${item.category}${item.contact}${item.city}${item.serviceAreas.join('')}`
        .toLowerCase()
        .includes(keyword)
    )
  }, [searchQuery, suppliers])

  const stats = useMemo(
    () => [
      {
        key: 'total',
        label: '供应商总数',
        value: String(suppliers.length),
        icon: '4.svg',
        tone: 'blue' as const,
      },
      {
        key: 'active',
        label: '合作中',
        value: String(suppliers.filter(item => item.status === '合作中').length),
        icon: '11.svg',
        tone: 'green' as const,
      },
      {
        key: 'pending',
        label: '待审核',
        value: String(suppliers.filter(item => item.status === '待审核').length),
        icon: '13.svg',
        tone: 'orange' as const,
      },
      {
        key: 'paused',
        label: '已暂停',
        value: String(suppliers.filter(item => item.status === '已暂停').length),
        icon: '15.svg',
        tone: 'red' as const,
      },
    ],
    [suppliers]
  )

  return (
    <div className="pcm-page">
      <div className="pcm-glow pcm-glow-left" />
      <div className="pcm-glow pcm-glow-right" />

      <AppSidebar currentHash={currentHash} />

      <div className="pm-workspace">
        <main className="pm-main">
          <PageHeader
            title="采购管理"
            subtitle="Procurement Management"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="搜索供应商..."
          />

          <div className="pm-body pcm-body">
            <div className="pcm-top-tabs" role="tablist" aria-label="采购模块切换">
              {topTabs.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  className={`pcm-top-tab ${tab.active ? 'active' : ''}`}
                  role="tab"
                  aria-selected={tab.active}
                >
                  <img src={`${ASSET_BASE}/${tab.icon}`} alt="" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <StatsCards
              items={stats}
              className="pm-stats-row"
              classNamePrefix="pm"
              assetBase={ASSET_BASE}
            />

            <section className="pcm-toolbar" aria-label="筛选和操作">
              <div className="pcm-view-switch" role="group" aria-label="视图切换">
                <button type="button" className="pcm-view-btn">
                  <img src={`${ASSET_BASE}/18.svg`} alt="" />
                  <span>网格</span>
                </button>
                <button type="button" className="pcm-view-btn active">
                  <img src={`${ASSET_BASE}/19.svg`} alt="" />
                  <span>列表</span>
                </button>
              </div>
              <div className="pcm-filter-actions">
                <label className="pcm-search-sm" aria-label="搜索供应商">
                  <img src={`${ASSET_BASE}/21.svg`} alt="" />
                  <input
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    placeholder="搜索供应商..."
                  />
                </label>
                <button type="button" className="pcm-filter-btn">
                  <img src={`${ASSET_BASE}/22.svg`} alt="" />
                  <span>分组</span>
                  <img src={`${ASSET_BASE}/23.svg`} alt="" />
                </button>
                <button type="button" className="pcm-filter-btn">
                  <img src={`${ASSET_BASE}/24.svg`} alt="" />
                  <span>排序</span>
                  <img src={`${ASSET_BASE}/25.svg`} alt="" />
                </button>
                <button type="button" className="pcm-add-btn">
                  <img src={`${ASSET_BASE}/20.svg`} alt="" />
                  <span>新增供应商</span>
                </button>
                <button type="button" className="pcm-filter-btn">
                  <img src={`${ASSET_BASE}/26.svg`} alt="" />
                  <span>操作</span>
                  <img src={`${ASSET_BASE}/27.svg`} alt="" />
                </button>
              </div>
            </section>

            <section className="pcm-table-wrap" aria-label="供应商列表">
              <table className="pcm-table">
                <thead>
                  <tr>
                    <th>供应商名称</th>
                    <th>类别</th>
                    <th>状态</th>
                    <th>评分</th>
                    <th>联系人</th>
                    <th>地区</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map(item => (
                    <tr
                      key={item.id}
                      className="pcm-clickable-row"
                      onClick={() => onOpenSupplier?.(item.id, searchQuery)}
                    >
                      <td>
                        <div className="pcm-vendor-cell">
                          <strong>{item.name}</strong>
                          <span>{item.code}</span>
                        </div>
                      </td>
                      <td className="center">{item.category}</td>
                      <td className="center">
                        <span className={`pcm-status-badge ${item.status}`}>{item.status}</span>
                      </td>
                      <td className="center">
                        <span className="pcm-rating-cell">
                          <img src={`${ASSET_BASE}/${item.ratingIcon}`} alt="" />
                          <em>{item.rating}</em>
                        </span>
                      </td>
                      <td className="center">{item.contact}</td>
                      <td className="center">{item.city}</td>
                      <td className="center">
                        <button
                          type="button"
                          className="pcm-row-action"
                          aria-label={`查看 ${item.name} 详情`}
                          onClick={event => {
                            event.stopPropagation()
                            onOpenSupplier?.(item.id, searchQuery)
                          }}
                        >
                          <img src={`${ASSET_BASE}/${item.actionIcon}`} alt="" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <footer className="pcm-pagination" aria-label="分页信息">
              <div className="pcm-pagination-left">
                <span>共 {filteredSuppliers.length} 条记录，当前第 1 / 1 页</span>
                <div className="pcm-page-size">
                  <span>每页显示</span>
                  <button type="button">
                    10 条
                    <img src={`${ASSET_BASE}/48.svg`} alt="" />
                  </button>
                </div>
              </div>
              <div className="pcm-pagination-right">
                <button type="button" className="icon" aria-label="上一页">
                  <img src={`${ASSET_BASE}/49.svg`} alt="" />
                </button>
                <button type="button" className="page active" aria-current="page">
                  1
                </button>
                <button type="button" className="icon" aria-label="下一页">
                  <img src={`${ASSET_BASE}/50.svg`} alt="" />
                </button>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProcurementManagementPage
