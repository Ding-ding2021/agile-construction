import { suppliers } from '../../components/resource/suppliers'
import type { SupplierItem } from '../../components/resource/supplier.types'

const SUPPLIER_STORAGE_KEY = 'pm-supplier-state-v1'

const createInitialState = (): SupplierItem[] =>
  suppliers.map(item => ({
    ...item,
    serviceAreas: [...item.serviceAreas],
  }))

const readLocalState = (): SupplierItem[] => {
  try {
    const raw = window.localStorage.getItem(SUPPLIER_STORAGE_KEY)
    if (!raw) {
      return createInitialState()
    }

    const parsed = JSON.parse(raw) as SupplierItem[]
    return Array.isArray(parsed) ? parsed : createInitialState()
  } catch {
    return createInitialState()
  }
}

const persistLocalState = (items: SupplierItem[]) => {
  try {
    window.localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore local storage errors
  }
}

const normalizeNumber = (id: string): number => {
  const matched = id.match(/\d+/g)
  if (!matched?.length) {
    return 0
  }

  return Number(matched.join('')) || 0
}

export const supplierRepository = {
  loadSuppliers(): SupplierItem[] {
    return readLocalState()
  },

  saveSuppliers(items: SupplierItem[]) {
    persistLocalState(items)
  },

  getNextSupplierId(items: SupplierItem[]): string {
    const maxId = items.reduce((max, item) => Math.max(max, normalizeNumber(item.id)), 1000)
    return `S${String(maxId + 1)}`
  },
}
