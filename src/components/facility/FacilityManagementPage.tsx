import { useMemo, useState } from 'react'
import { AppSidebar, PageHeader, StatsCards } from '../shared'
import { navigateByHash } from '../shared/navigation/nav.utils'
import './facility-management.css'

type FacilityStatus = '运行正常' | '维护中' | '故障' | '离线'

type FacilityItem = {
  id: string
  name: string
  code: string
  category: string
  location: string
  status: FacilityStatus
  owner: string
  score: string
}

const ASSET_BASE = '/assets/CodeBubbyAssets/4106_5251'

const statsItems = [
  { key: 'total', label: '设施总数', value: '248', tone: 'blue' as const, icon: '4.svg' },
  { key: 'healthy', label: '运行正常', value: '218', tone: 'green' as const, icon: '11.svg' },
  { key: 'maintaining', label: '维护中', value: '15', tone: 'orange' as const, icon: '13.svg' },
  { key: 'faulty', label: '故障/离线', value: '15', tone: 'red' as const, icon: '15.svg' },
]

const facilityItems: FacilityItem[] = [
  {
    id: 'HVAC-A-001',
    name: '中央空调系统A区',
    code: 'HVAC-A-001',
    category: '暖通空调',
    location: '上海南京路旗舰店',
    status: '运行正常',
    owner: '张维',
    score: '4.8',
  },
  {
    id: 'FIRE-001',
    name: '消防自动喷淋系统',
    code: 'FIRE-001',
    category: '消防系统',
    location: '上海南京路旗舰店',
    status: '运行正常',
    owner: '李安全',
    score: '5',
  },
  {
    id: 'ELEV-A-01',
    name: '电梯A座1号',
    code: 'ELEV-A-01',
    category: '垂直交通',
    location: '杭州西湖银泰店',
    status: '维护中',
    owner: '王电梯',
    score: '4.5',
  },
  {
    id: 'PLUMB-001',
    name: '给排水主管网',
    code: 'PLUMB-001',
    category: '给排水',
    location: '北京朝阳大悦城店',
    status: '运行正常',
    owner: '赵水管',
    score: '4.3',
  },
  {
    id: 'ELEC-001',
    name: '配电柜主系统',
    code: 'ELEC-001',
    category: '配电系统',
    location: '深圳南山海岸城店',
    status: '故障',
    owner: '钱电工',
    score: '3.8',
  },
  {
    id: 'VENT-B-001',
    name: '新风系统B区',
    code: 'VENT-B-001',
    category: '暖通空调',
    location: '成都春熙路店',
    status: '运行正常',
    owner: '孙通风',
    score: '4.6',
  },
  {
    id: 'LIGHT-001',
    name: '智能照明控制系统',
    code: 'LIGHT-001',
    category: '照明系统',
    location: '上海南京路旗舰店',
    status: '离线',
    owner: '周灯光',
    score: '4',
  },
  {
    id: 'SEC-001',
    name: '安防监控系统',
    code: 'SEC-001',
    category: '安防系统',
    location: '杭州西湖银泰店',
    status: '运行正常',
    owner: '吴保安',
    score: '4.7',
  },
]

const getStatusClassName = (status: FacilityStatus): string => {
  if (status === '运行正常') return 'ok'
  if (status === '维护中') return 'maintaining'
  if (status === '故障') return 'fault'
  return 'offline'
}

const FacilityManagementPage = () => {
  const [headerSearchQuery, setHeaderSearchQuery] = useState('')
  const [tableSearchQuery, setTableSearchQuery] = useState('')
  const currentHash =
    typeof window === 'undefined' ? '#/facility' : window.location.hash || '#/facility'

  const filteredItems = useMemo(() => {
    const query = tableSearchQuery.trim().toLowerCase()

    if (!query) {
      return facilityItems
    }

    return facilityItems.filter(item =>
      [item.name, item.code, item.category, item.location, item.owner].some(value =>
        value.toLowerCase().includes(query)
      )
    )
  }, [tableSearchQuery])

  return (
    <div className="fm-page">
      <div className="fm-glow fm-glow-left" />
      <div className="fm-glow fm-glow-right" />

      <AppSidebar currentHash={currentHash} />

      <section className="fm-main">
        <PageHeader
          title="设施管理"
          subtitle="Facility Management"
          searchQuery={headerSearchQuery}
          onSearchChange={setHeaderSearchQuery}
          searchPlaceholder="搜索..."
        />

        <main className="fm-content">
          <div className="fm-top-tabs" role="tablist" aria-label="设施管理主标签">
            <button type="button" className="fm-top-tab active" aria-selected="true">
              <img src={`${ASSET_BASE}/1.svg`} alt="" />
              设施设备
            </button>
            <button type="button" className="fm-top-tab" onClick={() => navigateByHash('#/orders')}>
              <img src={`${ASSET_BASE}/2.svg`} alt="" />
              服务单
            </button>
            <button type="button" className="fm-top-tab" onClick={() => navigateByHash('#/tasks')}>
              <img src={`${ASSET_BASE}/3.svg`} alt="" />
              巡检记录
            </button>
          </div>

          <StatsCards items={statsItems} assetBase={ASSET_BASE} classNamePrefix="fm" />

          <section className="fm-table-section">
            <div className="fm-toolbar">
              <div className="fm-view-toggle" role="tablist" aria-label="视图模式">
                <button type="button" className="fm-view-btn">
                  <img src={`${ASSET_BASE}/18.svg`} alt="" />
                  网格
                </button>
                <button type="button" className="fm-view-btn active">
                  <img src={`${ASSET_BASE}/19.svg`} alt="" />
                  列表
                </button>
              </div>

              <div className="fm-toolbar-right">
                <label className="fm-search-input">
                  <img src={`${ASSET_BASE}/21.svg`} alt="" />
                  <input
                    value={tableSearchQuery}
                    onChange={event => setTableSearchQuery(event.target.value)}
                    placeholder="搜索设施..."
                  />
                </label>
                <button type="button" className="fm-filter-btn" aria-label="分组">
                  <img src={`${ASSET_BASE}/22.svg`} alt="" />
                  <span>分组</span>
                  <img src={`${ASSET_BASE}/23.svg`} alt="" />
                </button>
                <button type="button" className="fm-filter-btn" aria-label="排序">
                  <img src={`${ASSET_BASE}/24.svg`} alt="" />
                  <span>排序</span>
                  <img src={`${ASSET_BASE}/25.svg`} alt="" />
                </button>
                <button type="button" className="fm-primary-btn">
                  <img src={`${ASSET_BASE}/20.svg`} alt="" />
                  新增设施
                </button>
                <button type="button" className="fm-filter-btn fm-filter-mini" aria-label="操作">
                  <img src={`${ASSET_BASE}/26.svg`} alt="" />
                  <span>操作</span>
                  <img src={`${ASSET_BASE}/27.svg`} alt="" />
                </button>
              </div>
            </div>

            <div className="fm-table-wrap">
              <table className="fm-table">
                <thead>
                  <tr>
                    <th>设施名称</th>
                    <th className="center">类别</th>
                    <th className="center">位置</th>
                    <th className="center">状态</th>
                    <th className="center">负责人</th>
                    <th className="center">评分</th>
                    <th className="center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="fm-name-cell">
                          <strong>{item.name}</strong>
                          <small>{item.code}</small>
                        </div>
                      </td>
                      <td className="center">{item.category}</td>
                      <td className="center">{item.location}</td>
                      <td className="center">
                        <span className={`fm-status-badge ${getStatusClassName(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="center">{item.owner}</td>
                      <td className="center">
                        <span className="fm-score">
                          <img src={`${ASSET_BASE}/28.svg`} alt="" />
                          {item.score}
                        </span>
                      </td>
                      <td className="center">
                        <button
                          type="button"
                          className="fm-action-btn"
                          aria-label={`查看${item.name}`}
                        >
                          <img src={`${ASSET_BASE}/29.svg`} alt="" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <footer className="fm-pagination">
                <div className="fm-page-meta">
                  <span>共 {filteredItems.length} 条记录，当前第 1 / 1 页</span>
                  <div className="fm-page-size">
                    <span>每页显示</span>
                    <button type="button" className="fm-page-size-btn">
                      10 条
                      <img src={`${ASSET_BASE}/44.svg`} alt="" />
                    </button>
                  </div>
                </div>
                <div className="fm-page-controls">
                  <button type="button" className="disabled" aria-label="上一页">
                    <img src={`${ASSET_BASE}/45.svg`} alt="" />
                  </button>
                  <button type="button" className="active" aria-current="page">
                    1
                  </button>
                  <button type="button" className="disabled" aria-label="下一页">
                    <img src={`${ASSET_BASE}/46.svg`} alt="" />
                  </button>
                </div>
              </footer>
            </div>
          </section>
        </main>
      </section>
    </div>
  )
}

export default FacilityManagementPage
