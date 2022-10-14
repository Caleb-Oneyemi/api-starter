import { ZodError } from 'zod'
import { CustomError, ErrorResult } from './CustomError'

export class BadRequestError extends CustomError {
  statusCode = 400

  constructor(public message: string, public data?: ZodError) {
    super(message)

    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors(): Array<ErrorResult> {
    if (!this.data) return [{ message: this.message }]

    return this.data?.issues?.map(({ message, path }) => {
      const field = (path[0] || '').toString()
      return {
        message,
        field,
      }
    })
  }
}
