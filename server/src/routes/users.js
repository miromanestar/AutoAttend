import { Router } from 'express'
import * as users from '../controllers/userController.js'

const usersRouter = Router()

usersRouter.get('/', users.getUsers)
usersRouter.get('/:id', users.getUser)

export default usersRouter