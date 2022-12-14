import { Schema, model } from 'mongoose'
import { UserAttributes } from '../../../common'

const userSchema = new Schema<UserAttributes>(
  {
    publicId: {
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
    salt: {
      type: String,
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
        delete ret.salt
      },
    },
  },
)

export const User = model('User', userSchema)
