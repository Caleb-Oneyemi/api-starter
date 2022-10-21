import { AppUser } from '../models'
import { Filter, AppUserAttributes } from '../../../common'

export const createAppUser = async (input: AppUserAttributes) => {
  return AppUser.build(input)
}

export const getAppUserById = async (id: string) => {
  return AppUser.findById(id)
}

export const getAppUserByCustomId = async (customId: string) => {
  return AppUser.findOne({ customId })
}

export const getAppUserByEmail = async (email: string) => {
  return AppUser.findOne({ email })
}

export const updateAppUser = async (
  filter: Filter,
  input: Partial<AppUserAttributes>,
) => {
  return AppUser.findOneAndUpdate(filter, { $set: input })
}

export const softDeleteAppUser = async (filter: Filter) => {
  return AppUser.findOneAndUpdate(filter, {
    $set: { deleted: true, deletedAt: new Date() },
  })
}

export const hardDeleteAppUser = async (filter: Filter) => {
  return AppUser.findOneAndRemove(filter)
}
