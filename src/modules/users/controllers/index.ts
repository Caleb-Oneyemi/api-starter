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
    const result = await UserService.updateUser(user?.publicId as string, input)
    return result
  },
)

export const changePassword = controllerWrapper(
  httpStatus.OK,
  async ({
    user,
    input,
  }: ControllerInput<ChangePasswordInput>): Promise<ResponseData> => {
    await UserService.changeUserPassword(user?.publicId as string, input)
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
    await UserService.resendAccountVerification(user?.publicId as string)
  },
)

export const deleteUser = controllerWrapper(
  httpStatus.NO_CONTENT,
  async ({ user }): Promise<ResponseData> => {
    await UserService.deleteUser(user?.publicId as string)
  },
)

export const forgotPassword = controllerWrapper(
  httpStatus.OK,
  async ({ input }): Promise<ResponseData> => {
    await UserService.handleForgotPassword(input.email)
    return {
      message:
        'A mail will be sent to this email if an account is registered under it',
    }
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

export const logOut = controllerWrapper(
  httpStatus.OK,
  async ({ user }): Promise<ResponseData> => {
    await UserService.handleLogout(user?.publicId as string)
    return { message: 'user tokens invalidated' }
  },
)

export const getPhotoUploadUrl = controllerWrapper(
  httpStatus.OK,
  async ({ user }): Promise<ResponseData> => {
    return UserService.getPhotoUploadUrl(user?.publicId as string)
  },
)

export const updateProfilePhoto = controllerWrapper(
  httpStatus.OK,
  async ({ user }): Promise<ResponseData> => {
    const result = await UserService.updatePhoto(user as AppUserAttributes)
    return result
  },
)
export const deleteProfilePhoto = controllerWrapper(
  httpStatus.NO_CONTENT,
  async ({ user }): Promise<ResponseData> => {
    await UserService.deletePhoto(user?.publicId as string)
  },
)
