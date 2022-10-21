import { Schema } from 'mongoose'
import { User } from './user'
import {
  ServiceUserAttributes,
  ServiceUserDoc,
  ServiceUserModel,
  UserTypes,
} from '../../../common'

const serviceUserSchema = new Schema<ServiceUserAttributes, ServiceUserModel>(
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

serviceUserSchema.statics.build = (input: ServiceUserAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new ServiceUser(input).save()
}

export const ServiceUser = User.discriminator<ServiceUserDoc, ServiceUserModel>(
  UserTypes.SERVICE_USER,
  serviceUserSchema,
)
