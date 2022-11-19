import { BadRequestError } from '../../../common'
import { sendEmailVerificationMail } from '../../../providers'
import * as UserDAL from '../data'
import { UpdateUserInput } from '../types'
import { getMailVerificationToken } from './helpers'

export const updateUser = async (publicId: string, input: UpdateUserInput) => {
  const result = await UserDAL.updateAppUser({ publicId }, input)
  if (!result) {
    throw new BadRequestError('user not found')
  }

  if (input.email) {
    const { publicId, salt, firstName, email } = result
    const token = getMailVerificationToken(publicId, salt)

    await sendEmailVerificationMail({ firstName, email }, token)
  }

  return result
}
