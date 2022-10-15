import { ZodError } from 'zod'
import { Request, NextFunction } from 'express'
import { BadRequestError, ConflictError, CustomResponse } from '../../../common'
import { getUserByEmail } from '../data'
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

    const existingUser = await getUserByEmail(req.body.email)
    if (existingUser) {
      return next(new ConflictError('email already in use'))
    }

    next()
  } catch (err) {
    if (err instanceof ZodError) {
      next(new BadRequestError(err))
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

    next()
  } catch (err) {
    if (err instanceof ZodError) {
      next(new BadRequestError(err))
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
    const { oldPassword, newPassword, confirmedNewPassword } = req.body

    if (oldPassword === newPassword) {
      throw new BadRequestError('old and new password must not be the same')
    }

    if (confirmedNewPassword !== newPassword) {
      throw new BadRequestError('confirmed password must match new password')
    }

    next()
  } catch (err) {
    if (err instanceof ZodError) {
      next(new BadRequestError(err))
    }

    next(err)
  }
}
