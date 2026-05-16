import { Router } from 'express'
import * as rolesCtrl from '../controllers/roles'

const router = Router()

router.get('/', rolesCtrl.getRoles)
router.get('/:id', rolesCtrl.getRole)
router.post('/', rolesCtrl.createRole)
router.put('/:id', rolesCtrl.updateRole)
router.delete('/:id', rolesCtrl.deleteRole)
router.post('/:id/bind', rolesCtrl.bindPersonToRole)
router.delete('/:id/bind/:personId', rolesCtrl.unbindPersonFromRole)

export default router
