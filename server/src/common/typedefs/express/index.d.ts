import { UserDoc } from '../../../modules/users/types'

type RequestUser = Omit<UserDoc, 'password' | 'salt'> &
  Partial<Pick<UserDoc, 'password' | 'salt'>>

declare module 'express' {
  interface Request {
    user?: RequestUser
  }
}
