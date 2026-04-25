import { useMemo } from 'react'
import { AppSidebar } from '../shared'
import { supplierRepository } from '../../services/repositories/supplierRepository'
import type { SupplierItem } from '../resource/supplier.types'
import './supplier-detail-page.css'

type SupplierDetailPageProps = {
  supplierId: string
  onBack: () => void
}

const ASSET_BASE = '/assets/CodeBubbyAssets/4287_2'

const enterpriseRows = (supplier: SupplierItem) => [
  { icon: '21.svg', label: '企业全称', value: supplier.name },
  { icon: '22.svg', label: '联系人', value: supplier.contact },
  { icon: '23.svg', label: '联系电话', value: '139-0000-0002' },
  { icon: '24.svg', label: '电子邮箱', value: 'liming@xinhui-deco.com' },
  { icon: '25.svg', label: '企业地址', value: `${supplier.city}市徐汇区虹桥路388号` },
  { icon: '26.svg', label: '所属省份', value: supplier.city.replace('市', '') },
  { icon: '27.svg', label: '注册资本', value: '5,000万' },
  { icon: '28.svg', label: '法定代表人', value: supplier.contact },
  { icon: '29.svg', label: '税务登记号', value: '91310104MA1FL8XXXX' },
  { icon: '30.svg', label: '开户银行', value: '中国工商银行上海虹桥支行' },
  { icon: '31.svg', label: '银行账号', value: '6222 0000 1234 5678' },
  { icon: '32.svg', label: '网站', value: 'www.xinhui-deco.com' },
]

const contracts = [
  {
    name: '南京路旗舰店精装修工程',
    period: '上海南京路旗舰店 · 2024-07-01 ~ 2025-06-30',
    status: '进行中',
    amount: '¥386万',
  },
  {
    name: '杭州西湖银泰店装修施工',
    period: '杭州西湖银泰店 · 2024-09-15 ~ 2025-04-30',
    status: '进行中',
    amount: '¥245万',
  },
  {
    name: '成都太古里店装修施工',
    period: '成都太古里旗舰店 · 2023-06-01 ~ 2024-01-31',
    status: '已完成',
    amount: '¥198万',
  },
] as const

const qualifications = [
  {
    name: '建筑装饰装修工程专业承包壹级',
    status: '有效',
    tone: 'valid',
    date: '有效期至 2027-06-30',
  },
  { name: '建筑幕墙工程专业承包贰级', status: '有效', tone: 'valid', date: '有效期至 2026-12-31' },
  {
    name: '消防设施工程专业承包贰级',
    status: '即将到期',
    tone: 'warning',
    date: '有效期至 2025-09-15',
  },
] as const

const SupplierDetailPage = ({ supplierId, onBack }: SupplierDetailPageProps) => {
  const supplier = useMemo(() => {
    const all = supplierRepository.loadSuppliers()
    return all.find(item => item.id === supplierId) ?? all[0]
  }, [supplierId])
  const currentHash =
    typeof window === 'undefined' ? '#/procurement' : window.location.hash || '#/procurement'

  if (!supplier) {
    return null
  }

  return (
    <div className="sdp-page">
      <div className="sdp-glow sdp-glow-left" />
      <div className="sdp-glow sdp-glow-right" />
      <AppSidebar currentHash={currentHash} />

      <main className="sdp-main">
        <header className="sdp-topbar">
          <div className="sdp-title-wrap">
            <h1>{supplier.name.slice(0, 4)}</h1>
            <span>{supplier.code}</span>
          </div>
          <div className="sdp-topbar-actions">
            <label className="sdp-search" aria-label="搜索">
              <img src={`${ASSET_BASE}/62.svg`} alt="" />
              <input placeholder="搜索..." />
            </label>
            <button type="button" className="sdp-icon-btn" aria-label="通知">
              <img src={`${ASSET_BASE}/56.svg`} alt="" />
            </button>
            <button type="button" className="sdp-icon-btn active" aria-label="消息">
              <img src={`${ASSET_BASE}/57.svg`} alt="" />
            </button>
            <button type="button" className="sdp-user-btn" aria-label="用户菜单">
              <img src={`${ASSET_BASE}/58.svg`} alt="" />
              <span>管理员</span>
              <img src={`${ASSET_BASE}/59.svg`} alt="" />
            </button>
          </div>
        </header>

        <section className="sdp-content">
          <div className="sdp-breadcrumb">
            <button type="button" onClick={onBack}>
              <img src={`${ASSET_BASE}/1.svg`} alt="" />
              <span>供应商列表</span>
            </button>
            <img src={`${ASSET_BASE}/2.svg`} alt="" />
            <strong>{supplier.name.slice(0, 4)}</strong>
          </div>

          <section className="sdp-profile-card">
            <div className="sdp-profile-main">
              <div className="sdp-profile-icon">
                <img src={`${ASSET_BASE}/3.svg`} alt="" />
              </div>
              <div className="sdp-profile-info">
                <div className="sdp-name-row">
                  <h2>{supplier.name}</h2>
                  <img src={`${ASSET_BASE}/4.svg`} alt="" />
                </div>
                <div className="sdp-tags">
                  <span className="tag rank">A级</span>
                  <span className="tag active">合作中</span>
                  <span className="tag neutral">施工方</span>
                  <span className="tag neutral">精装修施工</span>
                </div>
                <p>
                  {supplier.name}
                  成立于2010年，专注于商业空间精装修，在连锁门店、品牌旗舰店装修领域有丰富经验，
                  已完成超200个连锁品牌门店交付。
                </p>
              </div>
            </div>
            <aside className="sdp-score-card" aria-label="综合评分">
              <strong>{supplier.rating}</strong>
              <div className="sdp-stars">
                <img src={`${ASSET_BASE}/6.svg`} alt="" />
                <img src={`${ASSET_BASE}/7.svg`} alt="" />
                <img src={`${ASSET_BASE}/8.svg`} alt="" />
                <img src={`${ASSET_BASE}/9.svg`} alt="" />
                <img src={`${ASSET_BASE}/10.svg`} alt="" />
              </div>
              <span>综合评分</span>
            </aside>

            <div className="sdp-metrics">
              <article>
                <img src={`${ASSET_BASE}/11.svg`} alt="" />
                <span>累计合同</span>
                <strong>8 份</strong>
              </article>
              <article>
                <img src={`${ASSET_BASE}/12.svg`} alt="" />
                <span>累计金额</span>
                <strong className="green">¥1285万</strong>
              </article>
              <article>
                <img src={`${ASSET_BASE}/13.svg`} alt="" />
                <span>在执行</span>
                <strong className="orange">{supplier.currentTaskCount} 份</strong>
              </article>
              <article>
                <img src={`${ASSET_BASE}/14.svg`} alt="" />
                <span>入库日期</span>
                <strong className="muted">2021-03-15</strong>
              </article>
              <article>
                <img src={`${ASSET_BASE}/15.svg`} alt="" />
                <span>最近合作</span>
                <strong className="purple">2026-02-28</strong>
              </article>
            </div>
          </section>

          <section className="sdp-tabs" aria-label="详情标签">
            <button type="button" className="active">
              <img src={`${ASSET_BASE}/16.svg`} alt="" />
              <span>概览</span>
            </button>
            <button type="button">
              <img src={`${ASSET_BASE}/17.svg`} alt="" />
              <span>合作合同</span>
              <em>5</em>
            </button>
            <button type="button">
              <img src={`${ASSET_BASE}/18.svg`} alt="" />
              <span>评价记录</span>
              <em>3</em>
            </button>
            <button type="button">
              <img src={`${ASSET_BASE}/19.svg`} alt="" />
              <span>资质证书</span>
              <em>3</em>
            </button>
          </section>

          <section className="sdp-grid">
            <div className="sdp-left-col">
              <article className="sdp-card">
                <header>
                  <img src={`${ASSET_BASE}/20.svg`} alt="" />
                  <h3>企业信息</h3>
                </header>
                <div className="sdp-enterprise-grid">
                  {enterpriseRows(supplier).map(row => (
                    <div key={row.label} className="sdp-info-row">
                      <img src={`${ASSET_BASE}/${row.icon}`} alt="" />
                      <div>
                        <span>{row.label}</span>
                        <strong>{row.value}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="sdp-card">
                <header>
                  <img src={`${ASSET_BASE}/33.svg`} alt="" />
                  <h3>合作金额趋势</h3>
                </header>
                <p className="sdp-card-sub">近6个月（万元）</p>
                <div className="sdp-chart-wrap">
                  <img src={`${ASSET_BASE}/39.svg`} alt="合作金额趋势图" />
                </div>
              </article>

              <article className="sdp-card">
                <header className="between">
                  <div>
                    <img src={`${ASSET_BASE}/54.svg`} alt="" />
                    <h3>最近合同</h3>
                  </div>
                  <button type="button" className="ghost-link">
                    查看全部
                  </button>
                </header>
                <div className="sdp-contract-list">
                  {contracts.map(item => (
                    <div key={item.name} className="sdp-contract-item">
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.period}</span>
                      </div>
                      <span className={`contract-status ${item.status}`}>{item.status}</span>
                      <em>{item.amount}</em>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="sdp-right-col">
              <article className="sdp-card">
                <header>
                  <img src={`${ASSET_BASE}/42.svg`} alt="" />
                  <h3>综合评价</h3>
                </header>
                <div className="sdp-radar-wrap">
                  <img src={`${ASSET_BASE}/52.svg`} alt="综合评价雷达图" />
                </div>
                <div className="sdp-score-grid">
                  <div>
                    <strong>95</strong>
                    <span>质量</span>
                  </div>
                  <div>
                    <strong>90</strong>
                    <span>进度</span>
                  </div>
                  <div>
                    <strong>92</strong>
                    <span>安全</span>
                  </div>
                  <div>
                    <strong>88</strong>
                    <span>服务</span>
                  </div>
                  <div>
                    <strong>85</strong>
                    <span>成本</span>
                  </div>
                </div>
              </article>

              <article className="sdp-card compact">
                <header>
                  <img src={`${ASSET_BASE}/53.svg`} alt="" />
                  <h3>标签</h3>
                </header>
                <div className="sdp-labels">
                  <span>#精装修</span>
                  <span>#连锁门店</span>
                  <span>#商业空间</span>
                  <span>#品牌SI</span>
                </div>
              </article>

              <article className="sdp-card">
                <header className="between">
                  <div>
                    <img src={`${ASSET_BASE}/54.svg`} alt="" />
                    <h3>资质概览</h3>
                  </div>
                  <button type="button" className="ghost-link">
                    详情
                  </button>
                </header>
                <div className="sdp-qualification-list">
                  {qualifications.map(item => (
                    <div key={item.name} className="sdp-qualification-item">
                      <div className="top-row">
                        <strong>{item.name}</strong>
                        <span className={`badge ${item.tone}`}>{item.status}</span>
                      </div>
                      <span className="date">{item.date}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}

export default SupplierDetailPage
