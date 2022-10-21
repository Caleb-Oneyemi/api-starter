import { Schema, model } from 'mongoose'
import { AppUserAttributes } from '../../../common'

const userSchema = new Schema<Pick<AppUserAttributes, 'customId' | 'password'>>(
  {
    customId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
    },
  },
  {
    discriminatorKey: 'type',
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

export const User = model('User', userSchema)
