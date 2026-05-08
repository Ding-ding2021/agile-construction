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
import instantiationRoutes from './instantiation'
import templateRoutes from './templates'
import taskTemplateRoutes from './task-templates'
import standardRoutes from './standards'
import personnelRoutes from './personnel'
import organizationRoutes from './organizations'
import crewRoutes from './crews'
import procurementRoutes from './procurement'
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

// 采购管理
router.use('/procurement', procurementRoutes)

// 日历
router.use('/calendars', calendarRoutes)

// 工队管理
router.use('/crews', crewRoutes)

// 模板中心
router.use('/templates', templateRoutes)
router.use('/task-templates', taskTemplateRoutes)
router.use('/standards', standardRoutes)
router.use('/projects', instantiationRoutes)

export default router
