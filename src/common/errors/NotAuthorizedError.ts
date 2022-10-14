import { CustomError, ErrorResult } from './CustomError'

export class NotAuthorizedError extends CustomError {
  statusCode = 403

  constructor(public message: string) {
    super(message)

    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeErrors(): Array<ErrorResult> {
    return [{ message: this.message }]
  }
}
