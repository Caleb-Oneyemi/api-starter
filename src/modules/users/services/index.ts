import * as UserDAL from '../data'
import {
  hashPassword,
  AppUserAttributes,
  generateSalt,
  generateCode,
  generateCustomId,
} from '../../../common'

export const createUser = async (input: AppUserAttributes) => {
  const [password, customId] = await Promise.all([
    hashPassword(input.password),
    generateCustomId(),
  ])
  const confirmationCode = generateCode(6)
  const salt = generateSalt(24)

  const data = {
    ...input,
    customId,
    confirmationCode,
    password,
    salt,
  }

  const result = await UserDAL.createAppUser(data)
  return result
}
