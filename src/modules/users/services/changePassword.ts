import {
  BadRequestError,
  generateSalt,
  hashPassword,
  NotFoundError,
  verifyPassword,
} from '../../../common'

import * as UserDAL from '../data'
import { ChangePasswordInput } from '../types'

export const changeUserPassword = async (
  publicId: string,
  input: ChangePasswordInput,
) => {
  const { oldPassword, newPassword, confirmedNewPassword } = input
  const user = await UserDAL.getAppUserByPublicId(publicId)
  if (!user) {
    throw new NotFoundError('user not found')
  }

  const isPasswordValid = await verifyPassword(oldPassword, user.password)
  if (!isPasswordValid) {
    throw new BadRequestError('wrong old password')
  }

  if (oldPassword === newPassword) {
    throw new BadRequestError('old and new password must be different')
  }

  if (confirmedNewPassword !== newPassword) {
    throw new BadRequestError('confirmed password must match new password')
  }

  const salt = generateSalt(12)
  const password = await hashPassword(newPassword)
  return UserDAL.updateAppUser({ publicId }, { password, salt })
}
