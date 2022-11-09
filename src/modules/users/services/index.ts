import { TokenExpiredError } from 'jsonwebtoken'
import * as UserDAL from '../data'
import { sendRegistrationMail } from '../../../providers'
import {
  hashPassword,
  AppUserAttributes,
  generateSalt,
  generateCustomId,
  generateToken,
  decodeToken,
  validateToken,
  NotFoundError,
  BadRequestError,
} from '../../../common'

export const createUser = async (input: AppUserAttributes) => {
  const [password, customId] = await Promise.all([
    hashPassword(input.password),
    generateCustomId(),
  ])
  const salt = generateSalt(24)

  const data = {
    ...input,
    customId,
    password,
    salt,
  }

  const result = await UserDAL.createAppUser(data)

  const expires = 60 * 60 * 48
  const token = generateToken({ id: customId }, salt, expires)

  await sendRegistrationMail(
    { firstName: data.firstName, email: data.email },
    token,
  )
  return result
}

export const verifyAccount = async (token: string) => {
  const { id } = decodeToken(token)
  const user = await UserDAL.getAppUserByCustomId(id)

  if (!user) {
    throw new NotFoundError('user not found')
  }

  try {
    validateToken(token, user.salt)
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new BadRequestError('Token Expired')
    }

    throw new BadRequestError('Invalid Token')
  }

  await UserDAL.updateAppUser({ customId: id }, { confirmed: true })
}
