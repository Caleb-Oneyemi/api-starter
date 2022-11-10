import { Router } from 'express'
import { isAuthenticated } from '../../../common'
import * as UserController from '../controllers'
import { userCreationValidator, userUpdateValidator } from '../middleware'

const router = Router()

router.post('/', userCreationValidator, UserController.createUser)

router.get('/verify/:token', UserController.verifyAccount)

router.post(
  '/resend/account-verification',
  isAuthenticated,
  UserController.resendAccountVerification,
)

router.get('/', isAuthenticated, UserController.getUser)

router.patch(
  '/',
  isAuthenticated,
  userUpdateValidator,
  UserController.updateUser,
)

router.delete('/', isAuthenticated, UserController.deleteUser)

export { router as userRoutes }
