import { Router } from 'express'
import * as taskCtrl from '../controllers/tasks'

const router = Router()

router.get('/', taskCtrl.getTasks)
router.post('/', taskCtrl.createTask)
router.get('/tree', taskCtrl.getTaskTree)
router.put('/:taskId', taskCtrl.updateTask)
router.delete('/:taskId', taskCtrl.deleteTask)

export default router
