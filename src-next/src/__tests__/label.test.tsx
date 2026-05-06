import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/label'

describe('Label', () => {
  it('renders with text content', () => {
    render(<Label>用户名</Label>)
    expect(screen.getByText('用户名')).toBeInTheDocument()
  })

  it('forwards className', () => {
    render(<Label className="test-class">test</Label>)
    expect(screen.getByText('test')).toHaveClass('test-class')
  })
})
