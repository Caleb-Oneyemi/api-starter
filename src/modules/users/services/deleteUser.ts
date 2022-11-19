import { NotFoundError } from '../../../common'
import * as UserDAL from '../data'

export const deleteUser = async (publicId: string) => {
  const aMonthFromNow = new Date(
    new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
  )

  const result = await UserDAL.updateAppUser(
    { publicId },
    { deletedAt: aMonthFromNow },
  )

  if (!result) throw new NotFoundError('user not found')
}
