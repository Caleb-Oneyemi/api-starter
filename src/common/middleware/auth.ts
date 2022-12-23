import { Request, Response, NextFunction } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'
import { validateToken, decodeToken } from '../utils'
import { NotAuthenticatedError, NotFoundError } from '../errors'
import { AdminUserDoc, AppUserDoc } from '../types'

type getUserFnType = (
  publicId: string,
) => Promise<AppUserDoc | AdminUserDoc | null>

export const auth = (getUserByPublicId: getUserFnType) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const token = req.headers.authorization?.split('Bearer ')[1]
    if (!token) {
      return next(new NotAuthenticatedError('Not Authenticated'))
    }

    let user
    try {
      const payload = decodeToken(token)
      user = await getUserByPublicId(payload.id)
      if (!user) {
        return next(new NotFoundError('user not found'))
      }

      validateToken(token, user.salt)
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return next(new NotAuthenticatedError('Token Expired'))
      }

      return next(new NotAuthenticatedError('Invalid Token'))
    }

    if (user.type === 'APP_USER') {
      user.previousResetPasswordToken = undefined
    }

    req.user = user
    req.user.password = undefined
    req.user.salt = undefined

    next()
  }
}
