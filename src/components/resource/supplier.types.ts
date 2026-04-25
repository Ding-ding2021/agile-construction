export type SupplierStatus = '合作中' | '待审核' | '已暂停' | '已过期'

export type SupplierAvailabilityStatus = 'assignable' | 'busy' | 'unavailable'

export type SupplierQualificationStatus = '齐全' | '临期' | '需补齐'

export type SupplierItem = {
  id: string
  name: string
  code: string
  category: string
  status: SupplierStatus
  rating: string
  ratingIcon: string
  contact: string
  city: string
  actionIcon: string
  currentTaskCount: number
  availabilityStatus: SupplierAvailabilityStatus
  qualificationStatus: SupplierQualificationStatus
  serviceAreas: string[]
}
