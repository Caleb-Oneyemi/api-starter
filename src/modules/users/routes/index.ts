import { Router } from 'express'
import { isAuthenticated } from '../../../common'

import {
  userCreationValidator,
  userUpdateValidator,
  passwordUpdateValidator,
  loginUserValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  loginLimiter,
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
  resetPassword,
  logOut,
  getPhotoUploadUrl,
} from '../controllers'

const router = Router()

router
  .post('/', userCreationValidator, createUser)
  .get('/', isAuthenticated, getUser)
  .patch('/', isAuthenticated, userUpdateValidator, updateUser)
  .delete('/', isAuthenticated, deleteUser)
  .post('/login', loginUserValidator, loginLimiter, loginUser)
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
  .post('/reset-password', resetPasswordValidator, resetPassword)
  .get('/logout', isAuthenticated, logOut)
  .get('/photo/upload-url', isAuthenticated, getPhotoUploadUrl)

export { router as userRoutes }
