import httpStatus from 'http-status'
import { Request, NextFunction } from 'express'
import { CustomError } from '../errors'
import { CustomResponse } from '../types'
import { logger } from '../logger'

export const errorHandler = (
  err: Error,
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): CustomResponse => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .send({ errors: err.serializeErrors(), isSuccess: false })
  }

  logger.warn(err)

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    errors: [{ message: 'something went wrong' }],
    isSuccess: false,
  })
}
