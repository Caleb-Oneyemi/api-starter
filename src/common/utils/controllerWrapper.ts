import { Request, NextFunction } from 'express'
import { ControllerFunction, CustomResponse } from '../types'

export const controllerWrapper = (status: number, fn: ControllerFunction) => {
  return async (req: Request, res: CustomResponse, next: NextFunction) => {
    if (typeof fn !== 'function') {
      throw new Error(
        `Expected type of input to controllerWrapper function to be a function instead got ${typeof fn}`,
      )
    }

    try {
      const { body, params, query, user } = req
      const data = await fn({ input: body, params, query, user })

      res.status(status).send({
        isSuccess: true,
        data: data ? data : null,
      })
    } catch (err) {
      next(err)
    }
  }
}
