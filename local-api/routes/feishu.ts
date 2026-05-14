import { Router } from 'express'
import * as feishuCtrl from '../controllers/feishu'

const router = Router()

router.post('/webhook', feishuCtrl.webhook)
router.get('/queue', feishuCtrl.getQueue)
router.post('/respond', feishuCtrl.respond)
router.post('/heartbeat', feishuCtrl.heartbeat)
router.get('/status', feishuCtrl.getStatus)

export default router
