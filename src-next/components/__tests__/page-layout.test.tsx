import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageLayout } from '@/components/page-layout'

describe('PageLayout', () => {
  it('renders children', () => {
    render(
      <PageLayout>
        <div>test content</div>
      </PageLayout>
    )
    expect(screen.getByText('test content')).toBeDefined()
  })

  it('renders text children', () => {
    render(
      <PageLayout>
        <span>hello</span>
      </PageLayout>
    )
    expect(screen.getByText('hello')).toBeDefined()
  })

  it('applies custom className to inner container', () => {
    const { container } = render(
      <PageLayout className="extra-class">
        <div>test</div>
      </PageLayout>
    )
    const inner = container.querySelector('.p-4')
    expect(inner).toBeTruthy()
    expect(inner?.className).toContain('extra-class')
  })

  it('has base responsive layout classes', () => {
    const { container } = render(
      <PageLayout>
        <div>test</div>
      </PageLayout>
    )
    const outer = container.firstChild as HTMLElement
    expect(outer.className).toContain('flex')
    expect(outer.className).toContain('flex-col')
    expect(outer.className).toContain('h-full')
  })

  it('has scrollable middle container', () => {
    const { container } = render(
      <PageLayout>
        <div>test</div>
      </PageLayout>
    )
    const outer = container.firstChild as HTMLElement
    const scrollable = outer.firstChild as HTMLElement
    expect(scrollable.className).toContain('flex-1')
    expect(scrollable.className).toContain('overflow-auto')
  })

  it('has inner container with padding and spacing classes', () => {
    const { container } = render(
      <PageLayout>
        <div>test</div>
      </PageLayout>
    )
    const outer = container.firstChild as HTMLElement
    const scrollable = outer.firstChild as HTMLElement
    const inner = scrollable.firstChild as HTMLElement
    expect(inner.className).toContain('p-4')
    expect(inner.className).toContain('space-y-4')
  })
})
