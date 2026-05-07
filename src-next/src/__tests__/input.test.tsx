import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="请输入" />)
    expect(screen.getByPlaceholderText('请输入')).toBeInTheDocument()
  })

  it('accepts value changes', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="输入" />)
    const input = screen.getByPlaceholderText('输入')
    await user.type(input, '测试')
    expect(input).toHaveValue('测试')
  })

  it('forwards className', () => {
    render(<Input className="custom-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })
})
