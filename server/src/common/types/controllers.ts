import { ResponseData } from './responses'
import { RequestUser } from '../../modules/users/types'

/**
 T represents the type expected in the request body while
 U represents the type expected in the request params and
 V represents the type expected in the request query
 */
export interface ControllerInput<
  T extends object = any,
  U extends object = any,
  V extends object = any,
> {
  input: T
  params: U
  query: V
  user?: RequestUser
}

export type ControllerFunction = (
  input: ControllerInput,
) => Promise<ResponseData>
