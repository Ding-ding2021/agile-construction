import { useEffect, useMemo, useState } from 'react'
import { AppSidebar, PageHeader, StatsCards } from '../shared'
import { goToProjectDetail } from '../../config/navigation'
import './order-management-page.css'

type OrderStatus =
  | '运输中'
  | '已审批'
  | '部分到货'
  | '待审批'
  | '已到货'
  | '已完成'
  | '草稿'
  | '已下单'
  | '已取消'
type Priority = '紧急' | '高' | '中' | '低'

type OrderItem = {
  name: string
  code: string
  supplier: string
  status: OrderStatus
  priority: Priority
  amount: string
  itemCount: string
  progress: number
  projectCode: string
}

type OrderFlowLog = {
  id: string
  time: string
  operator: string
  action: string
  detail: string
}

type OrderFlowAction = {
  label: string
  to: OrderStatus
}

const ASSET_BASE = '/assets/CodeBubbyAssets/4106_3082'
const ORDER_STATE_STORAGE_KEY = 'pm-order-state-v1'
const ORDER_LOG_STORAGE_KEY = 'pm-order-flow-logs-v1'

const seedOrders: OrderItem[] = [
  {
    name: '店面吊顶龙骨及石膏板采购',
    code: 'PO-2026-001',
    supplier: '可耐福新型建材有限公司',
    status: '运输中',
    priority: '紧急',
    amount: '¥ 56.5万',
    itemCount: '4 项',
    progress: 40,
    projectCode: 'PRJ-2024-001',
  },
  {
    name: '中央空调设备采购安装',
    code: 'PO-2026-002',
    supplier: '大金空调（上海）有限公司',
    status: '已审批',
    priority: '高',
    amount: '¥ 96.0万',
    itemCount: '2 项',
    progress: 20,
    projectCode: 'PRJ-2024-002',
  },
  {
    name: '地面石材采购',
    code: 'PO-2026-003',
    supplier: '环球石材集团有限公司',
    status: '部分到货',
    priority: '紧急',
    amount: '¥ 168万',
    itemCount: '2 项',
    progress: 70,
    projectCode: 'PRJ-2024-003',
  },
  {
    name: '电气管线材料采购',
    code: 'PO-2026-004',
    supplier: '正泰电器股份有限公司',
    status: '待审批',
    priority: '中',
    amount: '¥ 45.6万',
    itemCount: '6 项',
    progress: 10,
    projectCode: 'PRJ-2024-004',
  },
  {
    name: '展示道具及货架采购',
    code: 'PO-2026-005',
    supplier: '上海锐展示工程有限公司',
    status: '已到货',
    priority: '中',
    amount: '¥ 32.0万',
    itemCount: '3 项',
    progress: 90,
    projectCode: 'PRJ-2024-005',
  },
  {
    name: '装修施工劳务进场',
    code: 'PO-2026-006',
    supplier: '四川宏达建筑劳务有限公司',
    status: '已完成',
    priority: '高',
    amount: '¥ 125万',
    itemCount: '3 项',
    progress: 100,
    projectCode: 'PRJ-2024-006',
  },
  {
    name: '防水材料采购',
    code: 'PO-2026-007',
    supplier: '东方雨虹防水技术股份有限公司',
    status: '草稿',
    priority: '低',
    amount: '¥ 38.5万',
    itemCount: '3 项',
    progress: 0,
    projectCode: 'PRJ-2024-007',
  },
  {
    name: '消防改造材料采购',
    code: 'PO-2026-008',
    supplier: '天广消防股份有限公司',
    status: '已下单',
    priority: '中',
    amount: '¥ 8.7万',
    itemCount: '5 项',
    progress: 30,
    projectCode: 'PRJ-2024-008',
  },
  {
    name: '门店验收检测服务',
    code: 'PO-2026-009',
    supplier: '上海建科检验有限公司',
    status: '已完成',
    priority: '中',
    amount: '¥ 18.0万',
    itemCount: '2 项',
    progress: 100,
    projectCode: 'PRJ-2024-009',
  },
  {
    name: '品牌灯箱招牌定制',
    code: 'PO-2026-010',
    supplier: '上海彩翼广告有限公司',
    status: '已取消',
    priority: '中',
    amount: '¥ 72.0万',
    itemCount: '2 项',
    progress: 0,
    projectCode: 'PRJ-2024-010',
  },
]

const statusIconMap: Record<OrderStatus, string> = {
  运输中: '19.svg',
  已审批: '20.svg',
  部分到货: '21.svg',
  待审批: '22.svg',
  已到货: '23.svg',
  已完成: '24.svg',
  草稿: '25.svg',
  已下单: '26.svg',
  已取消: '28.svg',
}

const statusProgressMap: Record<OrderStatus, number> = {
  草稿: 0,
  待审批: 10,
  已审批: 20,
  已下单: 30,
  运输中: 45,
  部分到货: 70,
  已到货: 90,
  已完成: 100,
  已取消: 0,
}

const flowActionsMap: Record<OrderStatus, OrderFlowAction[]> = {
  草稿: [
    { label: '提交审批', to: '待审批' },
    { label: '取消订单', to: '已取消' },
  ],
  待审批: [
    { label: '审批通过', to: '已审批' },
    { label: '驳回取消', to: '已取消' },
  ],
  已审批: [{ label: '确认下单', to: '已下单' }],
  已下单: [{ label: '登记发货', to: '运输中' }],
  运输中: [
    { label: '登记部分到货', to: '部分到货' },
    { label: '登记全部到货', to: '已到货' },
  ],
  部分到货: [{ label: '登记全部到货', to: '已到货' }],
  已到货: [{ label: '确认入库完成', to: '已完成' }],
  已完成: [],
  已取消: [],
}

const readLocalOrders = (): OrderItem[] | null => {
  try {
    const raw = window.localStorage.getItem(ORDER_STATE_STORAGE_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as OrderItem[]
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

const readLocalFlowLogs = (): Record<string, OrderFlowLog[]> => {
  try {
    const raw = window.localStorage.getItem(ORDER_LOG_STORAGE_KEY)
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw) as Record<string, OrderFlowLog[]>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const formatFlowTime = (date = new Date()) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

const OrderManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [ordersState, setOrdersState] = useState<OrderItem[]>(() => readLocalOrders() ?? seedOrders)
  const [flowLogsMap, setFlowLogsMap] = useState<Record<string, OrderFlowLog[]>>(() =>
    readLocalFlowLogs()
  )
  const [activeLogOrderCode, setActiveLogOrderCode] = useState<string | null>(null)

  const currentHash = window.location.hash || '#/orders'

  useEffect(() => {
    try {
      window.localStorage.setItem(ORDER_STATE_STORAGE_KEY, JSON.stringify(ordersState))
    } catch {
      // ignore storage errors
    }
  }, [ordersState])

  useEffect(() => {
    try {
      window.localStorage.setItem(ORDER_LOG_STORAGE_KEY, JSON.stringify(flowLogsMap))
    } catch {
      // ignore storage errors
    }
  }, [flowLogsMap])

  const filteredOrders = useMemo(
    () =>
      ordersState.filter(item =>
        `${item.name}${item.code}${item.supplier}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      ),
    [ordersState, searchQuery]
  )

  const stats = useMemo(() => {
    const total = ordersState.length
    const pending = ordersState.filter(
      item => item.status === '草稿' || item.status === '待审批'
    ).length
    const executing = ordersState.filter(item =>
      ['已下单', '运输中', '部分到货', '已到货'].includes(item.status)
    ).length
    const completed = ordersState.filter(item => item.status === '已完成').length
    return {
      total,
      pending,
      executing,
      completed,
    }
  }, [ordersState])

  const activeLogOrder = useMemo(
    () =>
      activeLogOrderCode
        ? (ordersState.find(item => item.code === activeLogOrderCode) ?? null)
        : null,
    [activeLogOrderCode, ordersState]
  )

  const advanceOrderStatus = (orderCode: string, action: OrderFlowAction) => {
    let changed = false
    let currentStatus: OrderStatus | null = null

    setOrdersState(previous =>
      previous.map(item => {
        if (item.code !== orderCode) {
          return item
        }

        if (item.status === action.to) {
          return item
        }

        currentStatus = item.status
        changed = true
        return {
          ...item,
          status: action.to,
          progress: statusProgressMap[action.to],
        }
      })
    )

    if (!changed || currentStatus === null) {
      return
    }

    const logTime = formatFlowTime()
    const flowLog: OrderFlowLog = {
      id: `${orderCode}-${action.to}-${logTime.replace(/[^\d]/g, '')}`,
      time: logTime,
      operator: '订单管理',
      action: action.label,
      detail: `状态由 ${currentStatus} 更新为 ${action.to}。`,
    }

    setFlowLogsMap(previous => {
      const currentLogs = previous[orderCode] ?? []
      return {
        ...previous,
        [orderCode]: [flowLog, ...currentLogs].slice(0, 20),
      }
    })
  }

  const statsItems = useMemo(
    () => [
      { key: 'total', icon: '1.svg', label: '全部订单', value: stats.total, tone: 'blue' as const },
      {
        key: 'pending',
        icon: '3.svg',
        label: '待处理',
        value: stats.pending,
        tone: 'orange' as const,
      },
      {
        key: 'executing',
        icon: '5.svg',
        label: '流转中',
        value: stats.executing,
        tone: 'purple' as const,
      },
      {
        key: 'completed',
        icon: '7.svg',
        label: '已完成',
        value: stats.completed,
        tone: 'green' as const,
      },
    ],
    [stats]
  )

  return (
    <div className="om-page">
      <div className="om-glow om-glow-left" />
      <div className="om-glow om-glow-right" />

      <AppSidebar currentHash={currentHash} />

      <main className="om-main">
        <PageHeader
          title="订单管理"
          subtitle="Order Management"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="搜索订单..."
        />

        <section className="om-content">
          <StatsCards
            items={statsItems}
            className="pm-stats-row"
            classNamePrefix="pm"
            assetBase={ASSET_BASE}
          />

          <div className="om-toolbar">
            <div className="om-view-switch" role="group" aria-label="视图切换">
              <button type="button" className="om-view-btn">
                <img src={`${ASSET_BASE}/9.svg`} alt="" />
                <span>网格</span>
              </button>
              <button type="button" className="om-view-btn active">
                <img src={`${ASSET_BASE}/10.svg`} alt="" />
                <span>列表</span>
              </button>
              <button type="button" className="om-view-btn">
                <img src={`${ASSET_BASE}/11.svg`} alt="" />
                <span>看板</span>
              </button>
            </div>

            <div className="om-toolbar-right">
              <label className="om-search-small" aria-label="搜索订单">
                <img src={`${ASSET_BASE}/13.svg`} alt="" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  placeholder="搜索订单..."
                />
              </label>
              <button type="button" className="om-tool-btn">
                <img src={`${ASSET_BASE}/14.svg`} alt="" />
                <span>分组</span>
                <img src={`${ASSET_BASE}/15.svg`} alt="" />
              </button>
              <button type="button" className="om-tool-btn">
                <img src={`${ASSET_BASE}/12.svg`} alt="" />
                <span>筛选</span>
              </button>
              <button type="button" className="om-tool-btn">
                <img src={`${ASSET_BASE}/16.svg`} alt="" />
                <span>排序</span>
                <img src={`${ASSET_BASE}/17.svg`} alt="" />
              </button>
              <button type="button" className="om-icon-square" aria-label="更多操作">
                <img src={`${ASSET_BASE}/18.svg`} alt="" />
              </button>
            </div>
          </div>

          <section className="om-table-shell" aria-label="订单列表">
            <table className="om-table">
              <thead>
                <tr>
                  <th>订单信息</th>
                  <th>供应商</th>
                  <th>状态</th>
                  <th>优先级</th>
                  <th>金额</th>
                  <th>履约进度</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(item => {
                  const flowActions = flowActionsMap[item.status] ?? []

                  return (
                    <tr key={item.code}>
                      <td>
                        <div className="om-order-meta">
                          <strong>{item.name}</strong>
                          <span>{item.code}</span>
                        </div>
                      </td>
                      <td>{item.supplier}</td>
                      <td className="center">
                        <span className={`om-tag om-status-${item.status}`}>
                          <img src={`${ASSET_BASE}/${statusIconMap[item.status]}`} alt="" />
                          {item.status}
                        </span>
                      </td>
                      <td className="center">
                        <span className={`om-tag om-priority-${item.priority}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="amount">
                        <strong>{item.amount}</strong>
                        <span>{item.itemCount}</span>
                      </td>
                      <td>
                        <div className="om-progress-wrap" aria-label={`履约进度 ${item.progress}%`}>
                          <div className="om-progress-track">
                            <div
                              className="om-progress-fill"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span>{item.progress}%</span>
                        </div>
                      </td>
                      <td className="center">
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                          }}
                        >
                          {flowActions.map(action => (
                            <button
                              key={`${item.code}-${action.to}`}
                              type="button"
                              className="om-link-btn"
                              onClick={() => advanceOrderStatus(item.code, action)}
                            >
                              {action.label}
                            </button>
                          ))}
                          <button
                            type="button"
                            className="om-link-btn"
                            onClick={() => setActiveLogOrderCode(item.code)}
                          >
                            流转日志
                          </button>
                          <button
                            type="button"
                            className="om-link-btn"
                            onClick={() => {
                              goToProjectDetail(item.projectCode)
                            }}
                          >
                            项目追溯
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <footer className="om-pagination" aria-label="分页">
              <div className="om-pagination-left">
                <span>共 {filteredOrders.length} 条记录，当前第 1 / 1 页</span>
                <span className="om-page-size">
                  每页显示{' '}
                  <button type="button">
                    12 条 <img src={`${ASSET_BASE}/29.svg`} alt="" />
                  </button>
                </span>
              </div>
              <div className="om-pagination-right">
                <button type="button" className="om-page-icon" aria-label="上一页">
                  <img src={`${ASSET_BASE}/30.svg`} alt="" />
                </button>
                <button type="button" className="om-page-num active" aria-current="page">
                  1
                </button>
                <button type="button" className="om-page-icon" aria-label="下一页">
                  <img src={`${ASSET_BASE}/31.svg`} alt="" />
                </button>
              </div>
            </footer>
          </section>

          {activeLogOrder ? (
            <section className="om-table-shell" aria-label="订单流转日志" style={{ marginTop: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <strong>{activeLogOrder.name} · 流转日志</strong>
                <button
                  type="button"
                  className="om-link-btn"
                  onClick={() => setActiveLogOrderCode(null)}
                >
                  关闭日志
                </button>
              </div>

              <table className="om-table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>操作人</th>
                    <th>动作</th>
                    <th>详情</th>
                  </tr>
                </thead>
                <tbody>
                  {(flowLogsMap[activeLogOrder.code] ?? []).map(log => (
                    <tr key={log.id}>
                      <td>{log.time}</td>
                      <td>{log.operator}</td>
                      <td>{log.action}</td>
                      <td>{log.detail}</td>
                    </tr>
                  ))}
                  {(flowLogsMap[activeLogOrder.code] ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={4}>暂无流转日志，请先执行一次状态推进操作。</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </section>
          ) : null}
        </section>
      </main>
    </div>
  )
}

export default OrderManagementPage
