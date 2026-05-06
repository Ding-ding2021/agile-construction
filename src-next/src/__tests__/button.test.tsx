import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>点击</Button>)
    expect(screen.getByRole('button', { name: '点击' })).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Button variant="destructive">删除</Button>)
    const btn = screen.getByRole('button', { name: '删除' })
    expect(btn).toBeInTheDocument()
  })

  it('applies size classes', () => {
    render(<Button size="lg">大按钮</Button>)
    expect(screen.getByRole('button', { name: '大按钮' })).toBeInTheDocument()
  })
})
