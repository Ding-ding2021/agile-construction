import React from 'react'
import { render, screen } from '@testing-library/react'
import ProjectDetailPage from '../ProjectDetailPage'
import { PROJECT_DETAIL_TABS } from '../projectTabs.shared'

// Minimal props interface assumed by the component; if not required, this prop is ignored by the component
const defaultProps = {
  projectId: 'test-project',
}

describe('ProjectDetailPage', () => {
  test('renders and displays detail tabs', () => {
    render(<ProjectDetailPage {...defaultProps} />)

    // Tabs could be strings or objects with label text
    const tabs = PROJECT_DETAIL_TABS
    tabs.forEach((tab: any) => {
      const label = typeof tab === 'string' ? tab : (tab.label ?? tab.name ?? '')
      if (label) {
        // Try to find tab by its label text
        expect(screen.getByText(label)).toBeInTheDocument()
      }
    })
  })
})
