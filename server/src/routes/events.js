import { Router } from 'express'
import * as events from '../controllers/eventController.js'
import identificationRouter from './identification.js'
import participantsRouter from './participants.js'

const eventsRouter = Router()

eventsRouter.get('/', events.getEvents)
eventsRouter.get('/:id', events.getEvent)

eventsRouter.post('/', events.createEvent)

eventsRouter.patch('/:id', events.editEvent)

eventsRouter.delete('/:id', events.deleteEvent)

eventsRouter.use('/:id/identifications', identificationRouter)
eventsRouter.use('/:id/participants', participantsRouter)

export default eventsRouter