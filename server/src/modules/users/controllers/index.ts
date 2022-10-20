import crypto from 'crypto'
import httpStatus from 'http-status'
import { nanoid } from 'nanoid'
import { insertNewUser } from '../data'
import { UserAttributes } from '../types'
import {
  ResponseData,
  hashPassword,
  generateToken,
  ControllerInput,
  controllerWrapper,
} from '../../../common'

export const createUser = controllerWrapper(
  httpStatus.CREATED,
  async ({ input }: ControllerInput<UserAttributes>): Promise<ResponseData> => {
    const hashedPassword = await hashPassword(input.password)
    const data = {
      ...input,
      customId: nanoid(8),
      confirmationCode: Math.floor(100000 + Math.random() * 900000),
      password: hashedPassword,
      salt: crypto.randomBytes(24).toString('hex'),
    }

    const result = await insertNewUser(data)
    const { customId, firstName, lastName, email, salt } = result
    const jwtToken = generateToken(
      { customId, firstName, lastName, email },
      salt,
    )

    return { ...result.toJSON(), token: jwtToken }
  },
)
