import { Router } from 'express'
import projectRoutes from './projects'
import taskRoutes from './tasks'
import milestoneRoutes from './milestones'
import phaseRoutes from './phases'
import riskRoutes from './risks'
import memberRoutes from './members'
import logRoutes from './logs'
import auditRoutes from './audit'

const router = Router()

router.use('/projects', projectRoutes)
router.use('/projects/:code/tasks', taskRoutes)
router.use('/projects/:code/milestones', milestoneRoutes)
router.use('/projects/:code/phases', phaseRoutes)
router.use('/projects/:code/risks', riskRoutes)
router.use('/projects/:code/members', memberRoutes)
router.use('/projects/:code/logs', logRoutes)
router.use('/audit/logs', auditRoutes)

export default router
