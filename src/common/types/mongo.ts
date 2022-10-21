import { ErrorResult } from '../errors'

export interface FormatMongoErrorResult {
  errors: Array<ErrorResult>
  status: number
}

export interface FormatMongoErrorInput extends Error {
  code?: number
  keyValue?: Record<string, string>
}
