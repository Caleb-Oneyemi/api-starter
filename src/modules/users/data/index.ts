import { ClientSession } from 'mongoose'
import { AppUser, AdminUser, User } from '../models'
import {
  Filter,
  AppUserAttributes,
  AdminUserAttributes,
  AppUserDoc,
  AdminUserDoc,
} from '../../../common'

export const createAppUser = async (input: AppUserAttributes) => {
  return AppUser.build(input)
}

export const getAppUserById = async (id: string) => {
  return AppUser.findById(id)
}

export const getAppUserByPublicId = async (publicId: string) => {
  return AppUser.findOne({ publicId })
}

export const getAppUserByEmail = async (email: string) => {
  return AppUser.findOne({ email })
}

export const getAppUserByPhone = async (phoneNumber: string) => {
  return AppUser.findOne({ phoneNumber })
}

export const updateAppUser = async (
  filter: Filter,
  input: Partial<AppUserAttributes>,
) => {
  return AppUser.findOneAndUpdate(filter, { $set: input }, { new: true }).exec()
}

export const createAdminUser = async (input: AdminUserAttributes) => {
  return AdminUser.build(input)
}

export const getAdminUserByUsername = async (username: string) => {
  return AdminUser.findOne({ username })
}

export const getUserByPublicId = async (
  publicId: string,
): Promise<AppUserDoc | AdminUserDoc | null> => {
  return User.findOne({ publicId })
}

export const getUsersToBeDeleted = (date = new Date()) => {
  return AppUser.find({
    deletedAt: { $lte: date },
  }).cursor()
}

export const hardDeleteUser = (publicId: string, session: ClientSession) => {
  return AppUser.deleteOne({ publicId }, { session })
}
