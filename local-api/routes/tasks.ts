import { Router } from 'express'
import * as taskCtrl from '../controllers/tasks'
import * as taskLogCtrl from '../controllers/taskLogs'
import * as taskSubCtrl from '../controllers/taskSubmissions'

const router = Router()

router.get('/', taskCtrl.getTasks)
router.post('/', taskCtrl.createTask)
router.get('/tree', taskCtrl.getTaskTree)
router.put('/:taskId', taskCtrl.updateTask)
router.delete('/:taskId', taskCtrl.deleteTask)

// 子资源：事件日志
router.get('/:taskId/logs', taskLogCtrl.getTaskLogs)
router.post('/:taskId/logs', taskLogCtrl.createTaskLog)

// 子资源：提交记录
router.get('/:taskId/submissions', taskSubCtrl.getTaskSubmissions)
router.post('/:taskId/submissions', taskSubCtrl.createTaskSubmission)
router.put('/:taskId/submissions/:subId/review', taskSubCtrl.reviewTaskSubmission)

export default router
