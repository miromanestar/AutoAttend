import { Router } from 'express'
import * as descriptors from '../controllers/descriptorController.js'

const descriptorsRouter = Router()

descriptorsRouter.get('/', descriptors.getDescriptors)
descriptorsRouter.get('/:id', descriptors.getDescriptor)

export default descriptorsRouter