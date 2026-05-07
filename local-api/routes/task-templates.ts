import { Router } from 'express'
import * as templateCtrl from '../controllers/templates'

const router = Router()

router.get('/', templateCtrl.getTaskTemplates)
router.get('/:id', templateCtrl.getTaskTemplate)
router.post('/', templateCtrl.createTaskTemplate)
router.put('/:id', templateCtrl.updateTaskTemplate)
router.delete('/:id', templateCtrl.deleteTaskTemplate)

export default router
