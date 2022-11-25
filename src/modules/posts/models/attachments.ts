import { Schema, model } from 'mongoose'
import { UserTypes } from '../../../common'
import { AttachmentAttributes, AttachmentDoc, AttachmentModel } from '../types'

const attachmentSchema = new Schema<AttachmentAttributes>(
  {
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
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
    },
  },
)

attachmentSchema.statics.build = (input: AttachmentAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new Attachment(input).save()
}

export const Attachment = model<AttachmentDoc, AttachmentModel>(
  'Attachment',
  attachmentSchema,
)
