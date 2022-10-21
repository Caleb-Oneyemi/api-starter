import { Schema, model } from 'mongoose'
import validator from 'validator'
import {
  ServiceUserAttributes,
  ServiceUserDoc,
  ServiceUserModel,
} from '../../../common'

const serviceUserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate: [validator.isStrongPassword],
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

export const ServiceUser = model<ServiceUserDoc, ServiceUserModel>(
  'ServiceUser',
  serviceUserSchema,
)
