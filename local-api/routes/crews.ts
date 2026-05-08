import { Router } from 'express'
import * as crewsCtrl from '../controllers/crews'

const router = Router()

router.get('/', crewsCtrl.getCrews)
router.get('/:id', crewsCtrl.getCrew)
router.post('/', crewsCtrl.createCrew)
router.put('/:id', crewsCtrl.updateCrew)
router.delete('/:id', crewsCtrl.deleteCrew)

router.get('/:id/members', crewsCtrl.getCrewMembers)
router.post('/:id/members', crewsCtrl.addCrewMember)
router.delete('/:id/members/:memberId', crewsCtrl.removeCrewMember)

router.get('/:id/certifications', crewsCtrl.getCrewCertifications)
router.post('/:id/certifications', crewsCtrl.createCertification)
router.put('/:id/certifications/:certId', crewsCtrl.updateCertification)
router.delete('/:id/certifications/:certId', crewsCtrl.deleteCertification)

export default router
