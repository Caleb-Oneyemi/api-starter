import { Document, Model } from 'mongoose'
import { UserAttributes } from '../../../../common'

export interface BaseLikeAttributes {
  owner: string | UserAttributes
}

export interface BaseLikeDoc extends BaseLikeAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface PostLikeAttributes extends BaseLikeAttributes {
  postId: string
}

export interface PostLikeDoc extends PostLikeAttributes, BaseLikeDoc {}

export interface PostLikeModel extends Model<PostLikeDoc> {
  build(input: PostLikeAttributes): PostLikeDoc
}

export interface CommentLikeAttributes extends BaseLikeAttributes {
  commentId: string
}

export interface CommentLikeDoc extends CommentLikeAttributes, BaseLikeDoc {}

export interface CommentLikeModel extends Model<CommentLikeDoc> {
  build(input: CommentLikeAttributes): CommentLikeDoc
}
