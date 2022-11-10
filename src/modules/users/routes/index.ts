import { Router } from 'express'
import { isAuthenticated } from '../../../common'
import * as UserController from '../controllers'
import { userCreationValidator, userUpdateValidator } from '../middleware'

const router = Router()

router.post('/', userCreationValidator, UserController.createUser)

router.get('/verify/:token', UserController.verifyAccount)

router.get('/', isAuthenticated, UserController.getUser)

router.patch(
  '/',
  isAuthenticated,
  userUpdateValidator,
  UserController.updateUser,
)

router.delete('/', isAuthenticated, UserController.deleteUser)

export { router as userRoutes }
