import { Router } from 'express'
import * as users from '../controllers/userController.js'

const usersRouter = Router()

usersRouter.get('/', users.getUsers)
usersRouter.get('/:id', users.getUser)

usersRouter.post('/', users.createUser)

usersRouter.patch('/:id', users.updateUser)

usersRouter.delete('/:id', users.deleteUser)

// USER IMAGES
usersRouter.get('/:id/images', users.getUserImages)

usersRouter.post('/:id/images', users.createUserImage)

usersRouter.delete('/:id/images', users.deleteUserImages)
usersRouter.delete('/:id/images/:imageId', users.deleteUserImage)

export default usersRouter