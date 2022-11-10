import { Router } from 'express'
import { isAuthenticated } from '../../../common'

import {
  userCreationValidator,
  userUpdateValidator,
  passwordUpdateValidator,
  loginUserValidator,
  forgotPasswordValidator,
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
  forgotPassword,
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
  .post('/forgot-password', forgotPasswordValidator, forgotPassword)

export { router as userRoutes }
