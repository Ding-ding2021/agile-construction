import { Router } from 'express'
import * as personnelCtrl from '../controllers/personnel'

const router = Router()

router.get('/', personnelCtrl.getPersonnel)
router.get('/:id', personnelCtrl.getPerson)
router.get('/:id/status-logs', personnelCtrl.getPersonStatusLogs)
router.get('/:id/roles', personnelCtrl.getPersonRoles)
router.get('/:id/teams', personnelCtrl.getPersonTeams)
router.post('/', personnelCtrl.createPerson)
router.post('/:id/status', personnelCtrl.updatePersonStatus)
router.put('/:id', personnelCtrl.updatePerson)
router.delete('/:id', personnelCtrl.deletePerson)

export default router
