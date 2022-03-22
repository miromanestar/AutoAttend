import { Router } from 'express'
import * as events from '../controllers/eventController.js'

const eventsRouter = Router()

eventsRouter.get('/', events.getEvents)
eventsRouter.get('/:id', events.getEvent)

export default eventsRouter