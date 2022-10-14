import { Response } from 'express'
import { ErrorResult } from '../errors'

type ResponseData = Array<Record<string, any>> | Record<string, any> | null

interface SuccessResponse {
  message: string
  data: ResponseData
  isSuccess: true
}

interface ErrorResponse {
  errors: Array<ErrorResult>
  isSuccess: false
}

interface CustomResponse extends Response {
  send: (data: SuccessResponse | ErrorResponse) => this
  json: (data: SuccessResponse | ErrorResponse) => this
}

export { CustomResponse, ResponseData }
