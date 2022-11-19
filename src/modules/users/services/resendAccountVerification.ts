import { sendRegistrationMail } from '../../../providers'
import { NotFoundError } from '../../../common'
import * as UserDAL from '../data'
import { getMailVerificationToken } from './helpers'

export const resendAccountVerification = async (publicId: string) => {
  const user = await UserDAL.getAppUserByPublicId(publicId)
  if (!user) {
    throw new NotFoundError('user not found')
  }

  const { salt, firstName, email } = user
  const token = getMailVerificationToken(publicId, salt)
  await sendRegistrationMail({ firstName, email }, token)
}
