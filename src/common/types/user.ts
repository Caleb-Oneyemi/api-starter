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
  confirmationCode: number
  phoneNumber?: string
  photoUrl?: string
  deleted?: boolean
  deletedAt?: Date
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

export type RequestUser = Omit<
  AppUserDoc | ServiceUserDoc,
  'password' | 'salt'
> &
  Partial<Pick<AppUserDoc | ServiceUserDoc, 'password' | 'salt'>>

export interface ServiceUserAttributes extends UserAttributes {
  username: string
}

export interface ServiceUserDoc extends ServiceUserAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface ServiceUserModel extends Model<ServiceUserDoc> {
  build(input: ServiceUserAttributes): ServiceUserDoc
}
