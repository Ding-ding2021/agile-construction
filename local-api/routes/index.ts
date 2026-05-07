import { Router } from 'express'
import projectRoutes from './projects'
import taskRoutes from './tasks'
import milestoneRoutes from './milestones'
import phaseRoutes from './phases'
import riskRoutes from './risks'
import memberRoutes from './members'
import logRoutes from './logs'
import auditRoutes from './audit'
import wbsRoutes from './wbs'
import calendarRoutes from './calendar'
import personnelRoutes from './personnel'
import organizationRoutes from './organizations'
import * as taskCtrl from '../controllers/tasks'

const router = Router()

router.use('/projects', projectRoutes)
router.use('/projects/:code/tasks', taskRoutes)

// 跨项目任务查询
router.get('/tasks/all', taskCtrl.getAllTasks)
router.get('/tasks/:taskCode', taskCtrl.getTaskByCodeGlobal)
router.use('/projects/:code/milestones', milestoneRoutes)
router.use('/projects/:code/phases', phaseRoutes)
router.use('/projects/:code/risks', riskRoutes)
router.use('/projects/:code/members', memberRoutes)
router.use('/projects/:code/logs', logRoutes)
router.use('/projects/:code/wbs', wbsRoutes)
router.use('/audit/logs', auditRoutes)

// 人员管理
router.use('/personnel', personnelRoutes)
router.use('/organizations', organizationRoutes)

// 日历
router.use('/calendars', calendarRoutes)

export default router
