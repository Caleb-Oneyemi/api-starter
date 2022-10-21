import { Document, Model } from 'mongoose'

export interface AppUserAttributes {
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

export type RequestUser = Omit<AppUserDoc, 'password' | 'salt'> &
  Partial<Pick<AppUserDoc, 'password' | 'salt'>>

export interface ServiceUserAttributes {
  username: string
  password: string
  customId: string
}

export interface ServiceUserDoc extends ServiceUserAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface ServiceUserModel extends Model<ServiceUserDoc> {
  build(input: ServiceUserAttributes): ServiceUserDoc
}
