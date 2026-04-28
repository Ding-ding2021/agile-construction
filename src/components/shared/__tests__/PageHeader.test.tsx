import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PageHeader from '../navigation/PageHeader'

describe('PageHeader', () => {
  it('renders title text in an h1', () => {
    render(<PageHeader title="Dashboard" subtitle="Overview" />)
    const heading = screen.getByRole('heading', { name: 'Dashboard' })
    expect(heading).toBeDefined()
  })

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Title" subtitle="Sub" />)
    expect(screen.getByText('Sub')).toBeDefined()
  })
})
