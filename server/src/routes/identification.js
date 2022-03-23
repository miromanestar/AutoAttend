import { Router } from 'express'
import * as identification from '../controllers/identificationController.js'

const identificationRouter = Router({ mergeParams: true })

identificationRouter.get('/', identification.getIdentification)
identificationRouter.get('/:identificationId', identification.getIdentification)

export default identificationRouter