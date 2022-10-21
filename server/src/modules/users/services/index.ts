import crypto from 'crypto'
import { nanoid } from 'nanoid'
import * as UserDAL from '../data'
import { hashPassword, UserAttributes } from '../../../common'

export const createUser = async (input: UserAttributes) => {
  const hashedPassword = await hashPassword(input.password)
  const data = {
    ...input,
    customId: nanoid(8),
    confirmationCode: Math.floor(100000 + Math.random() * 900000),
    password: hashedPassword,
    salt: crypto.randomBytes(24).toString('hex'),
  }

  const result = await UserDAL.createUser(data)
  return result
}
