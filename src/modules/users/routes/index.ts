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

import * as Ctrl from '../controllers'

const router = Router()

router
  .post('/', userCreationValidator, Ctrl.createUser)
  .get('/', isAuthenticated, Ctrl.getUser)
  .patch('/', isAuthenticated, userUpdateValidator, Ctrl.updateUser)
  .delete('/', isAuthenticated, Ctrl.deleteUser)
  .post('/login', loginUserValidator, loginLimiter, Ctrl.loginUser)
  .get('/verify/:token', Ctrl.verifyAccount)
  .post('/resend/account-verification', [
    isAuthenticated,
    Ctrl.resendAccountVerification,
  ])
  .patch('/change-password', [
    isAuthenticated,
    passwordUpdateValidator,
    Ctrl.changePassword,
  ])
  .post('/forgot-password', forgotPasswordValidator, Ctrl.forgotPassword)
  .post('/reset-password', resetPasswordValidator, Ctrl.resetPassword)
  .get('/logout', isAuthenticated, Ctrl.logOut)
  .get('/photo/upload-url', isAuthenticated, Ctrl.getPhotoUploadUrl)
  .patch('/photo', isAuthenticated, Ctrl.updateProfilePhoto)
  .delete('/photo', isAuthenticated, Ctrl.deleteProfilePhoto)

export { router as userRoutes }
