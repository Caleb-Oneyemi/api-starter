import { TokenExpiredError } from 'jsonwebtoken'
import { BadRequestError, generateToken, validateToken } from '../../../common'

export const getMailVerificationToken = (publicId: string, salt: string) => {
  const expires = 60 * 60 * 48
  const token = generateToken({ id: publicId }, { salt, expires })
  return token
}

export const handleTokenValidation = (token: string, salt: string) => {
  try {
    validateToken(token, salt)
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new BadRequestError('Token Expired')
    }

    throw new BadRequestError('Invalid Token')
  }
}
