import { AppUserAttributes } from '../../../common'

export type LoginUserInput = Pick<AppUserAttributes, 'email' | 'password'>

export type UpdateUserInput = Partial<
  Pick<AppUserAttributes, 'firstName' | 'lastName' | 'email' | 'phoneNumber'>
>

export interface ChangePasswordInput {
  oldPassword: string
  newPassword: string
  confirmedNewPassword: string
}

export type ResetPasswordInput = Omit<ChangePasswordInput, 'oldPassword'> & {
  token: string
}
