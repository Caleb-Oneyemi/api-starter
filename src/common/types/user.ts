import { Document, Model } from 'mongoose'

export interface UserAttributes {
  publicId: string
  password: string
  salt: string
}

export interface AppUserAttributes extends UserAttributes {
  type?: 'APP_USER'
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  photoUrl?: string
  deletedAt?: Date
  confirmed?: boolean
  previousResetPasswordToken?: string
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
  | Record<'publicId', string>

export type RequestUser = Partial<AppUserDoc | AdminUserDoc>

export interface AdminUserAttributes extends UserAttributes {
  type?: 'ADMIN_USER'
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
