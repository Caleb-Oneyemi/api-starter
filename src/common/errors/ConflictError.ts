import { CustomError, ErrorResult } from './CustomError'

export class ConflictError extends CustomError {
  statusCode = 409

  constructor(public message: string) {
    super(message)

    Object.setPrototypeOf(this, ConflictError.prototype)
  }

  serializeErrors(): Array<ErrorResult> {
    return [{ message: this.message }]
  }
}
