import { Router } from 'express'
import * as auditCtrl from '../controllers/audit'

const router = Router()

router.get('/', auditCtrl.getAuditLogs)
router.post('/', auditCtrl.createAuditLog)

export default router
