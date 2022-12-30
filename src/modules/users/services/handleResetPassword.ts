import {
  BadRequestError,
  decodeToken,
  generateSalt,
  hashPassword,
} from '../../../common'

import * as UserDAL from '../data'
import { ResetPasswordInput } from '../types'
import { handleTokenValidation } from './helpers'

export const handleResetPassword = async (input: ResetPasswordInput) => {
  const { token, newPassword, confirmedNewPassword } = input
  if (confirmedNewPassword !== newPassword) {
    throw new BadRequestError('confirmed password must match new password')
  }

  const res = decodeToken(token)
  if (!res) {
    throw new BadRequestError('invalid token')
  }

  const user = await UserDAL.getAppUserByPublicId(res.id)
  if (!user) {
    throw new BadRequestError('user not found')
  }

  if (user.previousResetPasswordToken === token) {
    throw new BadRequestError('reset token expired')
  }
  handleTokenValidation(token, user.salt)

  const salt = generateSalt(12)
  const password = await hashPassword(newPassword)
  return UserDAL.updateAppUser(
    { publicId: res.id },
    { salt, password, previousResetPasswordToken: token },
  )
}
