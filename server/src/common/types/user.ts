import { Document, Model } from 'mongoose'

export interface UserAttributes {
  firstName: string
  lastName: string
  email: string
  customId: string
  password: string
  confirmationCode: number
  phoneNumber?: string
  photoUrl?: string
  deleted?: boolean
  deletedAt?: Date
  salt: string
}

export interface UserDoc extends UserAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface UserModel extends Model<UserDoc> {
  build(input: UserAttributes): UserDoc
}

export type Filter =
  | Record<'email', string>
  | Record<'id', string>
  | Record<'customId', string>

export type RequestUser = Omit<UserDoc, 'password' | 'salt'> &
  Partial<Pick<UserDoc, 'password' | 'salt'>>

export interface ServiceUserAttributes {
  userName: string
  password: string
}

export interface ServiceUserDoc extends ServiceUserAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface ServiceUserModel extends Model<ServiceUserDoc> {
  build(input: ServiceUserAttributes): ServiceUserDoc
}
