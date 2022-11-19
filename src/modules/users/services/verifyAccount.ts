import { BadRequestError, decodeToken, NotFoundError } from '../../../common'
import * as UserDAL from '../data'
import { handleTokenValidation } from './helpers'

export const verifyAccount = async (token: string) => {
  const res = decodeToken(token)
  if (!res) {
    throw new BadRequestError('invalid token')
  }

  const user = await UserDAL.getAppUserByPublicId(res.id)
  if (!user) {
    throw new NotFoundError('user not found')
  }

  handleTokenValidation(token, user.salt)
  await UserDAL.updateAppUser({ publicId: res.id }, { confirmed: true })
}
