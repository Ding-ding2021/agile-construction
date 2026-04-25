/**
 * 项目成员卡片组件
 * 展示项目团队成员和角色信息
 */

import { EmptyState } from '../shared'
import type { ProjectMember } from '../../data/projects'

type ProjectMembersCardProps = {
  members: ProjectMember[]
  onMemberClick?: (member: ProjectMember) => void
}

const ProjectMembersCard = ({ members, onMemberClick }: ProjectMembersCardProps) => {
  if (members.length === 0) {
    return (
      <div className="card members-card">
        <div className="card-header">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          <h2>项目团队</h2>
        </div>
        <EmptyState
          icon={
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          }
          title="暂无团队成员"
          description="请添加项目成员"
          compact
        />
      </div>
    )
  }

  // 按角色排序（项目经理优先）
  const sortedMembers = [...members].sort((a, b) => {
    const roleOrder: Record<string, number> = {
      项目总监: 0,
      项目经理: 1,
      施工主管: 2,
      施工经理: 2,
      设计主管: 3,
      设计经理: 3,
      验收专员: 4,
      采购经理: 5,
      协调员: 6,
    }
    return (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99)
  })

  // 获取头像首字母
  const getAvatarText = (name: string) => {
    return name.slice(0, 1)
  }

  return (
    <div className="card members-card">
      <div className="card-header">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
        <h2>项目团队</h2>
        <span className="members-count">{members.length}</span>
      </div>

      {/* 成员列表 */}
      <div className="members-list">
        {sortedMembers.map(member => (
          <div
            key={member.id}
            className="member-item"
            onClick={() => onMemberClick?.(member)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                onMemberClick?.(member)
              }
            }}
          >
            {/* 头像 */}
            <div className="member-avatar">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} />
              ) : (
                <span className="member-avatar-text">{getAvatarText(member.name)}</span>
              )}
            </div>

            {/* 基本信息 */}
            <div className="member-info">
              <div className="member-name">{member.name}</div>
              <div className="member-role">{member.role}</div>
            </div>

            {/* 详细信息 */}
            <div className="member-details">
              <div className="member-detail-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
                <span>{member.department}</span>
              </div>
              <div className="member-detail-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span>{member.phone}</span>
              </div>
              <div className="member-detail-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span className="member-email">{member.email}</span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="member-actions">
              <button
                type="button"
                className="member-action-btn"
                onClick={e => {
                  e.stopPropagation()
                  window.location.href = `tel:${member.phone}`
                }}
                aria-label="拨打电话"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </button>
              <button
                type="button"
                className="member-action-btn"
                onClick={e => {
                  e.stopPropagation()
                  window.location.href = `mailto:${member.email}`
                }}
                aria-label="发送邮件"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectMembersCard
