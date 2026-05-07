import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

describe('Card', () => {
  it('renders card with content', () => {
    render(<Card>内容</Card>)
    expect(screen.getByText('内容')).toBeInTheDocument()
  })

  it('renders compound card', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>标题</CardTitle>
          <CardDescription>描述</CardDescription>
        </CardHeader>
        <CardContent>主体</CardContent>
        <CardFooter>底部</CardFooter>
      </Card>
    )
    expect(screen.getByText('标题')).toBeInTheDocument()
    expect(screen.getByText('描述')).toBeInTheDocument()
    expect(screen.getByText('主体')).toBeInTheDocument()
    expect(screen.getByText('底部')).toBeInTheDocument()
  })
})
