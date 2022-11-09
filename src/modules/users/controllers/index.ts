import httpStatus from 'http-status'
import * as UserService from '../services'
import {
  ResponseData,
  generateToken,
  ControllerInput,
  controllerWrapper,
  AppUserAttributes,
} from '../../../common'
import { sendRegistrationMail } from '../../../providers'

export const createUser = controllerWrapper(
  httpStatus.CREATED,
  async ({
    input,
  }: ControllerInput<AppUserAttributes>): Promise<ResponseData> => {
    const result = await UserService.createUser(input)
    const { customId, salt, firstName, email } = result

    const expires = 60 * 60 * 48
    const token = generateToken({ id: customId }, salt, expires)

    await sendRegistrationMail({ firstName, email }, token)
    return { ...result.toJSON() }
  },
)
