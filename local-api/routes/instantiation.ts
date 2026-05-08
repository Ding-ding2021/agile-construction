import { Router } from 'express'
import * as instCtrl from '../controllers/instantiation'

const router = Router()

router.post('/:code/instantiate', instCtrl.instantiateFromTemplate)

export default router
