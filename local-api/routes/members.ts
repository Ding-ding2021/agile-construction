import { Router } from 'express'
import * as memberCtrl from '../controllers/members'

const router = Router()

router.get('/', memberCtrl.getMembers)
router.post('/', memberCtrl.createMember)

export default router
