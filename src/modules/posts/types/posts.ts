import { Document, Model } from 'mongoose'
import { QueryInput, UserAttributes } from '../../../common'

export interface PostAttributes {
  publicId: string
  title: string
  owner: string | UserAttributes
  likes?: number
  content?: string
}

export interface PostDoc extends PostAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface PostModel extends Model<PostDoc> {
  build(input: PostAttributes): PostDoc
}

export type CreatePostInput = Pick<
  PostAttributes,
  'title' | 'owner' | 'content'
>

export type PostsByUserQueryInput = QueryInput & { owner: string }

export type UpdatePostInput = Partial<Omit<CreatePostInput, 'owner'>>
