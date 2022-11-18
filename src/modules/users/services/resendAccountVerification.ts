import { sendRegistrationMail } from '../../../providers'
import { NotFoundError } from '../../../common'
import * as UserDAL from '../data'
import { getMailVerificationToken } from './helpers'

export const resendAccountVerification = async (customId: string) => {
  const user = await UserDAL.getAppUserByCustomId(customId)
  if (!user) {
    throw new NotFoundError('user not found')
  }

  const { salt, firstName, email } = user
  const token = getMailVerificationToken(customId, salt)
  await sendRegistrationMail({ firstName, email }, token)
}
