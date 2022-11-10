import { ErrorResult } from '../errors'

export type ResponseData =
  | Array<Record<string, any>>
  | Record<string, any>
  | null
  | void

export interface SuccessResponse {
  data: ResponseData
  isSuccess: true
}

export interface ErrorResponse {
  errors: Array<ErrorResult>
  isSuccess: false
}
