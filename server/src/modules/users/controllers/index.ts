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
  }

  const result = await insertNewUser(data)
  const { id, firstName, lastName, email } = result
  const jwtToken = generateToken({ id, firstName, lastName, email })

  return { ...result.toJSON(), token: jwtToken }
}
