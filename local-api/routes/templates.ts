import { Router } from 'express'
import * as templateCtrl from '../controllers/templates'

const router = Router()

router.get('/', templateCtrl.getTemplates)
router.get('/:id', templateCtrl.getTemplate)
router.post('/', templateCtrl.createTemplate)
router.put('/:id', templateCtrl.updateTemplate)
router.delete('/:id', templateCtrl.deleteTemplate)

router.get('/:id/bindings', templateCtrl.getTemplateBindings)
router.post('/:id/bindings', templateCtrl.addTemplateBinding)
router.delete('/:id/bindings/:bindingId', templateCtrl.removeTemplateBinding)

export default router
