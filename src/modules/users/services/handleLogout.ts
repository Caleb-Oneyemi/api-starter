import { generateSalt } from '../../../common'
import * as UserDAL from '../data'

export const handleLogout = async (customId: string) => {
  const salt = generateSalt(12)
  await UserDAL.updateAppUser({ customId }, { salt })
}
