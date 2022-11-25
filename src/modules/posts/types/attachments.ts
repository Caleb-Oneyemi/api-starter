import { Document, Model } from 'mongoose'
import { PostAttributes } from './posts'
import { UserAttributes } from '../../../common'

export interface AttachmentAttributes {
  publicId: string
  postId: string | PostAttributes
  url?: string
  owner: string | UserAttributes
}

export interface AttachmentDoc extends AttachmentAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface AttachmentModel extends Model<AttachmentDoc> {
  build(input: AttachmentAttributes): Promise<AttachmentDoc>
}
