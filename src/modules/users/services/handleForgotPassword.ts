import { generateToken } from '../../../common'
import { sendPasswordResetMail } from '../../../providers'
import * as UserDAL from '../data'

export const handleForgotPassword = async (email: string) => {
  const user = await UserDAL.getAppUserByEmail(email)
  if (!user) {
    return null
  }

  const expires = 60 * 60 * 24
  const token = generateToken(
    { id: user.customId },
    { salt: user.salt, expires },
  )

  await sendPasswordResetMail({ firstName: user.firstName, email }, token)
}
