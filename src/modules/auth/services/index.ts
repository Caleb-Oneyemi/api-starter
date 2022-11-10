import { getAppUserByEmail } from '../../users/data'
import {
  AppUserAttributes,
  generateToken,
  BadRequestError,
  verifyPassword,
} from '../../../common'

export const loginUser = async (
  input: Pick<AppUserAttributes, 'email' | 'password'>,
) => {
  const existingUser = await getAppUserByEmail(input.email)
  if (!existingUser) {
    throw new BadRequestError('invalid credentials')
  }

  const isPasswordValid = await verifyPassword(
    input.password,
    existingUser.password,
  )
  if (!isPasswordValid) {
    throw new BadRequestError('invalid credentials')
  }

  const token = generateToken({ id: existingUser.customId }, existingUser.salt)
  return { user: existingUser, token }
}
