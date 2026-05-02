import { useMemo, useState } from 'react'
import { AppShell, AppSidebar, ListToolbar, Pagination, StatsCards, PageHeader } from '../shared'
import {
  getStandardTemplateStats,
  getStandardTemplatesByKind,
  type StandardTemplateKind,
} from './standard-template.data'
import './standard-management.css'

type TopTab = 'standard' | StandardTemplateKind

const ASSET_BASE = '/assets/CodeBubbyAssets/3998_1544'

const StandardManagementPage = () => {
  const [activeTopTab, setActiveTopTab] = useState<TopTab>('project')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const activeKind: StandardTemplateKind = activeTopTab === 'task' ? 'task' : 'project'
  const sourceTemplates = useMemo(() => getStandardTemplatesByKind(activeKind), [activeKind])
  const stats = useMemo(() => getStandardTemplateStats(activeKind), [activeKind])

  const statCards = useMemo(
    () => [
      { key: 'all', icon: '1.svg', label: '全部模版', value: stats.all, tone: 'blue' as const },
      {
        key: 'builtin',
        icon: '3.svg',
        label: '系统内置',
        value: stats.builtin,
        tone: 'green' as const,
      },
      {
        key: 'custom',
        icon: '4.svg',
        label: '自定义模版',
        value: stats.custom,
        tone: 'purple' as const,
      },
      {
        key: 'active',
        icon: '6.svg',
        label: '生效版本',
        value: stats.active,
        tone: 'orange' as const,
      },
    ],
    [stats]
  )

  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) {
      return sourceTemplates
    }

    const query = searchQuery.trim().toLowerCase()

    return sourceTemplates.filter(item => {
      const { name, listMeta, status, version } = item
      return (
        name.toLowerCase().includes(query) ||
        listMeta.description.toLowerCase().includes(query) ||
        listMeta.category.toLowerCase().includes(query) ||
        status.toLowerCase().includes(query) ||
        version.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, sourceTemplates])

  const openTemplateTasks = (templateId: string) => {
    window.location.assign(`#/tasks?templateId=${encodeURIComponent(templateId)}`)
  }

  const openTemplateDetail = (templateId: string) => {
    window.location.assign(`#/standards/templates/${encodeURIComponent(templateId)}`)
  }

  const currentTemplateLabel = activeKind === 'project' ? '项目模版' : '任务模版'
  const currentHash =
    typeof window === 'undefined' ? '#/standards' : window.location.hash || '#/standards'

  return (
    <AppShell
      classNamePrefix="sm"
      sidebar={<AppSidebar currentHash={currentHash} />}
      header={
        <PageHeader
          title="标准管理"
          subtitle="Standard Management"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="搜索标准模版..."
        />
      }
    >
      <div className="sm-top-tabs" role="tablist" aria-label="标准类型">
        <button
          type="button"
          className={activeTopTab === 'standard' ? 'sm-top-tab active' : 'sm-top-tab'}
          onClick={() => setActiveTopTab('standard')}
        >
          标准文件
        </button>
        <button
          type="button"
          className={activeTopTab === 'project' ? 'sm-top-tab active' : 'sm-top-tab'}
          onClick={() => setActiveTopTab('project')}
        >
          项目模版
        </button>
        <button
          type="button"
          className={activeTopTab === 'task' ? 'sm-top-tab active' : 'sm-top-tab'}
          onClick={() => setActiveTopTab('task')}
        >
          任务模版
        </button>
      </div>

      <StatsCards
        items={statCards}
        assetBase={ASSET_BASE}
        className="pm-stats-row"
        classNamePrefix="pm"
      />

      <section className="sm-table-section">
        <ListToolbar
          className="sm-toolbar"
          viewModes={[
            { key: 'grid', label: '网格' },
            { key: 'list', label: '列表' },
          ]}
          activeView={viewMode}
          onViewChange={view => setViewMode(view as 'grid' | 'list')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="搜索模版..."
          rightSlot={
            <>
              <button type="button" className="sm-filter-btn" aria-label="筛选">
                <img src={`${ASSET_BASE}/14.svg`} alt="" />
                <img src={`${ASSET_BASE}/15.svg`} alt="" />
              </button>
              <button type="button" className="sm-filter-btn" aria-label="排序">
                <img src={`${ASSET_BASE}/16.svg`} alt="" />
                <img src={`${ASSET_BASE}/17.svg`} alt="" />
              </button>
              <button type="button" className="sm-primary-btn">
                <img src={`${ASSET_BASE}/11.svg`} alt="" />
                新建模版
              </button>
              <button type="button" className="sm-icon-mini" aria-label="更多">
                <img src={`${ASSET_BASE}/12.svg`} alt="" />
              </button>
            </>
          }
        />

        <div className="sm-table-wrap">
          <table className="sm-table">
            <thead>
              <tr>
                <th>模版名称</th>
                <th className="center">分类</th>
                <th className="center">使用次数</th>
                <th className="center">更新时间</th>
                <th className="center">操作</th>
              </tr>
            </thead>
            <tbody>
              {activeTopTab === 'standard' ? (
                <tr>
                  <td colSpan={5} className="center">
                    标准文件模块即将接入，当前请先在“项目模版 / 任务模版”中维护模板数据。
                  </td>
                </tr>
              ) : filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="center">
                    未找到匹配的{currentTemplateLabel}
                  </td>
                </tr>
              ) : (
                filteredTemplates.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="sm-name-cell">
                        <span className={`sm-row-icon ${item.listMeta.iconTone}`}>
                          <img src={`${ASSET_BASE}/${item.listMeta.icon}`} alt="" />
                        </span>
                        <div className="sm-name-content">
                          <div className="sm-name-line">
                            <button
                              type="button"
                              className="sm-name-link"
                              onClick={() => openTemplateDetail(item.id)}
                            >
                              <strong>{item.name}</strong>
                            </button>
                            {item.listMeta.builtin && <span className="sm-builtin">内置</span>}
                          </div>
                          <p>{item.listMeta.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="center">{item.listMeta.category}</td>
                    <td className="center">{item.listMeta.usageCount} 次</td>
                    <td className="center">
                      <div className="sm-update-cell">
                        <span>{item.listMeta.updatedAt}</span>
                        <small>{item.listMeta.owner}</small>
                      </div>
                    </td>
                    <td className="center">
                      <div className="sm-actions">
                        <button type="button" onClick={() => openTemplateDetail(item.id)}>
                          <img src={`${ASSET_BASE}/${item.listMeta.viewIcon}`} alt="" />
                          查看详情
                        </button>
                        <button type="button" onClick={() => openTemplateTasks(item.id)}>
                          <img src={`${ASSET_BASE}/${item.listMeta.copyIcon}`} alt="" />
                          查看任务
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            total={activeTopTab === 'standard' ? 0 : filteredTemplates.length}
            currentPage={1}
            pageSize={Math.max(1, activeTopTab === 'standard' ? 1 : filteredTemplates.length || 1)}
            onPageChange={() => undefined}
            classNamePrefix="sm"
          />
        </div>
      </section>
    </AppShell>
  )
}

export default StandardManagementPage
