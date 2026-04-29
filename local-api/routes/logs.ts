import { Router } from 'express'
import * as logCtrl from '../controllers/logs'

const router = Router()

router.get('/', logCtrl.getStatusLogs)
router.post('/', logCtrl.createStatusLog)

export default router
