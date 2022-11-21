import { Schema, model } from 'mongoose'
import { UserTypes } from '../../../common'
import {
  PostCommentAttributes,
  PostCommentDoc,
  PostCommentModel,
} from '../types'

const postCommentSchema = new Schema<PostCommentAttributes>(
  {
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
    postId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
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

postCommentSchema.statics.build = (input: PostCommentAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new PostComment(input).save()
}

export const PostComment = model<PostCommentDoc, PostCommentModel>(
  'PostComment',
  postCommentSchema,
)
