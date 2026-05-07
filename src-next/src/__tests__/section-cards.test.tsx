import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionCards } from '@/components/section-cards'

describe('SectionCards', () => {
  const mockMetrics = [
    {
      title: '总人数',
      value: '42',
      trend: 'up' as const,
      trendLabel: '+5%',
      description: '较上月增长',
    },
    { title: '在岗', value: '35', trend: 'neutral' as const, trendLabel: '持平' },
    { title: '项目数', value: '12' },
  ]

  it('renders all metric cards', () => {
    render(<SectionCards metrics={mockMetrics} />)
    expect(screen.getByText('总人数')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('在岗')).toBeInTheDocument()
    expect(screen.getByText('35')).toBeInTheDocument()
    expect(screen.getByText('项目数')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('renders trend labels', () => {
    render(<SectionCards metrics={mockMetrics} />)
    expect(screen.getByText('+5%')).toBeInTheDocument()
    expect(screen.getByText('持平')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<SectionCards metrics={mockMetrics} />)
    expect(screen.getByText('较上月增长')).toBeInTheDocument()
  })

  it('applies className', () => {
    const { container } = render(<SectionCards metrics={mockMetrics} className="test-grid" />)
    expect(container.firstChild).toHaveClass('test-grid')
  })

  it('handles empty metrics', () => {
    const { container } = render(<SectionCards metrics={[]} />)
    expect(container.firstChild?.childNodes.length).toBe(0)
  })
})
