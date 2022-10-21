import { User } from '../models'
import { UserAttributes, Filter } from '../../../common'

export const createUser = async (input: UserAttributes) => {
  return User.build(input)
}

export const getUserById = async (id: string) => {
  return User.findById(id)
}

export const getUserByCustomId = async (customId: string) => {
  return User.findOne({ customId })
}

export const getUserByEmail = async (email: string) => {
  return User.findOne({ email })
}

export const updateUser = async (
  filter: Filter,
  input: Partial<UserAttributes>,
) => {
  return User.findOneAndUpdate(filter, { $set: input })
}

export const softDeleteUser = async (filter: Filter) => {
  return User.findOneAndUpdate(filter, {
    $set: { deleted: true, deletedAt: new Date() },
  })
}

export const hardDeleteUser = async (filter: Filter) => {
  return User.findOneAndRemove(filter)
}
