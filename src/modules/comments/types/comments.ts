import { Document, Model } from 'mongoose'
import { UserAttributes } from '../../../common'

export interface PostCommentAttributes {
  publicId: string
  postId: string
  content: string
  owner: string | UserAttributes
  likes?: number
}

export interface PostCommentDoc extends PostCommentAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface PostCommentModel extends Model<PostCommentDoc> {
  build(input: PostCommentAttributes): PostCommentDoc
}
