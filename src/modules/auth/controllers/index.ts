import httpStatus from 'http-status'
import * as AuthService from '../services'
import {
  ResponseData,
  ControllerInput,
  controllerWrapper,
  AppUserAttributes,
} from '../../../common'

export const loginUser = controllerWrapper(
  httpStatus.OK,
  async ({
    input,
  }: ControllerInput<AppUserAttributes>): Promise<ResponseData> => {
    const result = await AuthService.loginUser(input)
    return result
  },
)
