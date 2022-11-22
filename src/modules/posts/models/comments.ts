import { Schema, model } from 'mongoose'
import { UserTypes } from '../../../common'
import { CommentAttributes, CommentDoc, CommentModel } from '../types'

const commentSchema = new Schema<CommentAttributes>(
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
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: UserTypes.APP_USER,
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
      virtuals: true,
    },
  },
)

commentSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'commentId',
  count: true,
})

commentSchema.statics.build = (input: CommentAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new Comment(input).save()
}

export const Comment = model<CommentDoc, CommentModel>('Comment', commentSchema)
