import { Schema } from 'mongoose'
import { User } from './user'
import {
  AdminUserAttributes,
  AdminUserDoc,
  AdminUserModel,
  UserTypes,
} from '../../../common'

const adminUserSchema = new Schema<AdminUserAttributes, AdminUserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.password
      },
    },
  },
)

adminUserSchema.statics.build = (input: AdminUserAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new AdminUser(input).save()
}

export const AdminUser = User.discriminator<AdminUserDoc, AdminUserModel>(
  UserTypes.ADMIN_USER,
  adminUserSchema,
)
