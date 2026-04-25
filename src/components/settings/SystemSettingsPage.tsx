import { useMemo, useState } from 'react'
import { AppShell, AppSidebar, ListToolbar, StatsCards, PageHeader, EmptyState } from '../shared'

type SettingsViewMode = 'list' | 'kanban' | 'audit'
type PublishStatus = '草稿' | '待发布' | '已发布' | '已回滚'

type SettingModule = {
  id: string
  name: string
  scope: string
  owner: string
  updatedAt: string
  status: PublishStatus
  risk: '低' | '中' | '高'
  impact: string
}

type AuditItem = {
  id: string
  operator: string
  action: string
  module: string
  time: string
  detail: string
}

const settingModules: SettingModule[] = [
  {
    id: 'SET-ORG-001',
    name: '组织与租户参数',
    scope: 'org: 华东事业部',
    owner: '李想',
    updatedAt: '2026-04-07 09:30',
    status: '待发布',
    risk: '中',
    impact: '影响 3 个模块 / 26 个角色',
  },
  {
    id: 'SET-RBAC-002',
    name: '角色权限策略（RBAC）',
    scope: 'role: 项目经理',
    owner: '周敏',
    updatedAt: '2026-04-07 08:52',
    status: '草稿',
    risk: '高',
    impact: '影响 2 个模块 / 14 个角色',
  },
  {
    id: 'SET-NOTI-003',
    name: '通知与模板策略',
    scope: 'global',
    owner: '吴青',
    updatedAt: '2026-04-06 18:11',
    status: '已发布',
    risk: '低',
    impact: '影响 4 个模块 / 站内通知全量',
  },
  {
    id: 'SET-SEC-004',
    name: '安全策略（登录与会话）',
    scope: 'global',
    owner: '陈果',
    updatedAt: '2026-04-06 15:40',
    status: '已回滚',
    risk: '高',
    impact: '影响登录与 API Token 能力',
  },
  {
    id: 'SET-DICT-005',
    name: '字典与阈值参数',
    scope: 'org: 华北事业部',
    owner: '赵琳',
    updatedAt: '2026-04-05 20:16',
    status: '已发布',
    risk: '中',
    impact: '影响 SLA 阈值与状态枚举',
  },
]

const auditItems: AuditItem[] = [
  {
    id: 'AUD-2031',
    operator: '周敏',
    action: '发布审批',
    module: '权限策略',
    time: '2026-04-07 09:10',
    detail: '通过双人确认，发布资源按钮级权限调整。',
  },
  {
    id: 'AUD-2030',
    operator: '陈果',
    action: '回滚',
    module: '安全策略',
    time: '2026-04-06 16:02',
    detail: '检测到异常锁定率升高，回滚到稳定版本 v2.1.3。',
  },
  {
    id: 'AUD-2029',
    operator: '吴青',
    action: '渠道健康检查',
    module: '通知模板',
    time: '2026-04-06 14:45',
    detail: 'Webhook 连通性测试通过，延迟 92ms。',
  },
]

const statusToneClass: Record<PublishStatus, string> = {
  草稿: 'ss-tag-neutral',
  待发布: 'ss-tag-warn',
  已发布: 'ss-tag-success',
  已回滚: 'ss-tag-danger',
}

const riskToneClass: Record<SettingModule['risk'], string> = {
  低: 'ss-risk-low',
  中: 'ss-risk-mid',
  高: 'ss-risk-high',
}

const stats = {
  draft: settingModules.filter(item => item.status === '草稿').length,
  pending: settingModules.filter(item => item.status === '待发布').length,
  published: settingModules.filter(item => item.status === '已发布').length,
  risky: settingModules.filter(item => item.risk === '高').length,
}

const SystemSettingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<SettingsViewMode>('list')
  const [activeStatKey, setActiveStatKey] = useState<'all' | 'draft' | 'pending' | 'risky'>('all')

  const filteredModules = useMemo(() => {
    return settingModules.filter(item => {
      const bySearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())

      const byStat =
        activeStatKey === 'all'
          ? true
          : activeStatKey === 'draft'
            ? item.status === '草稿'
            : activeStatKey === 'pending'
              ? item.status === '待发布'
              : item.risk === '高'

      return bySearch && byStat
    })
  }, [searchQuery, activeStatKey])

  const moduleGroups = useMemo(() => {
    return {
      草稿: filteredModules.filter(item => item.status === '草稿'),
      待发布: filteredModules.filter(item => item.status === '待发布'),
      已发布: filteredModules.filter(item => item.status === '已发布'),
      已回滚: filteredModules.filter(item => item.status === '已回滚'),
    }
  }, [filteredModules])

  const handlePublish = (moduleName: string) => {
    const confirmed = window.confirm(`发布 ${moduleName} 前将执行影响分析与双人确认，是否继续？`)
    if (!confirmed) {
      return
    }

    window.alert('已提交发布审批：影响范围与差异对比（JSON Diff）已生成。')
  }

  const handleDiff = (moduleName: string) => {
    window.alert(`${moduleName}\n\n变更前后 JSON Diff 已准备，可在审计中心查看详情。`)
  }

  const handleDangerAction = (moduleName: string) => {
    const confirmed = window.confirm(
      `危险操作：回滚 ${moduleName}\n\n该操作将影响线上配置，确认继续？`
    )
    if (!confirmed) {
      return
    }

    window.alert('回滚任务已创建，操作留痕已记录。')
  }

  const currentHash =
    typeof window === 'undefined' ? '#/settings' : window.location.hash || '#/settings'

  const statItems = [
    {
      key: 'all',
      icon: '1.svg',
      label: '配置总数',
      value: settingModules.length,
      tone: 'blue' as const,
    },
    { key: 'draft', icon: '3.svg', label: '草稿中', value: stats.draft, tone: 'purple' as const },
    {
      key: 'pending',
      icon: '4.svg',
      label: '待发布',
      value: stats.pending,
      tone: 'orange' as const,
    },
    {
      key: 'risky',
      icon: '5.svg',
      label: '高风险变更',
      value: stats.risky,
      tone: 'green' as const,
    },
  ]

  return (
    <AppShell
      rootClassName="pm-app"
      glowClassPrefix="pm-glow"
      workspaceClassName="pm-workspace"
      mainClassName="pm-main"
      sidebar={<AppSidebar currentHash={currentHash} />}
      header={
        <PageHeader
          title="系统设置"
          subtitle="System Settings"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="搜索配置项 / 模块编码"
        />
      }
    >
      <div className="pm-body">
        <StatsCards
          items={statItems}
          activeKey={activeStatKey}
          onItemClick={key => setActiveStatKey(key as 'all' | 'draft' | 'pending' | 'risky')}
          assetBase="/assets/CodeBubbyAssets/3848_19"
          className="pm-stats-row"
        />

        <section className="ss-panel">
          <ListToolbar
            viewModes={[
              { key: 'list', label: '列表' },
              { key: 'kanban', label: '看板' },
              { key: 'audit', label: '审计' },
            ]}
            activeView={viewMode}
            onViewChange={view => setViewMode(view as SettingsViewMode)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            className="pm-table-toolbar"
            searchPlaceholder="搜索配置项 / 模块编码"
            rightSlot={
              <>
                <button type="button" className="pm-filter-btn">
                  影响分析
                </button>
                <button type="button" className="pm-filter-btn">
                  导出审计
                </button>
                <button type="button" className="pm-add-user-btn">
                  新建配置
                </button>
              </>
            }
          />

          {viewMode === 'list' && (
            <div className="ss-list-wrap">
              {filteredModules.map(item => (
                <article key={item.id} className="ss-module-card">
                  <div className="ss-module-head">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.id}</p>
                    </div>
                    <span className={`ss-status-tag ${statusToneClass[item.status]}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="ss-meta-grid">
                    <span>作用域：{item.scope}</span>
                    <span>负责人：{item.owner}</span>
                    <span>更新时间：{item.updatedAt}</span>
                    <span className={`ss-risk-tag ${riskToneClass[item.risk]}`}>
                      风险：{item.risk}
                    </span>
                  </div>

                  <div className="ss-impact-row">
                    <strong>影响范围：</strong>
                    <span>{item.impact}</span>
                  </div>

                  <div className="ss-actions">
                    <button
                      type="button"
                      className="pm-btn-secondary"
                      onClick={() => handleDiff(item.name)}
                    >
                      差异对比
                    </button>
                    <button
                      type="button"
                      className="pm-btn-primary"
                      onClick={() => handlePublish(item.name)}
                    >
                      发布申请
                    </button>
                    <button
                      type="button"
                      className="ss-danger-btn"
                      onClick={() => handleDangerAction(item.name)}
                    >
                      回滚
                    </button>
                  </div>
                </article>
              ))}
              {filteredModules.length === 0 && <EmptyState title="暂无匹配的配置项" compact />}
            </div>
          )}

          {viewMode === 'kanban' && (
            <div className="ss-kanban-grid">
              {(Object.keys(moduleGroups) as PublishStatus[]).map(statusKey => (
                <section key={statusKey} className="ss-kanban-col">
                  <header>
                    <h4>{statusKey}</h4>
                    <span>{moduleGroups[statusKey].length}</span>
                  </header>
                  <div className="ss-kanban-list">
                    {moduleGroups[statusKey].map(item => (
                      <button
                        type="button"
                        key={item.id}
                        className="ss-kanban-card"
                        onClick={() => handleDiff(item.name)}
                      >
                        <strong>{item.name}</strong>
                        <p>{item.id}</p>
                        <span className={`ss-risk-tag ${riskToneClass[item.risk]}`}>
                          风险：{item.risk}
                        </span>
                      </button>
                    ))}
                    {moduleGroups[statusKey].length === 0 && (
                      <EmptyState title="暂无数据" compact />
                    )}
                  </div>
                </section>
              ))}
            </div>
          )}

          {viewMode === 'audit' && (
            <div className="ss-audit-list">
              {auditItems.map(item => (
                <article key={item.id} className="ss-audit-item">
                  <div className="ss-audit-top">
                    <strong>{item.action}</strong>
                    <span>{item.time}</span>
                  </div>
                  <p>{item.detail}</p>
                  <div className="ss-audit-meta">
                    <span>{item.operator}</span>
                    <span>{item.module}</span>
                    <span>{item.id}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}

export default SystemSettingsPage
