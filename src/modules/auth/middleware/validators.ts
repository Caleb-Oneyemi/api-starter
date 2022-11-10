import { ZodError } from 'zod'
import { Request, NextFunction } from 'express'
import { BadRequestError, CustomResponse } from '../../../common'
import { loginUserSchema } from './schemas'

export const loginUserValidator = async (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): Promise<void> => {
  try {
    await loginUserSchema.parseAsync(req.body)
    next()
  } catch (err) {
    if (err instanceof ZodError) {
      return next(new BadRequestError(err))
    }

    next(err)
  }
}
