import { Router } from 'express'
import * as teamsCtrl from '../controllers/teams'

const router = Router()

router.get('/', teamsCtrl.getTeams)
router.get('/:id', teamsCtrl.getTeam)
router.post('/', teamsCtrl.createTeam)
router.put('/:id', teamsCtrl.updateTeam)
router.delete('/:id', teamsCtrl.deleteTeam)
router.post('/:id/members', teamsCtrl.addTeamMember)
router.delete('/:id/members/:personId', teamsCtrl.removeTeamMember)

export default router
