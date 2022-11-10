import {
  BadRequestError,
  ConflictError,
  middlewareWrapper,
} from '../../../common'
import { getAppUserByEmail, getAppUserByPhone } from '../data'
import {
  userCreationSchema,
  userUpdateSchema,
  passwordUpdateSchema,
  loginUserSchema,
} from './schemas'

export const userCreationValidator = middlewareWrapper(
  async ({ input }): Promise<void> => {
    await userCreationSchema.parseAsync(input)

    const existingUser = await getAppUserByEmail(input.email)
    if (existingUser) {
      throw new ConflictError('email already in use')
    }
  },
)

export const loginUserValidator = middlewareWrapper(
  async ({ input }): Promise<void> => {
    await loginUserSchema.parseAsync(input)
  },
)

export const userUpdateValidator = middlewareWrapper(
  async ({ input }): Promise<void> => {
    if (Object.keys(input).length === 0) {
      throw new BadRequestError('At least one property must be updated')
    }
    await userUpdateSchema.parseAsync(input)

    const [emailUser, phoneUser] = await Promise.all([
      getAppUserByEmail(input.email),
      getAppUserByPhone(input.phoneNumber),
    ])

    if (emailUser) {
      throw new ConflictError('email already in use')
    }

    if (phoneUser) {
      throw new ConflictError('phone number already in use')
    }
  },
)

export const passwordUpdateValidator = middlewareWrapper(
  async ({ input }): Promise<void> => {
    await passwordUpdateSchema.parseAsync(input)
  },
)
