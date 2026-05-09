import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TreeDataTable } from '@/components/data-table-tree'
import type { ColumnDef } from '@tanstack/react-table'

interface TestItem {
  id: number
  name: string
  subRows?: TestItem[]
}

const columns: ColumnDef<TestItem>[] = [
  {
    accessorKey: 'name',
    header: '名称',
  },
]

const treeData: TestItem[] = [
  {
    id: 1,
    name: '根节点 1',
    subRows: [
      { id: 2, name: '子节点 1-1' },
      { id: 3, name: '子节点 1-2', subRows: [{ id: 4, name: '孙节点 1-2-1' }] },
    ],
  },
  {
    id: 5,
    name: '根节点 2',
  },
]

describe('TreeDataTable', () => {
  it('renders tree data with expandable rows', () => {
    render(
      <TreeDataTable data={treeData} columns={columns} getSubRows={item => item.subRows ?? []} />
    )

    expect(screen.getByText('根节点 1')).toBeInTheDocument()
    expect(screen.getByText('根节点 2')).toBeInTheDocument()

    const expandButtons = screen.getAllByLabelText('展开')
    expect(expandButtons.length).toBe(1)
  })

  it('shows empty state when no data', () => {
    render(<TreeDataTable data={[]} columns={columns} />)

    expect(screen.getByText('暂无数据')).toBeInTheDocument()
  })

  it('accepts custom getSubRows', () => {
    const customData: TestItem[] = [
      {
        id: 1,
        name: 'Parent',
        subRows: [{ id: 2, name: 'Child' }],
      },
    ]

    render(
      <TreeDataTable data={customData} columns={columns} getSubRows={item => item.subRows ?? []} />
    )

    expect(screen.getByText('Parent')).toBeInTheDocument()
  })

  it('renders checkboxes in select column', () => {
    render(
      <TreeDataTable data={treeData} columns={columns} getSubRows={item => item.subRows ?? []} />
    )

    const checkboxes = screen.getAllByLabelText('选择行')
    expect(checkboxes.length).toBe(2)
  })

  it('toggles expand when arrow is clicked', () => {
    render(
      <TreeDataTable data={treeData} columns={columns} getSubRows={item => item.subRows ?? []} />
    )

    expect(screen.queryByText('子节点 1-1')).not.toBeInTheDocument()

    const expandBtn = screen.getByLabelText('展开')
    fireEvent.click(expandBtn)

    expect(screen.getByText('子节点 1-1')).toBeInTheDocument()
  })

  it('shows selected count in footer', () => {
    render(
      <TreeDataTable data={treeData} columns={columns} getSubRows={item => item.subRows ?? []} />
    )

    expect(screen.getByText(/已选 0 项/)).toBeInTheDocument()
  })
})
