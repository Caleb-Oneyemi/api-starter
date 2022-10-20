import crypto from 'crypto'
import { nanoid } from 'nanoid'
import { insertNewUser } from '../data'
import { UserAttributes } from '../types'
import { ResponseData, hashPassword, generateToken } from '../../../common'

export const createUser = async (
  input: UserAttributes,
): Promise<ResponseData> => {
  const hashedPassword = await hashPassword(input.password)
  const data: UserAttributes = {
    ...input,
    customId: nanoid(8),
    confirmationCode: Math.floor(100000 + Math.random() * 900000),
    password: hashedPassword,
    salt: crypto.randomBytes(24).toString('hex'),
  }

  const result = await insertNewUser(data)
  const { customId, firstName, lastName, email, salt } = result
  const jwtToken = generateToken({ customId, firstName, lastName, email }, salt)

  return { ...result.toJSON(), token: jwtToken }
}
