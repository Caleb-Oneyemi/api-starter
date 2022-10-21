import { AppUser, ServiceUser, User } from '../models'
import {
  Filter,
  AppUserAttributes,
  ServiceUserAttributes,
  UserTypes,
  AppUserDoc,
  ServiceUserDoc,
} from '../../../common'

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

export const createServiceUser = async (input: ServiceUserAttributes) => {
  return ServiceUser.build(input)
}

export const getServiceUserByUsername = async (username: string) => {
  return ServiceUser.findOne({ username })
}

export const getAppOrServiceUserByCustomId = async (
  customId: string,
): Promise<AppUserDoc | ServiceUserDoc | null> => {
  const { APP_USER, SERVICE_USER } = UserTypes
  return User.findOne({ customId, type: { $in: [APP_USER, SERVICE_USER] } })
}
