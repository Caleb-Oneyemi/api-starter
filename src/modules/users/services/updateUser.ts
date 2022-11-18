import { BadRequestError } from '../../../common'
import { sendEmailVerificationMail } from '../../../providers'
import * as UserDAL from '../data'
import { UpdateUserInput } from '../types'
import { getMailVerificationToken } from './helpers'

export const updateUser = async (customId: string, input: UpdateUserInput) => {
  const result = await UserDAL.updateAppUser({ customId }, input)
  if (!result) {
    throw new BadRequestError('user not found')
  }

  if (input.email) {
    const { customId, salt, firstName, email } = result
    const token = getMailVerificationToken(customId, salt)

    await sendEmailVerificationMail({ firstName, email }, token)
  }

  return result
}
