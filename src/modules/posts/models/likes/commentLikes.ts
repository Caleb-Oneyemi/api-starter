import { Schema } from 'mongoose'
import { Like } from './baseLike'

import {
  CommentLikeAttributes,
  CommentLikeDoc,
  CommentLikeModel,
} from '../../types'
import { LikeTypes } from '../../constants'

const commentLikeSchema = new Schema<CommentLikeAttributes, CommentLikeModel>({
  commentId: {
    type: Schema.Types.ObjectId,
  },
})

commentLikeSchema.index({ owner: 1, commentId: 1 }, { unique: true })

commentLikeSchema.statics.build = (input: CommentLikeAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new CommentLike(input).save()
}

export const CommentLike = Like.discriminator<CommentLikeDoc, CommentLikeModel>(
  LikeTypes.COMMENT,
  commentLikeSchema,
)
