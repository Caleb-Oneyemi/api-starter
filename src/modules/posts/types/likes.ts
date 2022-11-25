import { Document, Model } from 'mongoose'
import { UserAttributes } from '../../../common'
import { CommentAttributes } from './comments'
import { PostAttributes } from './posts'

export interface BaseLikeAttributes {
  owner: string | UserAttributes
}

export interface BaseLikeDoc extends BaseLikeAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface PostLikeAttributes extends BaseLikeAttributes {
  postId: string | PostAttributes
}

export interface PostLikeDoc extends PostLikeAttributes, BaseLikeDoc {}

export interface PostLikeModel extends Model<PostLikeDoc> {
  build(input: PostLikeAttributes): PostLikeDoc
}

export interface CommentLikeAttributes extends BaseLikeAttributes {
  commentId: string | CommentAttributes
}

export interface CommentLikeDoc extends CommentLikeAttributes, BaseLikeDoc {}

export interface CommentLikeModel extends Model<CommentLikeDoc> {
  build(input: CommentLikeAttributes): CommentLikeDoc
}
