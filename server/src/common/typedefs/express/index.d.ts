import { RequestUser } from '../../../modules/users/types'

declare module 'express' {
  interface Request {
    user?: RequestUser
  }
}
