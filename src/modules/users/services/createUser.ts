import { sendRegistrationMail } from '../../../providers'
import {
  AppUserAttributes,
  generatePublicId,
  generateSalt,
  hashPassword,
  logger,
} from '../../../common'

import * as UserDAL from '../data'
import { getMailVerificationToken } from './helpers'

export const createUser = async (input: AppUserAttributes) => {
  const [password, publicId] = await Promise.all([
    hashPassword(input.password),
    generatePublicId(),
  ])
  const salt = generateSalt(12)

  const data = {
    ...input,
    publicId,
    password,
    salt,
  }

  const result = await UserDAL.createAppUser(data)
  const token = getMailVerificationToken(publicId, salt)

  sendRegistrationMail(
    { firstName: data.firstName, email: data.email },
    token,
  ).catch((err) => {
    logger.warn(`Error sending mail for user ${publicId} --- ${err}`)
  })
  return result
}
