import { Schema } from 'mongoose'
import validator from 'validator'
import { User } from './user'
import {
  AppUserAttributes,
  AppUserDoc,
  AppUserModel,
  supportedDialingCodes,
  UserTypes,
} from '../../../common'

const appUserSchema = new Schema<AppUserAttributes, AppUserModel>({
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
    validate: [validator.isEmail],
  },
  phoneNumber: {
    type: String,
    unique: true,
    validate: {
      validator: function (data: string) {
        return validator.isMobilePhone(data, supportedDialingCodes, {
          strictMode: true,
        })
      },
    },
  },
  photoUrl: {
    type: String,
    validate: [validator.isURL],
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
})

appUserSchema.statics.build = (input: AppUserAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new AppUser(input).save()
}

export const AppUser = User.discriminator<AppUserDoc, AppUserModel>(
  UserTypes.APP_USER,
  appUserSchema,
)
