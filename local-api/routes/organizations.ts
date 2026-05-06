import { Router } from 'express'
import * as orgCtrl from '../controllers/organizations'

const router = Router()

router.get('/', orgCtrl.getOrganizations)
router.get('/:id', orgCtrl.getOrganization)
router.post('/', orgCtrl.createOrganization)

export default router
