import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
