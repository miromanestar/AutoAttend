import { Router } from 'express'
import * as ident from '../controllers/identifyController.js'

const identifyRouter = Router()

identifyRouter.get('/', ident.getIndex)

identifyRouter.post('/', ident.postIndex)

export default identifyRouter