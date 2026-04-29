import { Router } from 'express'
import * as milestoneCtrl from '../controllers/milestones'

const router = Router()

router.get('/', milestoneCtrl.getMilestones)
router.post('/', milestoneCtrl.createMilestone)

export default router
