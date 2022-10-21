import { CustomError, ErrorResult } from './CustomError'

export class NotAuthenticatedError extends CustomError {
  statusCode = 401

  constructor(public message: string) {
    super(message)

    Object.setPrototypeOf(this, NotAuthenticatedError.prototype)
  }

  serializeErrors(): Array<ErrorResult> {
    return [{ message: this.message }]
  }
}
