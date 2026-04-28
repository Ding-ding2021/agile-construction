import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectDetailPage from '../ProjectDetailPage'
import type { ProjectItem } from '../../../data/projects'

const mockProject: ProjectItem = {
  code: 'PRJ001',
  name: '测试项目',
  brand: 'test-brand',
  stage: '启动',
  status: 'active',
  statusTone: 'blue',
  progress: 50,
  budget: '500000',
  teamSize: '10',
  dateRange: '2026-01 ~ 2026-06',
  description: '测试项目描述',
  milestone: '0/5',
  tasks: '0/10',
  plannedOpenDate: '2026-01-01',
  owner: 'tester',
  riskLevel: null as any,
  riskCount: 0 as any,
}

describe('ProjectDetailPage', () => {
  it('renders project name in header', () => {
    render(<ProjectDetailPage project={mockProject} activeTab="overview" onBack={() => {}} />)
    expect(screen.getAllByText('测试项目').length).toBeGreaterThan(0)
  })
})
