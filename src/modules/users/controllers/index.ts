import httpStatus from 'http-status'
import * as UserService from '../services'
import {
  ResponseData,
  generateToken,
  ControllerInput,
  controllerWrapper,
  AppUserAttributes,
} from '../../../common'

export const createUser = controllerWrapper(
  httpStatus.CREATED,
  async ({
    input,
  }: ControllerInput<AppUserAttributes>): Promise<ResponseData> => {
    const result = await UserService.createUser(input)
    const { customId, salt } = result
    const jwtToken = generateToken({ customId }, salt)

    return { ...result.toJSON(), token: jwtToken }
  },
)
