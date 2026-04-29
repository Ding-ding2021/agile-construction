import { Router } from 'express'
import * as riskCtrl from '../controllers/risks'

const router = Router()

router.get('/', riskCtrl.getRisks)
router.post('/', riskCtrl.createRisk)

export default router
