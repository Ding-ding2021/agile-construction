/* eslint-disable @typescript-eslint/no-explicit-any -- 测试 mock 需要 any */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProjectCard from '../ProjectCard'
import type { ProjectItem } from '../../../data/projects'

// Build a minimal ProjectItem compatible with ProjectCard props
const mockProject: ProjectItem = {
  code: 'PRJ-TEST',
  name: 'Test Project',
  brand: 'BrandX',
  stage: '启动' as any,
  status: '进行中',
  statusTone: 'blue' as any,
  progress: 40,
  budget: '100000',
  teamSize: '5',
  dateRange: '2026-04-01 ~ 2026-04-30',
  description: '测试项目',
  milestone: '',
  tasks: '',
  riskLevel: null,
  riskCount: 0,
  plannedOpenDate: '2026-04-01',
  owner: 'alice',
}

describe('ProjectCard', () => {
  it('renders project name and opens on click when provided', () => {
    const onClick = vi.fn()
    render(<ProjectCard project={mockProject} variant="grid" onClick={onClick} />)
    // Check the name appears in the grid
    expect(screen.getByLabelText(`Project ${mockProject.name}`)).toBeInTheDocument()
    // Click the Open button
    const openBtn = screen.getByRole('button', { name: /打开/i })
    fireEvent.click(openBtn)
    expect(onClick).toHaveBeenCalled()
  })
})
