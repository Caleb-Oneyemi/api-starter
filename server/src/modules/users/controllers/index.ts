import httpStatus from 'http-status'
import * as UserService from '../services'
import {
  ResponseData,
  generateToken,
  ControllerInput,
  controllerWrapper,
  UserAttributes,
} from '../../../common'

export const createUser = controllerWrapper(
  httpStatus.CREATED,
  async ({ input }: ControllerInput<UserAttributes>): Promise<ResponseData> => {
    const result = await UserService.createUser(input)
    const { customId, firstName, lastName, email, salt } = result
    const jwtToken = generateToken(
      { customId, firstName, lastName, email },
      salt,
    )

    return { ...result.toJSON(), token: jwtToken }
  },
)
