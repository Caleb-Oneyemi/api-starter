import { Schema, model } from 'mongoose'
import { UserTypes } from '../../../../common'
import { BaseLikeAttributes } from '../../types'

const baseLikeSchema = new Schema<BaseLikeAttributes>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: UserTypes.APP_USER,
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
      },
    },
  },
)

export const Like = model('Like', baseLikeSchema)
