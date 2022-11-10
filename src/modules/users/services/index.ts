import { TokenExpiredError } from 'jsonwebtoken'
import * as UserDAL from '../data'
import {
  sendRegistrationMail,
  sendEmailVerificationMail,
  sendPasswordResetMail,
} from '../../../providers'
import {
  hashPassword,
  AppUserAttributes,
  generateSalt,
  generateCustomId,
  generateToken,
  decodeToken,
  validateToken,
  NotFoundError,
  BadRequestError,
  verifyPassword,
} from '../../../common'

const getMailVerificationToken = (customId: string, salt: string) => {
  const expires = 60 * 60 * 48
  const token = generateToken({ id: customId }, { salt, expires })
  return token
}

const handleTokenValidation = (token: string, salt: string) => {
  try {
    validateToken(token, salt)
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new BadRequestError('Token Expired')
    }

    throw new BadRequestError('Invalid Token')
  }
}

export const createUser = async (input: AppUserAttributes) => {
  const [password, customId] = await Promise.all([
    hashPassword(input.password),
    generateCustomId(),
  ])
  const salt = generateSalt(12)

  const data = {
    ...input,
    customId,
    password,
    salt,
  }

  const result = await UserDAL.createAppUser(data)
  const token = getMailVerificationToken(customId, salt)

  await sendRegistrationMail(
    { firstName: data.firstName, email: data.email },
    token,
  )
  return result
}

export const loginUser = async (
  input: Pick<AppUserAttributes, 'email' | 'password'>,
) => {
  const existingUser = await UserDAL.getAppUserByEmail(input.email)
  if (!existingUser) {
    throw new BadRequestError('invalid credentials')
  }

  const isPasswordValid = await verifyPassword(
    input.password,
    existingUser.password,
  )
  if (!isPasswordValid) {
    throw new BadRequestError('invalid credentials')
  }

  const token = generateToken(
    { id: existingUser.customId },
    { salt: existingUser.salt },
  )
  return { user: existingUser, token }
}

export const verifyAccount = async (token: string) => {
  const { id } = decodeToken(token)
  const user = await UserDAL.getAppUserByCustomId(id)

  if (!user) {
    throw new NotFoundError('user not found')
  }

  try {
    handleTokenValidation(token, user.salt)
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new BadRequestError('Token Expired')
    }

    throw new BadRequestError('Invalid Token')
  }

  await UserDAL.updateAppUser({ customId: id }, { confirmed: true })
}

export const resendAccountVerification = async (customId: string) => {
  const user = await UserDAL.getAppUserByCustomId(customId)
  if (!user) {
    throw new NotFoundError('user not found')
  }

  const { salt, firstName, email } = user
  const token = getMailVerificationToken(customId, salt)
  await sendRegistrationMail({ firstName, email }, token)
}

export const updateUser = async (
  customId: string,
  input: Partial<
    Pick<AppUserAttributes, 'firstName' | 'lastName' | 'email' | 'phoneNumber'>
  >,
) => {
  const result = await UserDAL.updateAppUser({ customId }, input)

  if (input.email && result != null) {
    const { customId, salt, firstName, email } = result
    const token = getMailVerificationToken(customId, salt)

    await sendEmailVerificationMail({ firstName, email }, token)
  }

  return result
}

interface ChangePasswordInput {
  oldPassword: string
  newPassword: string
  confirmedNewPassword: string
}

export const changeUserPassword = async (
  customId: string,
  input: ChangePasswordInput,
) => {
  const { oldPassword, newPassword, confirmedNewPassword } = input
  const user = await UserDAL.getAppUserByCustomId(customId)
  if (!user) {
    throw new NotFoundError('user not found')
  }

  const isPasswordValid = await verifyPassword(oldPassword, user.password)
  if (!isPasswordValid) {
    throw new BadRequestError('wrong old password')
  }

  if (oldPassword === newPassword) {
    throw new BadRequestError('old and new password must not be the same')
  }

  if (confirmedNewPassword !== newPassword) {
    throw new BadRequestError('confirmed password must match new password')
  }

  const password = await hashPassword(newPassword)
  return UserDAL.updateAppUser({ customId }, { password })
}

export const deleteUser = async (customId: string) => {
  const aMonthFromNow = new Date(
    new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
  )

  const result = await UserDAL.updateAppUser(
    { customId },
    { deletedAt: aMonthFromNow },
  )

  if (!result) throw new NotFoundError('user not found')
}

export const handleForgotPassword = async (email: string) => {
  const user = await UserDAL.getAppUserByEmail(email)
  if (!user) {
    return null
  }

  const expires = 60 * 60 * 24
  const token = generateToken(
    { id: user.customId },
    { salt: user.salt, expires },
  )

  await sendPasswordResetMail({ firstName: user.firstName, email }, token)
}

type ResetPasswordInput = Omit<ChangePasswordInput, 'oldPassword'> & {
  token: string
}

export const handleResetPassword = async (input: ResetPasswordInput) => {
  const { token, newPassword, confirmedNewPassword } = input
  if (confirmedNewPassword !== newPassword) {
    throw new BadRequestError('confirmed password must match new password')
  }

  const { id } = decodeToken(token)
  const user = await UserDAL.getAppUserByCustomId(id)
  if (!user) {
    throw new BadRequestError('user not found')
  }

  handleTokenValidation(token, user.salt)
  const password = await hashPassword(newPassword)
  return UserDAL.updateAppUser({ customId: id }, { password })
}
