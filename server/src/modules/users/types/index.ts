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
