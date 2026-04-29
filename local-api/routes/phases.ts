import { Router } from 'express'
import * as phaseCtrl from '../controllers/phases'

const router = Router()

router.get('/', phaseCtrl.getPhases)
router.post('/', phaseCtrl.createPhase)

export default router
