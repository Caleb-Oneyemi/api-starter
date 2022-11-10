import { Router } from 'express'
import { isAuthenticated } from '../../../common'

import {
  userCreationValidator,
  userUpdateValidator,
  passwordUpdateValidator,
  loginUserValidator,
} from '../middleware'

import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  verifyAccount,
  resendAccountVerification,
  changePassword,
} from '../controllers'

const router = Router()

router
  .post('/', userCreationValidator, createUser)
  .get('/', isAuthenticated, getUser)
  .patch('/', isAuthenticated, userUpdateValidator, updateUser)
  .delete('/', isAuthenticated, deleteUser)
  .post('/login', loginUserValidator, loginUser)
  .get('/verify/:token', verifyAccount)
  .post(
    '/resend/account-verification',
    isAuthenticated,
    resendAccountVerification,
  )
  .patch(
    '/change-password',
    isAuthenticated,
    passwordUpdateValidator,
    changePassword,
  )

export { router as userRoutes }
