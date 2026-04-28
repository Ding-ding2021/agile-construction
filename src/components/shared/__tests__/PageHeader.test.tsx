import React from 'react'
import { render, screen } from '@testing-library/react'
import PageHeader from '../PageHeader'

describe('PageHeader', () => {
  test('renders title', () => {
    render(<PageHeader title="Dashboard" />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  test('renders search input with placeholder when provided', () => {
    render(<PageHeader title="Search" searchPlaceholder="Search items..." />)
    const input = screen.getByPlaceholderText('Search items...')
    expect(input).toBeInTheDocument()
  })
})
