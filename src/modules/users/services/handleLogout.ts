import { generateSalt } from '../../../common'
import * as UserDAL from '../data'

export const handleLogout = async (publicId: string) => {
  const salt = generateSalt(12)
  await UserDAL.updateAppUser({ publicId }, { salt })
}
