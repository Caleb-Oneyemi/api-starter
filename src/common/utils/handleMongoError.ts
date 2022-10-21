import httpStatus from 'http-status'
import mongoose from 'mongoose'
import { logger } from '../logger'
import { mongoErrors } from '../constants'
import { FormatMongoErrorInput, FormatMongoErrorResult } from '../types'

const { CastError, ValidationError } = mongoose.Error

export const formatMongoError = (
  err: FormatMongoErrorInput,
): FormatMongoErrorResult => {
  if (err instanceof CastError) {
    const message = `Invalid ${err.path}`
    return {
      status: httpStatus.BAD_REQUEST,
      errors: [{ message, field: err.path }],
    }
  }

  if (err instanceof ValidationError) {
    const [key] = Object.keys(err.errors)
    const message = `Invalid ${err.errors[key].path}`
    return {
      status: httpStatus.BAD_REQUEST,
      errors: [{ message, field: err.errors[key].path }],
    }
  }

  if (err?.code === 11000) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [key] = Object.keys(err.keyValue!)
    return {
      status: httpStatus.CONFLICT,
      errors: [{ message: `${key} already in use` }],
    }
  }

  logger.warn(`MONGO_ERROR --- ${JSON.stringify(err)}`)

  return {
    status: httpStatus.INTERNAL_SERVER_ERROR,
    errors: [{ message: 'something went wrong' }],
  }
}

export const isMongoError = (err: Error) => {
  return Object.keys(mongoErrors).includes(err.name)
}
