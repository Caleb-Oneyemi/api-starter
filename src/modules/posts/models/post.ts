import { Schema, model } from 'mongoose'
import { UserTypes } from '../../../common'
import { PostAttributes, PostDoc, PostModel } from '../types'

const postSchema = new Schema<PostAttributes>(
  {
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
      maxlength: 50,
    },
    content: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: UserTypes.APP_USER,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
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

postSchema.statics.build = (input: PostAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new Post(input).save()
}

export const Post = model<PostDoc, PostModel>('Post', postSchema)
