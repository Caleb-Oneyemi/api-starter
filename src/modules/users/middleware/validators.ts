import { ZodError } from 'zod'
import { Request, NextFunction } from 'express'
import { BadRequestError, ConflictError, CustomResponse } from '../../../common'
import { getAppUserByEmail, getAppUserByPhone } from '../data'
import {
  userCreationSchema,
  userUpdateSchema,
  passwordUpdateSchema,
} from './schemas'

export const userCreationValidator = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): Promise<void> => {
  try {
    await userCreationSchema.parseAsync(req.body)

    const existingUser = await getAppUserByEmail(req.body.email)
    if (existingUser) {
      return next(new ConflictError('email already in use'))
    }

    next()
  } catch (err) {
    if (err instanceof ZodError) {
      return next(new BadRequestError(err))
    }

    next(err)
  }
}

export const userUpdateValidator = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): Promise<void> => {
  try {
    await userUpdateSchema.parseAsync(req.body)

    const [emailUser, phoneUser] = await Promise.all([
      getAppUserByEmail(req.body.email),
      getAppUserByPhone(req.body.phoneNumber),
    ])

    if (emailUser) {
      return next(new ConflictError('email already in use'))
    }

    if (phoneUser) {
      return next(new ConflictError('phone number already in use'))
    }

    next()
  } catch (err) {
    if (err instanceof ZodError) {
      return next(new BadRequestError(err))
    }

    next(err)
  }
}

export const passwordUpdateValidator = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): Promise<void> => {
  try {
    await passwordUpdateSchema.parseAsync(req.body)
    next()
  } catch (err) {
    if (err instanceof ZodError) {
      return next(new BadRequestError(err))
    }

    next(err)
  }
}
