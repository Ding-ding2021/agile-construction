import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectDetailPage from '../ProjectDetailPage'
import type { ProjectItem } from '../../../data/projects'

const mockProject: ProjectItem = {
  code: 'PRJ001',
  name: '测试项目',
  brand: 'test-brand',
  stage: 'design',
  status: 'active',
  statusTone: 'blue',
  progress: 50,
  area: 1000,
  budget: 500000,
  teamSize: 10,
  dateRange: '2026-01 ~ 2026-06',
  description: '测试项目描述',
  city: '上海',
  district: '浦东',
  address: '测试地址',
  taskCount: 5,
  completedTasks: 2,
}

describe('ProjectDetailPage', () => {
  it('renders project name in header', () => {
    render(<ProjectDetailPage project={mockProject} activeTab="overview" onBack={() => {}} />)
    expect(screen.getAllByText('测试项目').length).toBeGreaterThan(0)
  })
})
