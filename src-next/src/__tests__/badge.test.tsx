import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  it('renders with text', () => {
    render(<Badge>标签</Badge>)
    expect(screen.getByText('标签')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Badge variant="destructive">危险</Badge>)
    expect(screen.getByText('危险')).toBeInTheDocument()
  })

  it('forwards className', () => {
    render(<Badge className="custom-class">测试</Badge>)
    expect(screen.getByText('测试')).toHaveClass('custom-class')
  })
})
