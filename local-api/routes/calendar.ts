import { Router } from 'express'
import * as calendarCtrl from '../controllers/calendar'

const router = Router()

router.get('/', calendarCtrl.listCalendars)
router.get('/check', calendarCtrl.checkPeriod)
router.post('/check', calendarCtrl.checkPeriod)
router.get('/:id', calendarCtrl.getCalendar)
router.post('/', calendarCtrl.createCalendar)
router.put('/:id', calendarCtrl.updateCalendar)
router.delete('/:id', calendarCtrl.deleteCalendar)
router.put('/:id/exceptions', calendarCtrl.setExceptions)

export default router
