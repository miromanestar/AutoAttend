import { Router } from 'express'
import * as participants from '../controllers/participantController.js'

const participantsRouter = Router({ mergeParams: true })

participantsRouter.get('/', participants.getParticipants)
participantsRouter.get('/:participantId', participants.getParticipant)

participantsRouter.post('/', participants.addParticipant)

participantsRouter.patch('/:participantId', participants.editParticipant)

participantsRouter.delete('/', participants.deleteParticipants)
participantsRouter.delete('/:participantId', participants.deleteParticipant)

export default participantsRouter