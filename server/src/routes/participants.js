import { Router } from 'express'
import * as participants from '../controllers/participantController.js'

const participantsRouter = Router({ mergeParams: true })

participantsRouter.get('/', participants.getParticipants)
participantsRouter.get('/:participantId', participants.getParticipant)

export default participantsRouter