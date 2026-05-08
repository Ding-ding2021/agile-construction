import { Router } from 'express'
import {
  getProcurements,
  getProcurement,
  createProcurement,
  updateProcurement,
  deleteProcurement,
  getSuppliers,
} from '../controllers/procurement'

const router = Router()

router.get('/', getProcurements)
router.get('/suppliers', getSuppliers)
router.get('/:id', getProcurement)
router.post('/', createProcurement)
router.put('/:id', updateProcurement)
router.delete('/:id', deleteProcurement)

export default router
