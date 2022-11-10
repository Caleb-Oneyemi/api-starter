import { Request, NextFunction } from 'express'
import { ZodError } from 'zod'
import { BadRequestError } from '../errors'
import { CustomResponse, ControllerFunction } from '../types'

export const middlewareWrapper = (fn: ControllerFunction) => {
  return async (req: Request, res: CustomResponse, next: NextFunction) => {
    if (typeof fn !== 'function') {
      throw new Error(
        `Expected type of input to middlewareWrapper function to be a function instead got ${typeof fn} for ${
          req.method
        } request to ${req.originalUrl}`,
      )
    }

    try {
      const { body, params, query, user } = req
      await fn({ input: body, params, query, user })
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new BadRequestError(err))
      }

      next(err)
    }
  }
}
