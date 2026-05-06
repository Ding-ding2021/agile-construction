import { Router } from 'express'
import * as personnelCtrl from '../controllers/personnel'

const router = Router()

router.get('/', personnelCtrl.getPersonnel)
router.get('/:id', personnelCtrl.getPerson)
router.post('/', personnelCtrl.createPerson)
router.put('/:id', personnelCtrl.updatePerson)
router.delete('/:id', personnelCtrl.deletePerson)

export default router
