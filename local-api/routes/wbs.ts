import { Router } from 'express'
import * as wbsCtrl from '../controllers/wbs'

const router = Router()

router.get('/', wbsCtrl.getWBSTree)
router.post('/', wbsCtrl.createWBSNode)
router.put('/:id', wbsCtrl.updateWBSNode)
router.delete('/:id', wbsCtrl.deleteWBSNode)

export default router
