import { Router } from 'express'
import * as taskCtrl from '../controllers/tasks'
import * as taskLogCtrl from '../controllers/taskLogs'
import * as taskSubCtrl from '../controllers/taskSubmissions'
import * as checklistCtrl from '../controllers/checklist'
import * as relationCtrl from '../controllers/taskRelations'

const router = Router()

router.get('/', taskCtrl.getTasks)
router.post('/', taskCtrl.createTask)
router.get('/tree', taskCtrl.getTaskTree)
router.get('/code/:taskCode', taskCtrl.getTaskByCode)
router.put('/:taskId', taskCtrl.updateTask)
router.delete('/:taskId', taskCtrl.deleteTask)

// 子资源：事件日志
router.get('/:taskId/logs', taskLogCtrl.getTaskLogs)
router.post('/:taskId/logs', taskLogCtrl.createTaskLog)

// 子资源：提交记录
router.get('/:taskId/submissions', taskSubCtrl.getTaskSubmissions)
router.post('/:taskId/submissions', taskSubCtrl.createTaskSubmission)
router.put('/:taskId/submissions/:subId/review', taskSubCtrl.reviewTaskSubmission)

// 子资源：检查项
router.get('/:taskId/checklist', checklistCtrl.getChecklist)
router.post('/:taskId/checklist', checklistCtrl.createChecklistItem)
router.put('/:taskId/checklist/:itemId', checklistCtrl.updateChecklistItem)
router.delete('/:taskId/checklist/:itemId', checklistCtrl.deleteChecklistItem)

// 子资源：前置任务
router.get('/:taskId/relations', relationCtrl.getRelations)
router.post('/:taskId/relations', relationCtrl.createRelation)
router.delete('/:taskId/relations/:relationId', relationCtrl.deleteRelation)

// 前置任务依赖
router.get('/:taskId/dependencies', taskCtrl.getTaskDependencies)

// 批量创建
router.post('/batch', taskCtrl.batchCreateTasks)

// 状态机定义
router.get('/state-machine', taskCtrl.getTaskStateMachine)

// 催办
router.post('/:taskId/remind', relationCtrl.remindTask)

// 标准绑定
router.post('/:taskId/standards/bind', taskCtrl.bindStandardsToTask)
router.delete('/:taskId/standards/:bindingId', taskCtrl.unbindStandardFromTask)
router.get('/:taskId/standards', taskCtrl.getTaskStandardBindings)

// 快照
router.get('/:taskId/snapshots', taskCtrl.getTaskSnapshots)
router.post('/:taskId/snapshots/generate', taskCtrl.generateTaskSnapshot)

// 验收判定
router.post('/:taskId/acceptance/validate', taskCtrl.validateTaskAcceptance)

export default router
