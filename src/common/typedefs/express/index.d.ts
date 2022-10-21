import { RequestUser } from '../../types'

declare module 'express' {
  interface Request {
    user?: RequestUser
  }
}
