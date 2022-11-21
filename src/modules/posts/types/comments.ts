import { Document, Model } from 'mongoose'
import { UserAttributes } from '../../../common'

export interface CommentAttributes {
  publicId: string
  postId: string
  body: string
  owner: string | UserAttributes
  likes?: number
}

export interface CommentDoc extends CommentAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface CommentModel extends Model<CommentDoc> {
  build(input: CommentAttributes): CommentDoc
}

export type CreateCommentInput = Omit<CommentAttributes, 'likes' | 'publicId'>
