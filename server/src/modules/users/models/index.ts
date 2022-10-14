import { Schema, model } from 'mongoose'
import validator from 'validator'
import { UserAttributes, UserDoc, UserModel } from '../types'

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Email must be valid'],
    },
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
    confirmationCode: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      validate: [validator.isMobilePhone, 'Phone Number must be valid'],
    },
    photoUrl: {
      type: String,
      validate: [validator.isURL, 'Photo Url not valid'],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
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

userSchema.statics.build = (input: UserAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new User(input).save()
}

export const User = model<UserDoc, UserModel>('User', userSchema)
