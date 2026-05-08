import { Router } from 'express'
import * as stdCtrl from '../controllers/standards'

const router = Router()

router.get('/', stdCtrl.getStandards)
router.get('/:id', stdCtrl.getStandard)
router.post('/', stdCtrl.createStandard)
router.put('/:id', stdCtrl.updateStandard)
router.delete('/:id', stdCtrl.deleteStandard)

router.get('/:id/clauses', stdCtrl.getClauses)
router.post('/:id/clauses', stdCtrl.createClause)
router.put('/:id/clauses/:clauseId', stdCtrl.updateClause)
router.delete('/:id/clauses/:clauseId', stdCtrl.deleteClause)

router.get('/:id/clauses/:clauseId/rules', stdCtrl.getRules)
router.post('/:id/clauses/:clauseId/rules', stdCtrl.createRule)
router.put('/:id/clauses/:clauseId/rules/:ruleId', stdCtrl.updateRule)
router.delete('/:id/clauses/:clauseId/rules/:ruleId', stdCtrl.deleteRule)

export default router
