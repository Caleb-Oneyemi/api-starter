import httpStatus from 'http-status'
import * as UserService from '../services'

import {
  ResponseData,
  ControllerInput,
  controllerWrapper,
  AppUserAttributes,
  RequestUser,
} from '../../../common'

import {
  ChangePasswordInput,
  LoginUserInput,
  ResetPasswordInput,
  UpdateUserInput,
} from '../types'

export const createUser = controllerWrapper(
  httpStatus.CREATED,
  async ({
    input,
  }: ControllerInput<AppUserAttributes>): Promise<ResponseData> => {
    const result = await UserService.createUser(input)
    return result
  },
)

export const loginUser = controllerWrapper(
  httpStatus.OK,
  async ({ input }: ControllerInput<LoginUserInput>): Promise<ResponseData> => {
    const result = await UserService.loginUser(input)
    return result
  },
)

export const getUser = controllerWrapper(
  httpStatus.OK,
  async ({ user }): Promise<ResponseData> => {
    return user as RequestUser
  },
)

export const updateUser = controllerWrapper(
  httpStatus.OK,
  async ({
    user,
    input,
  }: ControllerInput<UpdateUserInput>): Promise<ResponseData> => {
    const result = await UserService.updateUser(user?.customId as string, input)
    return result
  },
)

export const changePassword = controllerWrapper(
  httpStatus.OK,
  async ({
    user,
    input,
  }: ControllerInput<ChangePasswordInput>): Promise<ResponseData> => {
    const result = await UserService.changeUserPassword(
      user?.customId as string,
      input,
    )
    return result
  },
)
export const verifyAccount = controllerWrapper(
  httpStatus.OK,
  async ({ params }): Promise<ResponseData> => {
    await UserService.verifyAccount(params.token)
  },
)

export const resendAccountVerification = controllerWrapper(
  httpStatus.OK,
  async ({ user }): Promise<ResponseData> => {
    await UserService.resendAccountVerification(user?.customId as string)
  },
)

export const deleteUser = controllerWrapper(
  httpStatus.NO_CONTENT,
  async ({ user }): Promise<ResponseData> => {
    await UserService.deleteUser(user?.customId as string)
  },
)

export const forgotPassword = controllerWrapper(
  httpStatus.OK,
  async ({ input }): Promise<ResponseData> => {
    await UserService.handleForgotPassword(input.email)
  },
)

export const resetPassword = controllerWrapper(
  httpStatus.OK,
  async ({
    input,
  }: ControllerInput<ResetPasswordInput>): Promise<ResponseData> => {
    await UserService.handleResetPassword(input)
  },
)
