import { create } from 'zustand'
import { wbsApi } from '@/services/api'
import { buildWBSTree } from '@/lib/wbs-utils'
import type { WBSNode } from '@/types/wbs'

interface WBSState {
  flatNodes: WBSNode[]
  tree: WBSNode[]
  selectedId: number | null
  expandedIds: number[]
  loading: boolean
  error: string | null

  loadTree: (projectCode: string) => Promise<void>
  selectNode: (id: number | null) => void
  toggleExpand: (id: number) => void
  expandAll: () => void
  collapseAll: () => void
  addNode: (projectCode: string, data: Record<string, unknown>) => Promise<void>
  updateNode: (id: number, data: Record<string, unknown>) => Promise<void>
  deleteNode: (id: number) => Promise<void>
}

export const useWBSStore = create<WBSState>((set, get) => ({
  flatNodes: [],
  tree: [],
  selectedId: null,
  expandedIds: [],
  loading: false,
  error: null,

  loadTree: async projectCode => {
    set({ loading: true, error: null })
    try {
      const flatNodes = await wbsApi.getTree(projectCode)
      const tree = buildWBSTree(flatNodes)
      set({ flatNodes, tree, loading: false })
    } catch (e) {
      set({ error: e instanceof Error ? e.message : '加载 WBS 失败', loading: false })
    }
  },

  selectNode: id => set({ selectedId: id }),

  toggleExpand: id => {
    const expanded = [...get().expandedIds]
    const idx = expanded.indexOf(id)
    if (idx >= 0) {
      expanded.splice(idx, 1)
    } else {
      expanded.push(id)
    }
    set({ expandedIds: expanded })
  },

  expandAll: () => set({ expandedIds: get().flatNodes.map(n => n.id) }),
  collapseAll: () => set({ expandedIds: [] }),

  addNode: async (projectCode, data) => {
    await wbsApi.create(projectCode, data)
    await get().loadTree(projectCode)
  },

  updateNode: async (id, data) => {
    const pc = get().flatNodes.find(n => n.id === id)?.projectCode
    if (!pc) return
    await wbsApi.update(pc, id, data)
    await get().loadTree(pc)
  },

  deleteNode: async id => {
    const pc = get().flatNodes.find(n => n.id === id)?.projectCode
    if (!pc) return
    await wbsApi.delete(pc, id)
    set({ selectedId: null })
    await get().loadTree(pc)
  },
}))
