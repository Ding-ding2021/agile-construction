import { Router } from 'express'
import * as projectCtrl from '../controllers/projects'

const router = Router()

router.get('/', projectCtrl.getProjects)
router.post('/', projectCtrl.createProject)
router.get('/:code', projectCtrl.getProjectByCode)
router.put('/:code', projectCtrl.updateProject)
router.delete('/:code', projectCtrl.deleteProject)

export default router
