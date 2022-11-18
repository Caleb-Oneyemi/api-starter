import { BadRequestError, generateToken, verifyPassword } from '../../../common'
import { LoginUserInput } from '../types'
import * as UserDAL from '../data'

export const loginUser = async (input: LoginUserInput) => {
  const existingUser = await UserDAL.getAppUserByEmail(input.email)
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

  const token = generateToken(
    { id: existingUser.customId },
    { salt: existingUser.salt },
  )
  return { user: existingUser, token }
}
