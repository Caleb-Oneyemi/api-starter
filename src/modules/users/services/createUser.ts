import { sendRegistrationMail } from '../../../providers'
import {
  AppUserAttributes,
  generateCustomId,
  generateSalt,
  hashPassword,
  logger,
} from '../../../common'

import * as UserDAL from '../data'
import { getMailVerificationToken } from './helpers'

export const createUser = async (input: AppUserAttributes) => {
  const [password, customId] = await Promise.all([
    hashPassword(input.password),
    generateCustomId(),
  ])
  const salt = generateSalt(12)

  const data = {
    ...input,
    customId,
    password,
    salt,
  }

  const result = await UserDAL.createAppUser(data)
  const token = getMailVerificationToken(customId, salt)

  sendRegistrationMail(
    { firstName: data.firstName, email: data.email },
    token,
  ).catch((err) => {
    logger.warn(`Error sending mail for user ${customId} --- ${err}`)
  })
  return result
}
