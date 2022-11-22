import { Schema } from 'mongoose'
import { Like } from './baseLike'
import { PostLikeAttributes, PostLikeDoc, PostLikeModel } from '../../types'
import { LikeTypes } from '../../constants'

const postLikeSchema = new Schema<PostLikeAttributes, PostLikeModel>({
  postId: {
    type: Schema.Types.ObjectId,
  },
})

postLikeSchema.index({ owner: 1, postId: 1 }, { unique: true })

postLikeSchema.statics.build = (input: PostLikeAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new PostLike(input).save()
}

export const PostLike = Like.discriminator<PostLikeDoc, PostLikeModel>(
  LikeTypes.POST,
  postLikeSchema,
)
