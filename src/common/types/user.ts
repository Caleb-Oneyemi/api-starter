import { Document, Model } from 'mongoose'

export interface UserAttributes {
  customId: string
  password: string
  salt: string
}

export interface AppUserAttributes extends UserAttributes {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  photoUrl?: string
  deleted?: boolean
  deletedAt?: Date
  confirmed?: boolean
}

export interface AppUserDoc extends AppUserAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface AppUserModel extends Model<AppUserDoc> {
  build(input: AppUserAttributes): AppUserDoc
}

export type Filter =
  | Record<'email', string>
  | Record<'id', string>
  | Record<'customId', string>

export type RequestUser = Omit<AppUserDoc | AdminUserDoc, 'password' | 'salt'> &
  Partial<Pick<AppUserDoc | AdminUserDoc, 'password' | 'salt'>>

export interface AdminUserAttributes extends UserAttributes {
  username: string
}

export interface AdminUserDoc extends AdminUserAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface AdminUserModel extends Model<AdminUserDoc> {
  build(input: AdminUserAttributes): AdminUserDoc
}
